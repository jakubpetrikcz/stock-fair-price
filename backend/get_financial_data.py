import yfinance as yf
import pandas as pd
import psycopg2
import os
import json
from dotenv import load_dotenv
import time
from decimal import Decimal, ROUND_HALF_UP

load_dotenv()

USER_DISCOUNT_RATE = 0.085
PERPETUAL_GROWTH_RATE = 0.025


def calculateDcfFairPrice(
    cash_equivalents,
    total_debt,
    shares_outstanding,
    future_fcfs,
):
    total = sum(Decimal(str(pv)) for pv in future_fcfs["pvOfFFCF"])
    sum_of_ffcf = int(total.quantize(Decimal("1"), rounding=ROUND_HALF_UP))

    equity_value = sum_of_ffcf + cash_equivalents - total_debt

    fair_price = round((equity_value / shares_outstanding), 2)

    return fair_price


def getTerminalValue(future_fcfs):
    terminal_value_fcf = round(
        future_fcfs[-1] * ((1 + PERPETUAL_GROWTH_RATE) / (USER_DISCOUNT_RATE - PERPETUAL_GROWTH_RATE)), 1)

    terminal_value_pv_of_ffcf = round(
        terminal_value_fcf / ((1 + USER_DISCOUNT_RATE) ** 10), 1)

    return {"terminal_value_fcf": terminal_value_fcf,
            "terminal_value_pv_of_ffcf": terminal_value_pv_of_ffcf
            }


def getFutureFcfs(cashFlows, userGrowthRate):
    last_value = cashFlows[-1]

    future_fcfs = {
        "future": [last_value],
        "pvOfFFCF": [],
    }

    for index in range(9):
        next_fcf = round(future_fcfs["future"][-1]
                         * (1 + userGrowthRate / 100), 1)

        future_fcfs["future"].append(next_fcf)

        next_pv_of_ffcf = round(
            future_fcfs["future"][-1] / (1 + USER_DISCOUNT_RATE) ** (index + 1), 1)

        future_fcfs["pvOfFFCF"].append(next_pv_of_ffcf)

    future_fcfs["future"].pop(0)

    terminal_values = getTerminalValue(
        future_fcfs["future"])

    future_fcfs["future"].append(terminal_values["terminal_value_fcf"])
    future_fcfs["pvOfFFCF"].append(terminal_values["terminal_value_pv_of_ffcf"])

    return future_fcfs


def create_connection():
    # For local DB
    # environment = os.environ["NODE_ENV"]

    # conn_string = (
    #     f"host={os.environ['DB_HOST']} "
    #     f"dbname={os.environ['DB_DATABASE']} "
    #     f"user={os.environ['DB_USER']} "
    #     f"password={os.environ['DB_PASSWORD']}"
    #     if environment == "development"
    #     else os.environ["DATABASE_URL"]
    # )

    conn_string = os.environ["DATABASE_URL"]

    return psycopg2.connect(conn_string)


def update_company(cursor, ticker, data):
    cursor.execute(
        """
        UPDATE sec_companies
        SET
            cash_equivalents=%s,
            total_debt=%s,
            free_cash_flow=%s,
            shares_outstanding=%s,
            dcf_future_fcfs=%s,
            dcf_fair_value=%s
        WHERE ticker=%s
        """,
        (
            data["cash_equivalents"],
            data["total_debt"],
            json.dumps(data["free_cash_flow"]),
            data["shares_outstanding"],
            json.dumps(data["future_fcfs"]),
            data["fair_price"],
            ticker
        )
    )


def get_financial_data():

    conn = create_connection()

    cursor = conn.cursor(
        cursor_factory=psycopg2.extras.RealDictCursor
    )

    cursor.execute(
        "SELECT * FROM sec_companies ORDER BY id"
    )

    rows = cursor.fetchall()

    df = pd.DataFrame(rows)

    total = len(df)

    processed = 0

    for i, item in enumerate(df["ticker"], start=1):

        print(f"[{i}/{total}] Zpracovávám {item}...")

        time.sleep(0.2)

        company_data = {
            "cash_equivalents": 0,
            "total_debt": 0,
            "free_cash_flow": [],
            "shares_outstanding": 0,
            "future_fcfs": {},
            "fair_price": 0
        }

        try:

            ticker = yf.Ticker(item)

            try:
                bs = ticker.balance_sheet
            except Exception:
                bs = pd.DataFrame()

            try:
                cf = ticker.cash_flow
            except Exception:
                cf = pd.DataFrame()

            try:
                info = ticker.info
            except Exception:
                info = {}

            if "Cash Cash Equivalents And Short Term Investments" in bs.index:

                company_data["cash_equivalents"] = float(
                    bs.loc[
                        "Cash Cash Equivalents And Short Term Investments"
                    ].iloc[0]
                )

            elif "Cash And Cash Equivalents" in bs.index:

                company_data["cash_equivalents"] = float(
                    bs.loc[
                        "Cash And Cash Equivalents"
                    ].iloc[0]
                )

            if "Total Debt" in bs.index:

                total_debt = bs.loc["Total Debt"].iloc[0]

                if not pd.isna(total_debt):
                    company_data["total_debt"] = float(total_debt)

            if "Free Cash Flow" in cf.index:

                series = cf.loc["Free Cash Flow"]

                company_data["free_cash_flow"] = [
                    {
                        "date": date.strftime("%Y-%m-%d"),
                        "value": value
                    }
                    for date, value in series.items()
                    if pd.notna(value)
                ]

            if "sharesOutstanding" in info:

                company_data["shares_outstanding"] = int(
                    info["sharesOutstanding"]
                )

            free_cash_flows = company_data["free_cash_flow"]

            cash_equivalents = round(
                company_data["cash_equivalents"] / 1000000, 3)

            total_debt = round(company_data["total_debt"] / 1000000, 3)

            shares_outstanding = round(
                company_data["shares_outstanding"] / 1000000, 1)

            cash_flow = [{"cash_flow": round(item["value"] / 1000000, 3)}
                         for item in reversed(free_cash_flows)
                         ]

            cash_flows = [item["cash_flow"] for item in cash_flow]

            future_fcfs = getFutureFcfs(cash_flows, 10)
            company_data["future_fcfs"] = future_fcfs

            fair_price = calculateDcfFairPrice(
                cash_equivalents,
                total_debt,
                shares_outstanding,
                future_fcfs,
            )
            company_data["fair_price"] = fair_price

        except Exception as e:

            print(f"{item} selhalo:")
            print(e)

        try:

            update_company(
                cursor,
                item,
                company_data
            )

        except psycopg2.OperationalError:

            print("DB connection lost. Reconnecting...")

            conn.close()

            conn = create_connection()

            cursor = conn.cursor(
                cursor_factory=psycopg2.extras.RealDictCursor
            )

            update_company(
                cursor,
                item,
                company_data
            )

        processed += 1

        if processed % 100 == 0:

            conn.commit()

            print(
                f"Commit hotový ({processed}/{total})"
            )

    conn.commit()

    conn.close()

    print(
        f"\nHotovo. Zpracováno {total} firem."
    )


if __name__ == "__main__":
    get_financial_data()

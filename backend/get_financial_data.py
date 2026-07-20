import yfinance as yf
import pandas as pd
import psycopg2
import os
import json
from dotenv import load_dotenv
import time

load_dotenv()


def create_connection():
    environment = os.environ["NODE_ENV"]

    conn_string = (
        f"host={os.environ['DB_HOST']} "
        f"dbname={os.environ['DB_DATABASE']} "
        f"user={os.environ['DB_USER']} "
        f"password={os.environ['DB_PASSWORD']}"
        if environment == "development"
        else os.environ["DATABASE_URL"]
    )

    return psycopg2.connect(conn_string)


def update_company(cursor, ticker, data):
    cursor.execute(
        """
        UPDATE sec_companies
        SET
            cash_equivalents=%s,
            total_debt=%s,
            free_cash_flow=%s,
            shares_outstanding=%s
        WHERE ticker=%s
        """,
        (
            data["cash_equivalents"],
            data["total_debt"],
            json.dumps(data["free_cash_flow"]),
            data["shares_outstanding"],
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
            "cash_equivalents": None,
            "total_debt": None,
            "free_cash_flow": [],
            "shares_outstanding": None
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

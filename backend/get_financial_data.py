import yfinance as yf
import pandas as pd
import psycopg2
import os
import json
from dotenv import load_dotenv

load_dotenv()

def get_financial_data():
    environment = os.environ["NODE_ENV"]
    conn_string = f"host={os.environ['DB_HOST']} dbname={os.environ['DB_DATABASE']} user={os.environ['DB_USER']} password={os.environ['DB_PASSWORD']}" if environment == "development" else os.environ["DATABASE_URL"]
    conn = psycopg2.connect(conn_string)

    cursor = conn.cursor(
        cursor_factory=psycopg2.extras.RealDictCursor
    )


    cursor.execute(
        "SELECT * FROM sec_companies ORDER BY id"
    )

    rows = cursor.fetchall()
    df = pd.DataFrame(rows)

    result = []
    total = len(df)

    for i, item in enumerate(df["ticker"], start=1):
        print(f"[{i}/{total}] Zpracovávám {item}...")

        try:
            ticker = yf.Ticker(item)

            bs = ticker.balance_sheet
            cf = ticker.cash_flow
            info = ticker.info

            cash_equivalents = None
            total_debt = None
            free_cash_flow = []
            shares_outstanding = None

            if "Cash Cash Equivalents And Short Term Investments" in bs.index:
                cash_equivalents = bs.loc[
                    "Cash Cash Equivalents And Short Term Investments"
                ].iloc[0]

            elif "Cash And Cash Equivalents" in bs.index:
                cash_equivalents = bs.loc[
                    "Cash And Cash Equivalents"
                ].iloc[0]


            if "Total Debt" in bs.index:
                total_debt = bs.loc["Total Debt"].iloc[0]

            if pd.isna(total_debt):
                total_debt = 0


            if "Free Cash Flow" in cf.index:
                series = cf.loc["Free Cash Flow"]

                free_cash_flow = [
                    {
                        "date": date.strftime("%Y-%m-%d"),
                        "value": value
                    }
                    for date, value in series.items()
                    if pd.notna(value)
                ]


            if "sharesOutstanding" in info:
                shares_outstanding = info["sharesOutstanding"]


            result.append({
                "ticker": item,
                "cash_equivalents": float(cash_equivalents) if cash_equivalents is not None else 0,
                "total_debt": float(total_debt) if total_debt is not None else 0,
                "free_cash_flow": free_cash_flow,
                "shares_outstanding": int(shares_outstanding) if shares_outstanding is not None else 0
            })


        except Exception as e:
            print(e)

            result.append({
                "ticker": item,
                "cash_equivalents": 0,
                "total_debt": 0,
                "free_cash_flow": [],
                "shares_outstanding": 0
            })


    for row in result:
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
                row["cash_equivalents"],
                row["total_debt"],
                json.dumps(row["free_cash_flow"]),
                row["shares_outstanding"],
                row["ticker"]
            )
        )


    conn.commit()
    print(f"\nHotovo. Zpracováno {total} firem.")


if __name__ == "__main__":
    get_financial_data()
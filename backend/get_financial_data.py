import yfinance as yf
import pandas as pd


def get_financial_data(rows):
    df = pd.DataFrame(rows)

    result = []

    for item in df["ticker"]:
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
                "cash_equivalents": cash_equivalents,
                "total_debt": total_debt,
                "free_cash_flow": free_cash_flow,
                "shares_outstanding": shares_outstanding
            })


        except Exception as e:
            print(e)

            result.append({
                "ticker": item,
                "cash_equivalents": None,
                "total_debt": None,
                "free_cash_flow": [],
                "shares_outstanding": None
            })


    return result
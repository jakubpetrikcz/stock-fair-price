import yfinance as yf
import pandas as pd
import sys
import json

df = pd.DataFrame(json.load(sys.stdin))

cash_equivalents_list = []
total_debt_list = []
free_cash_flow_list = []
shares_outstanding_list = []
total = len(df)

for i, item in enumerate(df["ticker"], start=1):
    print(f"[{i}/{total}] Zpracovávám {item}...", file=sys.stderr)

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

        cash_equivalents_list.append(cash_equivalents)

        if "Total Debt" in bs.index:
          total_debt = bs.loc["Total Debt"].iloc[0]

        if pd.isna(total_debt):
          total_debt = 0

        total_debt_list.append(total_debt)

        if "Free Cash Flow" in cf.index:
          free_cash_flow_series = cf.loc["Free Cash Flow"]

          free_cash_flow = [
              {
                  "date": date.strftime("%Y-%m-%d"),
                  "value": value,
              }
              for date, value in free_cash_flow_series.items()
              if pd.notna(value)
          ]

        free_cash_flow_list.append(free_cash_flow)


        if "sharesOutstanding" in info:
          shares_outstanding = info["sharesOutstanding"]

        shares_outstanding_list.append(shares_outstanding)


    except Exception as e:
        cash_equivalents_list.append(None)
        total_debt_list.append(None)
        free_cash_flow_list.append([])
        shares_outstanding_list.append(None)

df["cash_equivalents"] = cash_equivalents_list
df["total_debt"] = total_debt_list
df["free_cash_flow"] = free_cash_flow_list
df["shares_outstanding"] = shares_outstanding_list

print(df.to_json(orient="records"))
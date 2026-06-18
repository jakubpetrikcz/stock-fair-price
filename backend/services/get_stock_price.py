import json
import sys
from datetime import datetime, timezone

import yfinance as yf


def get_iso_datetime(timestamp):
    if timestamp is None:
        return None

    return datetime.fromtimestamp(timestamp, timezone.utc).isoformat()


def get_price(ticker_symbol):
    ticker = yf.Ticker(ticker_symbol)
    price = None
    currency = None

    try:
        info = ticker.info or {}
        price = info.get("regularMarketPrice") or info.get("currentPrice")
        currency = info.get("currency")
    except Exception:
        pass

    if price is None:
        fast_info = ticker.fast_info
        price = fast_info.get("last_price")
        currency = currency or fast_info.get("currency")

    if price is None:
        raise ValueError(f"Price is not available for ticker {ticker_symbol}")

    return {
        "ticker": ticker_symbol.upper(),
        "price": float(price),
        "currency": currency,
    }


def main():
    if len(sys.argv) != 2:
        raise ValueError("Expected exactly one ticker symbol argument")

    ticker_symbol = sys.argv[1].strip().upper()

    if not ticker_symbol:
        raise ValueError("Ticker symbol cannot be empty")

    print(json.dumps(get_price(ticker_symbol)))


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(json.dumps({"error": str(error)}), file=sys.stderr)
        sys.exit(1)

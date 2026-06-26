import json
import sys
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from datetime import datetime, timezone

import yfinance as yf


def get_iso_datetime(timestamp):
    if timestamp is None:
        return None

    return datetime.fromtimestamp(timestamp, timezone.utc).isoformat()


def get_info_price(info):
    market_state = info.get("marketState")

    if market_state == "PRE" and info.get("preMarketPrice") is not None:
        return (
            info.get("preMarketPrice"),
            get_iso_datetime(info.get("preMarketTime")),
            "preMarket",
        )

    if market_state in {"POST", "POSTPOST"} and info.get("postMarketPrice") is not None:
        return (
            info.get("postMarketPrice"),
            get_iso_datetime(info.get("postMarketTime")),
            "postMarket",
        )

    return (
        info.get("regularMarketPrice") or info.get("currentPrice"),
        get_iso_datetime(info.get("regularMarketTime")),
        "regularMarket",
    )


def get_price(ticker_symbol):
    ticker = yf.Ticker(ticker_symbol)
    price = None
    currency = None

    try:
        info = ticker.info or {}
        price, market_time, price_type = get_info_price(info)
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


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = parse_qs(urlparse(self.path).query)

        try:
            ticker = query.get("ticker", [""])[0]
            self.send_json(200, get_price(ticker))
        except Exception as error:
            self.send_json(503, {"error": str(error)})

    def send_json(self, status, body):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(body).encode("utf-8"))


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
from http.server import BaseHTTPRequestHandler
from get_financial_data import get_financial_data
import psycopg2
import json
import os


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        conn = psycopg2.connect(
          os.environ["DATABASE_URL"]
        )

        cursor = conn.cursor(
            cursor_factory=psycopg2.extras.RealDictCursor
        )


        cursor.execute(
            "SELECT * FROM sec_companies ORDER BY id"
        )

        rows = cursor.fetchall()


        data = get_financial_data(rows)


        for row in data:
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


        self.send_response(200)
        self.end_headers()

        self.wfile.write(
            b'{"success":true}'
        )
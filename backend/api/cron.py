from http.server import BaseHTTPRequestHandler
from get_financial_data import get_financial_data
import psycopg2
import json


class handler(BaseHTTPRequestHandler):

    def do_GET(self):

        conn = psycopg2.connect(
            "tvůj postgres connection string"
        )

        cursor = conn.cursor()


        cursor.execute(
            "SELECT * FROM sec_companies ORDER BY id LIMIT 5"
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
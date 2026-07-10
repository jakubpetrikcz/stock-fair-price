from http.server import BaseHTTPRequestHandler
from get_financial_data import get_financial_data


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        get_financial_data()

        self.send_response(200)
        self.end_headers()

        self.wfile.write(
            b'{"success":true}'
        )
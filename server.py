from __future__ import annotations

import html
import json
import mimetypes
import os
import re
import socket
import sys
import uuid
import smtplib
from email.message import EmailMessage
from dataclasses import dataclass
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError


ROOT_DIR = Path(__file__).resolve().parent
PORT = 3000
APPROVALS: dict[str, dict[str, Any]] = {}


def normalize_phone(value: str | None) -> str:
    text = (value or "").strip()
    if not text:
        return ""
    if text.startswith("+"):
        return text
    digits = re.sub(r"\D", "", text)
    if len(digits) == 10:
        return f"+91{digits}"
    if len(digits) == 11 and digits.startswith("0"):
        return f"+91{digits[1:]}"
    return f"+{digits}"


def build_base_url(handler: BaseHTTPRequestHandler) -> str:
    host = handler.headers.get("Host") or f"localhost:{PORT}"
    return f"http://{host}"


def build_approval_message(details: dict[str, Any], request_id: str, base_url: str) -> str:
    approve_url = f"{base_url}/api/approval/{request_id}/yes"
    deny_url = f"{base_url}/api/approval/{request_id}/no"
    return "\n".join(
        [
            "FormulaNest login request",
            f"Name: {details.get('name', '')}",
            f"Class: {details.get('classNumber', '')}",
            f"Time: {details.get('createdAt', '')}",
            "",
            f"Yes: {approve_url}",
            f"No: {deny_url}",
        ]
    )


def build_approval_page(title: str, message: str) -> bytes:
    safe_title = html.escape(title)
    safe_message = html.escape(message)
    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{safe_title}</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0f172a; color: #e2e8f0; }}
    .card {{ width: min(92vw, 420px); background: #111827; border: 1px solid #334155; border-radius: 18px; padding: 24px; box-shadow: 0 20px 50px rgba(0,0,0,.35); }}
    a {{ display: inline-block; margin-right: 10px; margin-top: 10px; padding: 10px 14px; border-radius: 999px; text-decoration: none; font-weight: 700; }}
    .yes {{ background: #14b8a6; color: #042f2e; }}
    .no {{ background: #e2e8f0; color: #0f172a; }}
    pre {{ white-space: pre-wrap; background: #0b1220; padding: 14px; border-radius: 12px; border: 1px solid #334155; overflow-x: auto; }}
  </style>
</head>
<body>
  <div class="card">
    <h1>{safe_title}</h1>
    <pre>{safe_message}</pre>
    <div>
      <a class="yes" href="yes">Yes</a>
      <a class="no" href="no">No</a>
    </div>
  </div>
</body>
</html>
"""
    return page.encode("utf-8")


def json_response(handler: BaseHTTPRequestHandler, status: HTTPStatus, payload: dict[str, Any]) -> None:
    body = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.end_headers()
    handler.wfile.write(body)


def text_response(handler: BaseHTTPRequestHandler, status: HTTPStatus, text: str, content_type: str = "text/plain; charset=utf-8") -> None:
    body = text.encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", content_type)
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.end_headers()
    handler.wfile.write(body)


def guess_mime_type(path: Path) -> str:
    mime_type, _ = mimetypes.guess_type(str(path))
    if mime_type:
        return mime_type
    return "application/octet-stream"


class FormulaNestHandler(BaseHTTPRequestHandler):
    server_version = "FormulaNest/1.0"

    def log_message(self, format: str, *args: Any) -> None:  # noqa: A003
        sys.stdout.write("%s - - [%s] %s\n" % (self.client_address[0], self.log_date_time_string(), format % args))

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        path = parsed.path

        if path.startswith("/api/"):
            self.handle_api_get(path)
            return

        self.serve_static_file(path)

    def do_POST(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        path = parsed.path
        if path == "/api/approval/request":
            self.handle_approval_request()
            return
        if path == "/api/chat":
            self.handle_chat_request()
            return
        text_response(self, HTTPStatus.METHOD_NOT_ALLOWED, "Method not allowed")

    def handle_api_get(self, path: str) -> None:
        match = re.fullmatch(r"/api/approval/([^/]+)/(status|yes|no)", path)
        if not match:
            json_response(self, HTTPStatus.NOT_FOUND, {"error": "Not found"})
            return

        request_id, action = match.group(1), match.group(2)
        entry = APPROVALS.get(request_id)
        if not entry:
            json_response(self, HTTPStatus.NOT_FOUND, {"error": "Unknown approval request."})
            return

        if action == "status":
            json_response(self, HTTPStatus.OK, {"status": entry["status"], "details": entry["details"]})
            return

        entry["status"] = "approved" if action == "yes" else "denied"
        title = "Approval granted" if action == "yes" else "Approval denied"
        message = (
            "You approved the FormulaNest login request. Return to the app on the computer to continue."
            if action == "yes"
            else "You denied the FormulaNest login request. The app will stop on the computer."
        )
        text_response(self, HTTPStatus.OK, build_approval_page(title, message), "text/html; charset=utf-8")

    def handle_approval_request(self) -> None:
        length = int(self.headers.get("Content-Length", "0") or "0")
        raw = self.rfile.read(length).decode("utf-8") if length else "{}"

        try:
            body = json.loads(raw) if raw.strip() else {}
        except json.JSONDecodeError:
            json_response(self, HTTPStatus.BAD_REQUEST, {"error": "Invalid JSON body."})
            return

        request_id = str(uuid.uuid4())
        details = {
            "name": str(body.get("name", "")).strip(),
            "classNumber": str(body.get("classNumber", "")).strip(),
            "recipient": normalize_phone(str(body.get("recipient", ""))),
            "createdAt": __import__("datetime").datetime.now().astimezone().isoformat(),
        }
        if not details["recipient"]:
            details["recipient"] = normalize_phone(os.environ.get("APPROVAL_TO_NUMBER", "6309767151"))

        APPROVALS[request_id] = {"status": "pending", "details": details}
        base_url = build_base_url(self)
        message = build_approval_message(details, request_id, base_url)

        sys.stdout.write("\n--- LOG PREVIEW ---\n")
        sys.stdout.write(f"To: {details['recipient']}\n")
        sys.stdout.write(message + "\n")
        sys.stdout.write("--- END LOG PREVIEW ---\n\n")

        # Try sending email notification
        config_path = ROOT_DIR / "email_config.json"
        if config_path.exists():
            try:
                with open(config_path, "r") as f:
                    config = json.load(f)
                
                sender_email = config.get("SENDER_EMAIL")
                app_password = config.get("APP_PASSWORD")
                receiver_email = config.get("RECEIVER_EMAIL")

                if sender_email and "your-gmail@gmail.com" not in sender_email:
                    msg = EmailMessage()
                    msg.set_content(message)
                    msg["Subject"] = f"FormulaNest: Login Request from {details.get('name', 'Unknown')}"
                    msg["From"] = sender_email
                    msg["To"] = receiver_email

                    # Assuming Gmail by default
                    sys.stdout.write(f"Sending real email to {receiver_email}...\n")
                    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                        server.login(sender_email, app_password)
                        server.send_message(msg)
                    sys.stdout.write("Email sent successfully!\n")
            except Exception as e:
                sys.stdout.write(f"Failed to send email: {e}\n")

        json_response(
            self,
            HTTPStatus.OK,
            {
                "requestId": request_id,
                "statusUrl": f"{base_url}/api/approval/{request_id}/status",
                "approvedUrl": f"{base_url}/api/approval/{request_id}/yes",
                "deniedUrl": f"{base_url}/api/approval/{request_id}/no",
                "recipient": details["recipient"],
                "mode": "python-mock",
            },
        )

    def handle_chat_request(self) -> None:
        length = int(self.headers.get("Content-Length", "0") or "0")
        raw = self.rfile.read(length).decode("utf-8") if length else "{}"

        try:
            body = json.loads(raw) if raw.strip() else {}
        except json.JSONDecodeError:
            json_response(self, HTTPStatus.BAD_REQUEST, {"error": "Invalid JSON body."})
            return

        body_api_key = str(body.get("apiKey", "")).strip()
        api_key = body_api_key or os.environ.get("OPENROUTER_API_KEY", "").strip()
        if not api_key:
            json_response(self, HTTPStatus.BAD_REQUEST, {"error": "Missing OpenRouter API key."})
            return

        messages = body.get("messages")
        if not isinstance(messages, list) or not messages:
            json_response(self, HTTPStatus.BAD_REQUEST, {"error": "Messages are required."})
            return

        model = body.get("model") or os.environ.get("OPENROUTER_MODEL", "meta-llama/llama-3.1-8b-instruct")
        payload = {
            "model": model,
            "messages": messages,
            "temperature": body.get("temperature", 0.7),
            "max_tokens": body.get("max_tokens", 600)
        }

        api_url = "https://openrouter.ai/api/v1/chat/completions"
        base_url = build_base_url(self)
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": base_url,
            "X-Title": "FormulaNest",
        }

        try:
            req = Request(api_url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
            with urlopen(req, timeout=40) as resp:
                response_data = json.loads(resp.read().decode("utf-8"))
        except HTTPError as error:
            error_text = error.read().decode("utf-8") if error.fp else str(error)
            json_response(self, HTTPStatus.BAD_GATEWAY, {"error": error_text})
            return
        except URLError as error:
            json_response(self, HTTPStatus.BAD_GATEWAY, {"error": str(error)})
            return

        try:
            content = response_data["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError):
            json_response(self, HTTPStatus.BAD_GATEWAY, {"error": "Invalid response from OpenRouter."})
            return

        json_response(self, HTTPStatus.OK, {"content": content})

    def serve_static_file(self, path: str) -> None:
        relative = path.lstrip("/") or "index.html"
        full_path = (ROOT_DIR / relative).resolve()
        try:
            full_path.relative_to(ROOT_DIR)
        except ValueError:
            text_response(self, HTTPStatus.FORBIDDEN, "Forbidden")
            return

        if not full_path.exists() or not full_path.is_file():
            text_response(self, HTTPStatus.NOT_FOUND, "Not found")
            return

        body = full_path.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", guess_mime_type(full_path))
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    port = PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    server = ThreadingHTTPServer(("0.0.0.0", port), FormulaNestHandler)
    host = socket.gethostname()
    local_ip = None
    try:
        local_ip = socket.gethostbyname(host)
    except OSError:
        local_ip = None

    sys.stdout.write(f"FormulaNest server running at http://localhost:{port}\n")
    if local_ip and not local_ip.startswith("127."):
        sys.stdout.write(f"LAN URL: http://{local_ip}:{port}/\n")
    sys.stdout.flush()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
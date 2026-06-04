# FormulaNest SMS Approval Gate

This folder now includes a small PowerShell server that can send a login approval message and wait for a Yes/No response before opening the app.

## What it does

- Collects the login details from `login.html`
- Sends an approval message to the recipient number
- Includes `Yes` and `No` links in the message
- Opens the app only when the request is approved

## Local run

```bash
powershell -ExecutionPolicy Bypass -File .\server.ps1
```

Then open:

```text
http://localhost:3000/index.html
```

## Real SMS setup

To send a real SMS, set these environment variables:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`
- `APPROVAL_TO_NUMBER` (default is `6309767151`)
- `PUBLIC_BASE_URL` (use a public URL if the phone must open the approval links)

Example:

```bash
set TWILIO_ACCOUNT_SID=your_sid
set TWILIO_AUTH_TOKEN=your_token
set TWILIO_FROM_NUMBER=+1xxxxxxxxxx
set APPROVAL_TO_NUMBER=6309767151
set PUBLIC_BASE_URL=https://your-public-url.example
npm start
```

If you do not set Twilio variables, the server runs in mock mode and prints the message to the console instead of sending SMS.

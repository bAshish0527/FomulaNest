param(
    [int]$Port = 3000
)

$ErrorActionPreference = 'Stop'
$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Listener = [System.Net.HttpListener]::new()
$Listener.Prefixes.Add("http://localhost:$Port/")
$LocalIp = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254*' } |
    Select-Object -First 1 -ExpandProperty IPAddress)
if ($LocalIp) {
    $Listener.Prefixes.Add("http://$LocalIp`:$Port/")
}

$script:Approvals = @{}
$script:TwilioSid = $env:TWILIO_ACCOUNT_SID
$script:TwilioToken = $env:TWILIO_AUTH_TOKEN
$script:TwilioFrom = $env:TWILIO_FROM_NUMBER
$script:ApprovalTo = $null
$script:PublicBaseUrl = if ($env:PUBLIC_BASE_URL) { $env:PUBLIC_BASE_URL.TrimEnd('/') } else { "http://localhost:$Port" }
$script:SmsMode = if ($env:SMS_MODE) { $env:SMS_MODE.ToLowerInvariant() } else { if ($script:TwilioSid -and $script:TwilioToken -and $script:TwilioFrom) { 'twilio' } else { 'mock' } }

# Gmail / Email settings (optional)
$script:GmailUser = if ($env:GMAIL_USER) { $env:GMAIL_USER } else { $null }
$script:GmailPass = if ($env:GMAIL_APP_PASSWORD) { $env:GMAIL_APP_PASSWORD } else { $null }
$script:EmailTo = if ($env:APPROVAL_EMAIL) { $env:APPROVAL_EMAIL } else { 'ashishdishmanth27@gmail.com' }
$script:EmailMode = if ($env:EMAIL_MODE) { $env:EMAIL_MODE.ToLowerInvariant() } else { if ($script:GmailUser -and $script:GmailPass) { 'gmail' } else { 'none' } }

$MimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.js' = 'application/javascript; charset=utf-8'
    '.css' = 'text/css; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.svg' = 'image/svg+xml'
    '.png' = 'image/png'
    '.jpg' = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif' = 'image/gif'
    '.ico' = 'image/x-icon'
    '.txt' = 'text/plain; charset=utf-8'
}

function Normalize-Phone {
    param([string]$Value)
    $text = if ($null -eq $Value) { '' } else { $Value.Trim() }
    if (-not $text) { return '' }
    if ($text.StartsWith('+')) { return $text }
    $digits = ($text -replace '\D', '')
    if ($digits.Length -eq 10) { return "+91$digits" }
    if ($digits.Length -eq 11 -and $digits.StartsWith('0')) { return "+91$($digits.Substring(1))" }
    return "+$digits"
}

$script:ApprovalTo = if ($env:APPROVAL_TO_NUMBER) { Normalize-Phone $env:APPROVAL_TO_NUMBER } else { Normalize-Phone '6309767151' }

function Add-CorsHeaders {
    param($Response)
    $Response.Headers.Add('Access-Control-Allow-Origin', '*')
    $Response.Headers.Add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    $Response.Headers.Add('Access-Control-Allow-Headers', 'Content-Type')
}

function Write-JsonResponse {
    param(
        $Response,
        [int]$StatusCode,
        $Payload
    )
    $json = $Payload | ConvertTo-Json -Depth 8 -Compress
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    Add-CorsHeaders -Response $Response
    $Response.StatusCode = $StatusCode
    $Response.ContentType = 'application/json; charset=utf-8'
    $Response.ContentLength64 = $bytes.Length
    $Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $Response.OutputStream.Close()
}

function Write-TextResponse {
    param(
        $Response,
        [int]$StatusCode,
        [string]$Text,
        [string]$ContentType = 'text/plain; charset=utf-8'
    )
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
    Add-CorsHeaders -Response $Response
    $Response.StatusCode = $StatusCode
    $Response.ContentType = $ContentType
    $Response.ContentLength64 = $bytes.Length
    $Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $Response.OutputStream.Close()
}

function Read-Body {
    param($Request)
    $reader = New-Object System.IO.StreamReader($Request.InputStream, $Request.ContentEncoding)
    try {
        $raw = $reader.ReadToEnd()
        if (-not $raw) { return @{} }
        return $raw | ConvertFrom-Json
    } finally {
        $reader.Close()
    }
}

function Get-MimeType {
    param([string]$FilePath)
    $extension = [System.IO.Path]::GetExtension($FilePath).ToLowerInvariant()
    if ($MimeTypes.ContainsKey($extension)) {
        return $MimeTypes[$extension]
    }
    return 'application/octet-stream'
}

function Serve-StaticFile {
    param($Context, [string]$RelativePath)
    $pathCandidate = if ($RelativePath -eq '/') { 'index.html' } else { $RelativePath.TrimStart('/') }
    $fullPath = [System.IO.Path]::GetFullPath((Join-Path $RootDir $pathCandidate))
    if (-not $fullPath.StartsWith($RootDir, [System.StringComparison]::OrdinalIgnoreCase)) {
        Write-TextResponse -Response $Context.Response -StatusCode 403 -Text 'Forbidden'
        return
    }

    if (-not (Test-Path -LiteralPath $fullPath)) {
        Write-TextResponse -Response $Context.Response -StatusCode 404 -Text 'Not found'
        return
    }

    $bytes = [System.IO.File]::ReadAllBytes($fullPath)
    Add-CorsHeaders -Response $Context.Response
    $Context.Response.StatusCode = 200
    $Context.Response.ContentType = Get-MimeType -FilePath $fullPath
    $Context.Response.ContentLength64 = $bytes.Length
    $Context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $Context.Response.OutputStream.Close()
}

function Build-ApprovalMessage {
    param($Details, [string]$Id)
    $approveUrl = "$($script:PublicBaseUrl)/api/approval/$Id/yes"
    $denyUrl = "$($script:PublicBaseUrl)/api/approval/$Id/no"
    return @(
        'FormulaNest login request',
        "Name: $($Details.name)",
        "Class: $($Details.classNumber)",
        "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
        '',
        "Yes: $approveUrl",
        "No: $denyUrl"
    ) -join "`n"
}

function Send-Sms {
    param(
        [string]$To,
        [string]$Message
    )

    if ($script:SmsMode -eq 'mock') {
        Write-Host ''
        Write-Host '--- SMS PREVIEW ---'
        Write-Host "To: $To"
        Write-Host $Message
        Write-Host '--- END SMS PREVIEW ---'
        Write-Host ''
        return
    }

    if (-not $script:TwilioSid -or -not $script:TwilioToken -or -not $script:TwilioFrom) {
        throw 'Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER for real SMS.'
    }

    $basic = [Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes("$($script:TwilioSid):$($script:TwilioToken)"))
    $headers = @{ Authorization = "Basic $basic" }
    $body = @{ To = $To; From = $script:TwilioFrom; Body = $Message }
    Invoke-RestMethod -Method Post -Uri "https://api.twilio.com/2010-04-01/Accounts/$($script:TwilioSid)/Messages.json" -Headers $headers -Body $body | Out-Null
}

function Send-Email {
    param(
        [string]$To,
        [string]$Subject,
        [string]$Body
    )

    if (-not $script:GmailUser -or -not $script:GmailPass) {
        throw 'Set GMAIL_USER and GMAIL_APP_PASSWORD to send email.'
    }

    $mail = New-Object System.Net.Mail.MailMessage
    $mail.From = $script:GmailUser
    $mail.To.Add($To)
    $mail.Subject = $Subject
    $mail.Body = $Body
    $mail.IsBodyHtml = $false

    $smtp = New-Object System.Net.Mail.SmtpClient('smtp.gmail.com', 587)
    $smtp.EnableSsl = $true
    $smtp.Credentials = New-Object System.Net.NetworkCredential($script:GmailUser, $script:GmailPass)
    $smtp.Send($mail)
}

function Build-ApprovalPage {
    param(
        [string]$Title,
        [string]$Message
    )

    return @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$Title</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0f172a; color: #e2e8f0; }
    .card { width: min(92vw, 420px); background: #111827; border: 1px solid #334155; border-radius: 18px; padding: 24px; box-shadow: 0 20px 50px rgba(0,0,0,.35); }
    a { display: inline-block; margin-right: 10px; margin-top: 10px; padding: 10px 14px; border-radius: 999px; text-decoration: none; font-weight: 700; }
    .yes { background: #14b8a6; color: #042f2e; }
    .no { background: #e2e8f0; color: #0f172a; }
    pre { white-space: pre-wrap; background: #0b1220; padding: 14px; border-radius: 12px; border: 1px solid #334155; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="card">
    <h1>$Title</h1>
    <pre>$($Message.Replace('<','&lt;').Replace('>','&gt;'))</pre>
    <div>
      <a class="yes" href="yes">Yes</a>
      <a class="no" href="no">No</a>
    </div>
  </div>
</body>
</html>
"@
}

$Listener.Start()
Write-Host "FormulaNest server running at http://localhost:$Port"
if ($LocalIp) {
    Write-Host "LAN URL: http://$LocalIp`:$Port/"
}
Write-Host "SMS mode: $($script:SmsMode)"
Write-Host "Email mode: $($script:EmailMode)"
Write-Host "Recipient: $($script:ApprovalTo)"

try {
    while ($Listener.IsListening) {
        $Context = $Listener.GetContext()
        $Request = $Context.Request
        $Response = $Context.Response
        $Path = $Request.Url.AbsolutePath
        $Method = $Request.HttpMethod.ToUpperInvariant()

        try {
            if ($Method -eq 'OPTIONS') {
                Add-CorsHeaders -Response $Response
                $Response.StatusCode = 204
                $Response.OutputStream.Close()
                continue
            }

            if ($Path -like '/api/*') {
                if ($Method -eq 'POST' -and $Path -eq '/api/approval/request') {
                    $Body = Read-Body -Request $Request
                    $Id = [Guid]::NewGuid().ToString()
                    $Details = [ordered]@{
                        name = ([string]$Body.name).Trim()
                        classNumber = ([string]$Body.classNumber).Trim()
                        recipient = Normalize-Phone ([string]$Body.recipient)
                        createdAt = (Get-Date).ToString('o')
                    }

                    if (-not $Details.recipient) {
                        $Details.recipient = $script:ApprovalTo
                    }

                    $script:Approvals[$Id] = [ordered]@{
                        status = 'pending'
                        details = $Details
                    }

                    $Message = Build-ApprovalMessage -Details $Details -Id $Id
                    try {
                        if ($script:EmailMode -eq 'gmail') {
                            # If recipient looks like an email use it, otherwise use configured approval email
                            $toEmail = if ($Details.recipient -match '@') { $Details.recipient } else { $script:EmailTo }
                            Send-Email -To $toEmail -Subject 'FormulaNest login request' -Body $Message
                        } else {
                            Send-Sms -To $Details.recipient -Message $Message
                        }
                    } catch {
                        $null = $script:Approvals.Remove($Id)
                        Write-JsonResponse -Response $Response -StatusCode 500 -Payload @{ error = $_.Exception.Message }
                        continue
                    }

                    Write-JsonResponse -Response $Response -StatusCode 200 -Payload @{
                        requestId = $Id
                        statusUrl = "$($script:PublicBaseUrl)/api/approval/$Id/status"
                        approvedUrl = "$($script:PublicBaseUrl)/api/approval/$Id/yes"
                        deniedUrl = "$($script:PublicBaseUrl)/api/approval/$Id/no"
                        recipient = $Details.recipient
                        mode = $script:SmsMode
                    }
                    continue
                }

                if ($Path -match '^/api/approval/([^/]+)/(status|yes|no)$') {
                    $Id = $Matches[1]
                    $Action = $Matches[2]
                    if (-not $script:Approvals.ContainsKey($Id)) {
                        Write-JsonResponse -Response $Response -StatusCode 404 -Payload @{ error = 'Unknown approval request.' }
                        continue
                    }

                    if ($Action -eq 'status') {
                        $Entry = $script:Approvals[$Id]
                        Write-JsonResponse -Response $Response -StatusCode 200 -Payload @{ status = $Entry.status; details = $Entry.details }
                        continue
                    }

                    $script:Approvals[$Id].status = if ($Action -eq 'yes') { 'approved' } else { 'denied' }
                    $pageTitle = if ($Action -eq 'yes') { 'Approval granted' } else { 'Approval denied' }
                    $pageMessage = if ($Action -eq 'yes') { 'You approved the FormulaNest login request. Return to the app on the computer to continue.' } else { 'You denied the FormulaNest login request. The app will stop on the computer.' }
                    $Html = Build-ApprovalPage -Title $pageTitle -Message $pageMessage
                    Write-TextResponse -Response $Response -StatusCode 200 -Text $Html -ContentType 'text/html; charset=utf-8'
                    continue
                }

                Write-JsonResponse -Response $Response -StatusCode 404 -Payload @{ error = 'Not found' }
                continue
            }

            if ($Method -eq 'GET') {
                Serve-StaticFile -Context $Context -RelativePath $Path
                continue
            }

            Write-TextResponse -Response $Response -StatusCode 405 -Text 'Method not allowed'
        } catch {
            try {
                Write-JsonResponse -Response $Response -StatusCode 500 -Payload @{ error = $_.Exception.Message }
            } catch {
                if ($Response.OutputStream) { $Response.OutputStream.Close() }
            }
        }
    }
} finally {
    $Listener.Stop()
    $Listener.Close()
}

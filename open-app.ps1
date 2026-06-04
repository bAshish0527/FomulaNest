$port = 3000
$version = 67
$hostName = $env:COMPUTERNAME
$ip = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254*' } |
    Select-Object -First 1 -ExpandProperty IPAddress)
$localUrl = if ($ip) { "http://$ip`:$port/index.html?v=$version" } else { "http://127.0.0.1:$port/index.html?v=$version" }
$stableLanUrl = "http://$hostName`:$port/index.html?v=$version"

$listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if (-not $listener) {
    Start-Process -WindowStyle Normal -FilePath "python" -ArgumentList @(
        "`"$PSScriptRoot\server.py`"",
        "$port"
    )
}

$maxTries = 5
for ($i = 0; $i -lt $maxTries; $i++) {
    try {
        Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:$port/index.html" | Out-Null
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}

Write-Host ""
Write-Host "FormulaNest started."
Write-Host "Stable LAN URL (preferred): $stableLanUrl"
if ($ip) {
    Write-Host "Current IP URL: http://$ip`:$port/index.html?v=$version"
}
Write-Host ""

Start-Process $localUrl

$ErrorActionPreference = "Stop"

$adapter = "Wi-Fi"

if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Please run this script as Administrator." -ForegroundColor Yellow
    exit 1
}

Write-Host "Switching adapter $adapter back to DHCP..." -ForegroundColor Cyan

Get-NetIPAddress -InterfaceAlias $adapter -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -notlike "169.254*" } |
    ForEach-Object { Remove-NetIPAddress -InputObject $_ -Confirm:$false }

Set-NetIPInterface -InterfaceAlias $adapter -AddressFamily IPv4 -Dhcp Enabled
Set-DnsClientServerAddress -InterfaceAlias $adapter -ResetServerAddresses

ipconfig /renew | Out-Null
Write-Host "DHCP restored." -ForegroundColor Green

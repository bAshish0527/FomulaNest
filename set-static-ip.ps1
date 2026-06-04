$ErrorActionPreference = "Stop"

$adapter = "Wi-Fi"
$ip = "192.168.0.103"
$prefixLength = 24
$gateway = "192.168.0.1"
$dnsPrimary = "192.168.0.1"
$dnsSecondary = "8.8.8.8"

if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Please run this script as Administrator." -ForegroundColor Yellow
    exit 1
}

Write-Host "Configuring static IP on adapter: $adapter" -ForegroundColor Cyan

# Remove existing non-link-local IPv4 addresses on this adapter.
Get-NetIPAddress -InterfaceAlias $adapter -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -notlike "169.254*" } |
    ForEach-Object { Remove-NetIPAddress -InputObject $_ -Confirm:$false }

# Remove existing default IPv4 routes on this adapter.
Get-NetRoute -InterfaceAlias $adapter -AddressFamily IPv4 -DestinationPrefix "0.0.0.0/0" -ErrorAction SilentlyContinue |
    ForEach-Object { Remove-NetRoute -InputObject $_ -Confirm:$false }

New-NetIPAddress -InterfaceAlias $adapter -IPAddress $ip -PrefixLength $prefixLength -DefaultGateway $gateway | Out-Null
Set-DnsClientServerAddress -InterfaceAlias $adapter -ServerAddresses @($dnsPrimary, $dnsSecondary)

Write-Host "Static IP applied successfully." -ForegroundColor Green
Write-Host "IP: $ip  Gateway: $gateway  DNS: $dnsPrimary, $dnsSecondary"
Write-Host "Open app: http://$ip`:8080/index.html?v=55"

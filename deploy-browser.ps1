# deploy-browser.ps1 - Copia el contenido de dist/browser a una carpeta destino
# Uso: .\deploy-browser.ps1 "C:\ruta\destino"

param(
    [Parameter(Mandatory=$true)]
    [string]$Destino
)

$Source = Join-Path (Get-Location) "dist\browser"

if (-not (Test-Path -LiteralPath $Source)) {
    Write-Host "ERROR: No existe la carpeta dist\browser en esta ubicacion." -ForegroundColor Red
    Write-Host "Asegurate de haber ejecutado 'ng build' antes." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pulsa Enter para cerrar..."
    Read-Host
    exit 1
}

Write-Host "Origen:  $Source" -ForegroundColor Cyan
Write-Host "Destino: $Destino" -ForegroundColor Cyan
Write-Host "------------------------------------------------------------"

# Crear destino si no existe
if (-not (Test-Path -LiteralPath $Destino)) {
    Write-Host "La carpeta destino no existe, creandola..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $Destino -Force | Out-Null
}

# Copiar y reemplazar todo
Copy-Item -LiteralPath "$Source\*" -Destination $Destino -Recurse -Force

Write-Host "Copiado correctamente." -ForegroundColor Green
Write-Host "------------------------------------------------------------"
Write-Host "Listo." -ForegroundColor Cyan
Write-Host ""
Write-Host "Pulsa Enter para cerrar..."
Read-Host

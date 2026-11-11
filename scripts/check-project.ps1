$ErrorActionPreference = "Stop"

Write-Host "Verificando TITICACA CONTRAST..." -ForegroundColor Cyan

Write-Host "1. Frontend: Typecheck, Lint, Test y Build" -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\web"
npm run typecheck
npm run lint
npm run test -- --run
npm run build

Write-Host "2. Pipeline: Pytest" -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\pipeline"
if (Test-Path ".\.venv\Scripts\python.exe") {
    .\.venv\Scripts\python.exe -m pytest -q
} else {
    python -m pytest -q
}

Set-Location -Path "$PSScriptRoot\.."
Write-Host "Verificacion completada con exito." -ForegroundColor Green

$ErrorActionPreference = "Stop"

Write-Host "Verificando TITICACA CONTRAST..." -ForegroundColor Cyan

Write-Host "1. Frontend: Typecheck, Lint, Test y Build" -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\web"
npm run typecheck
if ($LASTEXITCODE -ne 0) { throw "Fallo en npm run typecheck" }
npm run lint
if ($LASTEXITCODE -ne 0) { throw "Fallo en npm run lint" }
npm run test -- --run
if ($LASTEXITCODE -ne 0) { throw "Fallo en npm run test" }
npm run build
if ($LASTEXITCODE -ne 0) { throw "Fallo en npm run build" }

Write-Host "2. Pipeline: Pytest" -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\pipeline"
if (Test-Path ".\.venv\Scripts\python.exe") {
    .\.venv\Scripts\python.exe -m pytest -q
} else {
    python -m pytest -q
}
if ($LASTEXITCODE -ne 0) { throw "Fallo en pytest" }

Set-Location -Path "$PSScriptRoot\.."
Write-Host "Verificacion completada con exito." -ForegroundColor Green

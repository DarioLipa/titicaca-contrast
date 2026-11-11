$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$repoRoot = Resolve-Path "$PSScriptRoot\.."
$zipPath = "$repoRoot\titicaca-contrast-release.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

$tempDir = Join-Path $env:TEMP "titicaca-contrast-release"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}

New-Item -ItemType Directory -Path $tempDir | Out-Null

$itemsToCopy = @(
    "README.md",
    "LICENSE",
    ".editorconfig",
    ".gitignore",
    "docs",
    "scripts",
    ".github",
    "web\src",
    "web\public",
    "web\index.html",
    "web\package.json",
    "web\package-lock.json",
    "web\tsconfig.json",
    "web\tsconfig.node.json",
    "web\vite.config.ts",
    "pipeline\src",
    "pipeline\tests",
    "pipeline\config",
    "pipeline\pyproject.toml",
    "pipeline\requirements-lock.txt"
)

foreach ($item in $itemsToCopy) {
    $src = Join-Path $repoRoot $item
    $dest = Join-Path $tempDir $item
    if (Test-Path $src) {
        $parent = Split-Path $dest -Parent
        if (-not (Test-Path $parent)) {
            New-Item -ItemType Directory -Path $parent -Force | Out-Null
        }
        Copy-Item -Path $src -Destination $dest -Recurse -Force
    }
}

Get-ChildItem -Path $tempDir -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force
Get-ChildItem -Path $tempDir -Recurse -Directory -Filter ".pytest_cache" | Remove-Item -Recurse -Force

Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -CompressionLevel Optimal

Remove-Item $tempDir -Recurse -Force

Write-Host "Paquete de distribucion generado exitosamente en: $zipPath"

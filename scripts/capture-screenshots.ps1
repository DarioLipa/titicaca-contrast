$ErrorActionPreference = "Stop"

$screenshotsDir = (Resolve-Path "docs\screenshots").Path
$artifactDir = "C:\Users\Usuario\.gemini\antigravity\brain\efff69b4-5fc5-4ca0-8df8-21c41b3bfef0"

$server = Start-Process -FilePath "pipeline\.venv\Scripts\python.exe" -ArgumentList "-m", "http.server", "8085", "--directory", "web/dist" -PassThru
Start-Sleep -Seconds 2

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

$resList = @(
    @{ name = "desktop-1920x1080.png"; w = 1920; h = 1080 },
    @{ name = "desktop-1650x900.png"; w = 1650; h = 900 },
    @{ name = "laptop-1366x768.png"; w = 1366; h = 768 },
    @{ name = "tablet-768x1024.png"; w = 768; h = 1024 },
    @{ name = "mobile-390x844.png"; w = 390; h = 844 }
)

foreach ($res in $resList) {
    $outFile = Join-Path $screenshotsDir $res.name
    $args = @(
        "--headless",
        "--no-sandbox",
        "--disable-gpu",
        "--enable-webgl",
        "--use-gl=angle",
        "--virtual-time-budget=4000",
        "--window-size=$($res.w),$($res.h)",
        "--screenshot=`"$outFile`"",
        "http://127.0.0.1:8085/"
    )
    $proc = Start-Process -FilePath $chrome -ArgumentList $args -PassThru -Wait
}

Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue

Copy-Item "$screenshotsDir\*.png" $artifactDir -Force -ErrorAction SilentlyContinue

Get-ChildItem $screenshotsDir

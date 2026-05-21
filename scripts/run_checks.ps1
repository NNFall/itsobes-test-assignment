param(
    [switch]$IncludeDocker
)

$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:PYTHONIOENCODING = "utf-8"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")

Write-Host "== Task 1: JavaScript syntax =="
Push-Location (Join-Path $Root "task1_web_utility")
node --check "src/app.js"
Pop-Location

Write-Host "== Task 2: Python syntax =="
Push-Location (Join-Path $Root "task2_python_api_docker")
python -m py_compile "cbr_rates_report.py"

Write-Host "== Task 2: Python API smoke test =="
python "cbr_rates_report.py" --top 3

if ($IncludeDocker) {
    Write-Host "== Task 2: Docker build and run =="
    docker build -t cbr-rates-report .
    docker run --rm cbr-rates-report --top 3
}
Pop-Location

Write-Host "== Task 3: Apps Script syntax as JavaScript =="
Push-Location (Join-Path $Root "task3_apps_script")
Get-Content -Raw "Code.gs" | node --check --input-type=commonjs
Pop-Location

Write-Host "All checks passed."

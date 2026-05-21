$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$Deliverables = Join-Path $Root "deliverables"
$Archive = Join-Path $Deliverables "itsobes_test_assignment.zip"
$HashFile = "$Archive.sha256"

New-Item -ItemType Directory -Force $Deliverables | Out-Null

Get-ChildItem -Path $Root -Recurse -Force -Directory -Filter "__pycache__" |
    Remove-Item -Recurse -Force

Get-ChildItem -Path $Root -Recurse -Force -File -Filter "*.pyc" |
    Remove-Item -Force

if (Test-Path -LiteralPath $Archive) {
    Remove-Item -LiteralPath $Archive -Force
}

$Items = @(
    "task1_web_utility",
    "task2_python_api_docker",
    "task3_apps_script",
    "docs",
    "scripts",
    "README.md",
    "PLAN.md",
    "OPERATIONS.md",
    ".gitignore",
    ".gitattributes"
)

$Paths = $Items | ForEach-Object { Join-Path $Root $_ }
Compress-Archive -Path $Paths -DestinationPath $Archive -Force

$Hash = (Get-FileHash -LiteralPath $Archive -Algorithm SHA256).Hash
Set-Content -LiteralPath $HashFile -Value "$Hash  itsobes_test_assignment.zip" -Encoding ascii

Write-Host "Archive: $Archive"
Write-Host "SHA256: $Hash"

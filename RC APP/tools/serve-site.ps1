param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot),
  [int]$Port = 4173
)

$python = Get-Command py, python -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $python) {
  throw 'Python was not found. Install Python or run your own local static server.'
}

Write-Host "Serving $ProjectRoot at http://localhost:$Port" -ForegroundColor Cyan
& $python.Source -m http.server $Port --directory $ProjectRoot

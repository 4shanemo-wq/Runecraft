param(
  [ValidateSet('sync-gallery', 'validate', 'check-links', 'all', 'serve')]
  [string]$Task = 'all',
  [string]$ProjectRoot,
  [int]$Port = 4173,
  [switch]$SkipExternalLinks
)

$ToolsRoot = $PSScriptRoot
if (-not $ProjectRoot) {
  $ProjectRoot = Split-Path -Parent $ToolsRoot
}
$script:FailedSteps = New-Object System.Collections.Generic.List[string]

function Get-ToolPath {
  param([string]$Name)
  return Join-Path $ToolsRoot $Name
}

function Invoke-Tool {
  param(
    [string]$Label,
    [string]$Name,
    [string[]]$Arguments = @(),
    [switch]$ContinueOnError
  )

  Write-Host ""
  Write-Host "== $Label ==" -ForegroundColor Cyan

  $toolPath = Get-ToolPath $Name
  & powershell -NoProfile -ExecutionPolicy Bypass -File $toolPath @Arguments
  $exitCode = $LASTEXITCODE

  if ($exitCode -ne 0) {
    $script:FailedSteps.Add($Label) | Out-Null
    if (-not $ContinueOnError) {
      exit $exitCode
    }
  }
}

function Get-LinkArguments {
  $arguments = @('-ProjectRoot', $ProjectRoot)
  if ($SkipExternalLinks) {
    $arguments += '-SkipExternal'
  }
  return $arguments
}

switch ($Task) {
  'sync-gallery' {
    Invoke-Tool -Label 'Sync gallery' -Name 'sync-gallery.ps1' -Arguments @('-ProjectRoot', $ProjectRoot)
  }
  'validate' {
    Invoke-Tool -Label 'Validate local files and data' -Name 'validate-site.ps1' -Arguments @('-ProjectRoot', $ProjectRoot)
  }
  'check-links' {
    Invoke-Tool -Label 'Check links' -Name 'check-links.ps1' -Arguments (Get-LinkArguments)
  }
  'all' {
    Invoke-Tool -Label 'Sync gallery' -Name 'sync-gallery.ps1' -Arguments @('-ProjectRoot', $ProjectRoot) -ContinueOnError
    Invoke-Tool -Label 'Validate local files and data' -Name 'validate-site.ps1' -Arguments @('-ProjectRoot', $ProjectRoot) -ContinueOnError
    Invoke-Tool -Label 'Check links' -Name 'check-links.ps1' -Arguments (Get-LinkArguments) -ContinueOnError

    Write-Host ""
    if ($script:FailedSteps.Count -gt 0) {
      Write-Host 'Maintenance finished with issues in:' -ForegroundColor Red
      $script:FailedSteps | ForEach-Object { Write-Host " - $_" }
      exit 1
    }

    Write-Host 'All maintenance checks passed.' -ForegroundColor Green
  }
  'serve' {
    Invoke-Tool -Label 'Start local preview server' -Name 'serve-site.ps1' -Arguments @('-ProjectRoot', $ProjectRoot, '-Port', $Port)
  }
}


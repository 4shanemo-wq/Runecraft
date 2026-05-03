param(
  [ValidateSet('sync-gallery', 'validate', 'serve')]
  [string]$Task,
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot),
  [int]$Port = 4173
)

switch ($Task) {
  'sync-gallery' {
    & (Join-Path $PSScriptRoot 'sync-gallery.ps1') -ProjectRoot $ProjectRoot
  }
  'validate' {
    & (Join-Path $PSScriptRoot 'validate-site.ps1') -ProjectRoot $ProjectRoot
  }
  'serve' {
    & (Join-Path $PSScriptRoot 'serve-site.ps1') -ProjectRoot $ProjectRoot -Port $Port
  }
}

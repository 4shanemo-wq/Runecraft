param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot),
  [switch]$SkipExternal,
  [int]$TimeoutSeconds = 12
)

$issues = New-Object System.Collections.Generic.List[string]
$warnings = New-Object System.Collections.Generic.List[string]

function Add-Issue {
  param([string]$Message)
  $issues.Add($Message) | Out-Null
}

function Add-Warning {
  param([string]$Message)
  $warnings.Add($Message) | Out-Null
}

function Read-TextFile {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    Add-Issue "Missing file while checking links: $Path"
    return ""
  }

  return Get-Content -LiteralPath $Path -Raw
}

$indexPath = Join-Path $ProjectRoot 'index.html'
$indexContent = Read-TextFile $indexPath

$allContent = New-Object System.Text.StringBuilder
[void]$allContent.AppendLine($indexContent)

Get-ChildItem -Path (Join-Path $ProjectRoot 'assets') -File -Filter '*.js' -ErrorAction SilentlyContinue | ForEach-Object {
  [void]$allContent.AppendLine((Read-TextFile $_.FullName))
}

Get-ChildItem -Path (Join-Path $ProjectRoot 'scripts') -File -Filter '*.js' -ErrorAction SilentlyContinue | ForEach-Object {
  [void]$allContent.AppendLine((Read-TextFile $_.FullName))
}

$text = $allContent.ToString()

$idSet = New-Object System.Collections.Generic.HashSet[string]
[regex]::Matches($indexContent, 'id="(?<id>[^"]+)"') | ForEach-Object {
  [void]$idSet.Add($_.Groups['id'].Value)
}

[regex]::Matches($indexContent, 'href="#(?<anchor>[^"]+)"') | ForEach-Object {
  $anchor = $_.Groups['anchor'].Value
  if (-not $idSet.Contains($anchor)) {
    Add-Issue "Missing in-page anchor target: #$anchor"
  }
}

$externalLinks = New-Object System.Collections.Generic.HashSet[string]
[regex]::Matches($text, 'https?://[^\s"''<>)]+' ) | ForEach-Object {
  $url = $_.Value.TrimEnd('.', ',', ';')
  [void]$externalLinks.Add($url)
}

if ($SkipExternal) {
  Write-Host "Skipped external link checks." -ForegroundColor Yellow
} else {
  foreach ($url in ($externalLinks | Sort-Object)) {
    try {
      $response = Invoke-WebRequest -Uri $url -Method Head -MaximumRedirection 5 -TimeoutSec $TimeoutSeconds -UseBasicParsing -ErrorAction Stop
      $statusCode = [int]$response.StatusCode
      if ($statusCode -ge 400 -and $statusCode -notin 401, 403, 405, 429) {
        Add-Issue "External link returned HTTP ${statusCode}: $url"
      } elseif ($statusCode -in 401, 403, 405, 429) {
        Add-Warning "External link responded HTTP ${statusCode}, which may be bot protection: $url"
      }
    } catch {
      try {
        $response = Invoke-WebRequest -Uri $url -Method Get -MaximumRedirection 5 -TimeoutSec $TimeoutSeconds -UseBasicParsing -ErrorAction Stop
        $statusCode = [int]$response.StatusCode
        if ($statusCode -ge 400 -and $statusCode -notin 401, 403, 405, 429) {
          Add-Issue "External link returned HTTP ${statusCode}: $url"
        } elseif ($statusCode -in 401, 403, 405, 429) {
          Add-Warning "External link responded HTTP ${statusCode}, which may be bot protection: $url"
        }
      } catch {
        Add-Issue "External link failed: $url ($($_.Exception.Message))"
      }
    }
  }
}

if ($warnings.Count -gt 0) {
  Write-Host "Link check warnings:" -ForegroundColor Yellow
  $warnings | ForEach-Object { Write-Host " - $_" }
}

if ($issues.Count -gt 0) {
  Write-Host "Link check found issues:" -ForegroundColor Red
  $issues | ForEach-Object { Write-Host " - $_" }
  exit 1
}

Write-Host "Link check passed." -ForegroundColor Green

exit 0


param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$issues = New-Object System.Collections.Generic.List[string]

function Add-Issue {
  param([string]$Message)
  $issues.Add($Message) | Out-Null
}

function Read-FileText {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    Add-Issue "Missing file: $Path"
    return ""
  }
  return Get-Content -LiteralPath $Path -Raw
}

$membersPath = Join-Path $ProjectRoot 'assets\members-data.js'
$sitePath = Join-Path $ProjectRoot 'assets\site-data.js'
$galleryPath = Join-Path $ProjectRoot 'assets\gallery-data.js'

$membersContent = Read-FileText $membersPath
$siteContent = Read-FileText $sitePath
$galleryContent = Read-FileText $galleryPath

$memberNames = New-Object System.Collections.Generic.List[string]

[regex]::Matches($membersContent, '(?s)name:\s*"(?<name>[^"]+)".*?skin:\s*"(?<skin>[^"]+)".*?card:\s*"(?<card>[^"]+)"') | ForEach-Object {
  $name = $_.Groups['name'].Value
  $skin = $_.Groups['skin'].Value
  $card = $_.Groups['card'].Value
  $memberNames.Add($name) | Out-Null

  if (-not (Test-Path (Join-Path $ProjectRoot "assets\skins\$skin"))) {
    Add-Issue "Missing member skin for ${name}: assets/skins/$skin"
  }

  if (-not (Test-Path (Join-Path $ProjectRoot "assets\Creator_Cards\$card"))) {
    Add-Issue "Missing creator card for ${name}: assets/Creator_Cards/$card"
  }
}

[regex]::Matches($membersContent, 'schedule:\s*\[(?<schedule>.*?)\]', [System.Text.RegularExpressions.RegexOptions]::Singleline) | ForEach-Object {
  [regex]::Matches($_.Groups['schedule'].Value, '"([^"]+)"') | ForEach-Object {
    $scheduledName = $_.Groups[1].Value
    if ($memberNames -notcontains $scheduledName) {
      Add-Issue "Creator rotation references missing member: $scheduledName"
    }
  }
}

[regex]::Matches($siteContent, 'skin:\s*"([^"]+)"') | ForEach-Object {
  $skin = $_.Groups[1].Value
  if (-not (Test-Path (Join-Path $ProjectRoot "assets\skins\$skin"))) {
    Add-Issue "Missing site/admin skin: assets/skins/$skin"
  }
}

[regex]::Matches($galleryContent, '(?s)source:\s*"(?<source>[^"]+)".*?full:\s*"(?<full>[^"]+)".*?thumb:\s*"(?<thumb>[^"]+)"') | ForEach-Object {
  foreach ($key in 'source', 'full', 'thumb') {
    $relativePath = $_.Groups[$key].Value.Replace('/', '\')
    if (-not (Test-Path (Join-Path $ProjectRoot $relativePath))) {
      Add-Issue "Missing gallery asset: $relativePath"
    }
  }
}

if ($issues.Count -gt 0) {
  Write-Host 'Site validation found issues:' -ForegroundColor Red
  $issues | ForEach-Object { Write-Host " - $_" }
  exit 1
}

Write-Host 'Site validation passed.' -ForegroundColor Green


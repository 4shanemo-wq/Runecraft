param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot),
  [int]$DisplayWidth = 1600,
  [int]$ThumbWidth = 420,
  [long]$DisplayQuality = 82,
  [long]$ThumbQuality = 74
)

Add-Type -AssemblyName System.Drawing

function Get-JpegEncoder {
  [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
}

function Save-ResizedJpeg {
  param(
    [string]$InputPath,
    [string]$OutputPath,
    [int]$MaxWidth,
    [long]$Quality
  )

  $source = [System.Drawing.Image]::FromFile($InputPath)
  try {
    $ratio = [double]$MaxWidth / [double]$source.Width
    if ($ratio -gt 1) { $ratio = 1 }

    $newWidth = [int][Math]::Round($source.Width * $ratio)
    $newHeight = [int][Math]::Round($source.Height * $ratio)

    $bitmap = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.Clear([System.Drawing.Color]::Black)
        $graphics.DrawImage($source, 0, 0, $newWidth, $newHeight)
      }
      finally {
        $graphics.Dispose()
      }

      $encoder = Get-JpegEncoder
      $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
      $bitmap.Save($OutputPath, $encoder, $encoderParams)
      $encoderParams.Dispose()
    }
    finally {
      $bitmap.Dispose()
    }
  }
  finally {
    $source.Dispose()
  }
}

function Get-FriendlyCaption {
  param([string]$BaseName)

  if ($BaseName -match '^\d{4}-\d{2}-\d{2}_\d{2}\.\d{2}\.\d{2}$') {
    return ('RuneCraft build - ' + $BaseName.Replace('_', ' ').Replace('.', ':'))
  }

  return ('RuneCraft build - ' + ($BaseName -replace '[_-]+', ' '))
}

$galleryRoot = Join-Path $ProjectRoot 'assets\Gallery'
$displayDir = Join-Path $galleryRoot 'display'
$thumbDir = Join-Path $galleryRoot 'thumbs'
$dataPath = Join-Path $ProjectRoot 'assets\gallery-data.js'

New-Item -ItemType Directory -Force -Path $displayDir | Out-Null
New-Item -ItemType Directory -Force -Path $thumbDir | Out-Null

$sourceFiles = Get-ChildItem -Path $galleryRoot -File | Where-Object {
  $_.Extension.ToLowerInvariant() -in '.png', '.jpg', '.jpeg', '.webp'
} | Sort-Object Name

$existingEntries = @{}
$existingOrder = @()

if (Test-Path $dataPath) {
  $existingContent = Get-Content -LiteralPath $dataPath -Raw
  $pattern = '(?s)\{\s*source:\s*"(?<source>[^"]+)".*?full:\s*"(?<full>[^"]+)".*?thumb:\s*"(?<thumb>[^"]+)".*?alt:\s*"(?<alt>[^"]+)".*?caption:\s*"(?<caption>[^"]+)"\s*\}'
  [regex]::Matches($existingContent, $pattern) | ForEach-Object {
    $sourceValue = $_.Groups['source'].Value
    $fileName = Split-Path $sourceValue -Leaf
    $existingOrder += $fileName
    $existingEntries[$fileName] = [ordered]@{
      source = $sourceValue
      full = $_.Groups['full'].Value
      thumb = $_.Groups['thumb'].Value
      alt = $_.Groups['alt'].Value
      caption = $_.Groups['caption'].Value
    }
  }
}

foreach ($file in $sourceFiles) {
  $displayOut = Join-Path $displayDir ($file.BaseName + '.jpg')
  $thumbOut = Join-Path $thumbDir ($file.BaseName + '.jpg')
  Save-ResizedJpeg -InputPath $file.FullName -OutputPath $displayOut -MaxWidth $DisplayWidth -Quality $DisplayQuality
  Save-ResizedJpeg -InputPath $file.FullName -OutputPath $thumbOut -MaxWidth $ThumbWidth -Quality $ThumbQuality

  if (-not $existingEntries.Contains($file.Name)) {
    $friendlyCaption = Get-FriendlyCaption -BaseName $file.BaseName
    $existingEntries[$file.Name] = [ordered]@{
      source = "assets/Gallery/$($file.Name)"
      full = "assets/Gallery/display/$($file.BaseName).jpg"
      thumb = "assets/Gallery/thumbs/$($file.BaseName).jpg"
      alt = $friendlyCaption
      caption = $friendlyCaption
    }
  }
}

$orderedNames = @($existingOrder | Where-Object { $existingEntries.Contains($_) })
$orderedNames += @($sourceFiles.Name | Where-Object { $orderedNames -notcontains $_ })

$entriesText = foreach ($name in $orderedNames) {
  $entry = $existingEntries[$name]
@"
  {
    source: "$($entry.source)",
    full: "$($entry.full)",
    thumb: "$($entry.thumb)",
    alt: "$($entry.alt)",
    caption: "$($entry.caption)"
  }
"@
}

$output = "window.RUNECRAFT_GALLERY = [`r`n" + ($entriesText -join ",`r`n") + "`r`n];`r`n"
Set-Content -LiteralPath $dataPath -Value $output -Encoding UTF8

Write-Host "Updated gallery assets and data file:" -ForegroundColor Cyan
Write-Host "  Source folder : $galleryRoot"
Write-Host "  Display files : $displayDir"
Write-Host "  Thumb files   : $thumbDir"
Write-Host "  Data file     : $dataPath"
Write-Host "" 
Write-Host "Add new gallery images by dropping source files into assets/Gallery and rerunning this script." -ForegroundColor Green

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$VideoPath,

    [Parameter(Mandatory = $true)]
    [string]$OutputDirectory,

    [string]$SidecarPath,

    [switch]$AllowSpeechToText,

    [ValidateNotNullOrEmpty()]
    [string]$WhisperModel = 'base',

    [string]$WhisperModelPath,

    [string]$Language,

    [switch]$Force
)

$ErrorActionPreference = 'Stop'

$source = Get-Item -LiteralPath $VideoPath -ErrorAction Stop
if ($source.PSIsContainer) {
    throw "VideoPath must be a file: $VideoPath"
}

$output = New-Item -ItemType Directory -Path $OutputDirectory -Force
$plainTranscriptPath = Join-Path $output.FullName 'transcript.txt'
$allowedSidecarExtensions = @('.srt', '.vtt', '.txt', '.md')
$resolvedWhisperModelPath = $null
if ($WhisperModelPath) {
    $modelFile = Get-Item -LiteralPath $WhisperModelPath -ErrorAction SilentlyContinue
    if ($modelFile -and -not $modelFile.PSIsContainer) {
        $resolvedWhisperModelPath = $modelFile.FullName
    }
}
elseif ($env:USERPROFILE) {
    $cachedModelPath = Join-Path $env:USERPROFILE ".cache\whisper\$WhisperModel.pt"
    if (Test-Path -LiteralPath $cachedModelPath -PathType Leaf) {
        $resolvedWhisperModelPath = (Get-Item -LiteralPath $cachedModelPath).FullName
    }
}

function Assert-OutputAvailable {
    param([Parameter(Mandatory = $true)][string]$Path)

    if ((Test-Path -LiteralPath $Path) -and -not $Force) {
        throw "Output already exists: $Path. Choose another directory or pass -Force explicitly."
    }
}

function Convert-SubtitleToPlainText {
    param(
        [Parameter(Mandatory = $true)][string]$InputPath,
        [Parameter(Mandatory = $true)][string]$DestinationPath
    )

    Assert-OutputAvailable -Path $DestinationPath
    $lines = @(Get-Content -LiteralPath $InputPath)
    $text = New-Object System.Collections.Generic.List[string]

    for ($index = 0; $index -lt $lines.Count; $index++) {
        $line = [string]$lines[$index]
        $trimmed = $line.Trim()
        $next = if ($index + 1 -lt $lines.Count) { ([string]$lines[$index + 1]).Trim() } else { '' }

        if (-not $trimmed -or $trimmed -eq 'WEBVTT') { continue }
        if ($trimmed -match '^(NOTE|STYLE|REGION)(\s|$)') { continue }
        if ($trimmed -match '^\d+$' -and $next -match '-->') { continue }
        if ($trimmed -match '^((\d{2}:)?\d{2}:\d{2}[\.,]\d{3})\s+-->\s+') { continue }

        $clean = [System.Net.WebUtility]::HtmlDecode(($trimmed -replace '<[^>]+>', '')).Trim()
        if (-not $clean) { continue }
        if ($text.Count -eq 0 -or $text[$text.Count - 1] -ne $clean) {
            $text.Add($clean)
        }
    }

    [System.IO.File]::WriteAllText(
        $DestinationPath,
        ($text -join [Environment]::NewLine),
        (New-Object System.Text.UTF8Encoding($false))
    )
    return $text.Count
}

function Write-Result {
    param(
        [Parameter(Mandatory = $true)][string]$Status,
        [string]$SourceType,
        [string]$SourceTranscriptPath,
        [string]$TranscriptPath,
        [string]$Reason,
        [int]$LineCount = 0,
        [string]$Engine
    )

    [pscustomobject]@{
        status = $Status
        videoPath = $source.FullName
        sourceType = $SourceType
        sourceTranscriptPath = $SourceTranscriptPath
        transcriptPath = $TranscriptPath
        lineCount = $LineCount
        engine = $Engine
        reason = $Reason
        capabilities = [pscustomobject]@{
            ffprobe = [bool](Get-Command ffprobe -ErrorAction SilentlyContinue)
            ffmpeg = [bool](Get-Command ffmpeg -ErrorAction SilentlyContinue)
            whisper = [bool](Get-Command whisper -ErrorAction SilentlyContinue)
            whisperModel = [bool]$resolvedWhisperModelPath
        }
    } | ConvertTo-Json -Depth 4
}

$sidecarCandidates = @()
if ($SidecarPath) {
    $sidecar = Get-Item -LiteralPath $SidecarPath -ErrorAction Stop
    if ($sidecar.PSIsContainer -or $sidecar.Extension.ToLowerInvariant() -notin $allowedSidecarExtensions) {
        throw 'SidecarPath must be an .srt, .vtt, .txt, or .md file.'
    }
    $sidecarCandidates = @($sidecar)
}
else {
    $stem = [System.IO.Path]::GetFileNameWithoutExtension($source.Name)
    $prefix = "$stem."
    $sidecarCandidates = @(
        Get-ChildItem -LiteralPath $source.DirectoryName -File |
            Where-Object {
                $_.Extension.ToLowerInvariant() -in $allowedSidecarExtensions -and
                ($_.BaseName -eq $stem -or $_.Name.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase))
            } |
            Sort-Object @{ Expression = { if ($_.BaseName -eq $stem) { 0 } else { 1 } } }, Name
    )
}

if ($sidecarCandidates.Count -gt 0) {
    $selectedSidecar = $sidecarCandidates[0]
    $lineCount = Convert-SubtitleToPlainText -InputPath $selectedSidecar.FullName -DestinationPath $plainTranscriptPath
    Write-Result -Status 'available' -SourceType 'sidecar' -SourceTranscriptPath $selectedSidecar.FullName -TranscriptPath $plainTranscriptPath -LineCount $lineCount
    return
}

$ffprobe = Get-Command ffprobe -ErrorAction SilentlyContinue
$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if ($ffprobe -and $ffmpeg) {
    $probeJson = & $ffprobe.Source -v error -select_streams s -show_entries 'stream=index,codec_name:stream_tags=language,title' -of json $source.FullName 2>$null
    if ($LASTEXITCODE -eq 0 -and $probeJson) {
        $probe = ($probeJson -join [Environment]::NewLine) | ConvertFrom-Json
        if (@($probe.streams).Count -gt 0) {
            $subtitlePath = Join-Path $output.FullName 'embedded-subtitles.srt'
            Assert-OutputAvailable -Path $subtitlePath
            $overwriteArgument = if ($Force) { '-y' } else { '-n' }
            & $ffmpeg.Source -v error $overwriteArgument -i $source.FullName -map '0:s:0' -c:s srt $subtitlePath
            if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $subtitlePath)) {
                throw 'FFmpeg found an embedded subtitle stream but could not extract it as SRT.'
            }
            $lineCount = Convert-SubtitleToPlainText -InputPath $subtitlePath -DestinationPath $plainTranscriptPath
            Write-Result -Status 'available' -SourceType 'embedded-subtitles' -SourceTranscriptPath $subtitlePath -TranscriptPath $plainTranscriptPath -LineCount $lineCount -Engine 'ffmpeg'
            return
        }
    }
}

if ($AllowSpeechToText) {
    $whisper = Get-Command whisper -ErrorAction SilentlyContinue
    if (-not $ffmpeg -or -not $whisper -or -not $resolvedWhisperModelPath) {
        Write-Result -Status 'unavailable' -Reason 'Local speech-to-text requires already-installed ffmpeg and whisper commands plus an existing model file. Supply -WhisperModelPath or cache the selected model first; this helper will not download one.'
        return
    }

    $whisperTranscriptPath = Join-Path $output.FullName ($source.BaseName + '.txt')
    Assert-OutputAvailable -Path $whisperTranscriptPath
    $arguments = @(
        $source.FullName,
        '--model', $resolvedWhisperModelPath,
        '--output_dir', $output.FullName,
        '--output_format', 'txt',
        '--verbose', 'False'
    )
    if ($Language) {
        $arguments += @('--language', $Language)
    }

    $whisperLog = @(& $whisper.Source @arguments 2>&1 | ForEach-Object { "$_" })
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $whisperTranscriptPath)) {
        $lastLogLine = if ($whisperLog.Count -gt 0) { $whisperLog[$whisperLog.Count - 1] } else { 'No diagnostic output.' }
        throw "Local Whisper transcription failed: $lastLogLine"
    }

    $lineCount = @(Get-Content -LiteralPath $whisperTranscriptPath).Count
    Write-Result -Status 'available' -SourceType 'local-speech-to-text' -SourceTranscriptPath $whisperTranscriptPath -TranscriptPath $whisperTranscriptPath -LineCount $lineCount -Engine 'whisper'
    return
}

Write-Result -Status 'unavailable' -Reason 'No sidecar transcript or locally extractable embedded subtitle stream was found. Speech-to-text was not requested.'


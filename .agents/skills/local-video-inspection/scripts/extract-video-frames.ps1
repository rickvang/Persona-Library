[CmdletBinding(DefaultParameterSetName = 'Uniform')]
param(
    [Parameter(Mandatory = $true)]
    [string]$VideoPath,

    [Parameter(Mandatory = $true)]
    [string]$OutputDirectory,

    [Parameter(ParameterSetName = 'Uniform')]
    [ValidateRange(1, 100)]
    [int]$SampleCount = 10,

    [Parameter(Mandatory = $true, ParameterSetName = 'Targeted')]
    [ValidateNotNullOrEmpty()]
    [string]$TimestampsSeconds,

    [ValidateRange(1, 4096)]
    [int]$MaxWidth = 1280,

    [ValidateRange(1, 4096)]
    [int]$MaxHeight = 1280,

    [switch]$Force
)

$ErrorActionPreference = 'Stop'

if ($PSVersionTable.PSEdition -ne 'Desktop') {
    throw 'This script requires Windows PowerShell 5.1. Invoke C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe explicitly.'
}

$source = Get-Item -LiteralPath $VideoPath -ErrorAction Stop
if ($source.PSIsContainer) {
    throw "VideoPath must be a file: $VideoPath"
}

$output = New-Item -ItemType Directory -Path $OutputDirectory -Force
if ($source.FullName -eq $output.FullName) {
    throw 'OutputDirectory must not resolve to the source file.'
}

Add-Type -AssemblyName System.Runtime.WindowsRuntime
if (-not ('LocalVideoInspection.VectorAppendDelegate' -as [Type])) {
    Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

namespace LocalVideoInspection
{
    [UnmanagedFunctionPointer(CallingConvention.StdCall)]
    public delegate int VectorAppendDelegate(IntPtr thisPointer, IntPtr valuePointer);
}
'@
}

$script:AsTaskGeneric = [System.WindowsRuntimeSystemExtensions].GetMethods() |
    Where-Object {
        $_.Name -eq 'AsTask' -and
        $_.IsGenericMethod -and
        $_.GetParameters().Count -eq 1
    } |
    Select-Object -First 1

function Await-WinRtOperation {
    param(
        [Parameter(Mandatory = $true)]$Operation,
        [Parameter(Mandatory = $true)][Type]$ResultType
    )

    $task = $script:AsTaskGeneric.MakeGenericMethod($ResultType).Invoke($null, @($Operation))
    $task.Wait()
    return $task.Result
}

function Add-MediaClipToComposition {
    param(
        [Parameter(Mandatory = $true)]$Composition,
        [Parameter(Mandatory = $true)]$Clip
    )

    $clips = Write-Output -NoEnumerate ($Composition.Clips)
    $clipType = [Windows.Media.Editing.MediaClip, Windows.Media.Editing, ContentType = WindowsRuntime]
    $vectorTypeOpen = [Type]::GetType('Windows.Foundation.Collections.IVector`1, Windows.Foundation, ContentType=WindowsRuntime', $true)
    $vectorType = $vectorTypeOpen.MakeGenericType($clipType)
    $unknownPointer = [System.Runtime.InteropServices.Marshal]::GetIUnknownForObject($clips)
    $vectorPointer = [IntPtr]::Zero
    $vectorGuid = $vectorType.GUID

    try {
        $queryResult = [System.Runtime.InteropServices.Marshal]::QueryInterface($unknownPointer, [ref]$vectorGuid, [ref]$vectorPointer)
        if ($queryResult -ne 0) {
            [System.Runtime.InteropServices.Marshal]::ThrowExceptionForHR($queryResult)
        }

        # IVector<T>::Append follows IInspectable and the seven preceding IVector methods.
        $vectorTable = [System.Runtime.InteropServices.Marshal]::ReadIntPtr($vectorPointer)
        $appendPointer = [System.Runtime.InteropServices.Marshal]::ReadIntPtr($vectorTable, [IntPtr]::Size * 13)
        $append = [System.Runtime.InteropServices.Marshal]::GetDelegateForFunctionPointer(
            $appendPointer,
            [LocalVideoInspection.VectorAppendDelegate]
        )
        $clipPointer = [System.Runtime.InteropServices.Marshal]::GetIUnknownForObject($Clip)
        try {
            $appendResult = $append.Invoke($vectorPointer, $clipPointer)
            if ($appendResult -ne 0) {
                [System.Runtime.InteropServices.Marshal]::ThrowExceptionForHR($appendResult)
            }
        }
        finally {
            $null = [System.Runtime.InteropServices.Marshal]::Release($clipPointer)
        }
    }
    finally {
        if ($vectorPointer -ne [IntPtr]::Zero) {
            $null = [System.Runtime.InteropServices.Marshal]::Release($vectorPointer)
        }
        $null = [System.Runtime.InteropServices.Marshal]::Release($unknownPointer)
    }
}

$storageOperation = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]::GetFileFromPathAsync($source.FullName)
$storageFile = Await-WinRtOperation $storageOperation ([Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime])

$clipOperation = [Windows.Media.Editing.MediaClip, Windows.Media.Editing, ContentType = WindowsRuntime]::CreateFromFileAsync($storageFile)
$clip = Await-WinRtOperation $clipOperation ([Windows.Media.Editing.MediaClip, Windows.Media.Editing, ContentType = WindowsRuntime])

$composition = New-Object 'Windows.Media.Editing.MediaComposition, Windows.Media.Editing, ContentType=WindowsRuntime'
Add-MediaClipToComposition -Composition $composition -Clip $clip

$durationSeconds = $composition.Duration.TotalSeconds
if ($durationSeconds -le 0) {
    throw 'The decoder reported a zero-length video.'
}

$videoProperties = $clip.GetVideoEncodingProperties()
$sourceWidth = [int]$videoProperties.Width
$sourceHeight = [int]$videoProperties.Height
$scale = [Math]::Min(1.0, [Math]::Min($MaxWidth / [double]$sourceWidth, $MaxHeight / [double]$sourceHeight))
$targetWidth = [Math]::Max(1, [int][Math]::Round($sourceWidth * $scale))
$targetHeight = [Math]::Max(1, [int][Math]::Round($sourceHeight * $scale))

if ($PSCmdlet.ParameterSetName -eq 'Targeted') {
    $sampleSeconds = @(
        $TimestampsSeconds -split '[,;\s]+' |
            Where-Object { $_ } |
            ForEach-Object {
                $parsedTimestamp = 0.0
                if (-not [double]::TryParse(
                    $_,
                    [System.Globalization.NumberStyles]::Float,
                    [System.Globalization.CultureInfo]::InvariantCulture,
                    [ref]$parsedTimestamp
                )) {
                    throw "Invalid timestamp: $_. Use seconds separated by commas, semicolons, or spaces."
                }
                $parsedTimestamp
            } |
            Sort-Object -Unique
    )
    $samplingMode = 'targeted'
}
elseif ($SampleCount -eq 1) {
    $sampleSeconds = @($durationSeconds / 2)
    $samplingMode = 'uniform-interior'
}
else {
    $edgeInset = [Math]::Min(1.0, $durationSeconds * 0.02)
    $sampleStart = $edgeInset
    $sampleEnd = [Math]::Max($sampleStart, $durationSeconds - $edgeInset)
    $sampleSeconds = 0..($SampleCount - 1) | ForEach-Object {
        $sampleStart + (($sampleEnd - $sampleStart) * $_ / ($SampleCount - 1))
    }
    $samplingMode = 'uniform-interior'
}

foreach ($second in $sampleSeconds) {
    if ($second -lt 0 -or $second -gt $durationSeconds) {
        throw "Timestamp $second is outside the video duration of $durationSeconds seconds."
    }
}

$frames = foreach ($second in $sampleSeconds) {
    $thumbnailOperation = $composition.GetThumbnailAsync(
        [TimeSpan]::FromSeconds($second),
        $targetWidth,
        $targetHeight,
        [Windows.Media.Editing.VideoFramePrecision, Windows.Media.Editing, ContentType = WindowsRuntime]::NearestFrame
    )
    $thumbnail = Await-WinRtOperation $thumbnailOperation ([Windows.Graphics.Imaging.ImageStream, Windows.Graphics, ContentType = WindowsRuntime])

    $extension = if ($thumbnail.ContentType -eq 'image/png') { '.png' } else { '.jpg' }
    $milliseconds = [long][Math]::Round($second * 1000)
    $outputPath = Join-Path $output.FullName ('frame-{0:D9}ms{1}' -f $milliseconds, $extension)
    if ((Test-Path -LiteralPath $outputPath) -and -not $Force) {
        $thumbnail.Dispose()
        throw "Output already exists: $outputPath. Choose another directory or pass -Force explicitly."
    }

    $inputStream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($thumbnail)
    $outputStream = [System.IO.File]::Create($outputPath)
    try {
        $inputStream.CopyTo($outputStream)
    }
    finally {
        $outputStream.Dispose()
        $inputStream.Dispose()
        $thumbnail.Dispose()
    }

    [pscustomobject]@{
        seconds = [Math]::Round($second, 3)
        path = $outputPath
        contentType = if ($extension -eq '.png') { 'image/png' } else { 'image/jpeg' }
    }
}

[pscustomobject]@{
    videoPath = $source.FullName
    durationSeconds = [Math]::Round($durationSeconds, 3)
    sourceWidth = $sourceWidth
    sourceHeight = $sourceHeight
    outputWidth = $targetWidth
    outputHeight = $targetHeight
    samplingMode = $samplingMode
    frameCount = @($frames).Count
    frames = @($frames)
} | ConvertTo-Json -Depth 4


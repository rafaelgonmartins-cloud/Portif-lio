# Script de inicializacao do servidor local
$port = 3000
$folder = $PSScriptRoot
if (-not $folder) { $folder = (Get-Location).Path }

Write-Host "Iniciando servidor local em http://localhost:$port" -ForegroundColor Cyan
Write-Host "Pasta raiz: $folder" -ForegroundColor DarkGray
Write-Host "Pressione Ctrl+C para encerrar o servidor a qualquer momento.`n" -ForegroundColor Yellow

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
} catch {
    $port = 8080
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Prefixes.Add("http://127.0.0.1:$port/")
    $listener.Start()
    Write-Host "Porta alternativa ativa: http://localhost:$port" -ForegroundColor Cyan
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8";
    ".css"  = "text/css; charset=utf-8";
    ".js"   = "application/javascript; charset=utf-8";
    ".json" = "application/json; charset=utf-8";
    ".png"  = "image/png";
    ".jpg"  = "image/jpeg";
    ".jpeg" = "image/jpeg";
    ".svg"  = "image/svg+xml";
    ".mp4"  = "video/mp4";
    ".webm" = "video/webm";
    ".ico"  = "image/x-icon"
}

Start-Process "http://localhost:$port"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $rawUrl = $request.Url.LocalPath
    $urlPath = [System.Uri]::UnescapeDataString($rawUrl).TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($urlPath)) { $urlPath = "index.html" }

    $filePath = Join-Path $folder $urlPath

    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
        
        $response.ContentType = $contentType
        $response.AddHeader("Accept-Ranges", "bytes")
        $response.AddHeader("Access-Control-Allow-Origin", "*")

        $fileStream = [System.IO.File]::OpenRead($filePath)
        $totalBytes = $fileStream.Length

        # Handle Range requests for high-performance video streaming
        $rangeHeader = $request.Headers["Range"]
        if ($rangeHeader -and $rangeHeader.StartsWith("bytes=")) {
            $range = $rangeHeader.Substring(6).Split('-')
            $start = [int64]$range[0]
            $end = if ($range[1]) { [int64]$range[1] } else { $totalBytes - 1 }
            if ($end -ge $totalBytes) { $end = $totalBytes - 1 }
            $length = $end - $start + 1

            $response.StatusCode = 206 # Partial Content
            $response.AddHeader("Content-Range", "bytes $start-$end/$totalBytes")
            $response.ContentLength64 = $length

            $fileStream.Seek($start, [System.IO.SeekOrigin]::Begin) | Out-Null
            $buffer = New-Object byte[] 65536
            $bytesRemaining = $length

            while ($bytesRemaining -gt 0) {
                $bytesToRead = [Math]::Min(65536, $bytesRemaining)
                $read = $fileStream.Read($buffer, 0, $bytesToRead)
                if ($read -le 0) { break }
                $response.OutputStream.Write($buffer, 0, $read)
                $bytesRemaining -= $read
            }
        } else {
            $response.StatusCode = 200
            $response.ContentLength64 = $totalBytes
            $fileStream.CopyTo($response.OutputStream)
        }

        $fileStream.Close()
    } else {
        $response.StatusCode = 404
        $buffer = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 - Arquivo nao encontrado</h1>")
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    }

    $response.OutputStream.Close()
}

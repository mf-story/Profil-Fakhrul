# Menjalankan server statis lokal untuk website profil
# Jalankan: klik kanan > Run with PowerShell, atau: .\serve.ps1
$port = 5510
$root = $PSScriptRoot
Write-Host "Menyajikan '$root' di http://localhost:$port" -ForegroundColor Green
Write-Host "Tekan Ctrl+C untuk berhenti." -ForegroundColor Yellow

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Start-Process "http://localhost:$port/"

$mime = @{
  ".html" = "text/html"; ".css" = "text/css"; ".js" = "application/javascript";
  ".json" = "application/json"; ".png" = "image/png"; ".jpg" = "image/jpeg";
  ".svg" = "image/svg+xml"; ".ico" = "image/x-icon"; ".webmanifest" = "application/manifest+json"
}

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath.TrimStart("/")
    if ([string]::IsNullOrWhiteSpace($path)) { $path = "index.html" }
    $file = Join-Path $root $path
    if (Test-Path $file -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      $ctx.Response.ContentType = $mime[$ext]; if (-not $ctx.Response.ContentType) { $ctx.Response.ContentType = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.Close()
  }
} finally {
  $listener.Stop()
}

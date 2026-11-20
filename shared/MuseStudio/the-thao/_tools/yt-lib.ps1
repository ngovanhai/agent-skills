# Hàm dùng chung để điều khiển YouTube Studio qua FoxProfile (profile teo-the-thao). Nạp: . C:\Users\anhha\MuseStudio\the-thao\_tools\yt-lib.ps1
$global:YB = 'http://127.0.0.1:8000/api/v1/browser/teo-the-thao/page'
function YPost($p, $o, $to = 60) {
  try { Invoke-RestMethod -Method Post "$YB/$p" -ContentType 'application/json; charset=utf-8' -Body ([Text.Encoding]::UTF8.GetBytes(($o | ConvertTo-Json -Compress))) -TimeoutSec $to }
  catch { "ERR $p : $($_.ErrorDetails.Message) $($_.Exception.Message)" }
}
function YEv($js) { (YPost 'evaluate' @{ script = $js }).result }
function YNav($url) { YPost 'navigate' @{ url = $url } 90 | Out-Null }
function YShot($path) { try { Invoke-WebRequest "$YB/screenshot" -OutFile $path -TimeoutSec 40 } catch {} }
# Đọc gói .txt của pack.mjs (TIÊU ĐỀ / MÔ TẢ / TAG), bỏ dòng hashtag trùng
function Read-Pack($txt) {
  $raw = Get-Content $txt -Raw -Encoding utf8
  $title = ([regex]::Match($raw, '(?s)TIÊU ĐỀ:\s*\n(.+?)\n')).Groups[1].Value.Trim()
  $desc = ([regex]::Match($raw, '(?s)MÔ TẢ:\s*\n(.+?)\n\s*\nTAG:')).Groups[1].Value.Trim()
  $lines = $desc -split "`n"; $seen = @{}; $out = @()
  foreach ($l in $lines) { $k = $l.Trim(); if ($k.StartsWith('#')) { if ($seen.ContainsKey('#')) { continue }; $seen['#'] = 1 }; $out += $l.TrimEnd() }
  $tags = ([regex]::Match($raw, '(?s)TAG:\s*\n(.+?)\n')).Groups[1].Value.Trim()
  $tags = (($tags -split ',\s*') | Select-Object -Unique) -join ', '
  [pscustomobject]@{ title = $title; desc = ($out -join "`n").Trim(); tags = $tags }
}

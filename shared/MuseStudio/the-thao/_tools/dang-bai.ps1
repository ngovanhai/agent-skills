# Đăng một video từ kế hoạch của dang-tu-drive.mjs: tải lên (Riêng tư) rồi hẹn giờ công khai.
# Người dùng chọn 2026-10-27: mỗi ngày 1 tập dài + 3 Short tự hẹn giờ công khai, không cần duyệt từng ngày.
# Nạp:  . C:\Users\anhha\MuseStudio\the-thao\_tools\yt-lib.ps1; . C:\Users\anhha\MuseStudio\the-thao\_tools\yt-schedule.ps1; . C:\Users\anhha\MuseStudio\the-thao\_tools\dang-bai.ps1
#   $id = Upload-Video -Mp4 <đường dẫn trong the-thao/_dang> -Title <..> -Desc <..> -Tags <..> [-Thumb <png>]   → trả về id video (11 ký tự) hoặc "LOI: …"
#   Schedule-Video -Tab upload|short -TitleLike <..> -Date '28 thg 10, 2026' -Time '19:00'   (yt-schedule.ps1, có kiểm ngày/giờ)
function Upload-Video([string]$Mp4, [string]$Title, [string]$Desc, [string]$Tags, [string]$Thumb = '') {
  YNav 'https://studio.youtube.com/channel/UCmVa984PvbXOWKsLKYXbZHw/videos/upload?d=ud'; Start-Sleep 6
  $r = YPost 'upload' @{ selector = 'input[type=file]'; path = $Mp4 } 120
  if ("$r" -like 'ERR*') { return "LOI: upload $r" }
  # chờ bảng Chi tiết
  for ($i = 0; $i -lt 20; $i++) { Start-Sleep 3; if ((YEv "!!document.querySelector('#title-textarea #textbox')") -eq $true) { break } }
  YPost 'type' @{ selector = '#title-textarea #textbox'; text = $Title; clear = $true } | Out-Null; Start-Sleep 1
  YPost 'type' @{ selector = '#description-textarea #textbox'; text = $Desc; clear = $true } | Out-Null; Start-Sleep 2
  if ($Thumb -and (Test-Path $Thumb)) { YPost 'upload' @{ selector = 'input#file-loader'; path = $Thumb } | Out-Null; Start-Sleep 3 }
  YEv "(() => { const b=document.querySelector('tp-yt-paper-radio-button[name=VIDEO_MADE_FOR_KIDS_NOT_MFK]'); if(b) b.click(); return b ? b.getAttribute('aria-checked') : 'none'; })()" | Out-Null
  YEv "(() => { const t=document.querySelector('#toggle-button'); if(t) t.click(); return 1; })()" | Out-Null; Start-Sleep 2
  if ($Tags) { YPost 'type' @{ selector = 'input[aria-label="Thẻ (từ khóa)"]'; text = $Tags; clear = $false; submit = $true } | Out-Null; Start-Sleep 1 }
  # chờ xử lý xong phần tải (nút Tiếp bấm được) rồi qua 3 bước
  for ($i = 0; $i -lt 3; $i++) { YEv "(() => { const n=document.querySelector('#next-button'); if(n) n.click(); return 1; })()" | Out-Null; Start-Sleep 3 }
  YEv "(() => { const p=document.querySelector('tp-yt-paper-radio-button[name=PRIVATE]'); if(p) p.click(); return 1; })()" | Out-Null; Start-Sleep 1
  $link = YEv "(() => { const a=[...document.querySelectorAll('a')].find(x=>/youtu\.be\/|youtube\.com\/shorts\//.test(x.href)); return a ? a.href : ''; })()"
  # chờ tải xong trước khi Lưu (đóng hộp sớm có thể làm hỏng bản tải)
  for ($i = 0; $i -lt 60; $i++) {
    $st = YEv "(document.querySelector('ytcp-video-upload-progress')||{}).innerText||''"
    if ("$st" -notmatch 'Đang tải lên|Uploading') { break }; Start-Sleep 10
  }
  YEv "(() => { const d=document.querySelector('#done-button'); if(d) d.click(); return 1; })()" | Out-Null; Start-Sleep 5
  $m = [regex]::Match("$link", '(?:youtu\.be/|shorts/)([A-Za-z0-9_-]{11})')
  if (-not $m.Success) { return "LOI: không lấy được link ($link)" }
  return $m.Groups[1].Value
}

# Ngày dạng Studio tiếng Việt: '2026-10-28' → '28 thg 10, 2026'
function To-StudioDate([string]$Iso) { $d = [datetime]::ParseExact($Iso, 'yyyy-MM-dd', $null); "$($d.Day) thg $($d.Month), $($d.Year)" }

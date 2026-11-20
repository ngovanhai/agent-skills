# Đăng một tập Cọng Tóc Cuối: tải lên (Riêng tư) rồi hẹn giờ công khai. Dùng profile FoxProfile cong-toc-cuoi.
# Mượn hàm Upload-Video / Schedule-Video của kênh Tèo, đổi profile + ID kênh.
#   pwsh -File ctc-dang.ps1 -Tap tap-01-mot-nam-thue-tro -Ngay 2026-10-30 -Gio 19:00
# Sau tải lên: soát lại tiêu đề/tags trong Studio (2026-10-29 tập 3 bị gõ tags vào ô tiêu đề), hẹn giờ thử 3 lần.
# Hẹn hỏng: vẫn ghi job-log (để job không tải trùng) kèm "CHUA HEN", không đẩy Drive, thoát mã 2.
param([string]$Tap, [string]$Ngay, [string]$Gio = '19:00')
$ErrorActionPreference = 'Continue'
$T = 'C:\Users\anhha\MuseStudio\the-thao\_tools'
$KENH_TEO = 'UCmVa984PvbXOWKsLKYXbZHw'; $KENH = 'UClW6e47o_G4Jy1H0i2pBxig'
. "$T\yt-lib.ps1"
$global:YB = 'http://127.0.0.1:8000/api/v1/browser/cong-toc-cuoi/page'
foreach ($f in 'dang-bai.ps1', 'yt-schedule.ps1') {
  $src = (Get-Content "$T\$f" -Raw -Encoding utf8).Replace($KENH_TEO, $KENH)
  # lịch chưa mở bằng .click() (gặp 2026-10-29): bấm thật vào ô ngày khi ô nhập ngày chưa hiện
  $src = $src.Replace("t.click(); return 'x'; })()`" | Out-Null; Start-Sleep 2",
    "t.click(); return 'x'; })()`" | Out-Null; Start-Sleep 3`n  if ([int](YEv `"[...document.querySelectorAll('input')].filter(i=>i.offsetParent).length`") -lt 4) { try { YPost 'click' @{ selector = 'ytcp-dropdown-trigger:has-text(`"thg`") >> visible=true' } 15 | Out-Null } catch {}; Start-Sleep 3 }")
  # tập 5 (2026-10-30) bị "tải lên gián đoạn": chữ tiến độ không phải "Đang tải lên" nên đóng hộp sớm → chờ cả khi còn "%" (in tiến độ bằng Write-Host: in ra output thì lẫn vào mã video trả về, gặp tập 9)
  $src = $src.Replace("-notmatch 'Đang tải lên|Uploading') { break }", "-notmatch 'Đang tải|Uploading|%') { break }; Write-Host `"  tiến độ: `$st`"")
  # giờ 07:00: Studio có thể hiện "7:00" → so khớp giờ không cần số 0 đầu (2026-11-03, chuyển sang 2 tập/ngày)
  $src = $src.Replace('$chk -notmatch [regex]::Escape($Time)', '$chk -notmatch (''(?<![0-9])0?'' + [regex]::Escape($Time.TrimStart(''0'')))')
  . ([scriptblock]::Create($src))
}
# sổ cái chung (MuseStudio/_so-cai): ghi từng bước đã tải / đã hẹn / lỗi
function SoCai { node 'C:\Users\anhha\MuseStudio\_so-cai\so-cai.mjs' @args 2>&1 | ForEach-Object { "  sổ cái: $_" } }
function Hong($msg) { $msg; SoCai ghi ctc $Tap loi --loi "$msg"; Remove-Item $D -Recurse -Force -ErrorAction SilentlyContinue; exit 1 }
function Cho($js, $n = 15) { for ($i = 0; $i -lt $n; $i++) { Start-Sleep 3; if ((YEv $js) -eq $true) { return $true } }; $false }
$Y = "C:\Users\anhha\MuseStudio\cong-toc-cuoi\$Tap\youtube"
$title = (Get-Content "$Y\tieu-de.txt" -Raw -Encoding utf8).Trim()
$desc = (Get-Content "$Y\mo-ta.txt" -Raw -Encoding utf8).Trim()
$tags = (Get-Content "$Y\tags.txt" -Raw -Encoding utf8).Trim()
# FoxProfile chỉ nhận file dưới the-thao: chép tạm
$D = 'C:\Users\anhha\MuseStudio\the-thao\_dang_ctc'
New-Item -ItemType Directory -Force $D | Out-Null
Copy-Item "$Y\$Tap.mp4" "$D\$Tap.mp4" -Force
Copy-Item "$Y\thumbnail.png" "$D\$Tap.png" -Force
# kiểm đúng kênh trước khi tải
YNav "https://studio.youtube.com/channel/$KENH/videos/upload"; Start-Sleep 6
$url = YEv 'location.href'
if ("$url" -notmatch $KENH) { Hong "LOI: sai kênh hoặc chưa đăng nhập ($url)" }
$id = Upload-Video -Mp4 "$D\$Tap.mp4" -Title $title -Desc $desc -Tags $tags -Thumb "$D\$Tap.png"
"upload: $id"
if ("$id" -match 'LOI|ERR' -or -not $id) { Hong "LOI upload: $(("$id" -replace '\s+', ' ').Trim())" }
# chữ tiến độ từng lẫn vào mã video (tập 9, 03/11): chỉ giữ mã 11 ký tự cuối
if ("$id" -match '([A-Za-z0-9_-]{11})\s*$') { $id = $matches[1] } else { Hong "LOI: mã video lạ: $id" }
SoCai ghi ctc $Tap da-tai --id $id --tieu-de $title --ghi 'ctc-dang: tải lên xong'
Remove-Item $D -Recurse -Force

# soát tiêu đề + tags trong trang chi tiết, sai thì sửa rồi Lưu
YNav "https://studio.youtube.com/video/$id/edit"
Cho '!!document.querySelector("#title-textarea #textbox")' | Out-Null
$t0 = YEv 'document.querySelector("#title-textarea #textbox").innerText.trim()'
YEv '(()=>{const t=document.querySelector("#toggle-button"); if(t) t.click(); return 1})()' | Out-Null; Start-Sleep 3
$nTag = [int](YEv 'document.querySelectorAll("ytcp-chip").length')
if ($t0 -ne $title -or $nTag -lt 3) {
  "soát: tiêu đề '$t0', $nTag tags → sửa"
  if ($t0 -ne $title) { YPost 'type' @{ selector = '#title-textarea #textbox'; text = $title; clear = $true } | Out-Null; Start-Sleep 2 }
  if ($nTag -lt 3 -and (YEv '!!document.querySelector(''input[aria-label="Thẻ (từ khóa)"]'')') -eq $true) {
    YPost 'type' @{ selector = 'input[aria-label="Thẻ (từ khóa)"]'; text = $tags; clear = $false; submit = $true } | Out-Null; Start-Sleep 2
  }
  YEv '(()=>{const b=document.querySelector("#save"); if(b) b.click(); return 1})()' | Out-Null; Start-Sleep 5
  YNav "https://studio.youtube.com/video/$id/edit"
  Cho '!!document.querySelector("#title-textarea #textbox")' | Out-Null
  $t0 = YEv 'document.querySelector("#title-textarea #textbox").innerText.trim()'
  if ($t0 -ne $title) { "LOI: tiêu đề vẫn sai sau khi sửa: $t0" }
}

# hẹn giờ: chờ danh sách nạp đủ rồi mới gọi, thử tối đa 3 lần
$sd = To-StudioDate $Ngay
$like = $title.Substring(0, [Math]::Min(25, $title.Length))
$s = ''
for ($k = 1; $k -le 3; $k++) {
  $s = Schedule-Video -Tab upload -TitleLike $like -Date $sd -Time $Gio
  "schedule lần ${k}: $s"
  if ("$s" -notmatch '^LOI' -and "$s" -match 'Đã lên lịch|Đang chờ xử lý') { break }
  Start-Sleep 20
}
$ok = "$s" -notmatch '^LOI'
$log = 'C:\Users\anhha\MuseStudio\cong-toc-cuoi\_tools\job-log.md'
$ghiChu = if ($ok) { $s } else { "CHUA HEN — hẹn tay trong Studio · $s" }
Add-Content $log -Encoding utf8 "- $(Get-Date -Format 'yyyy-MM-dd HH:mm') $Tap → https://youtu.be/$id · hẹn công khai $Ngay $Gio · $ghiChu"
"link: https://youtu.be/$id"
if ("$s" -match 'Đã lên lịch') { SoCai ghi ctc $Tap da-hen --id $id --gio "$Ngay $Gio" --ghi 'ctc-dang: Studio báo Đã lên lịch' }
elseif ($ok -and "$s" -match 'Đang chờ xử lý') { SoCai ghi ctc $Tap da-hen --id $id --gio "$Ngay $Gio" --canh-bao 'Studio báo Đang chờ xử lý lúc hẹn — so-cai kiem sẽ xác nhận' }
else { SoCai ghi ctc $Tap loi --id $id --gio "$Ngay $Gio" --loi "hẹn giờ chưa chắc: $(("$s" -replace '\s+', ' ').Substring(0, [Math]::Min(200, "$s".Length)))" }
if (-not $ok) { "LOI: chưa hẹn được giờ, video đang Riêng tư"; exit 2 }
# đã lên YouTube: đẩy gói lên Drive, khớp SHA-256 rồi xoá video trong máy
Push-Location 'C:\Users\anhha\MuseStudio\cong-toc-cuoi'
node "$env:USERPROFILE\.claude\skills\cong-toc-cuoi\scripts\drive-sync.mjs" $Tap --xoa 2>&1 | Select-Object -Last 2
Pop-Location

# Đăng MỘT mục trong kế hoạch của dang-tu-drive.mjs (job teo-tt-dang-bai): tải lên → hẹn giờ → ghi sổ xong.
#   pwsh -NoProfile -File dang-mot.ps1 -Plan <ke-hoach.json> -Index <i> [-LinkDai <link tập dài tải hôm nay>]
# In ra một dòng JSON kết quả (KQ {...}).
param([string]$Plan, [int]$Index, [string]$LinkDai = '')
$ErrorActionPreference = 'Continue'
$T = 'C:\Users\anhha\MuseStudio\the-thao\_tools'
. "$T\yt-lib.ps1"; . "$T\yt-schedule.ps1"; . "$T\dang-bai.ps1"
[Console]::OutputEncoding = [Text.Encoding]::UTF8
$p = (Get-Content $Plan -Raw -Encoding utf8 | ConvertFrom-Json)[$Index]
# FoxProfile so ổ đĩa theo dạng C:\ : đổi / thành \
$p.mp4 = $p.mp4 -replace '/', '\'; if ($p.thumb) { $p.thumb = $p.thumb -replace '/', '\' }
$kq = [ordered]@{ id = $p.id; loai = $p.loai; title = $p.title }
function Out-KQ { 'KQ ' + ($kq | ConvertTo-Json -Compress); exit }

if ("$($p.title) $($p.desc)" -match 'cá cược|nhà cái|cá độ|tạm biệt') { $kq.loi = 'chữ cấm trong tiêu đề/mô tả'; Out-KQ }
if (-not (Test-Path $p.mp4)) { $kq.loi = "không thấy mp4 $($p.mp4)"; Out-KQ }
$desc = $p.desc
if ($p.loai -eq 'short') {
  $ld = if ($p.link_dai -like 'http*') { $p.link_dai } else { $LinkDai }
  if (-not $ld) { $kq.loi = "thiếu link tập dài ($($p.link_dai))"; Out-KQ }
  $desc = "▶ Xem bản đầy đủ: $ld`n`n" + $desc
  if ($p.title -notmatch '#Shorts') { $p.title = "$($p.title) #Shorts" }
}
$thumb = if ($p.thumb) { $p.thumb } else { '' }

$id = Upload-Video -Mp4 $p.mp4 -Title $p.title -Desc $desc -Tags $p.tags -Thumb $thumb
if ("$id" -like 'LOI*') {
  YShot "$T\job-runs\loi-$($p.id -replace '[/\\]','_')-1.png"
  $kq.loi1 = "$id"
  $id = Upload-Video -Mp4 $p.mp4 -Title $p.title -Desc $desc -Tags $p.tags -Thumb $thumb
  if ("$id" -like 'LOI*') { YShot "$T\job-runs\loi-$($p.id -replace '[/\\]','_')-2.png"; $kq.loi = "$id"; Out-KQ }
}
$kq.vid = $id
$kq.link = if ($p.loai -eq 'short') { "https://youtube.com/shorts/$id" } else { "https://youtu.be/$id" }

# giờ hẹn: đã qua (hoặc sát giờ) thì lùi tới giờ tròn kế tiếp ≥30 phút sau hiện tại
$gio = [datetime]::ParseExact($p.gio, 'yyyy-MM-dd HH:mm', $null)
$now = Get-Date
if ($gio -lt $now.AddMinutes(20)) {
  $g = $now.AddMinutes(30); $g = $g.Date.AddHours($g.Hour); if ($g -lt $now.AddMinutes(30)) { $g = $g.AddHours(1) }
  $kq.lui = "$($p.gio) -> $($g.ToString('yyyy-MM-dd HH:mm'))"; $gio = $g
}
$kq.gio = $gio.ToString('yyyy-MM-dd HH:mm')
$tab = if ($p.loai -eq 'short') { 'short' } else { 'upload' }
$like = $p.title.Substring(0, [Math]::Min(30, $p.title.Length))
Start-Sleep 5
$s = Schedule-Video -Tab $tab -TitleLike $like -Date (To-StudioDate $gio.ToString('yyyy-MM-dd')) -Time $gio.ToString('HH:mm')
if ("$s" -like 'LOI*' -or "$s" -notmatch 'lịch') {
  Start-Sleep 10
  $s2 = Schedule-Video -Tab $tab -TitleLike $like -Date (To-StudioDate $gio.ToString('yyyy-MM-dd')) -Time $gio.ToString('HH:mm')
  $kq.hen1 = "$s"; $s = $s2
}
$kq.hen = "$s"
$kq.hen_ok = ("$s" -notlike 'LOI*' -and "$s" -match 'lịch')
# ghi sổ đã đăng (kể cả khi hẹn lỗi, để không tải trùng; lỗi hẹn ghi job-log cho người dùng)
$kq.xong = (node "$T\dang-tu-drive.mjs" xong $p.id $kq.link $kq.gio 2>&1 | Out-String).Trim()
Out-KQ

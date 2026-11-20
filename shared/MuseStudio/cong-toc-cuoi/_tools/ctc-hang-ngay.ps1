# Job hằng ngày kênh Cọng Tóc Cuối (Windows Task Scheduler "ctc-dang-bai", 09:00).
# Giữ lịch công khai đủ $TRUOC ngày tới, mỗi ngày 2 tập: 07:00 và 19:00 (từ 2026-11-03; trước đó 1 tập 19:00):
# lấp các khung giờ còn trống (cách giờ chạy ≥2 tiếng),
# lấy tập đã đóng gói (youtube/<tap>.mp4) mà chưa có trong job-log.md, tập số nhỏ trước,
# gọi ctc-dang.ps1 (tải lên Riêng tư → hẹn giờ → đẩy Drive, xoá video trong máy) từng tập một.
#   pwsh -File ctc-hang-ngay.ps1 [-Truoc 3] [-Thu]   (-Thu: chỉ in kế hoạch, không đăng)
param([int]$Truoc = 3, [switch]$Thu)
$ErrorActionPreference = 'Continue'
$G = 'C:\Users\anhha\MuseStudio\cong-toc-cuoi'
$T = "$G\_tools"
$logJob = "$T\job-log.md"
$runs = "$T\job-runs"; New-Item -ItemType Directory -Force $runs | Out-Null
$log = "$runs\dang-$(Get-Date -Format 'yyyy-MM-dd_HHmm').log"
function Ghi($s) { $l = "$(Get-Date -Format 'HH:mm:ss') $s"; $l; Add-Content $log -Encoding utf8 $l }

# khoá: không cho 2 lượt chạy cùng lúc (lượt tay + job 09:00 sẽ đăng trùng tập)
$mx = [System.Threading.Mutex]::new($false, 'Global\ctc-dang-bai')
if (-not $Thu -and -not $mx.WaitOne(0)) { Ghi "đang có lượt khác chạy, bỏ qua"; exit 0 }
$GIO = @('07:00', '19:00')
$daDang = @{}; $kin = @{}
if (Test-Path $logJob) {
  foreach ($l in Get-Content $logJob -Encoding utf8) {
    if ($l -match '(tap-\d+-[a-z0-9-]+) → .*hẹn công khai (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})') {
      $daDang[$matches[1]] = 1; $kin["$($matches[2]) $($matches[3])"] = 1
    }
  }
}
# sổ cái chung: tập sổ ghi đã tải/hẹn cũng coi là đã đăng (hợp với job-log, chặn tải trùng); quét lại sổ mỗi lượt
$SC = 'C:\Users\anhha\MuseStudio\_so-cai\so-cai.mjs'
if (Test-Path $SC) {
  node $SC quet 2>&1 | ForEach-Object { Ghi "  sổ cái: $_" }
  if (-not $Thu) { node $SC kiem 2>&1 | ForEach-Object { Ghi "  sổ cái kiểm: $_" } }  # xác nhận tập 2 kênh đã tới giờ hẹn đã công khai chưa
  try {
    $soDa = node $SC da-dang ctc | ConvertFrom-Json  # đừng đặt tên $sc: PowerShell không phân biệt hoa thường, sẽ đè $SC
    foreach ($x in $soDa.da) { $daDang[$x] = 1 }
    foreach ($x in $soDa.kin) { $kin[$x] = 1 }
  } catch { Ghi "CẢNH BÁO: không đọc được sổ cái, chỉ dùng job-log: $_" }
}
$cho = Get-ChildItem $G -Directory -Filter 'tap-*' | Sort-Object Name |
  Where-Object { -not $daDang[$_.Name] -and (Test-Path "$($_.FullName)\youtube\$($_.Name).mp4") }
# thứ tự người dùng kéo thả trên bảng sổ cái (localhost:4747); tập không có trong danh sách xếp sau, theo tên
$xep = @()
if (Test-Path $SC) { try { $xep = @(node $SC thu-tu ctc | ConvertFrom-Json) } catch { Ghi "CẢNH BÁO: không đọc được thứ tự sổ cái, xếp theo tên: $_" } }
if ($xep.Count -and $cho) {
  $cho = @($cho) | Sort-Object @{ Expression = { $i = [array]::IndexOf($xep, $_.Name); if ($i -lt 0) { 1e9 } else { $i } } }, Name
}
$han = (Get-Date).Date.AddDays($Truoc + 1); $som = (Get-Date).AddHours(2)
$trong = for ($d = (Get-Date).Date; $d -lt $han; $d = $d.AddDays(1)) {
  foreach ($g in $GIO) {
    $k = "$($d.ToString('yyyy-MM-dd')) $g"
    if (-not $kin[$k] -and [datetime]::ParseExact($k, 'yyyy-MM-dd HH:mm', $null) -gt $som) { $k }
  }
}
Ghi "khung trống tới $($han.AddDays(-1).ToString('yyyy-MM-dd')): $(@($trong) -join ', '); tập chờ: $(@($cho).Count)"
if (-not $cho) { Ghi "không còn tập đóng gói nào chờ đăng"; exit 0 }
if (-not $trong) { Ghi "lịch đã kín"; exit 0 }

if (-not $Thu) {
  try { Invoke-RestMethod -Method Post 'http://127.0.0.1:8000/api/v1/browser/cong-toc-cuoi/launch' -TimeoutSec 90 | Out-Null; Start-Sleep 8 } catch {}
}
$i = 0
foreach ($tap in $cho) {
  if ($i -ge @($trong).Count) { break }
  $ngay, $gio = @($trong)[$i] -split ' '; $i++
  if ($Thu) { Ghi "THỬ: $($tap.Name) → $ngay $gio"; continue }
  Ghi "đăng $($tap.Name) → $ngay $gio"
  pwsh -NoProfile -File "$T\ctc-dang.ps1" -Tap $tap.Name -Ngay $ngay -Gio $gio 2>&1 | ForEach-Object { Ghi "  $_" }
  if ($LASTEXITCODE -ne 0) { Ghi "LỖI $($tap.Name), dừng lượt này"; exit 1 }
  Start-Sleep 60
}
Ghi "xong"

# Job "so-cai-kiem" (Task Scheduler 07:40 và 19:40): quét sổ cái 2 kênh, hỏi YouTube xem tập đã tới giờ hẹn đã công khai chưa,
# in việc cần xử lý, xuất lại bang.html. Log: _so-cai/log/kiem-YYYY-MM-DD.log
$ErrorActionPreference = 'Continue'
[Console]::OutputEncoding = [Text.Encoding]::UTF8; $OutputEncoding = [Text.Encoding]::UTF8  # đọc đúng tiếng Việt từ node khi chạy trong Task Scheduler
$H = 'C:\Users\anhha\MuseStudio\_so-cai'
New-Item -ItemType Directory -Force "$H\log" | Out-Null
$log = "$H\log\kiem-$(Get-Date -Format 'yyyy-MM-dd').log"
function Ghi($s) { $l = "$(Get-Date -Format 'HH:mm:ss') $s"; $l; Add-Content $log -Encoding utf8 $l }
Ghi "== lượt kiểm"
foreach ($lenh in @('quet'), @('kiem'), @('can-xu-ly')) {
  node "$H\so-cai.mjs" @lenh 2>&1 | ForEach-Object { Ghi "  [$($lenh[0])] $_" }
}
# sao lưu sổ lên Drive (giữ bản theo ngày)
$bk = 'G:\My Drive\_so-cai'
if (Test-Path 'G:\My Drive') {
  New-Item -ItemType Directory -Force $bk | Out-Null
  foreach ($f in 'teo-the-thao.json', 'cong-toc-cuoi.json', 'bang.html') { Copy-Item "$H\$f" "$bk\$f" -Force -ErrorAction SilentlyContinue }
}

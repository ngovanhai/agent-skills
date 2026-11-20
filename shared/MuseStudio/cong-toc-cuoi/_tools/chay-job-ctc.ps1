# Tự động sản xuất video kênh Cọng Tóc Cuối bằng AGY CLI.
# Windows Task Scheduler hoặc người dùng gọi file này:
#   pwsh -File chay-job-ctc.ps1 [-Force] [-MinBuffer 6] [-Model gemini-3.8-flash-high]
# -Force: Bắt buộc sản xuất 1 tập mới ngay lập tức (không kiểm tra hàng chờ).
# -MinBuffer: Số tập chờ đăng tối thiểu để duy trì (mặc định 6 tập = 3 ngày). Nếu hàng chờ >= MinBuffer thì nghỉ lượt.
param(
  [switch]$Force,
  [int]$MinBuffer = 6,
  [string]$Model = 'gemini-3.8-flash-high'
)

$ErrorActionPreference = 'Stop'
$G = 'C:\Users\anhha\MuseStudio\cong-toc-cuoi'
$tools = "$G\_tools"
$runs = "$tools\job-runs"
New-Item -ItemType Directory -Force $runs | Out-Null

$stamp = Get-Date -Format 'yyyy-MM-dd_HHmm'
$log = "$runs\tao-video-$stamp.log"
$lock = "$tools\ctc-tao-video.lock"

function LogMsg($s) {
  $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $s"
  Write-Host $line
  Add-Content -Path $log -Encoding utf8 -Value $line
}

# 1. Kiểm tra tiến trình khác đang chạy
if (Test-Path $lock) {
  $oldPid = [int](Get-Content $lock -Raw)
  if (Get-Process -Id $oldPid -ErrorAction SilentlyContinue) {
    LogMsg "Bỏ lượt: Có tiến trình khác đang sản xuất video (PID $oldPid)"
    exit 0
  }
}
Set-Content -Encoding ascii -Path $lock -Value $PID

try {
  Set-Location $G
  $OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8

  # 2. Quét sổ cái và kiểm tra hàng chờ
  $SC = 'C:\Users\anhha\MuseStudio\_so-cai\so-cai.mjs'
  $JSON = 'C:\Users\anhha\MuseStudio\_so-cai\cong-toc-cuoi.json'
  
  if (Test-Path $SC) {
    node $SC quet ctc 2>&1 | Out-Null
  }

  $choDang = 0
  $daHen = 0
  if (Test-Path $JSON) {
    try {
      $soCai = Get-Content -Raw -Encoding utf8 $JSON | ConvertFrom-Json
      $vals = $soCai.tap.PSObject.Properties.Value
      $choDang = @($vals | Where-Object { $_.trang_thai -eq 'cho-dang' }).Count
      $daHen = @($vals | Where-Object { $_.trang_thai -eq 'da-hen' }).Count
    } catch {
      LogMsg "CẢNH BÁO: Không đọc được JSON sổ cái, bỏ qua đếm hàng chờ."
    }
  }

  LogMsg "Trạng thái hàng chờ CTC: $choDang tập chờ đăng, $daHen tập đã hẹn công khai."

  if (-not $Force -and $choDang -ge $MinBuffer) {
    LogMsg "Hàng chờ còn $choDang tập (>= ngưỡng $MinBuffer tập). Lịch phát hành an toàn, nghỉ lượt."
    exit 0
  }

  LogMsg "BẮT ĐẦU SẢN XUẤT 01 TẬP MỚI BẰNG AGY CLI (Model: $Model)"

  $promptFile = "$tools\ctc-video-dai-prompt.md"
  if (-not (Test-Path $promptFile)) {
    throw "Không tìm thấy file prompt giao việc: $promptFile"
  }

  $rawPrompt = Get-Content -Raw -Encoding utf8 $promptFile
  $fullPrompt = "[Job tự động sản xuất video Cọng Tóc Cuối lúc $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') bằng Windows Task Scheduler + AGY CLI]`n`n$rawPrompt"

  $agyExe = "$env:LOCALAPPDATA\agy\bin\agy.exe"
  if (-not (Test-Path $agyExe)) {
    throw "Không tìm thấy agy.exe tại: $agyExe"
  }

  # Chạy AGY tiền cảnh và ghi toàn bộ log
  & $agyExe -p $fullPrompt --model $Model --dangerously-skip-permissions --print-timeout 0 *>> $log
  $rc = $LASTEXITCODE

  LogMsg "Phiên AGY hoàn tất với mã thoát $rc."

  if ($rc -eq 0) {
    LogMsg "THÀNH CÔNG: Đã sản xuất xong tập mới Cọng Tóc Cuối."
    if (Test-Path $SC) { node $SC quet ctc 2>&1 | Out-Null }
  } else {
    LogMsg "LỖI: AGY trả về mã lỗi $rc. Kiểm tra chi tiết tại $log."
  }
} finally {
  Remove-Item $lock -ErrorAction SilentlyContinue
}

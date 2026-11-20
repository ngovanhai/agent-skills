# Chạy một job của kênh Tèo Thể Thao bằng AGY CLI hoặc Claude Code CLI (Windows Task Scheduler gọi file này).
# Thay bộ hẹn giờ của app Claude Desktop (từ 2026-10-27 chiều app báo oauth 403, job không chạy).
# Chuyển đổi mặc định sang AGY CLI từ 2026-11-06.
#   pwsh -File chay-job.ps1 -Job teo-tt-video-dai [-Engine agy|claude] [-Model gemini-3.8-flash-high]
# Đề bài lấy từ ~/.claude/scheduled-tasks/<job>/SKILL.md (bỏ phần frontmatter). Log: _tools/job-runs/<job>-<giờ>.log
param(
  [Parameter(Mandatory)][string]$Job,
  [ValidateSet('agy', 'claude')][string]$Engine = 'agy',
  [string]$Model = 'gemini-3.8-flash-high'
)

$ErrorActionPreference = 'Stop'
$tools = 'C:\Users\anhha\MuseStudio\the-thao\_tools'
$runs = Join-Path $tools 'job-runs'
New-Item -ItemType Directory -Force $runs | Out-Null
$stamp = Get-Date -Format 'yyyy-MM-dd_HHmm'
$log = Join-Path $runs "$Job-$stamp.log"

# một job chỉ chạy một bản: lượt trước còn chạy thì bỏ lượt này
$lock = Join-Path $runs "$Job.lock"
if (Test-Path $lock) {
  $oldPid = [int](Get-Content $lock -Raw)
  if (Get-Process -Id $oldPid -ErrorAction SilentlyContinue) {
    "$(Get-Date -Format s) bỏ lượt: $Job còn chạy (pid $oldPid)" | Add-Content -Encoding utf8 $log
    exit 0
  }
}
Set-Content -Encoding ascii $lock $PID

try {
  $taskFile = "$env:USERPROFILE\.claude\scheduled-tasks\$Job\SKILL.md"
  if (-not (Test-Path $taskFile)) {
    throw "Không tìm thấy file đề bài: $taskFile"
  }
  $raw = Get-Content -Raw -Encoding utf8 $taskFile
  $prompt = ($raw -replace '(?s)^---.*?\r?\n---\r?\n', '').Trim()
  Set-Location 'C:\Users\anhha\MuseStudio'
  $OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8

  if ($Engine -eq 'agy') {
    $fullPrompt = "[Job theo lịch $Job, chạy lúc $(Get-Date -Format 'yyyy-MM-dd HH:mm') bằng Windows Task Scheduler + AGY CLI; không có người ngồi xem, không hỏi lại, tự quyết theo luật trong đề.]`n`n$prompt"
    "$(Get-Date -Format s) bắt đầu $Job (AGY CLI - $Model)" | Add-Content -Encoding utf8 $log
    $agyExe = "$env:LOCALAPPDATA\agy\bin\agy.exe"
    & $agyExe -p $fullPrompt --model $Model --dangerously-skip-permissions --print-timeout 0 *>> $log
    $rc = $LASTEXITCODE
  } else {
    $fullPrompt = "[Job theo lịch $Job, chạy lúc $(Get-Date -Format 'yyyy-MM-dd HH:mm') bằng Windows Task Scheduler + Claude Code CLI; không có người ngồi xem, không hỏi lại, tự quyết theo luật trong đề.]`n`n$prompt"
    "$(Get-Date -Format s) bắt đầu $Job (Claude CLI)" | Add-Content -Encoding utf8 $log
    $fullPrompt | & "$env:USERPROFILE\.local\bin\claude.exe" -p --dangerously-skip-permissions 2>&1 | Add-Content -Encoding utf8 $log
    $rc = $LASTEXITCODE
  }

  "$(Get-Date -Format s) xong $Job (mã $rc)" | Add-Content -Encoding utf8 $log
  if ($rc -ne 0) {
    "| $(Get-Date -Format 'yyyy-MM-dd HH:mm') | $Job (Task Scheduler - $Engine) | phiên $Engine thoát mã $rc giữa chừng, xem $log; lượt sau làm nốt | |" | Add-Content -Encoding utf8 (Join-Path $tools 'job-log-loi.md')
  }
} finally {
  Remove-Item $lock -ErrorAction SilentlyContinue
}

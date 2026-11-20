# Chạy agy TÁCH RỜI khỏi phiên Claude: mỗi lần là một tác vụ Task Scheduler riêng (\TeoTheThao\agy\<tag>).
# Lý do (2026-10-29): bật agy thẳng từ Bash của phiên Claude headless làm chết cả phiên Claude (mã 0xC000013A / 137),
# lần 09:18 chết luôn các job khác đang chạy cùng lúc.
#   pwsh -File chay-agy.ps1 -Tag video-dai-0729 -PromptFile <file giao việc> [-Continue]
# In ra đường dẫn log và file .done (agy xong thì .done chứa mã thoát). Không chờ: phiên Claude tự theo dõi .done (Monitor).
param(
  [Parameter(Mandatory)][string]$Tag,
  [Parameter(Mandatory)][string]$PromptFile,
  [switch]$Continue,
  [string]$Model = 'gemini-3.8-flash-high'
)
$ErrorActionPreference = 'Stop'
$tools = 'C:\Users\anhha\MuseStudio\the-thao\_tools'
$log = Join-Path $tools "agy-$Tag.log"
$done = "$log.done"
Remove-Item $done -ErrorAction SilentlyContinue
$prompt = (Resolve-Path $PromptFile).Path
$cont = if ($Continue) { '--continue' } else { '' }

$runner = Join-Path $tools "job-runs\agy-$Tag.ps1"
@"
Set-Location 'C:\Users\anhha\MuseStudio\the-thao'
`$OutputEncoding = [Console]::OutputEncoding = [Text.Encoding]::UTF8
`$p = Get-Content -Raw -Encoding utf8 '$prompt'
& 'C:\Users\anhha\AppData\Local\agy\bin\agy.exe' $cont -p `$p --model $Model --dangerously-skip-permissions --print-timeout 0 *>> '$log'
Set-Content -Encoding ascii '$done' `$LASTEXITCODE
"@ | Set-Content -Encoding utf8 $runner

$name = "agy-$Tag"
$act = New-ScheduledTaskAction -Execute (Get-Command pwsh).Source -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$runner`"" -WorkingDirectory 'C:\Users\anhha\MuseStudio\the-thao'
$set = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Hours 6) -DontStopOnIdleEnd
Register-ScheduledTask -TaskPath '\TeoTheThao\agy\' -TaskName $name -Action $act -Settings $set -Force | Out-Null
Start-ScheduledTask -TaskPath '\TeoTheThao\agy\' -TaskName $name
"log=$log"
"done=$done"

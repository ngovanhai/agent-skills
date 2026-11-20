# Mở MỘT lượt làm tập dài song song (job teo-tt-video-dai-b, đề ở ~/.claude/scheduled-tasks/teo-tt-video-dai-b/SKILL.md)
# Người dùng tự chạy: ! pwsh -File C:/Users/anhha/MuseStudio/the-thao/_tools/mo-luot-song-song.ps1
$src = Get-ScheduledTask -TaskPath '\TeoTheThao\' -TaskName 'teo-tt-video-dai'
$act = New-ScheduledTaskAction -Execute $src.Actions[0].Execute -Argument ($src.Actions[0].Arguments -replace '-Job teo-tt-video-dai$', '-Job teo-tt-video-dai-b') -WorkingDirectory $src.Actions[0].WorkingDirectory
Register-ScheduledTask -TaskPath '\TeoTheThao\' -TaskName 'teo-tt-video-dai-b' -Action $act -Settings $src.Settings -Principal $src.Principal -Force | Out-Null
Start-ScheduledTask -TaskPath '\TeoTheThao\' -TaskName 'teo-tt-video-dai-b'
Start-Sleep 10
(Get-ScheduledTask -TaskPath '\TeoTheThao\' -TaskName 'teo-tt-video-dai-b').State
Get-ChildItem C:\Users\anhha\MuseStudio\the-thao\_tools\job-runs\teo-tt-video-dai-b-*.log | ForEach-Object { $_.Name; Get-Content $_ }

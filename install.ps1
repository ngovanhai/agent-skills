param(
  [Parameter(Mandatory=$true)]
  [string]$RepoUrl,
  [string]$InstallDir = "$HOME\.agent-skills",
  [string]$Profiles = "all"
)

$ErrorActionPreference = "Stop"

if (Test-Path $InstallDir) {
  Write-Host "Thu muc $InstallDir da ton tai -> dang git pull..."
  git -C $InstallDir pull --ff-only
} else {
  Write-Host "Dang clone $RepoUrl -> $InstallDir..."
  git clone $RepoUrl $InstallDir
}

Write-Host "Dang dang ky lenh 'skillhub' global (npm link)..."
Push-Location $InstallDir
try {
  npm link | Out-Null
} catch {
  Write-Warning "Khong the npm link tu dong. Ban van co the chay: node $InstallDir\bin\skillhub.mjs"
}
Pop-Location

node "$InstallDir\bin\skillhub.mjs" init --profiles $Profiles --harnesses auto
node "$InstallDir\bin\skillhub.mjs" sync
node "$InstallDir\bin\skillhub.mjs" doctor
Write-Host "`nHoan tat! Dung 'skillhub update' bat cu luc nao de keo ban moi."

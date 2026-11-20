#!/usr/bin/env bash
# Render bản cuối lần lượt từng tập (đã review đạt) → đo tiếng → pack → gd-check --log.
#   bash _tools/render-hang.sh tap-17-... tap-11-...
# Chờ tới khi không còn gd-render nào chạy (render chiếm 2 suất ~30 phút), rồi mới render tập kế.
# Tiếng câm (mean < -40 dB, gặp ở tập 6) thì trộn lại bằng tron-tieng.py.
cd "$(dirname "$0")/.."
SK=~/.claude/skills
SLOT=C:/Users/anhha/MuseStudio/the-thao/_tools/slot.sh
dang_render() { powershell -NoProfile -c "@(Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | ? { \$_.CommandLine -match 'gd-render' }).Count"; }
for TAP in "$@"; do
  while [ "$(dang_render | tr -d '\r')" != "0" ]; do sleep 60; done
  echo "=== $TAP $(date +%H:%M) render"
  bash $SLOT "$TAP render" node $SK/teo-kiem-hiep/scripts/gd-render.mjs $TAP --par 2 2>&1 | tail -2
  F=$TAP/renders/final.mp4
  [ -f $F ] || { echo "LOI: không có $F"; continue; }
  M=$(ffmpeg -hide_banner -i $F -af volumedetect -f null - 2>&1 | grep mean_volume | sed 's/.*mean_volume: \([-0-9.]*\).*/\1/')
  echo "  dài $(ffprobe -v error -show_entries format=duration -of csv=p=0 $F) s, tiếng $M dB"
  if awk "BEGIN{exit !($M < -40)}"; then
    echo "  tiếng câm → trộn lại"; PYTHONIOENCODING=utf-8 python $SK/cong-toc-cuoi/scripts/tron-tieng.py $TAP 2>&1 | tail -1
  fi
  node $SK/cong-toc-cuoi/scripts/pack.mjs $TAP 2>&1 | tail -2
  node $SK/cong-toc-cuoi/scripts/gd-check.mjs $TAP --log 2>&1 | tail -1
  echo "=== $TAP $(date +%H:%M) xong"
done

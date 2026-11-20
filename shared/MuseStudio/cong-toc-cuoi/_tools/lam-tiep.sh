#!/usr/bin/env bash
# Sau khi sửa loi.txt: đọc lại câu đổi → gd-check (timeline) → nhạc theo timeline mới → soi.
#   bash _tools/lam-tiep.sh tap-05-... tap-07-...
# Giọng theo story.ban_gioi (nam → Quốc Tuấn, nu → Ngọc Huyền). Việc nặng qua slot.sh.
cd "$(dirname "$0")/.."
SK=~/.claude/skills
SLOT=C:/Users/anhha/MuseStudio/the-thao/_tools/slot.sh
for TAP in "$@"; do
  echo "=== $TAP"
  G=$(node -e "try{console.log(require('./$TAP/godot/story.json').ban_gioi||'nam')}catch(e){console.log('nam')}")
  V="Quốc Tuấn"; [ "$G" = "nu" ] && V="Ngọc Huyền"
  bash $SLOT "$TAP giọng" node $SK/teo-kiem-hiep/scripts/gd-voice.mjs $TAP --voice "$V" 2>&1 | tail -1
  node $SK/cong-toc-cuoi/scripts/gd-check.mjs $TAP 2>&1 | grep -E "LỖI|^OK|^tap-" | head -8
  [ -f $TAP/work/nhac.py ] && PYTHONIOENCODING=utf-8 python $TAP/work/nhac.py "$(pwd)/$TAP" 2>&1 | tail -1
  ffmpeg -hide_banner -i $TAP/godot/nhac.ogg -af volume=-3dB,volumedetect -f null - 2>&1 | grep mean_volume | sed "s/.*mean/  nhac mean/"
  bash $SLOT "$TAP soi" node $SK/cong-toc-cuoi/scripts/soi.mjs $TAP 2>&1 | tail -1
done
echo "=== xong"

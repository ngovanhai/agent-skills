#!/bin/bash
# Hàng đợi việc nặng CPU dùng chung giữa các session. 2 làn chạy song song:
#   làn "giong"  : các stage không có render (tts/align khi --tts-local/--align-local, build, lint)
#   làn "render" : hyperframes render (stages có render)
# Mỗi làn chỉ 1 việc một lúc, xếp theo thứ tự vào hàng; video dài được ưu tiên trước short (đường dẫn có /shorts/).
# Dùng: bash chay-nang.sh <video_dir> <stages> <log_file> [thêm tham số make.mjs...]
# tts và align chạy trên Colab (make.mjs, trừ khi có --tts-local/--align-local) nên không tốn CPU: chạy ngay, không xếp hàng;
# các stage sau đó (build, lint, render…) mới vào làn. Short (…/shorts/…) đọc + căn chữ bằng CPU (luật kit/lib/mix.mjs) nên vẫn xếp làn như cũ.
DIR="$1"; STAGES="$2"; LOG="$3"; shift 3
Q=/Users/haingo/MuseStudio/ideas/.queue
KIT=/Users/haingo/MuseStudio/kit
# hyperframes cần Node >= 22
for v in /Users/haingo/.nvm/versions/node/v24*/bin /Users/haingo/.nvm/versions/node/v22*/bin; do [ -x "$v/node" ] && export PATH="$v:$PATH" && break; done
if [[ "$DIR" != */shorts/* && ( ",$STAGES," == *",tts,"* || ",$STAGES," == *",align,"* ) && " $* " != *" --tts-local "* && " $* " != *" --align-local "* ]]; then
  if [[ ",$STAGES," == *",align,"* ]]; then PRE="${STAGES%%align*}align"; else PRE="${STAGES%%tts*}tts"; fi
  STAGES="${STAGES#"$PRE"}"; STAGES="${STAGES#,}"
  mkdir -p "$(dirname "$LOG")"
  echo "[queue] $(date '+%F %T') $PRE chạy ngay (Colab, không chờ làn): $DIR" >> "$LOG"
  node "$KIT/make.mjs" "$DIR" --stage "$PRE" "$@" >> "$LOG" 2>&1
  code=$?
  echo "[queue] $(date '+%F %T') $PRE xong, mã $code" >> "$LOG"
  [ $code -ne 0 ] || [ -z "$STAGES" ] && exit $code
fi
if [[ ",$STAGES," == *",render,"* ]]; then LANE=render; PAT="^node .*hyperframes render"; else LANE=giong; PAT="kit/py/tts.py|kit/py/align.py"; fi
LOCK="$Q/lock-$LANE"
mkdir -p "$Q/$LANE" "$(dirname "$LOG")"
# vé xếp hàng: <ưu tiên><giờ vào>-<pid>; ưu tiên 1 = video dài, 2 = short
PRI=1; [[ "$DIR" == */shorts/* ]] && PRI=2
TICKET="$Q/$LANE/$PRI$(date +%s)-$$"
echo "$DIR $STAGES" > "$TICKET"
trap 'rm -f "$TICKET"' EXIT
echo "[queue] $(date '+%F %T') chờ làn $LANE: $DIR $STAGES" >> "$LOG"
# hoãn short: chủ kênh muốn 5 video dài xong trước. Short chỉ chạy khi có file .queue/shorts-ok
if [ "$PRI" == 2 ]; then
  echo "[queue] $(date '+%F %T') short đang hoãn, chờ $Q/shorts-ok" >> "$LOG"
  until [ -e "$Q/shorts-ok" ]; do sleep 30; done
fi
while true; do
  # dọn vé của tiến trình đã chết
  for t in "$Q/$LANE"/*; do [ -e "$t" ] || continue; p="${t##*-}"; kill -0 "$p" 2>/dev/null || rm -f "$t"; done
  first=$(ls "$Q/$LANE" | sort | head -1)
  if [ "$Q/$LANE/$first" == "$TICKET" ] && ! pgrep -f "$PAT" >/dev/null; then
    if mkdir "$LOCK" 2>/dev/null; then echo "$$ $DIR $STAGES" > "$LOCK/owner"; break; fi
    pid=$(cut -d' ' -f1 "$LOCK/owner" 2>/dev/null)
    if [ -n "$pid" ] && ! kill -0 "$pid" 2>/dev/null; then rm -rf "$LOCK"; continue; fi
  fi
  sleep 15
done
trap 'rm -f "$TICKET"; rm -rf "$LOCK"' EXIT
echo "[queue] $(date '+%F %T') bắt đầu (làn $LANE)" >> "$LOG"
node "$KIT/make.mjs" "$DIR" --stage "$STAGES" "$@" >> "$LOG" 2>&1
code=$?
echo "[queue] $(date '+%F %T') xong, mã $code" >> "$LOG"
exit $code

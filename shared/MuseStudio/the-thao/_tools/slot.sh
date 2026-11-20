#!/usr/bin/env bash
# Suất máy cho việc nặng (giọng, render): tối đa 2 việc cùng lúc trên cả máy.
#   bash the-thao/_tools/slot.sh "<tên việc>" <lệnh> [tham số…]
# Giữ suất bằng thư mục khoá MuseStudio/.slots/sN (mkdir là nguyên tử); chờ đến khi có suất trống.
set -u
NAME="$1"; shift
ROOT="C:/Users/anhha/MuseStudio/.slots"
mkdir -p "$ROOT"
SLOTS=2
while :; do
  for i in $(seq 1 $SLOTS); do
    if mkdir "$ROOT/s$i" 2>/dev/null; then
      echo "$NAME ($$, $(date '+%F %T'))" > "$ROOT/s$i/who"
      trap 'rm -rf "$ROOT/s$i"' EXIT INT TERM
      echo "slot s$i: $NAME"
      "$@"
      exit $?
    fi
  done
  sleep 5
done

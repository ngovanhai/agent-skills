#!/usr/bin/env bash
# Hàng đợi render: đọc tên tập từ _tools/hang-render.txt (mỗi dòng một tập), render lần lượt những tập chưa có render-hang-<NN>.log.
# Chờ hàng cũ (đuôi-xích) xong trước bằng CHO_LOG. Thoát khi danh sách hết và không có dòng mới trong 3 giờ.
cd "$(dirname "$0")/.."
[ -n "$CHO_LOG" ] && until grep -q "ban-cuoi.jpg" "$CHO_LOG" 2>/dev/null; do sleep 60; done
ranh=0
while [ $ranh -lt 180 ]; do
  T=""
  while read -r x; do [ -z "$x" ] && continue; n=$(echo $x | sed 's/tap-\([0-9]*\).*/\1/'); [ -f _tools/render-hang-$n.log ] || { T=$x; break; }; done < _tools/hang-render.txt
  if [ -z "$T" ]; then sleep 60; ranh=$((ranh+1)); continue; fi
  ranh=0; n=$(echo $T | sed 's/tap-\([0-9]*\).*/\1/')
  bash _tools/render-hang.sh $T > _tools/render-hang-$n.log 2>&1
  bash _tools/kiem-ban-cuoi.sh $T >> _tools/render-hang-$n.log 2>&1
done

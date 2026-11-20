#!/usr/bin/env bash
# Soát bản cuối: trích 1 khung giữa MỖI đoạn kNN từ renders/final.mp4 (giờ lấy ở timeline.json), ghép 4 cột
# → <tap>/work/ban-cuoi.jpg (ô theo thứ tự đoạn, trái→phải, trên→dưới). Bắt lỗi kẹt hình (tập 19: soi đúng mà bản render đứng nền/chữ).
#   bash _tools/kiem-ban-cuoi.sh tap-17-...
cd "$(dirname "$0")/.."
TAP=$1; F=$TAP/renders/final.mp4; O=$TAP/work/bc; rm -rf $O; mkdir -p $O
node -e "
const t=require('./$TAP/godot/timeline.json');const g={};
for(const c of t.cau){const k=c.id.slice(0,3);(g[k]=g[k]||[]).push(c.t0)}
const ks=Object.keys(g);ks.forEach((k,i)=>{const a=g[k][0],b=i+1<ks.length?g[ks[i+1]][0]:t.dur;console.log(k,((a+b)/2).toFixed(1))})" > $O/gio.txt
i=0; while read k t; do
  i=$((i+1)); ffmpeg -v error -y -ss $t -i $F -frames:v 1 -vf "scale=640:-1" $O/$(printf %02d $i).jpg </dev/null; echo "$i=$k@$t"
done < $O/gio.txt
ffmpeg -v error -y -i "$O/%02d.jpg" -vf "tile=4x3" -frames:v 1 $TAP/work/ban-cuoi.jpg
echo "→ $TAP/work/ban-cuoi.jpg ($(ls $O/*.jpg | wc -l) đoạn)"

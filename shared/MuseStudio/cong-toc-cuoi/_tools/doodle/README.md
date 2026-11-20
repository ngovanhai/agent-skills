# Nhân vật nét bút dạ — kênh Cọng Tóc Cuối

Engine nhân vật Godot 4.7 dùng chung cho mọi tập. Nền không cố định, mỗi kịch bản tự dựng nền.

## File

| File | Việc |
|---|---|
| `nv.gd` | Vẽ nhân vật: nét rung 8 lần/giây, 16 tư thế, 5 biểu cảm, nhép miệng, cọng tóc, urgo. Tất định theo `t`. |
| `cast.json` | Sổ vai. Thêm vai mới = thêm một dòng, không sửa code. |
| `demo.gd` | Xuất sheet soi và clip mẫu. |

## Dùng trong tập

Chép `nv.gd` và `cast.json` vào `godot/` của tập.

```gdscript
var b = preload("res://nv.gd").new(); add_child(b); b.setup("ban")
var c = preload("res://nv.gd").new(); add_child(c); c.setup("chu_tro"); c.scale.x = -1  # quay sang trái
# mỗi khung:
b.t = t                         # bắt buộc, để nét rung và cử động tất định
b.set_pose("dung", "guc", k)    # trộn hai tư thế, k = 0..1
b.set_pose("di", "", 0, t * TAU * 1.7)   # đi/chạy: tham số cuối là pha bước
b.expr = "met"                  # binh | vui | met | buon | soc
b.talk = true                   # nhép miệng khi có thoại
b.toc = 0.6                     # cọng tóc: 0 dựng … 1 gục (chỉ "Bạn")
b.toc_roi = 0.5                 # tóc rụng: <0 còn trên đầu, 0..1 đang rơi, 1 nằm dưới đất, >1.5 mất hẳn (cảnh sau, đầu trọc)
b.toc_san = -160.0              # (tuỳ chọn) tóc rơi xuống mặt bàn thay vì sàn, y theo toạ độ vai
b.urgo = 2                      # 0..3
```

## Tư thế

`dung`, `di`, `chay`, `cam_dt`, `chi`, `vay_tay`, `gai_dau`, `khoanh_tay`, `chong_nanh`, `om_thung`, `dem_tien`, `ngoi` (ghế nhựa xanh), `guc`, `om_dau`, `ngoi_bet` (ngồi không có ghế nhựa: ghế gỗ, chiếu, sau mâm; đặt y = mặt ghế), `quy` (quỳ một gối, tay đưa ra trước: cầu hôn; thêm ở tập 2).

Thêm tư thế: thêm một dòng vào `POSES` trong `nv.gd`. Góc tính theo thế giới (0 = thẳng xuống, + = về phía x dương), mỗi chi là `[đoạn trên, cộng thêm cho đoạn dưới]`. Cờ:
`mid` tay vẽ trước thân, `front` tay vẽ trên cả đầu, `phone`/`cash`/`box` cầm đồ, `gai`/`vay` tay cử động, `ghe` ghế nhựa, `drop` hạ hông khi ngồi.

## Luật tạo hình

- Chỉ "Bạn" có màu áo (`ao` trong cast.json). Vai phụ đen trắng. Đồ vật (tiền, thùng, ghế) được có màu.
- Mỗi vai một món đồ nhận diện, nhìn bóng cũng biết là ai.
- Đầu vuông (`shape: square`) cho người có quyền: sếp, chủ trọ, cho vay, môi giới. Đầu tròn cho người thường.
- Cọng tóc rụng chỉ dùng ở khúc tệ nhất của tập. Cọng tóc nằm dưới sàn nhỏ, cảnh đó nên quay cận.

Bạn nữ: vai `ban_nu` (đầu tròn, cọng tóc + urgo như Bạn, thêm nơ hồng `no` + váy). Tập có `story.ban_gioi = "nu"` dùng `b.setup("ban_nu")`.

Tuỳ chọn trong cast.json: `shape` round|square|bean · `hair` strand|spiky|flat|bun|dai|curlers|bald|capback|tuft · `clothes` shirt|tank|tie|baba|vest · `glasses` · `sun` · `ria` · `dots` · `beltbag` · `skirt` · `quan_dui` · `tag` · `no` (nơ hồng cạnh cọng tóc) · `feet` giay|dep · `dep` màu dép · `ao` màu áo.

## Soi

```
godot --path . -- --mode=ban  --out=sheet-ban.png     # 14 tư thế của Bạn
godot --path . -- --mode=cast --out=sheet-cast.png    # 9 vai + tư thế đặc trưng
godot --path . --write-movie frames/f.png --fixed-fps 24 -- --mode=clip    # đời Bạn 10 giây
godot --path . --write-movie frames/f.png --fixed-fps 24 -- --mode=clip2   # ngày đóng tiền trọ 9 giây
```
Chạy có cửa sổ (không `--headless`) để chụp được hình.

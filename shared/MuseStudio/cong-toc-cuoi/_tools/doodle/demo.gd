extends Node2D
## Demo nhân vật nét bút dạ.
## Sheet: godot --path . -- --mode=ban|cast --out=<file.png>
## Kênh: godot --path . -- --mode=avatar|banner --out=<f.png>  (rồi ffmpeg cắt/phóng, xem _avatar)
## Clip:  godot --path . --write-movie <dir>/f.png --fixed-fps 24 -- --mode=clip|clip2

const Nv := preload("res://nv.gd")
const INK := Color("141414")
const LOSS := Color("d8392b")
const TEN_TU_THE := {"gai_dau": "gãi đầu", "khoanh_tay": "khoanh tay", "chi": "chỉ tay", "chong_nanh": "chống nạnh",
	"dem_tien": "đếm tiền", "cam_dt": "cầm điện thoại", "ngoi": "ngồi ghế nhựa", "vay_tay": "vẫy tay"}

var mode := "ban"
var out := "user://sheet.png"
var t := 0.0
var frames := 0
var font := SystemFont.new()
var tay := SystemFont.new()
var b
var c
var lbl_tien: Label
var lbl_moc: Label


func _ready() -> void:
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--mode="):
			mode = a.get_slice("=", 1)
		if a.begins_with("--out="):
			out = a.get_slice("=", 1)
	font.font_names = PackedStringArray(["Segoe UI", "Arial"])
	tay.font_names = PackedStringArray(["Segoe Print", "Segoe UI"])
	tay.font_weight = 700
	RenderingServer.set_default_clear_color(Color("f3f4f1"))
	match mode:
		"ban": _sheet_ban()
		"cast": _sheet_cast()
		"clip": _clip_setup()
		"clip2": _clip2_setup()
		"avatar": _avatar()
		"banner": _banner()


func _label(txt: String, pos: Vector2, size := 28, col := INK, center := true) -> Label:
	var l := Label.new()
	l.text = txt
	l.add_theme_font_override("font", font)
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", col)
	l.position = pos
	if center:
		l.size = Vector2(300, 40)
		l.position = pos - Vector2(150, 0)
		l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	add_child(l)
	return l


func _nv(id: String, x: float, y: float, s: float):
	var n = Nv.new()
	n.setup(id)
	n.position = Vector2(x, y)
	n.scale = Vector2(s, s)
	add_child(n)
	return n


# ---------- sheet ----------

func _sheet_ban() -> void:
	var poses := [["dung", "đứng", "binh"], ["di", "đi", "vui"], ["chay", "chạy", "soc"], ["cam_dt", "cầm điện thoại", "met"],
		["chi", "chỉ tay", "binh"], ["vay_tay", "vẫy tay", "vui"], ["gai_dau", "gãi đầu", "met"],
		["khoanh_tay", "khoanh tay", "buon"], ["chong_nanh", "chống nạnh", "binh"], ["om_thung", "ôm thùng", "met"],
		["dem_tien", "đếm tiền", "vui"], ["ngoi", "ngồi ghế nhựa", "buon"], ["guc", "gục", "buon"], ["om_dau", "ôm đầu", "soc"]]
	for i in poses.size():
		var x := 140.0 + (i % 7) * 274.0
		var y := 470.0 if i < 7 else 1000.0
		var n = _nv("ban", x, y, 0.6)
		n.set_pose(poses[i][0], "", 0.0, 1.2)
		n.expr = poses[i][2]
		n.t = 0.3
		_label(poses[i][1], Vector2(x, y + 14), 26)


func _sheet_cast() -> void:
	var ids := ["ban", "to_truong", "moi_gioi", "chu_tro", "cho_vay", "me", "bo", "vo", "dong_nghiep"]
	var sig := {"ban": ["gai_dau", "met"], "to_truong": ["khoanh_tay", "binh"], "moi_gioi": ["chi", "vui"],
		"chu_tro": ["chong_nanh", "binh"], "cho_vay": ["dem_tien", "vui"], "me": ["cam_dt", "buon"],
		"bo": ["ngoi", "binh"], "vo": ["chong_nanh", "buon"], "dong_nghiep": ["vay_tay", "vui"]}
	var f := FileAccess.open("res://cast.json", FileAccess.READ)
	var all: Dictionary = JSON.parse_string(f.get_as_text())
	for i in ids.size():
		var x := 110.0 + i * 212.0
		var n = _nv(ids[i], x, 470, 0.6)
		n.t = 0.2
		_label(all[ids[i]]["ten"], Vector2(x, 484), 24)
		var m = _nv(ids[i], x, 1000, 0.6)
		m.set_pose(sig[ids[i]][0])
		m.expr = sig[ids[i]][1]
		m.t = 0.6
		_label(TEN_TU_THE[sig[ids[i]][0]], Vector2(x, 1014), 22, Color("5d6663"))


# ---------- ảnh kênh (vẽ 1920×1080 rồi cắt/phóng) ----------
# avatar: cắt giữa 1080×1080. banner: phóng lên 2560×1440; vùng an toàn y 381..698, x 380..1540

func _avatar() -> void:
	var nen := Polygon2D.new()
	var p := PackedVector2Array()
	for i in 48:
		var a := TAU * i / 48.0
		p.append(Vector2(960, 560) + Vector2(cos(a), sin(a)) * (400 + 10 * sin(a * 3.0)))
	nen.polygon = p
	nen.color = Color("dcebf5")
	add_child(nen)
	var n = _nv("ban", 960, 1690, 2.7)
	n.expr = "met"
	n.toc = 0.25
	n.urgo = 1
	n.t = 0.3


func _banner() -> void:
	var n = _nv("ban", 560, 694, 0.58)
	n.set_pose("gai_dau")
	n.expr = "met"
	n.toc = 0.35
	n.urgo = 1
	n.t = 0.3
	var phu := [["chu_tro", "chong_nanh", 190.0, -1.0], ["to_truong", "khoanh_tay", 1730.0, 1.0]]
	for v in phu:
		var m = _nv(v[0], v[2], 682, 0.53)
		m.set_pose(v[1])
		m.scale.x *= v[3]
		m.t = 0.6
	var ten := _label("Cọng Tóc Cuối", Vector2(700, 405), 108, INK, false)
	ten.add_theme_font_override("font", tay)
	var phu_de := _label("Chuyện đời thường kể đến cọng tóc cuối cùng.", Vector2(706, 580), 31, Color("5d6663"), false)
	phu_de.add_theme_font_override("font", tay)

# ---------- clip 1: đời Bạn trong 10 giây ----------

func _clip_setup() -> void:
	b = _nv("ban", 300, 930, 1.05)
	lbl_tien = _label("8.000.000đ", Vector2(1380, 60), 64, INK, false)
	lbl_moc = _label("Tháng 1", Vector2(960, 990), 40)


func _ss(a: float, e: float, x: float) -> float:
	var k := clampf((x - a) / (e - a), 0.0, 1.0)
	return k * k * (3.0 - 2.0 * k)


func _process(dt: float) -> void:
	frames += 1
	if mode in ["ban", "cast", "avatar", "banner"]:
		if frames == 3:
			_save()
		return
	t += dt
	if mode == "clip":
		_clip(t)
		if t >= 10.0:
			get_tree().quit()
	else:
		_clip2(t)
		if t >= 9.0:
			get_tree().quit()


func _save() -> void:
	await RenderingServer.frame_post_draw
	get_viewport().get_texture().get_image().save_png(out)
	get_tree().quit()


func _clip(x: float) -> void:
	b.t = x
	if x < 2.6:
		b.position.x = lerpf(300, 860, _ss(0.0, 2.2, x))
		b.set_pose("di", "dung", _ss(2.0, 2.5, x), x * TAU * 1.7)
		b.expr = "vui"
		b.talk = x > 0.6 and x < 1.8
	elif x < 4.4:
		b.talk = false
		b.set_pose("dung", "cam_dt", _ss(2.6, 2.95, x))
		b.expr = "binh" if x < 3.3 else "met"
		b.toc = _ss(3.4, 4.2, x)
		b.urgo = 1 if x > 3.6 else 0
	elif x < 6.2:
		b.set_pose("cam_dt", "guc", _ss(4.4, 4.8, x))
		b.expr = "buon"
		b.urgo = 2 if x > 5.2 else 1
	elif x < 8.2:
		b.set_pose("guc", "om_dau", _ss(6.2, 6.5, x))
		b.expr = "soc"
		b.urgo = 3 if x > 6.6 else 2
		b.toc_roi = _ss(6.8, 8.2, x) if x > 6.8 else -1.0
	else:
		b.set_pose("om_dau", "guc", _ss(8.2, 8.6, x))
		b.expr = "met"
		b.toc_roi = 1.0
	if x < 3.2:
		lbl_tien.text = "8.000.000đ"
	elif x < 6.6:
		lbl_tien.text = "1.240.000đ"
	else:
		lbl_tien.text = "−3.500.000đ"
	var flash := (x > 3.2 and x < 3.7) or x > 6.6
	lbl_tien.add_theme_color_override("font_color", LOSS if flash else INK)
	lbl_moc.text = "Tháng 1" if x < 4.4 else ("Tháng 6" if x < 6.2 else "Năm thứ 2")


# ---------- clip 2: ngày đóng tiền trọ ----------

func _clip2_setup() -> void:
	b = _nv("ban", 640, 930, 1.0)
	c = _nv("chu_tro", 1300, 930, 1.0)
	c.scale.x = -1.0
	lbl_tien = _label("Tiền trọ tháng này: 2.800.000đ", Vector2(60, 50), 48, INK, false)
	lbl_moc = _label("Ngày mùng 5", Vector2(960, 990), 40)


func _clip2(x: float) -> void:
	b.t = x
	c.t = x + 0.37
	if x < 3.0:
		c.set_pose("dung", "chong_nanh", _ss(0.0, 0.4, x))
		c.expr = "binh"
		c.talk = x > 0.4 and x < 2.6
		b.set_pose("dung", "gai_dau", _ss(0.6, 1.0, x))
		b.expr = "met"
		b.toc = _ss(1.0, 2.2, x) * 0.5
	elif x < 6.0:
		c.set_pose("chong_nanh", "khoanh_tay", _ss(3.0, 3.4, x))
		c.talk = false
		b.set_pose("gai_dau", "dem_tien", _ss(3.0, 3.4, x))
		b.expr = "buon"
		b.toc = 0.5 + _ss(3.6, 5.6, x) * 0.5
		b.urgo = 1 if x > 5.0 else 0
		lbl_tien.text = "Đếm đi đếm lại: 2.650.000đ"
		lbl_tien.add_theme_color_override("font_color", LOSS)
	else:
		c.set_pose("khoanh_tay", "dem_tien", _ss(6.0, 6.4, x))
		c.expr = "vui"
		b.set_pose("dem_tien", "guc", _ss(6.0, 6.5, x))
		b.expr = "met"
		lbl_tien.text = "Còn nợ chủ trọ 150.000đ"

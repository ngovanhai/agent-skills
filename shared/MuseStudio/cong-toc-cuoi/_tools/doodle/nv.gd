extends Node2D
## Nhân vật nét bút dạ của kênh Cọng Tóc Cuối ("Bạn" và mọi vai phụ).
## Luật: chỉ "Bạn" có màu áo; vai phụ đen trắng, mỗi vai một món đồ nhận diện; đầu vuông = người có quyền.
## Gốc toạ độ ở giữa hai bàn chân, cao ~540 px ở scale 1. Mọi hình tất định theo t.
## Dùng: var c = preload("res://nv.gd").new(); add_child(c); c.setup("chu_tro")
##       mỗi khung: c.t = t; c.expr = "met"; c.set_pose("dung", "guc", k)
## Lật hướng: c.scale.x = -1 (mặc định hướng sang phải).

const INK := Color("141414")
const PAPER := Color("ffffff")
const LID := Color("cfcfcf")
const URGO := Color("efc9a0")
const URGO_PAD := Color("d9a877")
const CASH := Color("7daf8c")
const BOX := Color("d7b184")
const STOOL := Color("3d8fd6")
const W := 5.0
const BOIL_FPS := 8.0     # nét "sôi": đổi hình rung 8 lần/giây
const JIT := 1.7
const HIP := Vector2(0, -138)
const NECK := Vector2(0, -318)
const L_ARM := 62.0
const L_LEG := 66.0
const HEAD_S := 0.95

# Góc theo thế giới: 0 = thẳng xuống, + = quay về phía x dương. [đoạn trên, cộng thêm cho đoạn dưới]
# Cờ: phone/cash/box = cầm đồ; mid = tay vẽ trước thân; front = tay vẽ trên cả đầu; gai/vay = tay cử động; ghe = ghế nhựa.
const POSES := {
	"dung":       {"aR": [0.28, -0.12], "aL": [-0.28, 0.12], "lR": [0.06, 0.0], "lL": [-0.06, 0.0]},
	"cam_dt":     {"aR": [0.30, -2.65], "aL": [-0.28, 0.12], "lR": [0.06, 0.0], "lL": [-0.06, 0.0], "tilt": 0.12, "phone": 1.0},
	"chi":        {"aR": [1.45, 0.10], "aL": [-0.28, 0.12], "lR": [0.07, 0.0], "lL": [-0.06, 0.0], "lean": -0.04, "tilt": -0.06},
	"guc":        {"aR": [0.06, 0.0], "aL": [-0.06, 0.0], "lR": [0.05, 0.1], "lL": [-0.05, -0.1], "tilt": 0.32, "bob": 12.0},
	"om_dau":     {"aR": [2.6, 0.9], "aL": [-2.6, -0.9], "lR": [0.09, 0.0], "lL": [-0.09, 0.0], "front": 1.0},
	"ngoi":       {"aR": [0.5, -1.1], "aL": [-0.5, 1.1], "lR": [1.3, -1.3], "lL": [-1.3, 1.3], "drop": 54.0, "ghe": 1.0, "mid": 1.0},
	"khoanh_tay": {"aR": [0.15, -1.82], "aL": [-0.15, 1.82], "lR": [0.08, 0.0], "lL": [-0.08, 0.0], "tilt": -0.05, "mid": 1.0},
	"chong_nanh": {"aR": [0.7, -1.3], "aL": [-0.7, 1.3], "lR": [0.12, 0.0], "lL": [-0.12, 0.0], "mid": 1.0},
	"gai_dau":    {"aR": [2.4, 0.9], "aL": [-0.28, 0.12], "lR": [0.06, 0.0], "lL": [-0.06, 0.0], "tilt": 0.1, "front": 1.0, "gai": 1.0},
	"vay_tay":    {"aR": [2.3, 0.5], "aL": [-0.28, 0.12], "lR": [0.06, 0.0], "lL": [-0.06, 0.0], "tilt": -0.06, "vay": 1.0},
	"om_thung":   {"aR": [0.35, -0.65], "aL": [-0.35, 0.65], "lR": [0.1, 0.0], "lL": [-0.1, 0.0], "bob": 4.0, "box": 1.0, "mid": 1.0},
	"ngoi_bet":   {"aR": [0.5, -1.1], "aL": [-0.5, 1.1], "lR": [1.3, -1.3], "lL": [-1.3, 1.3], "drop": 54.0, "mid": 1.0},
	"quy":        {"aR": [1.35, -0.25], "aL": [-0.28, 0.12], "lR": [1.45, -1.45], "lL": [-0.15, -1.3], "drop": 58.0, "tilt": -0.04},
	"dem_tien":   {"aR": [0.30, -2.55], "aL": [-0.30, 2.55], "lR": [0.06, 0.0], "lL": [-0.06, 0.0], "tilt": 0.14, "cash": 1.0, "mid": 1.0},
}
const FLAGS := ["lean", "tilt", "bob", "drop", "phone", "front", "mid", "ghe", "gai", "vay", "box", "cash"]

var t := 0.0
var look := {}                 # từ cast.json
var expr := "binh"             # binh | vui | met | buon | soc
var talk := false              # nhép miệng
var toc := 0.0                 # cọng tóc (chỉ hair "strand"): 0 dựng … 1 gục
var toc_roi := -1.0            # < 0 còn trên đầu; 0..1 đang rơi; 1 nằm dưới đất; > 1.5 mất hẳn (cảnh sau, không vẽ tóc dưới sàn)
var toc_san := -6.0            # y (toạ độ vai) chỗ cọng tóc rơi xuống: mặc định sàn; sau mâm/bàn thì đặt bằng mặt bàn
var urgo := 0                  # 0..3
var phone_col := INK
var _p: Dictionary = POSES["dung"]
var _root_w := Vector2.ZERO


func _init() -> void:
	setup("ban")


func setup(id: String) -> void:
	var f := FileAccess.open("res://cast.json", FileAccess.READ)
	var all: Dictionary = JSON.parse_string(f.get_as_text()) if f else {}
	look = all.get(id, {})
	queue_redraw()


func _lk(k: String, d = null):
	return look.get(k, d)


func set_pose(a: String, b := "", k := 0.0, walk_ph := 0.0) -> void:
	var pa := _pose(a, walk_ph)
	_p = pa if b == "" else _mix(pa, _pose(b, walk_ph), clampf(k, 0.0, 1.0))
	queue_redraw()


func _pose(n: String, ph: float) -> Dictionary:
	var s := sin(ph)
	if n == "di":
		return {"aR": [0.28 - 0.25 * s, -0.12], "aL": [-0.28 - 0.25 * s, 0.12],
			"lR": [0.06 + 0.32 * s, 0.0], "lL": [-0.06 + 0.32 * s, 0.0], "bob": 6.0 * absf(s)}
	if n == "chay":
		return {"aR": [0.5 - 0.6 * s, -1.0], "aL": [-0.5 - 0.6 * s, 1.0],
			"lR": [0.1 + 0.5 * s, -0.5 * maxf(0.0, -s)], "lL": [-0.1 + 0.5 * s, 0.5 * maxf(0.0, s)],
			"bob": 10.0 * absf(s), "lean": -0.12}
	return POSES[n]


func _mix(a: Dictionary, b: Dictionary, k: float) -> Dictionary:
	var o := {}
	for key in ["aR", "aL", "lR", "lL"]:
		o[key] = [lerpf(a[key][0], b[key][0], k), lerpf(a[key][1], b[key][1], k)]
	for key in FLAGS:
		o[key] = lerpf(a.get(key, 0.0), b.get(key, 0.0), k)
	return o


func _process(_dt: float) -> void:
	queue_redraw()


# ---------- nét ----------

func _h(i: int, k: int, sid: int) -> float:
	var x := sin(float(i) * 12.9898 + float(k) * 78.233 + float(sid) * 37.719) * 43758.5453
	return (x - floorf(x)) * 2.0 - 1.0


func _jit(pts: PackedVector2Array, sid: int) -> PackedVector2Array:
	var k := int(floorf(t * BOIL_FPS))
	var q := PackedVector2Array()
	for i in pts.size():
		q.append(pts[i] + Vector2(_h(i, k, sid), _h(i + 57, k, sid)) * JIT)
	return q


func _line(pts: PackedVector2Array, sid: int, w := W, col := INK) -> void:
	var q := _jit(pts, sid)
	draw_polyline(q, col, w, true)
	draw_circle(q[0], w * 0.5, col)
	draw_circle(q[q.size() - 1], w * 0.5, col)


func _shape(pts: PackedVector2Array, fill: Color, sid: int, w := W) -> void:
	var q := _jit(pts, sid)
	if Geometry2D.triangulate_polygon(q).is_empty():
		q = Geometry2D.convex_hull(q)
		q.remove_at(q.size() - 1)
	draw_colored_polygon(q, fill)
	if w <= 0.0:
		return
	var c := q.duplicate()
	c.append(q[0])
	draw_polyline(c, INK, w, true)


func _quad(a: Vector2, c: Vector2, b: Vector2, n := 10) -> PackedVector2Array:
	var o := PackedVector2Array()
	for i in n + 1:
		var u := float(i) / n
		o.append(a.lerp(c, u).lerp(c.lerp(b, u), u))
	return o


func _cub(a: Vector2, b: Vector2, c: Vector2, d: Vector2, n := 10) -> PackedVector2Array:
	var o := PackedVector2Array()
	for i in n + 1:
		var u := float(i) / n
		var v := 1.0 - u
		o.append(a * v * v * v + b * 3.0 * v * v * u + c * 3.0 * v * u * u + d * u * u * u)
	return o


func _ell(c: Vector2, rx: float, ry: float, n := 24) -> PackedVector2Array:
	var o := PackedVector2Array()
	for i in n:
		var a := TAU * i / n
		o.append(c + Vector2(cos(a) * rx, sin(a) * ry))
	return o


func _join(parts: Array) -> PackedVector2Array:
	var o := PackedVector2Array()
	for p in parts:
		for v in p:
			if o.is_empty() or o[o.size() - 1].distance_to(v) > 0.01:
				o.append(v)
	return o


func _bend(a: Vector2, mid: Vector2, b: Vector2, sid: int) -> void:
	_line(_quad(a, mid * 2.0 - (a + b) * 0.5, b, 12), sid)


func _dir(a: float) -> Vector2:
	return Vector2(sin(a), cos(a))


func _rect(c: Vector2, w: float, h: float, ang: float) -> PackedVector2Array:
	var o := PackedVector2Array()
	for v in [Vector2(-w, -h), Vector2(w, -h), Vector2(w, h), Vector2(-w, h)]:
		o.append(c + (v * 0.5).rotated(ang))
	return o


func _capsule(c: Vector2, w: float, h: float, ang: float) -> PackedVector2Array:
	var o := PackedVector2Array()
	var r := h * 0.5
	var hx := w * 0.5 - r
	for i in 9:
		var a := -PI * 0.5 + PI * i / 8.0
		o.append(c + (Vector2(hx, 0) + Vector2(cos(a), sin(a)) * r).rotated(ang))
	for i in 9:
		var a := PI * 0.5 + PI * i / 8.0
		o.append(c + (Vector2(-hx, 0) + Vector2(cos(a), sin(a)) * r).rotated(ang))
	return o


func _pts(a: Array) -> PackedVector2Array:
	var o := PackedVector2Array()
	for v in a:
		o.append(Vector2(v[0], v[1]))
	return o


# ---------- hình cố định ----------

var HEADS := {
	"round": _join([
		_cub(Vector2(-78, 2), Vector2(-80, -46), Vector2(-44, -80), Vector2(2, -78)),
		_cub(Vector2(2, -78), Vector2(48, -80), Vector2(80, -42), Vector2(78, 4)),
		_cub(Vector2(78, 4), Vector2(80, 48), Vector2(44, 80), Vector2(-4, 78)),
		_cub(Vector2(-4, 78), Vector2(-48, 79), Vector2(-79, 44), Vector2(-78, 2))]),
	"square": _join([
		_quad(Vector2(-80, -66), Vector2(-80, -76), Vector2(-70, -76), 4), [Vector2(72, -78)],
		_quad(Vector2(72, -78), Vector2(82, -78), Vector2(82, -68), 4), [Vector2(84, 58)],
		_quad(Vector2(84, 58), Vector2(84, 68), Vector2(74, 68), 4), [Vector2(-72, 70)],
		_quad(Vector2(-72, 70), Vector2(-80, 70), Vector2(-80, 60), 4),
		[Vector2(-80, 30), Vector2(-80, 0), Vector2(-80, -30)]]),
	"bean": _join([
		_cub(Vector2(-62, -6), Vector2(-68, -96), Vector2(68, -104), Vector2(62, -6)),
		_cub(Vector2(62, -6), Vector2(60, 52), Vector2(40, 90), Vector2(0, 90)),
		_cub(Vector2(0, 90), Vector2(-40, 90), Vector2(-60, 52), Vector2(-62, -6))]),
}
var TORSO := _join([
	_cub(Vector2(-50, -306), Vector2(-62, -238), Vector2(-54, -148), Vector2(-32, -128)),
	[Vector2(32, -128)],
	_cub(Vector2(32, -128), Vector2(54, -148), Vector2(62, -238), Vector2(50, -306)),
	_cub(Vector2(50, -306), Vector2(30, -322), Vector2(-30, -322), Vector2(-50, -306))])
var CAP := _join([
	_quad(Vector2(-78, -10), Vector2(-80, -80), Vector2(0, -80)),
	_quad(Vector2(0, -80), Vector2(80, -80), Vector2(78, -10)),
	_quad(Vector2(78, -10), Vector2(60, -50), Vector2(0, -52)),
	_quad(Vector2(0, -52), Vector2(-60, -50), Vector2(-78, -10))])


# ---------- vẽ ----------

func _draw() -> void:
	var p := _p.duplicate(true)
	var bob: float = p.get("bob", 0.0)
	var drop: float = p.get("drop", 0.0)
	var lean: float = p.get("lean", 0.0)
	var tilt: float = p.get("tilt", 0.0)
	var front: bool = p.get("front", 0.0) > 0.5
	var mid: bool = p.get("mid", 0.0) > 0.5
	var phone: bool = p.get("phone", 0.0) > 0.5
	if p.get("gai", 0.0) > 0.5:
		p["aR"][1] += sin(t * 14.0) * 0.18
	if p.get("vay", 0.0) > 0.5:
		p["aR"][1] += sin(t * 9.0) * 0.45
	var hip0 := HIP + Vector2(0, drop)
	var up := func(v: Vector2) -> Vector2: return (v - HIP).rotated(-lean) + hip0 + Vector2(0, bob)

	if p.get("ghe", 0.0) > 0.5:
		_stool(hip0)

	# chân + giày/dép
	for sd in ["L", "R"]:
		var s := 1.0 if sd == "R" else -1.0
		var a: Array = p["l" + sd]
		var hip := hip0 + Vector2(18 * s, 0)
		var knee := hip + _dir(a[0]) * L_LEG
		var foot := knee + _dir(a[0] + a[1]) * L_LEG
		_bend(hip, knee, foot, 10 if sd == "R" else 11)
		_feet(foot, s)
	if _lk("quan_dui", false):
		var qd := _pts([[-46, -152], [46, -152], [48, -98], [8, -98], [0, -124], [-8, -98], [-48, -98]])
		for i in qd.size():
			qd[i] += Vector2(0, drop)
		_shape(qd, PAPER, 14)

	if not front and not mid:
		_arms(p, up, lean, ["L"] if phone else ["L", "R"])

	_torso(up)

	if mid or (phone and not front):
		_arms(p, up, lean, ["L", "R"] if mid else ["R"])

	# đầu
	var ang := -lean + tilt
	var neck: Vector2 = up.call(NECK)
	var hc := neck + Vector2(0, -78).rotated(ang)
	_root_w = hc + (Vector2(0, -78) * HEAD_S).rotated(ang)
	draw_set_transform(hc, ang, Vector2(HEAD_S, HEAD_S))
	_head()
	draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)

	if front:
		_arms(p, up, lean)
	_fallen()


func _feet(foot: Vector2, s: float) -> void:
	if _lk("feet", "giay") == "dep":
		var c := foot + Vector2(10 * s, 6)
		var col := Color(_lk("dep", "ffffff"))
		_shape(_capsule(c + Vector2(0, 4), 60, 14, 0.0), col, 16 if s > 0 else 17, 3.0)
		_shape(_ell(c + Vector2(0, -2), 18, 8, 16), PAPER, 18 if s > 0 else 19, 4.0)
		var strap := _quad(c + Vector2(-18, 2), c + Vector2(0, -16), c + Vector2(18, 2), 8)
		draw_polyline(_jit(strap, 15), col, 9.0, true)
		_line(strap, 15, 3.0)
	else:
		_shape(_ell(foot + Vector2(10 * s, 6), 22, 10, 18), INK, 12 if s > 0 else 13)


func _stool(hip: Vector2) -> void:
	var y := hip.y + 6
	_shape(_pts([[-56, y + 12], [56, y + 12], [70, -2], [-70, -2]]), STOOL, 90, 4.0)
	_shape(_capsule(Vector2(0, y + 6), 140, 18, 0.0), STOOL, 91, 4.0)


func _torso(up: Callable) -> void:
	var tf := func(a: Array) -> PackedVector2Array:
		var o := PackedVector2Array()
		for v in a:
			o.append(up.call(Vector2(v[0], v[1])))
		return o
	var tp := PackedVector2Array()
	for v in TORSO:
		tp.append(up.call(v))
	_shape(tp, Color(_lk("ao", "ffffff")), 20)
	if _lk("dots", false):
		for d in [[-24, -270], [18, -250], [-14, -210], [28, -190], [-30, -170], [6, -160], [-2, -290]]:
			draw_circle(up.call(Vector2(d[0], d[1])), 6, INK)
	match _lk("clothes", "shirt"):
		"shirt":
			_line(tf.call([[-20, -312], [0, -290], [20, -312]]), 21, 4.0)
		"tank":
			_line(_quad(up.call(Vector2(-26, -314)), up.call(Vector2(0, -276)), up.call(Vector2(26, -314))), 21, 4.0)
			_line(_quad(up.call(Vector2(-50, -300)), up.call(Vector2(-36, -280)), up.call(Vector2(-40, -258))), 23, 3.0)
			_line(_quad(up.call(Vector2(50, -300)), up.call(Vector2(36, -280)), up.call(Vector2(40, -258))), 24, 3.0)
		"tie":
			_line(tf.call([[-20, -312], [0, -290], [20, -312]]), 21, 4.0)
			_shape(tf.call([[-7, -292], [7, -292], [11, -196], [0, -182], [-11, -196]]), INK, 25, 3.0)
		"baba":
			_line(_quad(up.call(Vector2(-14, -314)), up.call(Vector2(0, -300)), up.call(Vector2(14, -314))), 21, 4.0)
			for d in [[8, -286], [14, -246], [18, -206]]:
				draw_circle(up.call(Vector2(d[0], d[1])), 5, INK)
		"vest":
			_line(tf.call([[-30, -316], [-10, -200]]), 21, 4.0)
			_line(tf.call([[30, -316], [10, -200]]), 26, 4.0)
			for q in _quad(Vector2(-26, -306), Vector2(0, -246), Vector2(26, -306), 12):
				draw_circle(up.call(q), 3.5, INK)
	if _lk("tag", false):
		_shape(tf.call([[6, -268], [36, -268], [36, -252], [6, -252]]), PAPER, 22, 3.0)
	if _lk("skirt", false):
		_shape(tf.call([[-44, -150], [44, -150], [64, -92], [-64, -92]]), PAPER, 27)
	if _lk("beltbag", false):
		_line(tf.call([[-52, -168], [52, -152]]), 28, 4.0)
		var bc: Vector2 = up.call(Vector2(0, -156))
		_shape(_ell(bc, 38, 20, 20), PAPER, 29)
		_line(PackedVector2Array([bc + Vector2(-26, -2), bc + Vector2(26, -2)]), 29, 3.0)


func _arms(p: Dictionary, up: Callable, lean: float, sides := ["L", "R"]) -> void:
	var hands := {}
	for sd in ["L", "R"]:
		var s := 1.0 if sd == "R" else -1.0
		var a: Array = p["a" + sd]
		var sh: Vector2 = up.call(Vector2(48 * s, -278))
		var el := sh + _dir(a[0] + lean) * L_ARM
		hands[sd] = [sh, el, el + _dir(a[0] + a[1] + lean) * L_ARM]
	if p.get("box", 0.0) > 0.5 and "R" in sides:
		var c: Vector2 = (hands["L"][2] + hands["R"][2]) * 0.5 + Vector2(0, -40)
		_shape(_rect(c, 130, 92, 0.0), BOX, 36)
		_line(PackedVector2Array([c + Vector2(-65, -22), c + Vector2(65, -22)]), 37, 3.0)
	if p.get("cash", 0.0) > 0.5 and "R" in sides:
		var c: Vector2 = (hands["L"][2] + hands["R"][2]) * 0.5 + Vector2(0, -8)
		_shape(_rect(c, 58, 30, 0.08), CASH, 38, 3.0)
		_shape(_rect(c + Vector2(6, -6), 58, 30, -0.15 + sin(t * 10.0) * 0.25), CASH, 39, 3.0)
	for sd in sides:
		var hd: Array = hands[sd]
		_bend(hd[0], hd[1], hd[2], 30 if sd == "R" else 31)
		if sd == "R" and p.get("phone", 0.0) > 0.5:
			_shape(_rect(hd[2] + Vector2(-8, -18), 30, 52, -0.2), phone_col, 33, 4.0)
		_shape(_ell(hd[2], 12, 12, 16), PAPER, 34 if sd == "R" else 35)


func _head() -> void:
	var hair: String = _lk("hair", "spiky")
	if hair == "bun":
		_shape(_ell(Vector2(0, -96), 26, 26, 18), INK, 42)
	if hair == "dai":
		_shape(_join([_quad(Vector2(-84, -10), Vector2(-98, 60), Vector2(-72, 104)), [Vector2(72, 104)],
			_quad(Vector2(72, 104), Vector2(98, 60), Vector2(84, -10))]), INK, 42)
	_shape(HEADS.get(_lk("shape", "round"), HEADS["round"]), PAPER, 40)
	_hair(hair)
	if _lk("no", false):
		# nơ kẹp tóc cạnh cọng tóc (Bạn nữ): vẫn giữ nguyên cọng tóc tâm trạng
		var nc := Vector2(-34, -84)
		_shape(PackedVector2Array([nc, nc + Vector2(-26, -16), nc + Vector2(-26, 16)]), Color("f08aa6"), 46, 4.0)
		_shape(PackedVector2Array([nc, nc + Vector2(26, 16), nc + Vector2(26, -16)]), Color("f08aa6"), 47, 4.0)
		_shape(_ell(nc, 8, 8, 10), Color("f08aa6"), 48, 3.0)
	_face()
	var spots := [[Vector2(-34, -50), -0.38], [Vector2(34, -56), 0.45], [Vector2(52, 34), -0.6]]
	for i in clampi(urgo, 0, 3):
		var c: Vector2 = spots[i][0]
		var a: float = spots[i][1]
		_shape(_capsule(c, 52, 20, a), URGO, 50 + i, 3.0)
		draw_colored_polygon(_rect(c, 16, 14, a), URGO_PAD)


func _hair(hair: String) -> void:
	match hair:
		"strand":
			if toc_roi < 0.0:
				var sw := sin(t * 2.3) * 4.0 * (1.0 - toc)
				var up_pts := _quad(Vector2(0, -78), Vector2(-12, -118), Vector2(6 + sw, -152), 16)
				var dn_pts := _join([_quad(Vector2(0, -78), Vector2(2, -110), Vector2(28, -114), 8),
					_quad(Vector2(28, -114), Vector2(46, -114), Vector2(46, -96), 8)])
				var st := PackedVector2Array()
				for i in up_pts.size():
					st.append(up_pts[i].lerp(dn_pts[mini(i, dn_pts.size() - 1)], toc))
				_line(st, 41, 6.0)
			else:
				_line(PackedVector2Array([Vector2(1, -79), Vector2(2, -86)]), 41, 6.0)
		"spiky":
			_shape(_join([_pts([[-62, -40], [-54, -70], [-36, -56], [-24, -86], [-4, -62], [14, -88], [28, -62], [50, -76], [58, -44]]),
				_quad(Vector2(58, -44), Vector2(0, -60), Vector2(-62, -40))]), INK, 43)
		"bun", "dai":
			_shape(CAP, INK, 43)
		"curlers":
			_shape(CAP, INK, 43)
			var cs := [[-50, -74, -20], [-16, -88, -6], [20, -88, 8], [52, -70, 22]]
			for i in cs.size():
				_shape(_capsule(Vector2(cs[i][0], cs[i][1]), 30, 22, deg_to_rad(cs[i][2] + 90)), PAPER, 44 + i, 4.0)
		"bald":
			_line(_quad(Vector2(-38, -58), Vector2(-20, -70), Vector2(2, -68)), 43, 3.0)
			for i in 4:
				var s := -1.0 if i < 2 else 1.0
				var y := -8.0 if i % 2 == 0 else 6.0
				_line(PackedVector2Array([Vector2(76 * s, y), Vector2(88 * s, y - (6 if y < 0 else 2))]), 44 + i, 3.0)
		"capback":
			_shape(_join([_quad(Vector2(-80, -18), Vector2(-80, -98), Vector2(0, -98)), _quad(Vector2(0, -98), Vector2(80, -98), Vector2(80, -18))]), PAPER, 43)
			_shape(_pts([[-80, -30], [-130, -18], [-122, -2], [-80, -14]]), PAPER, 44)
			draw_circle(Vector2(0, -98), 6, INK)
		"flat":
			_shape(_join([_pts([[-82, -30], [-80, -86], [82, -88], [84, -30]]),
				_quad(Vector2(84, -30), Vector2(40, -62), Vector2(-10, -58)), _quad(Vector2(-10, -58), Vector2(-50, -56), Vector2(-82, -30))]), INK, 43)
			draw_line(Vector2(-30, -84), Vector2(-36, -62), PAPER, 4.0)
		"tuft":
			for i in 3:
				var x := -12.0 + 12.0 * i
				_line(PackedVector2Array([Vector2(x, -98), Vector2(x * 1.5, -122)]), 43 + i)


func _eye(c: Vector2, r: float, sid: int) -> void:
	_shape(_ell(c, r, r, 20), PAPER, sid)


func _face() -> void:
	var talking := talk and int(floorf(t * 7.0)) % 2 == 0
	if _lk("sun", false):
		for s in [-1.0, 1.0]:
			var cx: float = 28.0 * s
			_shape(_join([[Vector2(cx - 22, -20), Vector2(cx + 22, -20)],
				_quad(Vector2(cx + 22, 2), Vector2(cx + 22, 14), Vector2(cx + 10, 14), 4),
				_quad(Vector2(cx - 10, 14), Vector2(cx - 22, 14), Vector2(cx - 22, 2), 4)]), INK, 60 if s < 0 else 61, 3.0)
		_line(PackedVector2Array([Vector2(-6, -16), Vector2(6, -16)]), 62, 4.0)
	else:
		_eyes_brows()
	if _lk("ria", false):
		_shape(_join([_quad(Vector2(-28, 26), Vector2(-12, 12), Vector2(0, 20), 6), _quad(Vector2(0, 20), Vector2(12, 12), Vector2(28, 26), 6),
			_quad(Vector2(28, 26), Vector2(0, 30), Vector2(-28, 26), 6)]), INK, 71, 3.0)
	# miệng
	if expr == "soc" and not _lk("sun", false):
		_shape(_join([_quad(Vector2(-16, 30), Vector2(0, 22), Vector2(16, 30)), _quad(Vector2(16, 30), Vector2(14, 60), Vector2(0, 60)), _quad(Vector2(0, 60), Vector2(-14, 60), Vector2(-16, 30))]), INK, 70)
	elif talking:
		_shape(_ell(Vector2(0, 40), 11, 9, 14), INK, 70)
	elif expr == "vui":
		_shape(_join([_quad(Vector2(-20, 32), Vector2(0, 36), Vector2(20, 32)), _quad(Vector2(20, 32), Vector2(0, 62), Vector2(-20, 32))]), INK, 70)
	elif expr == "met":
		_line(_join([_quad(Vector2(-16, 42), Vector2(-8, 36), Vector2(0, 42)), _quad(Vector2(0, 42), Vector2(8, 48), Vector2(16, 42))]), 70)
	elif expr == "buon":
		_line(_quad(Vector2(-14, 44), Vector2(0, 34), Vector2(14, 44)), 70)
	elif _lk("sun", false):
		_line(_quad(Vector2(-14, 38), Vector2(4, 44), Vector2(18, 32)), 70)
	else:
		_line(_quad(Vector2(-14, 38), Vector2(0, 42), Vector2(14, 36)), 70)
	if _lk("glasses", false):
		for s in [-1.0, 1.0]:
			var r := _rect(Vector2(26 * s, -4), 40, 36, 0.0)
			r.append(r[0])
			_line(r, 72 if s < 0 else 73, 4.0)
		_line(PackedVector2Array([Vector2(-6, -8), Vector2(6, -8)]), 74, 4.0)


func _eyes_brows() -> void:
	match expr:
		"soc":
			_eye(Vector2(-28, -6), 18, 60); _eye(Vector2(28, -6), 18, 61)
			draw_circle(Vector2(-28, -6), 3, INK); draw_circle(Vector2(28, -6), 3, INK)
			_line(_quad(Vector2(-46, -36), Vector2(-30, -46), Vector2(-12, -38)), 62)
			_line(_quad(Vector2(12, -38), Vector2(30, -46), Vector2(46, -36)), 63)
			for i in 4:
				var s := -1.0 if i < 2 else 1.0
				var y := -40.0 if i % 2 == 0 else 0.0
				_line(PackedVector2Array([Vector2(98 * s, y), Vector2((114 if y < 0 else 120) * s, y - (12 if y < 0 else 0))]), 65 + i)
		"met":
			_eye(Vector2(-26, -4), 14, 60); _eye(Vector2(26, -4), 14, 61)
			for s in [-1.0, 1.0]:
				var lid := PackedVector2Array()
				for i in 13:
					var a := PI + PI * i / 12.0
					lid.append(Vector2(26 * s, -4) + Vector2(cos(a), sin(a)) * 14)
				_shape(lid, LID, 62 if s < 0 else 63)
				draw_circle(Vector2(26 * s, 4), 4, INK)
				_line(_quad(Vector2(14 * s, 18), Vector2(26 * s, 24), Vector2(38 * s, 18)), 64 if s < 0 else 65)
			_line(PackedVector2Array([Vector2(-40, -22), Vector2(-16, -30)]), 66)
			_line(PackedVector2Array([Vector2(16, -30), Vector2(40, -22)]), 67)
		"buon":
			_eye(Vector2(-26, -2), 13, 60); _eye(Vector2(26, -2), 13, 61)
			draw_circle(Vector2(-25, 3), 5, INK); draw_circle(Vector2(27, 3), 5, INK)
			_line(PackedVector2Array([Vector2(-40, -20), Vector2(-16, -30)]), 66)
			_line(PackedVector2Array([Vector2(16, -30), Vector2(40, -20)]), 67)
		_:
			_eye(Vector2(-26, -4), 14, 60); _eye(Vector2(26, -4), 14, 61)
			draw_circle(Vector2(-24, -2), 5, INK); draw_circle(Vector2(28, -2), 5, INK)
			var by := -32.0 if expr == "vui" else -28.0
			_line(PackedVector2Array([Vector2(-40, by), Vector2(-14, by + 2)]), 66)
			_line(PackedVector2Array([Vector2(14, by + 2), Vector2(40, by)]), 67)


func _fallen() -> void:
	if toc_roi < 0.0 or toc_roi > 1.5 or _lk("hair", "") != "strand":
		return
	var k := clampf(toc_roi, 0.0, 1.0)
	var e := k * k * (3.0 - 2.0 * k)
	var start := _root_w + Vector2(4, -36)
	var end := Vector2(_root_w.x + 110, toc_san)
	var pos := start.lerp(end, e) + Vector2(sin(k * 9.0) * 24.0 * (1.0 - k), 0)
	var rot := e * 1.45 + sin(k * 7.0) * 0.4 * (1.0 - k)
	draw_set_transform(pos, rot, Vector2.ONE)
	_line(_quad(Vector2(0, 22), Vector2(-8, 0), Vector2(4, -24), 10), 80, 6.0)
	draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)

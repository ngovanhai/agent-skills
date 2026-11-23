extends "res://engine.gd"
# NGẠO KHẨU ĐOẠT TRƯỢNG: Hoàng Dung đoạt lại gậy trúc từ tay Dương Khang trên đài Quân Sơn.
# Cơ chế: ba lần siết cổ tay làm gậy xoay trong tay địch, lần thứ ba gậy bật khỏi lòng bàn tay, bay theo cung và rơi gọn vào tay nàng.
# Không có tia chưởng, không có đối thủ bị đánh bay xa: chỉ có bàn tay, cổ tay, và một khúc trúc đổi chủ.

const COL := Color(0.75, 1.45, 0.62)
const HOT := Color(1.9, 2.3, 1.15)
const FOE_COL := Color(0.95, 0.72, 1.35)
const BEATS := [2.7, 3.7, 4.7]
const PEAK := 6.0

var beat_i := 0
var hit := false
var x_hit := 0.0
var staff_pos := Vector2.ZERO
var staff_ang := -PI * 0.5
var staff_vis := true
var grip := Vector2.ZERO
var trail: Array = []


func _setup() -> void:
	sky_cols = [Color("#050d0f"), Color("#0d2426"), Color("#1d3a34")]
	far_col = Color("#14302e")
	near_col = Color("#0b1d1d")
	ground_cols = [Color("#233a34"), Color("#0a1513"), Color("#567a66")]
	mist_col = Color(0.6, 0.85, 0.72, 0.16)
	moon = Vector2(1510, 205)
	moon_col = Color(1.15, 1.3, 1.12)
	moon_glow = Color(0.7, 0.95, 0.72, 0.22)
	slowmo = [PEAK - 0.12, PEAK + 0.62, 0.32]
	title = "GẬY TRÚC ĐỔI CHỦ"
	subtitle = "ba lần đoạt gậy trúc trên đài Quân Sơn"
	title_at = 8.35
	title_col = HOT
	set_char(hero, "hoang-dung")
	set_char(foe, "duong-khang")
	hero.col = COL
	foe.col = FOE_COL
	hero.base = "stance"
	foe.base = "stance"
	cue(0.9, "lib-riser", 0.6)
	cue(PEAK - 0.35, "lib-whoosh-cinematic", 0.85)


func _story(dt: float) -> void:
	# ---- người đoạt gậy
	hero.gather = smooth(1.0, 1.9, t) * (1.0 - smooth(2.3, 2.7, t))
	var bp := 0.0
	for b in BEATS:
		bp = maxf(bp, pulse(b - 0.18, b + 0.16, 0.3, t))
	hero.push = bp * 0.55
	hero.extra = [["point", smooth(1.5, 2.2, t) * (1.0 - smooth(PEAK + 0.4, 8.0, t))]]
	hero.lean = bp * 0.18
	hero.aura = smooth(1.0, 1.9, t) * 0.35 + bp * 0.25 - smooth(7.2, 9.5, t) * 0.5
	hero.expr = "dac-y" if t > 7.2 else ("quyet-tam" if t > 1.2 else "binh")

	# ---- kẻ giữ gậy
	foe.gather = smooth(0.6, 1.4, t) * (1.0 - smooth(2.4, 2.8, t)) * 0.4
	foe.extra = [["guard", smooth(1.8, 2.4, t) * (1.0 - smooth(PEAK, 7.4, t))]]
	foe.expr = "ko" if t > PEAK + 0.2 else ("soc" if t > 2.5 else "gian")
	pose(hero, 0.0)
	pose(foe, 0.0)

	# ---- vị trí gậy: trước đỉnh nằm trong tay địch, mỗi nhịp xoay và trượt
	if not hit:
		var turn := 0.0
		var slip := 0.0
		for b in BEATS:
			var k := smooth(b - 0.05, b + 0.2, t)
			turn += k * 0.5
			slip += k * 14.0
		grip = foe.hand + Vector2(18 - slip, -6)
		staff_ang = -PI * 0.5 + 0.18 + turn
		staff_pos = grip
		if t > PEAK - 0.05:
			# gậy rời tay: bay theo cung sang tay Hoàng Dung
			var k := clampf((t - (PEAK - 0.05)) / 0.5, 0.0, 1.0)
			var a: Vector2 = grip
			var b: Vector2 = hero.hand + Vector2(0, -14)
			var c: Vector2 = (a + b) * 0.5 + Vector2(0, -240)
			staff_pos = a.lerp(c, k).lerp(c.lerp(b, k), k)
			staff_ang = -PI * 0.5 + 0.18 + turn + ease_out(k) * TAU * 1.65
			if k >= 1.0:
				hit = true
				x_hit = foe.pos.x
	else:
		# gậy đã về tay nàng: xoay nhẹ, rung theo nhịp thở
		grip = hero.hand + Vector2(6, -14)
		staff_pos = grip
		staff_ang = -PI * 0.5 + 0.08 + sin(t * 2.2) * 0.09 + smooth(PEAK, PEAK + 0.8, t) * 0.18

	# ---- nhịp siết cổ tay
	if beat_i < BEATS.size() and t >= BEATS[beat_i]:
		var at: Vector2 = foe.hand + Vector2(-8, -18)
		add_ring(at, 150, HOT, 5, 0.28)
		burst(at, 16, 120, 520, HOT, COL, 420.0, 0.75, -PI * 0.9, PI * 0.2)
		shake = maxf(shake, 9.0)
		sfx("lib-whoosh-short", 0.5)
		sfx("lib-impact-bass-2", 0.35)
		foe.pos.x += 9.0
		beat_i += 1

	# ---- đỉnh: gậy đổi chủ
	if t >= PEAK and not foe.has("caught"):
		foe.caught = true
		foe.expr = "ko"
		flash = 0.55
		flash_col = Color(0.85, 1.0, 0.75)
		shake = 26.0
		var at: Vector2 = hero.hand + Vector2(0, -20)
		add_ring(at, 440, HOT, 12, 0.55)
		add_ring(Vector2(at.x, GROUND), 520, COL, 8, 0.75, 0.2)
		burst(at, 80, 240, 1100, HOT, COL, 700.0, 1.0)
		sfx("lib-impact-bass-1", 0.9)
		sfx("lib-impact-bass-2", 0.9)

	if hit:
		var k := clampf((t - PEAK) / 0.85, 0.0, 1.0)
		foe.pos = Vector2(lerpf(x_hit, 1470.0, ease_out(k)), GROUND - sin(k * PI) * 70.0)
		foe.rot = ease_out(k) * PI * 0.34
		foe.hurt = 1.0 if k < 0.9 else 0.0
		foe.aura = 0.0
		if k > 0.9:
			foe.base = "kneel"
			foe.extra = []
			foe.rot = 0.0
		if k >= 1.0 and not foe.has("landed"):
			foe.landed = true
			shake = maxf(shake, 10.0)
			sfx("lib-impact-bass-2", 0.45)
			for i in 14:
				emit("smoke", Vector2(1470 + rng.randf_range(-30, 150), GROUND), Vector2(rng.randf_range(-120, 160), -rng.randf_range(20, 110)), 1.8, rng.randf_range(30, 70), Color(0.45, 0.55, 0.5, 0.35))

	# vệt gậy khi bay
	if not hit and t > PEAK - 0.05 and t < PEAK + 0.55:
		trail.append(staff_pos)
		if trail.size() > 14:
			trail.pop_front()
	elif trail.size() > 0:
		trail.clear()

	if hero.gather > 0.05:
		orbit(hero, rng.randf_range(120, 230), rng.randf_range(2.2, 3.2), 200, rng.randf_range(2, 5), HOT, 2.0)


func _draw_staff(c: Node2D, p: Vector2, ang: float, length: float, col: Color, core: float, w: float) -> void:
	var d := Vector2(cos(ang), sin(ang))
	var a := p - d * length * 0.34
	var b := p + d * length * 0.66
	c.draw_line(a, b, Color(col.r, col.g, col.b, 0.22), w + 9.0, true)
	c.draw_line(a, b, col, w, true)
	c.draw_line(a, b, Color(minf(1.6, col.r * 1.35), minf(1.6, col.g * 1.35), minf(1.6, col.b * 1.35), core), maxf(2.0, w * 0.32), true)
	# đốt trúc
	var n := 9
	for i in range(1, n):
		var q := a.lerp(b, float(i) / float(n))
		var nv := d.orthogonal() * (w * 0.55 + 1.0)
		c.draw_line(q - nv, q + nv, Color(0.12, 0.24, 0.16, 0.85), 2.2, true)


func _fx_norm(c: Node2D) -> void:
	# thân gậy trúc
	if staff_vis:
		var glow := 1.0 if t < PEAK else 0.75
		_draw_staff(c, staff_pos, staff_ang, 430.0, Color(0.55, 1.05, 0.5, glow), 0.9, 12.0)
		# bàn tay địch mở dần sau nhịp hai
		if not hit and t > BEATS[1]:
			var at: Vector2 = foe.hand + Vector2(-6, -12)
			for i in 5:
				var r := 10.0 + i * 5.0
				c.draw_arc(at, r, -PI * 0.9, PI * 0.4, 16, Color(1.4, 1.1, 0.8, 0.25), 2.0, true)


func _fx_add(c: Node2D) -> void:
	# vệt bay
	if trail.size() > 2:
		var pts := PackedVector2Array()
		for q in trail:
			pts.append(q)
		c.draw_polyline(pts, Color(1.2, 1.7, 0.8, 0.30), 5.0, true)
		c.draw_polyline(pts, Color(1.9, 2.2, 1.1, 0.55), 1.6, true)
	# quầng ở chỗ gậy về tay
	var k := smooth(PEAK, PEAK + 0.35, t) * (1.0 - smooth(PEAK + 0.4, PEAK + 1.2, t))
	if k > 0.0:
		blob(c, hero.hand + Vector2(0, -16), 90 * k, Color(0.9, 1.8, 0.8, 0.18))
		blob(c, hero.hand + Vector2(0, -16), 30 * k, Color(2.0, 2.4, 1.1, 0.45))


func _fx_ground(c: Node2D) -> void:
	# phiến đá đài Quân Sơn, vết nứt sau cú giằng
	flat_blob(c, Vector2(960, GROUND + 14), 620, 0.12, Color(0.6, 0.9, 0.7, 0.18))
	if hit:
		var k := smooth(PEAK, PEAK + 0.6, t)
		c.draw_line(Vector2(1080, GROUND + 4), Vector2(1080 + 90 * k, GROUND + 20), Color(0.15, 0.25, 0.2, 0.8), 4.0, true)
		c.draw_line(Vector2(1080, GROUND + 4), Vector2(1010 - 60 * k, GROUND + 18), Color(0.15, 0.25, 0.2, 0.8), 3.0, true)


func _cam() -> Array:
	var c := CENTER
	var z := 1.0
	# mở: hai người, đài rộng
	var k1 := smooth(1.0, 1.8, t) * (1.0 - smooth(2.3, 2.8, t))
	c = c.lerp(Vector2(930, 600), k1)
	z = lerpf(z, 1.12, k1)
	# ba nhịp: bám khoảng giữa hai người, không cắt ai khỏi khung
	var k2 := smooth(2.4, 2.8, t) * (1.0 - smooth(5.2, 5.6, t))
	c = c.lerp(Vector2(960, 600), k2)
	z = lerpf(z, 1.18, k2)
	# đỉnh: theo cung gậy
	var k3 := smooth(PEAK - 0.3, PEAK + 0.1, t) * (1.0 - smooth(PEAK + 0.9, PEAK + 1.5, t))
	c = c.lerp(Vector2(960, 590), k3)
	z = lerpf(z, 1.14, k3)
	# kết: thấy cả hai, gậy trong tay nàng
	var k4 := smooth(7.4, 9.0, t)
	c = c.lerp(Vector2(980, 600), k4)
	z = lerpf(z, 1.0, k4)
	return [c, z]

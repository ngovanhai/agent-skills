extends Node2D
class_name DonghuaChibiRig
## Hierarchical 2D Donghua Chibi Rig (2.6-Head Heroic Proportions)
## Supports: gather (Mã Bộ), strike (Cung Bộ Lunge), and Spine/Line2D VFX from palm/sword tip.

@export var char_dir: String = "res://assets/chibi/tieu_phong"
@export var use_sword: bool = false
@export var vfx_color_outer: Color = Color(1.0, 0.55, 0.0, 0.55)
@export var vfx_color_core: Color = Color(1.0, 0.98, 0.85, 0.95)

var pelvis: Node2D
var torso: Sprite2D
var head: Sprite2D
var cape: Sprite2D
var leg_back: Sprite2D
var leg_front: Sprite2D
var arm_back: Sprite2D
var arm_front: Sprite2D
var palm_marker: Marker2D

var vfx_line: Line2D
var vfx_core: Line2D
var dragon_head: Sprite2D

var anim_phase: int = 0 # 0 = gather (Mã Bộ), 1 = strike (Cung Bộ)
var phase_progress: float = 0.0
var global_time: float = 0.0


func _ready() -> void:
	_build_hierarchy()


func _load_tex(file_name: String) -> Texture2D:
	var p := char_dir.path_join(file_name)
	return load(p) if ResourceLoader.exists(p) else null


func _make_sprite(tex_name: String, offset_px: Vector2, z_idx: int = 0, darken: float = 1.0) -> Sprite2D:
	var sp := Sprite2D.new()
	sp.texture = _load_tex(tex_name)
	sp.offset = offset_px
	sp.z_index = z_idx
	if darken < 1.0:
		sp.modulate = Color(darken, darken, darken, 1.0)
	return sp


func _build_hierarchy() -> void:
	pelvis = Node2D.new()
	pelvis.position = Vector2(0, -88)
	add_child(pelvis)

	# Z-Order: cape -> arm_back -> leg_back -> leg_front -> torso -> head -> arm_front
	cape = _make_sprite("part_cape.png", Vector2(-50, 40), 1)
	cape.position = Vector2(-22, -78)

	leg_back = _make_sprite("part_leg.png", Vector2(0, 42), 2, 0.72)
	leg_back.position = Vector2(-16, -4)
	pelvis.add_child(leg_back)

	leg_front = _make_sprite("part_leg.png", Vector2(0, 42), 3)
	leg_front.position = Vector2(16, -4)
	pelvis.add_child(leg_front)

	torso = _make_sprite("part_torso.png", Vector2(0, -10), 4)
	pelvis.add_child(torso)
	torso.add_child(cape)

	arm_back = _make_sprite("part_arm.png", Vector2(36, 12), -1, 0.72)
	arm_back.position = Vector2(18, -72)
	torso.add_child(arm_back)

	head = _make_sprite("part_head.png", Vector2(-8, -56), 5)
	head.position = Vector2(2, -96)
	torso.add_child(head)

	arm_front = _make_sprite("part_arm.png", Vector2(40, 14), 6)
	arm_front.position = Vector2(-16, -72)
	torso.add_child(arm_front)

	palm_marker = Marker2D.new()
	palm_marker.position = Vector2(105, 8)
	arm_front.add_child(palm_marker)

	# Additive HDR Glow VFX Lines
	var add_mat := CanvasItemMaterial.new()
	add_mat.blend_mode = CanvasItemMaterial.BLEND_MODE_ADD

	vfx_line = Line2D.new()
	vfx_line.width = 48.0
	vfx_line.default_color = vfx_color_outer
	vfx_line.material = add_mat
	vfx_line.begin_cap_mode = Line2D.LINE_CAP_ROUND
	vfx_line.end_cap_mode = Line2D.LINE_CAP_ROUND
	add_child(vfx_line)

	vfx_core = Line2D.new()
	vfx_core.width = 20.0
	vfx_core.default_color = vfx_color_core
	vfx_core.material = add_mat
	vfx_core.begin_cap_mode = Line2D.LINE_CAP_ROUND
	vfx_core.end_cap_mode = Line2D.LINE_CAP_ROUND
	add_child(vfx_core)

	dragon_head = _make_sprite("dragon_head.png", Vector2(-10, -10), 10)
	dragon_head.scale = Vector2(0.42, 0.42)
	dragon_head.visible = false
	add_child(dragon_head)


func set_pose(phase: int, progress: float, time_sec: float) -> void:
	anim_phase = phase
	phase_progress = clampf(progress, 0.0, 1.0)
	global_time = time_sec

	var ease := sin(phase_progress * PI * 0.5)
	var wind := 0.0

	if anim_phase == 0:
		# Mã Bộ Gather
		pelvis.position = Vector2(0, -88 + 10 * ease)
		torso.rotation_degrees = -10.0 * ease
		head.rotation_degrees = 10.0 * ease
		leg_front.rotation_degrees = -22.0 * ease
		leg_back.rotation_degrees = 24.0 * ease
		arm_front.rotation_degrees = 25.0 + 15.0 * ease
		arm_front.scale = Vector2(0.85, 1.0)
		arm_back.rotation_degrees = -28.0 - 10.0 * ease
		wind = -0.2 * ease
		vfx_line.visible = false
		vfx_core.visible = false
		dragon_head.visible = false
	else:
		# Cung Bộ Lunge Strike
		pelvis.position = Vector2(68 * ease, -78 - 2 * ease)
		torso.rotation_degrees = -10.0 + 28.0 * ease
		head.rotation_degrees = 10.0 - 24.0 * ease
		leg_front.rotation_degrees = -34.0 * ease
		leg_back.rotation_degrees = 42.0 * ease
		arm_front.rotation_degrees = 40.0 - 58.0 * ease
		arm_front.scale = Vector2(0.85 + 0.22 * ease, 1.0)
		arm_back.rotation_degrees = -38.0 + 145.0 * ease
		wind = -1.1 * ease
		_update_spline_vfx(ease)

	cape.rotation_degrees = sin(global_time * 4.0) * 5.0 + wind * 16.0


func _update_spline_vfx(progress: float) -> void:
	if progress <= 0.05:
		return
	vfx_line.visible = true
	vfx_core.visible = true

	var start_local := to_local(palm_marker.global_position)
	var reach := 540.0 * minf(1.0, progress * 1.15)
	var pts: PackedVector2Array = []
	var num_pts := 26

	for i in range(num_pts):
		var t := float(i) / float(num_pts - 1)
		var env := sin(t * PI * 0.85)
		var wave := sin(t * 7.5 - global_time * 8.0) * (34.0 * env)
		pts.append(start_local + Vector2(t * reach, -10.0 * t + wave))

	vfx_line.points = pts
	vfx_core.points = pts

	if dragon_head.texture != null:
		dragon_head.visible = true
		dragon_head.position = pts[num_pts - 1]
		var dir := pts[num_pts - 1] - pts[num_pts - 2]
		dragon_head.rotation = dir.angle() * 0.65 - 0.25

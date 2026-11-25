---
name: teo-kiem-hiep-donghua
description: >-
  Làm một tập Tèo Kể Kiếm Hiệp (≥20 phút, giọng Tiến Đạt) dựng toàn bộ bằng Godot 2D theo phong cách
  2D Donghua Chibi (2.6-Head Heroic Chibi Rigging + Cảnh núi võ hiệp đa tầng + Chiêu thức Spline HDR Glow).
  Giữ nguyên khung quy trình sản xuất (loi.txt, ZeroTTS, gd-check, gd-render, pack.mjs) nhưng THAY THẾ hoàn toàn
  phần tạo nhân vật, cảnh vật và chiêu thức bằng pipeline Donghua Chibi 2D Rigging.
---

# Tèo Kiếm Hiệp × Donghua Chibi 2D (Godot 4.7.2)

`SKILL = thư mục chứa file này` · `KH = ~/.agent-skills/skills/teo-kiem-hiep` · `LOCK = bash $HOME/MuseStudio/kiem-hiep/_tools/slot.sh`

Skill này kế thừa **100% quy trình sản xuất tập dài** của `teo-kiem-hiep-godot` (research → `loi.txt` → ZeroTTS giọng Tiến Đạt → `gd-check` → `gd-render --par 2` → `nhac.py` → `thumb.tscn` → `pack.mjs` → `check-tong-the.py`), **NHƯNG THAY THẾ HOÀN TOÀN 3 MẢNG HÌNH ẢNH**:
1. **Nhân vật:** Thay `nhan-vat-chibi` + nét vẽ đơn giản bằng **2.6-Head Heroic Donghua Chibi Modular Rigging** (`scripts/extract_parts.py` + `scripts/donghua_chibi_rig.gd`).
2. **Cảnh vật:** Thay nền phẳng bằng **Cảnh Võ Hiệp Donghua Đa Tầng** (`Parallax2D`: đỉnh núi gồ ghề, tháp cổ trên đỉnh núi, mây sương trôi, rừng trúc / cây tùng thủy mặc, vách đá phân tầng, sao chỉ nằm sau núi).
3. **Chiêu thức / Skill:** Thay chiêu đơn điệu bằng **Donghua Spline HDR VFX** (`Line2D` + `CanvasItemMaterial Add` + `WorldEnvironment` Glow + Đầu Kim Long / Kiếm Khí Nguyệt Nha xuất phát chính xác từ `Marker2D` lòng bàn tay hoặc mũi kiếm).

---

## Điểm Khác Biệt Cốt Lõi So Với `teo-kiem-hiep-godot`

| Hạng mục | `teo-kiem-hiep-godot` (cũ) | `teo-kiem-hiep-donghua` (mới) |
| :--- | :--- | :--- |
| **Tạo hình nhân vật** | `nhan-vat-chibi` + `ve.mjs` (mặt tròn đơn giản, tự vẽ thân trong `nguoi.gd`) | **Donghua Chibi 2.6 Đầu** tách lớp PNG độ nét cao (`part_head`, `part_torso`, `part_arm`, `part_leg`, `part_cape`, vũ khí/bầu rượu) qua `scripts/extract_parts.py` (border flood-fill). |
| **Chuyển động khớp xương** | Thay pose tĩnh hoặc xoay đơn giản | **Cây phân cấp `Node2D` (`scripts/donghua_chibi_rig.gd`)**: `Pelvis → Legs / Torso → Cape / Head / ArmBack / ArmFront`, chuyển đổi mượt giữa **Mã Bộ (Tụ khí)** và **Cung Bộ (Lao thân phát lực)**. |
| **Cảnh vật (`phim.gd`)** | Khung cảnh 2D phẳng tối giản | **Bối cảnh Donghua đa tầng**: Rặng núi `quadraticCurveTo`, tháp cổ, mây sương trôi, rừng trúc/cây tùng uốn lượn, vách đá có khe nứt phát sáng chân khí. |
| **Chiêu thức (Skill / VFX)** | `chuong-2d` cũ | **Spline HDR VFX** (`Line2D` uốn sin + `BLEND_MODE_ADD` + `dragon_head.png` / Kiếm khí Độc Cô Cửu Kiếm) gắn vào `palm_marker.global_position`. |

---

## Quy Trình Tạo Nhân Vật & Cảnh Donghua (Thay Thế Bước 5 & 6)

### Bước A: Chuẩn Bị Modular Sprite Sheet & Tách Lớp (`extract_parts.py`)
1. Tạo 2 sheet sạch trên nền xám than đồng nhất (`#22252A`), nét viền `#1C110E`:
   - **Head Sprite**: Đầu Chibi 2.6 đầu, tóc mái & tóc sau bay tự nhiên, không dính cổ áo.
   - **Modular Body Parts Sheet (4 phần tách rời, không đè nhau)**:
     - `part_torso.png` (y phục võ giả, cổ áo chữ Y, lông thú/đai lưng + ngọc bội/bầu rượu)
     - `part_arm.png` (cánh tay cơ bắp + hộ oản đinh tán + bàn tay mở chưởng / cầm kiếm)
     - `part_leg.png` (quần thụng + xà cạp đan chéo + giày cổ trang mũi hếch)
     - `part_cape.png` (áo choàng rách 3 mũi nhọn)
2. Chạy **`python scripts/extract_parts.py`** dùng thuật toán **border flood-fill** (`tol=22`) để xóa nền `#22252A` mà **giữ nguyên 100% viền mực tối bên trong**, lưu vào `godot/assets/chibi/<nv>/`.

### Bước B: Gắn Xương Trong Godot (`scripts/donghua_chibi_rig.gd`)
Trong `phim.gd`, khởi tạo nhân vật bằng `DonghuaChibiRig`:
```gdscript
var tieu_phong := preload("res://scripts/donghua_chibi_rig.gd").new()
tieu_phong.char_dir = "res://assets/chibi/tieu_phong"
add_child(tieu_phong)

# Trong phim.at(t, seg, line):
# pha 0 = Mã Bộ (tụ khí), pha 1 = Cung Bộ (tung chưởng / đâm kiếm)
tieu_phong.set_pose(1, clampf((t - t_start) / 0.6, 0.0, 1.0), t)
```

### Bước C: Quy Chuẩn Cảnh Võ Hiệp & Ánh Sáng (`phim.gd`)
- **Phân tầng không gian**:
  1. Bầu trời gradient hoàng hôn/đêm trăng + sao (chỉ vẽ ở vùng trời phía trên núi).
  2. Mặt trăng/mặt trời tỏa hào quang `RadialGradient`.
  3. Núi xa + tháp cổ + dải mây sương trôi.
  4. Núi trung cảnh + cây tùng/rừng trúc gân guốc (không vẽ hình elip phẳng).
  5. Vách đá tiền cảnh + vết nứt đất phát sáng chân khí + bụi đất bay khi đạp chân Cung Bộ.
- **Môi trường HDR Glow**: Bật `WorldEnvironment` (`glow_enabled = true`, `forward_plus` renderer) để `vfx_line` và `vfx_core` phát sáng rực rỡ chuẩn Donghua.

### Bước D: Kiểm Tra Thị Giác Bắt Buộc (Soi Sheet Trước Render Dài)
- Chạy `LOCK "<tap> xem" node KH/scripts/gd-render.mjs <tap> --preview --from A --to B --sheet 5 --out xa` (hoặc chụp trực tiếp 2 pha `gather` & `strike` bằng Godot/Chrome headless).
- Mở ảnh sheet soi kỹ:
  - Không lệch khớp cổ, vai, khuỷu tay, hông.
  - Rồng/Kiếm khí xuất phát **đúng từ tâm lòng bàn tay / đầu mũi kiếm**.
  - Không có đốm sao rơi nhầm xuống mặt đất.

---

## Các Bước Giữ Nguyên Từ `teo-kiem-hiep-godot`
- **Bước 0–4:** Research ≥ 2 nguồn, `kich-ban-tho.md`, `y-tuong.md`, `new-tap.mjs`, `loi.txt` (đủ 5 dòng header metadata, tỷ lệ 65/35, luật 60s đầu, lời mời đầu video, tên kênh **Tèo Tửu Lâu**, ≥ 15 động từ hành động), ZeroTTS giọng Tiến Đạt (`-20 LUFS`), `gd-check.mjs --no-godot` (DUR ≥ 20:00).
- **Bước 7–12:** `gd-check.mjs`, `smoke-test.py`, `nhac.py` (≤ -40 LUFS, sáo trúc/đàn bầu/đàn gảy êm dịu), `gd-render.mjs --par 2`, `thumb.tscn` (dùng chính sprite Donghua độ nét cao), `pack.mjs`, `check-tong-the.py` (`youtube/.READY_TO_UPLOAD`), và `gd-check.mjs --log`.

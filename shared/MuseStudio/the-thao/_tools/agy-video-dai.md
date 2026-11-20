Bạn làm MỘT video dài mới cho kênh YouTube hoạt hình bóng đá tiếng Việt "Tèo Thể Thao". Trả lời bằng tiếng Việt.

Toàn bộ quy trình nằm trong skill `C:/Users/anhha/.claude/skills/teo-the-thao/SKILL.md` — ĐỌC KỸ và làm theo, cùng: `data/danh-gia.md` (cổng chọn chủ đề ≥28/40 + review kịch bản bắt buộc), `data/tang-truong.md` (tiêu đề, hook 30 s, CTA, câu kết, "Bài học từ số liệu"), `data/ke-hoach-30-ngay.md` ("Lời hứa đang treo" làm trước), `data/chu-de.md`, `data/history.json` (không trùng chủ đề; khung, vai Tèo, bút, palette, nhạc, font, thumbnail khác 5 tập trước). Kiểm thư mục `C:/Users/anhha/MuseStudio/the-thao/tap-*` để biết số tập tiếp theo và tránh chủ đề đang có người làm dở.

Tập mẫu hoàn chỉnh (CHỈ ĐỌC): `C:/Users/anhha/MuseStudio/the-thao/tap-01-mbappe-phut-87-camp-nou/` (y-tuong.md, godot/loi.txt, story.json, phim.gd, thumb.gd, work/nhac.py). Không chép code hình nguyên si.

Bắt buộc:
- Thư mục `C:/Users/anhha/MuseStudio/the-thao/tap-<NN>-<slug>/` tạo bằng `node C:/Users/anhha/.claude/skills/teo-the-thao/scripts/new-tap.mjs <thư mục> --ten "<khung>"`.
- Research WebSearch/WebFetch (tin bóng đá 48 giờ qua trước), mọi dữ kiện ≥2 nguồn vào bảng dữ kiện y-tuong.md + story.facts; chỉ 1 nguồn thì bỏ. Ghi "## Đánh giá chủ đề" có "Tổng: NN/40".
- Review kịch bản: tự soát + nhờ một lượt review độc lập (đọc lại toàn bộ loi.txt đối chiếu bảng dữ kiện như một biên tập viên khác), sửa đến ĐẠT, ghi "## Review kịch bản … Kết luận: ĐẠT" (có chữ "độc lập").
- Kịch bản 8:00–14:30, giọng Hải Đăng (~4,5 từ/giây): viết ≥2.300 từ, không làm Short (người dùng tắt Short 2026-11-03).
- Nhân vật & phong cách dựng hình (chốt 2026-11-20 cho tập kể chuyện 19:00): KHÔNG dùng nhân vật chuyển động `chibi.gd` rig v2 (`chars.json`, `export-chars.mjs`, `ve-cartoon.mjs`). Thay bằng **ảnh nhân vật** PNG nền trong suốt trong `godot/assets/*.png` (chân dung cutout / hedcut / mực báo, tuyệt đối không dính logo/watermark) rồi render dạng **ảnh hoạt hình (2.5D / cutout motion)** trong `phim.gd` (camera zoom/pan, parallax nhiều lớp, thở/nhún nhẹ theo `t`, thẻ hồ sơ/báo cũ/số liệu; không làm chớp mắt). Trong `godot/cast.json` để `{}` hoặc không ghi trường `char`.
- Việc nặng qua `bash C:/Users/anhha/MuseStudio/the-thao/_tools/slot.sh "<tên>" <lệnh>` (Git Bash). Giọng: `node C:/Users/anhha/.claude/skills/teo-kiem-hiep/scripts/gd-voice.mjs <tập>`. Render: `node C:/Users/anhha/.claude/skills/teo-kiem-hiep/scripts/gd-render.mjs <tập> [--preview --from A --to B --sheet 8 --out x | --par 2]`.
- `node C:/Users/anhha/.claude/skills/teo-the-thao/scripts/gd-check.mjs <tập>` phải OK. Soi preview sheet TOÀN BỘ video (chia khúc, đọc ảnh), sửa chữ chồng/tràn, nhân vật bị che, rồi mới render bản cuối. Khán đài/hạt nền ≤600 chấm mỗi khung.
- Nhạc tự sinh (python + ffmpeg), thumbnail bằng `godot/thumb.tscn` (chạy có cửa sổ, chữ ≤4 từ không lặp tiêu đề), rồi `node C:/Users/anhha/.claude/skills/teo-the-thao/scripts/pack.mjs <tập>` và `gd-check <tập> --log`.

TUYỆT ĐỐI KHÔNG: tải lên YouTube, mở/điều khiển FoxProfile hay trình duyệt kênh, chạy drive-sync, công khai, xoá file của tập khác, gửi tin nhắn. Dừng sau khi pack xong.

Báo cáo cuối: thư mục tập, chủ đề + điểm cổng, tiêu đề, thời lượng, gd-check, các sheet đã soi, thumbnail và youtube/, chỗ còn chưa chắc. Hỏng không tự sửa được thì dừng, báo lỗi kèm log.

- KHÔNG làm chủ đề bóng đá liên quan Việt Nam (người dùng chốt 2026-11-05).

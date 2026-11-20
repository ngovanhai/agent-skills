Bạn làm MỘT video dài mới cho kênh YouTube hoạt hình bóng đá tiếng Việt "Tèo Thể Thao". Trả lời bằng tiếng Việt.

Toàn bộ quy trình nằm trong skill `C:/Users/anhha/.claude/skills/teo-the-thao/SKILL.md` — ĐỌC KỸ và làm theo, cùng: `data/danh-gia.md` (cổng chọn chủ đề ≥28/40 + review kịch bản bắt buộc), `data/tang-truong.md` (tiêu đề, hook 30 s, CTA, câu kết, "Bài học từ số liệu"), `data/ke-hoach-30-ngay.md` ("Lời hứa đang treo" làm trước), `data/chu-de.md`, `data/history.json` (không trùng chủ đề; khung, vai Tèo, bút, palette, nhạc, font, thumbnail khác 5 tập trước). Kiểm thư mục `C:/Users/anhha/MuseStudio/the-thao/tap-*` để biết số tập tiếp theo và tránh chủ đề đang có người làm dở.

Tập mẫu hoàn chỉnh (CHỈ ĐỌC): `C:/Users/anhha/MuseStudio/the-thao/tap-01-mbappe-phut-87-camp-nou/` (y-tuong.md, godot/loi.txt, story.json, phim.gd, thumb.gd, work/nhac.py). Không chép code hình nguyên si.

Bắt buộc:
- Thư mục `C:/Users/anhha/MuseStudio/the-thao/tap-<NN>-<slug>/` tạo bằng `node C:/Users/anhha/.claude/skills/teo-the-thao/scripts/new-tap.mjs <thư mục> --ten "<khung>"`.
- Research WebSearch/WebFetch (tin bóng đá 48 giờ qua trước), mọi dữ kiện ≥2 nguồn vào bảng dữ kiện y-tuong.md + story.facts; chỉ 1 nguồn thì bỏ. Ghi "## Đánh giá chủ đề" có "Tổng: NN/40".
- Review kịch bản: tự soát + nhờ một lượt review độc lập (đọc lại toàn bộ loi.txt đối chiếu bảng dữ kiện như một biên tập viên khác), sửa đến ĐẠT, ghi "## Review kịch bản … Kết luận: ĐẠT" (có chữ "độc lập").
- Kịch bản 8:00–14:30, có 3 đoạn đắt tách được thành 3 Short.
- Nhân vật kiểu CARTOON của kênh: look mới thêm vào `C:/Users/anhha/.claude/skills/nhan-vat-chibi/data/chars.json` (id `bd-…`, sửa JSON cẩn thận, không làm mất nhân vật khác); xuất bằng `node C:/Users/anhha/MuseStudio/the-thao/_tools/export-chars.mjs <id>…` chạy trong `godot/`; chép `C:/Users/anhha/.claude/skills/thao-tac-chibi/engine/chibi.gd` vào `godot/`. Tèo là `teo-the-thao`.
- Việc nặng qua `bash C:/Users/anhha/MuseStudio/the-thao/_tools/slot.sh "<tên>" <lệnh>` (Git Bash). Giọng: `node C:/Users/anhha/.claude/skills/teo-kiem-hiep/scripts/gd-voice.mjs <tập>`. Render: `node C:/Users/anhha/.claude/skills/teo-kiem-hiep/scripts/gd-render.mjs <tập> [--preview --from A --to B --sheet 8 --out x | --par 2]`.
- `node C:/Users/anhha/.claude/skills/teo-the-thao/scripts/gd-check.mjs <tập>` phải OK. Soi preview sheet TOÀN BỘ video (chia khúc, đọc ảnh), sửa chữ chồng/tràn, nhân vật bị che, rồi mới render bản cuối. Khán đài/hạt nền ≤600 chấm mỗi khung.
- Nhạc tự sinh (python + ffmpeg), thumbnail bằng `godot/thumb.tscn` (chạy có cửa sổ, chữ ≤4 từ không lặp tiêu đề), rồi `node C:/Users/anhha/.claude/skills/teo-the-thao/scripts/pack.mjs <tập>` và `gd-check <tập> --log`.

TUYỆT ĐỐI KHÔNG: tải lên YouTube, mở/điều khiển FoxProfile hay trình duyệt kênh, chạy drive-sync, công khai, xoá file của tập khác, gửi tin nhắn. Dừng sau khi pack xong.

Báo cáo cuối: thư mục tập, chủ đề + điểm cổng, tiêu đề, thời lượng, gd-check, các sheet đã soi, thumbnail và youtube/, chỗ còn chưa chắc. Hỏng không tự sửa được thì dừng, báo lỗi kèm log.

NHIỆM VỤ CỤ THỂ: tập 07, thư mục `C:/Users/anhha/MuseStudio/the-thao/tap-07-park-hang-seo-phan-1/`, format `cuoc-doi`, series "Cuộc đời huyền thoại": Park Hang-seo Phần 1. Góc: cuộc đời ông từ cầu thủ Hàn Quốc, trợ lý Guus Hiddink ở World Cup 2002, những năm HLV ít thành công ở Hàn Quốc, rồi tháng 10/2017 sang Việt Nam khi ít người biết tên, đến chức vô địch AFF Cup 2018. Tập 03 của kênh ĐÃ kể chi tiết Thường Châu 2018 → ở tập này Thường Châu chỉ lướt 1 đoạn ngắn với góc nhìn của Park, không lặp lại diễn biến từng trận. Phần 2 (sau này) sẽ kể SEA Games 2019, vòng loại World Cup 2022 và chia tay 2023 → câu kết móc sang tập 03 Thường Châu (đã đăng) hoặc hứa phần 2. Tên riêng nước ngoài viết theo cách đọc trong loi.txt (như các tập 1–6, ví dụ "Pắc Hang-xơ", "Híp-đinh"), số đọc bằng chữ. Mọi chi tiết đời tư/lời phát biểu phải có ≥2 nguồn có URL cụ thể; không bịa giai thoại.

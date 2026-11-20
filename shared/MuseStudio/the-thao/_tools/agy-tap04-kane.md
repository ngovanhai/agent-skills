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

NHIỆM VỤ CỤ THỂ (người dùng chọn chủ đề, bỏ qua lịch và lời hứa):
- Tập 04, thư mục `C:/Users/anhha/MuseStudio/the-thao/tap-04-harry-kane-qua-bong-vang-2026/`.
- Chủ đề: Harry Kane đoạt Quả bóng vàng 2026 (lễ trao giải 26/10/2026 ở London; Mbappé thứ 2, Yamal thứ 3; người Anh đầu tiên sau 25 năm, tức sau Michael Owen 2001). Format `cuoc-doi` kết hợp thời sự: hành trình từ cậu bé bị học viện Arsenal loại, những lần cho mượn, "lời nguyền không danh hiệu" ở Tottenham, sang Bayern và danh hiệu đầu tiên, đến mùa giải đoạt Quả bóng vàng; và vì sao Kane thắng Mbappé/Yamal (ý kiến Tèo rõ ràng).
- Đọc `C:/Users/anhha/.claude/skills/teo-the-thao/data/nghien-cuu-kenh.md` (mục 5) và `chu-de.md` mục 5 + 8 (luật series cuộc đời).
- Mọi con số (bàn/trận mùa giải, danh hiệu, năm, CLB cho mượn, thứ hạng bầu chọn) phải ≥2 nguồn (ESPN, Sky Sports, Goal, Bundesliga.com, BBC, Transfermarkt, Wikipedia). Số liệu đang thay đổi nói "tính đến ngày 27/10/2026". Các nguồn mô tả khác nhau thì nói chung chung.
- Không bàn đời tư, không chê Mbappé/Yamal; nhắc fan Yamal/Mbappé bằng giọng công bằng. Câu hỏi bình luận hai lựa chọn (ví dụ "K nếu Kane xứng đáng, Y nếu Yamal mới đáng").
- Nhân vật mới: `bd-kane` (áo trắng-đỏ kiểu Bayern chỉ màu + số 9, không logo), `bd-mbappe`/`bd-yamal` nếu cần (kiểm chars.json đã có chưa, có thì dùng lại).

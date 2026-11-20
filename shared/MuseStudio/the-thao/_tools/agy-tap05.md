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

NHIỆM VỤ CỤ THỂ (người dùng yêu cầu làm liên tục; Claude chọn theo `ke-hoach-30-ngay.md`, thứ tự series):
- Tập 05, thư mục `C:/Users/anhha/MuseStudio/the-thao/tap-05-man-united-phan-1-newton-heath-den-1968/`. KHÔNG đụng thư mục tap-04 (đang render).
- Series "Lịch sử CLB qua các thời kỳ" (format `lich-su-clb`), Manchester United PHẦN 1: từ đội công nhân đường sắt Newton Heath, đổi tên Manchester United, Matt Busby, thảm hoạ Munich 1958, đến chức vô địch cúp C1 năm 1968. Đọc `C:/Users/anhha/.claude/skills/teo-the-thao/data/chu-de.md` mục 6 (luật series) và `nghien-cuu-kenh.md`.
- Tiêu đề có "(Phần 1)"; câu kết móc sang Phần 2 (26 năm của Sir Alex) và video có sẵn trên kênh; không hứa ngày ra mắt.
- Thảm hoạ Munich: kể trang trọng, KHÔNG dựng cảnh máy bay rơi/tai nạn, chỉ dùng con số tử vong đã xác nhận ≥2 nguồn (BBC, Manchester United chính thức, Wikipedia), có thể dùng hình nến, hoa, đồng hồ dừng.
- Không vẽ huy hiệu MU, không chữ "Red Devils" thành logo; áo chỉ màu đỏ + số.
- Tên riêng nước ngoài viết theo cách đọc tiếng Việt như các tập trước (xem tap-01..03 loi.txt: Li-vơ-pun, Rê-an Ma-đrít, Em-báp-pê…), số viết bằng chữ, mọi nhận định nói rõ "theo Tèo".
- Review độc lập THẬT: không được tự ghi "độc lập" khi tự soát; nếu không gọi được người review khác thì ghi rõ "chưa có review độc lập", Claude sẽ làm.
- Không bịa chi tiết (lời nói, ảnh, con số) không có trong bảng dữ kiện ≥2 nguồn có URL.

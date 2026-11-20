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

NHIỆM VỤ CỤ THỂ (job lịch teo-tt-video-dai 2026-10-28 14:18; Claude chọn theo `ke-hoach-30-ngay.md`, thứ tự series ★ số 1):
- Tập 06, thư mục `C:/Users/anhha/MuseStudio/the-thao/tap-06-ronaldo-phan-1-madeira-den-old-trafford/`. KHÔNG đụng tap-01..05 hay thư mục của kênh khác.
- Series "Cuộc đời huyền thoại" (format `cuoc-doi`), Cristiano Ronaldo PHẦN 1: từ cậu bé ở Madeira (Funchal), Andorinha, Nacional, học viện Sporting Lisbon năm mười hai tuổi, ra mắt Sporting, trận giao hữu khánh thành sân mới gặp Man United tháng 8/2003, chuyển sang Old Trafford với áo số bảy, những năm đầu bị chê "làm xiếc", đến đỉnh cao 2007–08 (Champions League ở Moscow, Quả bóng vàng 2008) và dừng ở bước ngoặt mùa hè 2009 rời MU sang Real Madrid (kỷ lục chuyển nhượng lúc đó) — chưa kể gì ở Real. Đọc `C:/Users/anhha/.claude/skills/teo-the-thao/data/chu-de.md` mục 5 (luật series) và `nghien-cuu-kenh.md`.
- Tiêu đề có "(Phần 1)"; câu kết móc sang Phần 2 (từ Real Madrid đến hiện tại) và gợi một video có sẵn trên kênh; không hứa ngày ra mắt.
- Gia đình/nghèo khó/bệnh tim tuổi mười lăm chỉ kể ở mức Ronaldo tự kể công khai và có ≥2 nguồn; chuyện bố nghiện rượu, đời tư, pháp lý KHÔNG làm lõi (tối đa một câu trung tính hoặc bỏ). Không chế giễu ngoại hình.
- Không vẽ huy hiệu MU/Sporting, không logo; áo chỉ màu + số. Ronaldo chibi: tóc đen ngắn vuốt, da sáng nâu nhẹ, áo đỏ số 7 (Sporting: sọc ngang xanh lá–trắng số 28).
- Tên riêng nước ngoài viết theo cách đọc tiếng Việt như các tập trước (xem tap-01..05 loi.txt: Li-vơ-pun, Rê-an Ma-đrít, Em-báp-pê, Man-chét-xtơ Du-nai-tịt…), số viết bằng chữ, mọi nhận định nói rõ "theo Tèo".
- Review độc lập THẬT: không được tự ghi "độc lập" khi tự soát; nếu không gọi được người review khác thì ghi rõ "chưa có review độc lập", Claude sẽ làm.
- Không bịa chi tiết (lời nói, ảnh, con số, tên người) không có trong bảng dữ kiện ≥2 nguồn có URL. Không trích lời quá một câu nguyên văn.
- Phí chuyển nhượng (MU mua từ Sporting, Real mua từ MU) có nhiều con số khác nhau theo nguồn: nói rõ đơn vị (bảng Anh) và "theo báo chí Anh thời đó", hoặc nói chung chung.

Bạn làm YouTube Shorts (dọc 1080×1920, ≤60 s) cho kênh hoạt hình bóng đá tiếng Việt "Tèo Thể Thao". Trả lời bằng tiếng Việt.

Quy trình nằm trong skill `C:/Users/anhha/.claude/skills/teo-the-thao/SKILL.md` — ĐỌC KỸ mục "Shorts dọc", cùng `data/tang-truong.md` (mục 8 Shorts), `data/danh-gia.md` (mục 2: review kịch bản). Short mẫu đã làm xong để học (CHỈ ĐỌC): `C:/Users/anhha/MuseStudio/the-thao/tap-01-mbappe-phut-87-camp-nou/shorts/01-ba-cham-phut-87/`.

NHIỆM VỤ: xem đoạn "NHIỆM VỤ CỤ THỂ" ở cuối (tập dài nguồn + số Short).

Luật:
- Short luôn cắt từ tập dài nguồn: `node C:/Users/anhha/.claude/skills/teo-the-thao/scripts/new-short.mjs <tập> <NN-ten> --tu kA-01..kB-05 …`. Mỗi Short một kiểu khác nhau và khác các Short đã có trong `<tập>/shorts/` (pha bóng trọn vẹn, con số sốc, bí mật ít ai biết, màn đối đầu, quyết định gây tranh cãi…). Chỉ dùng dữ kiện có trong bảng dữ kiện `<tập>/y-tuong.md`.
- Lời: hook `[s01-01]` ≤12 chữ vào thẳng điểm đắt; câu nối giới thiệu lại tên cầu thủ/trận; kết `[s03-01]` nối vòng về hook + mời xem bản đầy đủ + "đăng ký Tèo Thể Thao". Tự review theo danh-gia.md mục 2a, ghi kết quả vào `<short>/y-tuong.md` ("## Review kịch bản … Kết luận: ĐẠT").
- story.json của short: kieu, seo.title ≤60 ký tự có #Shorts, seo.mo_ta (dòng đầu để trống cho link — người tải lên sẽ chèn), tags.
- Việc nặng chạy qua `bash C:/Users/anhha/MuseStudio/the-thao/_tools/slot.sh "<tên>" <lệnh>` (Git Bash). Giọng: `node C:/Users/anhha/.claude/skills/teo-kiem-hiep/scripts/gd-voice.mjs <short>`. Preview: `node C:/Users/anhha/.claude/skills/teo-kiem-hiep/scripts/gd-render.mjs <short> --preview --sheet 4`. Bản cuối: `node …/gd-render.mjs <short>`.
- phim.gd dọc: hình trong y 190–1350, dưới y 1350 và mép phải trống cho phụ đề/nút; giây đầu đã có hình đắt + chữ hook ≤6 từ; nhân vật kiểu cartoon của kênh (chars/ đã có trong project short), Tèo là `teo-the-thao`; kết có Tèo + nút ĐĂNG KÝ. Không chữ chồng chữ, không tràn khung.
- `node C:/Users/anhha/.claude/skills/teo-the-thao/scripts/gd-check.mjs <short>` phải OK; soi sheet preview bằng cách đọc ảnh, sửa rồi mới render; cuối cùng `node C:/Users/anhha/.claude/skills/teo-the-thao/scripts/pack.mjs <short>`.

TUYỆT ĐỐI KHÔNG: tải lên YouTube, mở/điều khiển FoxProfile hay trình duyệt, chạy drive-sync, xoá file ngoài thư mục short đang làm, sửa skill hay file của tập khác, gửi tin nhắn. Dừng sau khi pack xong.

Báo cáo cuối: với từng Short — đường dẫn thư mục, kiểu, tiêu đề, thời lượng, kết quả gd-check, đường dẫn sheet đã soi, đường dẫn mp4 trong `<tập>/youtube/shorts/`, chỗ còn chưa chắc.

NHIỆM VỤ CỤ THỂ:
Tập dài nguồn: `C:/Users/anhha/MuseStudio/the-thao/tap-01-mbappe-phut-87-camp-nou`. LÀM NỐT 1 Short: `shorts/03-con-so-soc/` (kiểu "con số sốc": 9/9 trận thắng rồi thua, Mbappé 100 bàn/116 trận, bảng 27–25–24 tính đến 26/10). Lượt trước đã viết loi.txt, story.json, phim.gd, y-tuong.md nhưng bị dừng trước khi làm giọng/preview/render. Việc: kiểm lại loi.txt chỉ dùng dữ kiện trong bảng dữ kiện `tap-01-.../y-tuong.md` → gd-voice (qua slot.sh) → gd-check OK → preview --sheet 4, đọc sheet, sửa phim.gd nếu chữ chồng/tràn/chạm y>1350 → render bản cuối → pack.mjs. KHÔNG đụng `shorts/01-*` và `shorts/02-may-hay-gioi` (Claude đang review). Mô tả KHÔNG cần link tập dài (job đăng tự thêm). Máy có thể có job khác dùng slot.sh — luôn dùng slot.sh, chờ suất trống.

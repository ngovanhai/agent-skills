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
Tập nguồn: C:/Users/anhha/MuseStudio/the-thao/tap-06-ronaldo-phan-1-madeira-den-old-trafford (Ronaldo Phần 1: Madeira đến Old Trafford). Tập này CHƯA có Short nào. Làm 2 Short:
- 01-dem-mua-moscow (kiểu: pha bóng trọn vẹn / màn kịch tính luân lưu): cắt từ k08-01..k08-08 (đêm 21/5/2008, đánh đầu phút 26, Čech cản quả luân lưu lượt ba của Ronaldo, Terry trượt chân, Van der Sar cản Anelka, 6-5, Ronaldo bật khóc). Bỏ k08-09/k08-10 nếu quá 50 s giọng.
- 02-tran-giao-huu-2003 (kiểu: bí mật ít ai biết, "trận thử việc" vô tình): cắt từ k05-01..k05-09 (6/8/2003 giao hữu khánh thành José Alvalade, Sporting thắng MU 3-1, John O'Shea vất vả, Ferguson kể cầu thủ giục ký trên chuyến bay về, Ferdinand kể phòng thay đồ chỉ nói về Ronaldo, 12/8/2003 ký 12,24 triệu bảng).
Chỉ dùng dữ kiện trong bảng dữ kiện đầu tiên của tap-06/y-tuong.md (bảng có 23 dòng, Claude đã kiểm). KHÔNG dùng bảng cũ phía dưới (có lỗi: tuổi 15 phẫu thuật tim, phút 44 FA Cup, thay Nicky Butt phút 61). Không nói tuổi lúc phẫu thuật tim. Không thêm chi tiết ngoài bảng (không mô tả thời tiết khác "mưa", không trích nguyên văn, không gọi Terry là tội đồ, không hạ nhục Chelsea).
Mô tả KHÔNG cần link (job đăng tự thêm). Không logo CLB/UEFA, cúp vẽ cách điệu. Áo MU đỏ số 7, Chelsea xanh, Sporting sọc ngang xanh lá trắng số 28.

Bạn làm phần KỊCH BẢN + HÌNH cho MỘT tập mới của kênh YouTube hoạt hình tiếng Việt "Cọng Tóc Cuối" (@congtoccuoi). Trả lời bằng tiếng Việt. Một người review (Claude) sẽ đánh giá lại, sửa và render bản cuối sau bạn, nên bạn DỪNG trước bước render bản cuối.

Quy trình nằm trong skill `C:/Users/anhha/.claude/skills/cong-toc-cuoi/SKILL.md`. ĐỌC KỸ trước khi làm, cùng các file sau:
- `data/cong-thuc.md`: phân tích Lạnh Vcl, mục "Phóng khoáng", "Series", giọng kể tự nhiên, tìm tiêu đề, mạch tập.
- `data/danh-gia.md`: cổng chọn chủ đề ≥28/40, review kịch bản bắt buộc.
- `data/chu-de.md`
- `data/history.json`: để không trùng khung, nền, máy quay, palette, nhạc, font, thumbnail với 5 tập trước.
- `C:/Users/anhha/MuseStudio/cong-toc-cuoi/y-tuong-100.md`: 110 ý đã chấm, top 10 và thứ tự đăng.

Tập mẫu hoàn chỉnh, CHỈ ĐỌC, không chép code nền nguyên si: `C:/Users/anhha/MuseStudio/cong-toc-cuoi/tap-02-dam-cuoi-no-bo-vo/`. Xem `kich-ban-tho.md`, `y-tuong.md` (có Sổ logic, Tiêu đề, Chia phần, Review), `godot/loi.txt`, `story.json`, `phim.gd` (cách dùng nút `truoc` làm tiền cảnh, `_vai`, `thoai`, `the`, `so`, cảnh tóc rụng có `toc_san`), `nen.gd`, `thumb.gd`, `work/nhac.py`.

## Luật bắt buộc (người dùng đã chốt)
- **Logic là luật cứng.** Chuyện được bịa hoàn toàn, nhưng trong tập mọi thứ phải khớp nhau: mốc thời gian, tuổi, tiền vào ra cộng đúng (tự cộng lại), ai biết gì lúc nào, động cơ từng người, cú lật có manh mối gieo trước. Ghi `## Sổ logic` vào y-tuong.md. Review độc lập phải soi logic trước tiên, đóng vai người xem khó tính.
- **Kể như nói chuyện:** câu ngắn, 2–3 câu cho mỗi `[id]`, từ nói ("thôi", "đấy", "nhé", "mà"), không văn viết, không "hãy". Mỗi `[id]` từ 10 đến 40 từ.
- **Tiêu đề:** chạy `node SKILL/scripts/tieu-de.mjs <tập> "<từ khoá>" …` trước. Từ khoá chính lấy từ gợi ý tìm kiếm, ghi vào `story.seo.tu_khoa`, nằm trong khoảng 40 ký tự đầu của tiêu đề. Ăn theo các video ★ đang nổi.
- **Chia phần theo kịch bản thô** (1, 2 hoặc 3 phần), ghi `## Chia phần`.
- **Giọng theo giới của Bạn:** `story.ban_gioi` nam → `--voice "Quốc Tuấn"`, nữ → `--voice "Ngọc Huyền"`. Engine CHƯA có hình Bạn nữ, nên nếu chọn Bạn nữ thì phải thêm một vai Bạn nữ vào `godot/cast.json` của tập: hair "dai", váy, VẪN có cọng tóc tâm trạng. Kiểm hình kỹ.
- **Nhạc:** tự sinh, chỉ dùng nhạc cụ gảy hoặc gõ (piano, ukulele, đàn dây, lo-fi). KHÔNG kèn, sáo, clarinet hay tiếng thổi. Mean volume của nhac.ogg đo bằng `ffmpeg -af volume=-3dB,volumedetect` phải khoảng −35 dB. Tắt hẳn nhạc ở cảnh tóc rụng.
- **Font khác tập trước.** Tập 1 dùng Segoe Print, tập 2 dùng Patrick Hand + Bahnschrift. Chọn một font Google Fonts (OFL) có đủ dấu tiếng Việt: tải về một thư mục riêng, kiểm bằng fontTools với chuỗi "Thường Châu ưởng ỹ Ỗ đĐ ạệợ", rồi chép vào `godot/font/` và nạp như `but.gd` của tập 2.
- Chỉ Bạn có màu áo. Vai phụ đen trắng. Đầu vuông là người có quyền. Cọng tóc rụng đúng một lần, ở khúc tệ nhất (series thì ở phần cuối).

## Lệnh
- Tạo tập: `node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/new-tap.mjs C:/Users/anhha/MuseStudio/cong-toc-cuoi/tap-<NN>-<slug> --ten "<khung>"`. NN là số tiếp theo, kiểm thư mục `tap-*`.
- Việc nặng phải chạy qua `bash C:/Users/anhha/MuseStudio/the-thao/_tools/slot.sh "<tên>" <lệnh>` (Git Bash):
  - Giọng: `node C:/Users/anhha/.claude/skills/teo-kiem-hiep/scripts/gd-voice.mjs <tập> --voice "<giọng>"`.
  - Soi hình: `node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/soi.mjs <tập>`. Lệnh này chụp 1 khung mỗi câu, ghép thành `work/soi-NN.jpg`. ĐỌC TỪNG ẢNH, sửa chữ đè mặt hay đè ảnh nền, chữ tràn hoặc bị cắt, nền có mảng đen hoặc trống, nhân vật bị che, sai tư thế. Sau đó chạy soi lại.
- Kiểm cú pháp GDScript: `C:/tool/Godot/Godot_v4.7.2-stable_win64_console.exe --headless --path <tập>/godot --check-only --script res://phim.gd`. Lấy giá trị từ Array hay Dictionary thì khai kiểu rõ, ví dụ `var x: float = …`.
- Soát tổng: `node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/gd-check.mjs <tập>` phải OK.
- Thumbnail: `godot/thumb.tscn` + `thumb.gd`, chạy có cửa sổ với `--position -10000,-10000`, lưu `thumb/thumb-godot.png`. Mở ảnh xem lại, mặt Bạn không được bị che.
- Nhạc: `work/nhac.py` → `godot/nhac.ogg`, chạy sau khi có `timeline.json` (gd-check tạo ra file này).

## DỪNG ở đây
KHÔNG chạy `gd-render.mjs --par 2` (bản cuối), không `pack.mjs`, không `gd-check --log`. TUYỆT ĐỐI KHÔNG tải lên YouTube, không mở FoxProfile hay trình duyệt, không chạy drive-sync, không xoá file của tập khác, không sửa SKILL.md hay data của skill (trừ dấu `(tập N)` trong chu-de.md), không gửi tin nhắn.

## Báo cáo cuối (ngắn)
- thư mục tập, chủ đề, điểm cổng
- tiêu đề, từ khoá chính, video ăn theo
- số phần, thời lượng theo gd-check
- các ảnh soi đã xem và đã sửa gì
- chỗ còn chưa chắc

Đừng ghi "đã soi, đạt" nếu chưa thật sự mở từng ảnh. Hỏng mà không tự sửa được thì dừng, báo lỗi kèm log.

NHIỆM VỤ CỤ THỂ (một agent làm lần lượt 4 tập, xong tập này mới sang tập sau; mỗi tập dừng trước render như trên):
- Tập 7 = ý B2 'Con nhà người ta' (Bạn nữ, ban_gioi "nu", giọng Ngọc Huyền). Thư mục tap-07-<slug>. Font chữ tay: Sriracha. Nhạc: đàn tranh / harp gảy nhẹ.
- Tập 8 = ý G1 'Lương 10 triệu flex trên mạng, cuối tháng ăn mì' (Bạn nam, Quốc Tuấn). Thư mục tap-08-<slug>. Font: Grandstander. Nhạc: synth pluck lo-fi vui.
- Tập 9 = ý K1 'Nhân viên ngân hàng chạy chỉ tiêu' (Bạn nam, Quốc Tuấn). Thư mục tap-09-<slug>. Font: Kodchasan. Nhạc: marimba.
- Tập 10 = ý C5 'Lương tháng 13 và kỳ đánh giá cuối năm' (Bạn nữ, Ngọc Huyền). Thư mục tap-10-<slug>. Font: tự chọn font Google khác hẳn các tập trước. Nhạc: guitar mộc + chuông nhỏ.
Mỗi tập: nghiên cứu trước (tieu-de.mjs, tìm trên mạng các tình huống người ta hay kể về chủ đề để chuyện nghe thật), rồi làm đủ quy trình. Font giao sẵn phải kiểm dấu tiếng Việt bằng fontTools; thiếu dấu thì chọn font Google khác và ghi lý do.
LÀM SONG SONG: các agent khác đang làm tập 3, 4, 5, 6. Chỉ làm trong thư mục tập của bạn. KHÔNG sửa chu-de.md. Việc nặng luôn qua slot.sh (chờ suất là bình thường). Bạn nữ dùng vai có sẵn "ban_nu" (b.setup("ban_nu")).
Báo cáo cuối gộp cả 4 tập.

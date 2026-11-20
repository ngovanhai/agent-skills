Bạn làm phần KỊCH BẢN + HÌNH cho MỘT tập mới của kênh YouTube hoạt hình tiếng Việt "Cọng Tóc Cuối" (@congtoccuoi). Trả lời bằng tiếng Việt. Một người review (Claude) sẽ đánh giá lại, sửa và render bản cuối sau bạn, nên bạn DỪNG trước bước render bản cuối.

Quy trình nằm trong skill `C:/Users/anhha/.claude/skills/cong-toc-cuoi/SKILL.md`. ĐỌC KỸ trước khi làm, cùng các file sau:
- `data/cong-thuc.md`: phân tích Lạnh Vcl, mục "Phóng khoáng", "Series", giọng kể tự nhiên, tìm tiêu đề, mạch tập.
- `data/danh-gia.md`: cổng chọn chủ đề ≥28/40, review kịch bản bắt buộc.
- `data/chu-de.md`
- `data/history.json`: để không trùng khung, nền, máy quay, palette, nhạc, font, thumbnail với 5 tập trước.
- `C:/Users/anhha/MuseStudio/cong-toc-cuoi/y-tuong-100.md`: 110 ý đã chấm, top 10 và thứ tự đăng.

Tập mẫu hoàn chỉnh, CHỈ ĐỌC, không chép code nền nguyên si: `C:/Users/anhha/MuseStudio/cong-toc-cuoi/tap-02-dam-cuoi-no-bo-vo/`. Xem `kich-ban-tho.md`, `y-tuong.md` (có Sổ logic, Tiêu đề, Chia phần, Review), `godot/loi.txt`, `story.json`, `phim.gd` (cách dùng nút `truoc` làm tiền cảnh, `_vai`, `thoai`, `the`, `so`, cảnh tóc rụng có `toc_san`), `nen.gd`, `thumb.gd`, `work/nhac.py`.

## Luật bắt buộc (người dùng đã chốt)
- **Ý lấy từ kho, không tự nghĩ chủ đề.** Mỗi tập từ tập 11 chỉ làm đúng ý mà đề giao trong `cong-toc-cuoi/kho-y-tuong.md`, tìm bằng ID.
  - `y-tuong.md` ghi `Kho: <ID>`, chép nguyên khung logic của ý vào `## Khung logic`.
  - Giữ đúng cú lật, 3 manh mối và phần soát. Chỉ được làm sâu thêm, đổi tên, thêm chi tiết.
  - Nếu thấy khung logic không khép thì dừng lại và báo, không tự đổi cú lật.
- **Logic là luật cứng.** Chuyện được bịa hoàn toàn, nhưng trong tập mọi thứ phải khớp nhau: mốc thời gian, tuổi, tiền vào ra cộng đúng (tự cộng lại), ai biết gì lúc nào, động cơ từng người, cú lật có manh mối gieo trước. Ghi `## Sổ logic` vào y-tuong.md. Review độc lập phải soi logic trước tiên, đóng vai người xem khó tính.
- **Kể như nói chuyện:** câu ngắn, 2–3 câu cho mỗi `[id]`, từ nói ("thôi", "đấy", "nhé", "mà"), không văn viết, không "hãy". Mỗi `[id]` từ 10 đến 40 từ.
- **Tiêu đề:** chạy `node SKILL/scripts/tieu-de.mjs <tập> "<từ khoá>" …` trước. Từ khoá chính lấy từ gợi ý tìm kiếm, ghi vào `story.seo.tu_khoa`, nằm trong khoảng 40 ký tự đầu của tiêu đề. Ăn theo các video ★ đang nổi.
- **Chia phần theo kịch bản thô** (1, 2 hoặc 3 phần), ghi `## Chia phần`.
- **Giọng (luật mới từ tập 21):** người kể LUÔN là giọng nam "Quốc Tuấn", kể cả khi Bạn là nữ. Giọng nữ "Ngọc Huyền" chỉ chèn vào câu THOẠI của nhân vật nữ (Bạn nữ nói, mẹ chồng, chị đồng nghiệp…):
  - Tách thoại nữ thành `[id]` riêng, chỉ chứa lời nhân vật đó nói (không có "cô ấy bảo", không lời kể), 10–40 từ. Lời dẫn đặt ở câu trước.
  - Liệt kê các id đó trong `story.json` → `"giong_nu": ["k03-04", …]`. Chỉ nên khoảng 5–20 câu mỗi tập; phần lớn vẫn là người kể.
  - Chạy một lệnh: `gd-voice.mjs <tập> --voice "Quốc Tuấn"` (tự đọc các id trong giong_nu bằng "Ngọc Huyền"). gd-check chặn nếu sai.
  - Trên hình, câu thoại nữ thì nhân vật nữ đang nói phải nhép miệng (`talk`).
  - Bạn nữ dùng vai "ban_nu" có sẵn.
- **Nhạc:** tự sinh, chỉ dùng nhạc cụ gảy hoặc gõ (piano, ukulele, đàn dây, lo-fi). KHÔNG kèn, sáo, clarinet hay tiếng thổi. Mean volume của nhac.ogg đo bằng `ffmpeg -af volume=-3dB,volumedetect` phải khoảng −35 dB. Tắt hẳn nhạc ở cảnh tóc rụng.
- **Font khác tập trước.** Tập 1 dùng Segoe Print, tập 2 dùng Patrick Hand + Bahnschrift. Chọn một font Google Fonts (OFL) có đủ dấu tiếng Việt: tải về một thư mục riêng, kiểm bằng fontTools với chuỗi "Thường Châu ưởng ỹ Ỗ đĐ ạệợ", rồi chép vào `godot/font/` và nạp như `but.gd` của tập 2.
- Chỉ Bạn có màu áo. Vai phụ đen trắng. Đầu vuông là người có quyền. Cọng tóc rụng đúng một lần, ở khúc tệ nhất (series thì ở phần cuối).

- **Chỉ dùng tư thế và biểu cảm có thật trong nv.gd** (POSES; expr chỉ binh/vui/met/buon/soc). Tên tự bịa làm nhân vật biến mất khỏi hình. Thiếu tư thế thì thêm vào POSES của engine. gd-check sẽ chặn.

- **Bài học đợt 11–20 (đều bị bắt sửa, đừng lặp):**
  - phim.gd phải có `func at(t, seg, line)` và dựng hình cho ĐÚNG cốt truyện của tập mình (tập 20 từng dựng cho chuyện khác).
  - Mọi lớp tự vẽ bằng `_draw` (nền, lớp trước, chữ) phải `queue_redraw()` mỗi khung trong `at()`. Thiếu thì soi vẫn đúng nhưng bản render kẹt hình.
  - Không ghi chữ meta lên hình như "CÚ LẬT", "MANH MỐI 1", "twist". Nhãn phải là nội dung trong chuyện.
  - Không dùng tên ngân hàng, app, công ty thật. Kiểm luật lao động/đất đai trước khi viết, sai thì nói chung chung.
  - Tự cộng lại mọi khoản tiền trong loi.txt và trên hình, ghi phép tính vào `## Sổ logic`.

## Lệnh
- Tạo tập: `node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/new-tap.mjs C:/Users/anhha/MuseStudio/cong-toc-cuoi/tap-<NN>-<slug> --ten "<khung>"`. NN là số tiếp theo, kiểm thư mục `tap-*`.
- Việc nặng phải chạy qua `bash C:/Users/anhha/MuseStudio/the-thao/_tools/slot.sh "<tên>" <lệnh>` (Git Bash):
  - Giọng: `node C:/Users/anhha/.claude/skills/teo-kiem-hiep/scripts/gd-voice.mjs <tập> --voice "<giọng>"`.
  - Soi hình: `node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/soi.mjs <tập>`. Lệnh này chụp 1 khung mỗi câu, ghép thành `work/soi-NN.jpg`. ĐỌC TỪNG ẢNH, sửa chữ đè mặt hay đè ảnh nền, chữ tràn hoặc bị cắt, nền có mảng đen hoặc trống, nhân vật bị che, sai tư thế. Sau đó chạy soi lại.
- Kiểm cú pháp GDScript: `C:/tool/Godot/Godot_v4.7.2-stable_win64_console.exe --headless --path <tập>/godot --check-only --script res://phim.gd`. Lấy giá trị từ Array hay Dictionary thì khai kiểu rõ, ví dụ `var x: float = …`.
- Soát tổng: `node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/gd-check.mjs <tập>` phải OK.
- Thumbnail: `godot/thumb.tscn` + `thumb.gd`, chạy có cửa sổ với `--position -10000,-10000`, lưu `thumb/thumb-godot.png`. Mở ảnh xem lại, mặt Bạn không được bị che.
- Nhạc: `work/nhac.py` → `godot/nhac.ogg`, chạy sau khi có `timeline.json` (gd-check tạo ra file này).

- **Chạy lệnh dài (giọng, soi) ở TIỀN CẢNH và chờ xong.** Không để chạy nền rồi kết thúc phiên: tác vụ nền bị huỷ khi agy thoát (tập 5 từng thoát khi giọng chưa đọc).

## DỪNG ở đây
KHÔNG chạy `gd-render.mjs --par 2` (bản cuối), không `pack.mjs`, không `gd-check --log`. TUYỆT ĐỐI KHÔNG tải lên YouTube, không mở FoxProfile hay trình duyệt, không chạy drive-sync, không xoá file của tập khác, không sửa SKILL.md hay data của skill (trừ dấu `(tập N)` trong chu-de.md), không gửi tin nhắn.

## Báo cáo cuối (ngắn)
- thư mục tập, chủ đề, điểm cổng
- tiêu đề, từ khoá chính, video ăn theo
- số phần, thời lượng theo gd-check
- các ảnh soi đã xem và đã sửa gì
- chỗ còn chưa chắc

Đừng ghi "đã soi, đạt" nếu chưa thật sự mở từng ảnh. Hỏng mà không tự sửa được thì dừng, báo lỗi kèm log.

NHIỆM VỤ CỤ THỂ:
- Tập 23 = Kho M1 'Shipper 14 tiếng, 1 đơn bom' (Bạn nam, ban_gioi "nam"; người kể Quốc Tuấn, thoại nhân vật nữ nếu có thì Ngọc Huyền qua giong_nu). Thư mục tap-23-<slug>. Font: Be Vietnam Pro. Nhạc: guitar điện funk tắt tiếng + trống máy nhanh như đường phố.
- Tập 24 = Kho D14 'Người yêu tặng khoá học làm giàu' (Bạn nữ, ban_gioi "nu"; người kể Quốc Tuấn, thoại nữ Ngọc Huyền qua giong_nu). Thư mục tap-24-<slug>. Font: Coiny. Nhạc: piano lounge sang chảnh giả tạo + harp gảy.
Ý tưởng và khung logic: đọc `C:/Users/anhha/MuseStudio/cong-toc-cuoi/kho-y-tuong.md`, mục "Chọn 10 tập 21–30" và "Khung logic tập 21–30". Tìm đúng khối `**Tập N, ID: …**`, chép vào `## Khung logic` của y-tuong.md, ghi dòng `Kho: <ID>` ở đầu y-tuong.md. KHÔNG sửa kho-y-tuong.md, KHÔNG sửa chu-de.md.
LÀM SONG SONG: 4 agent khác đang làm các tập 21–30 còn lại. Chỉ làm trong thư mục tập của bạn, đúng số tập được giao (KHÔNG tự lấy số tiếp theo). Việc nặng luôn qua slot.sh (chờ suất là bình thường). Bạn nữ dùng vai có sẵn "ban_nu" (b.setup("ban_nu")). Font giao sẵn phải kiểm dấu tiếng Việt bằng fontTools; thiếu dấu thì chọn font Google khác chưa tập nào dùng (đã dùng: Segoe Print, Patrick Hand, Charmonman, Mali, Pangolin, Itim, Sriracha, Grandstander, Kodchasan, Baloo 2, Playpen Sans, Shantell Sans, Fuzzy Bubbles, Lexend, Varela Round, Andika, Gluten, Sniglet, Comfortaa, Signika) và ghi lý do.
Mỗi tập: nghiên cứu trước (tieu-de.mjs, tìm trên mạng các tình huống người ta hay kể để chuyện nghe thật), rồi làm đủ quy trình. Một agent làm lần lượt 2 tập, xong tập trước mới sang tập sau, báo cáo cuối gộp cả 2 tập.

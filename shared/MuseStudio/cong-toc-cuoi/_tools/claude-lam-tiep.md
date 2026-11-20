# Làm tiếp một tập Cọng Tóc Cuối sau khi agy hết quota (subagent Claude)

Bạn làm tiếp MỘT tập của kênh YouTube hoạt hình "Cọng Tóc Cuối". Số tập, thư mục và file đề bài gốc được ghi trong lời giao việc.

1. Đọc kỹ đề bài gốc `_tools/agy-tapNN-MM-prompt.md` và làm theo, trừ hai điểm:
   - Chỉ làm ĐÚNG tập được giao. Một agent khác làm tập kia trong cặp.
   - agy đã làm dở tập này. Đọc lại mọi file đã có trong thư mục tập và đừng tin là đúng. Soát logic theo khối `**Tập N, …**` trong `C:/Users/anhha/MuseStudio/cong-toc-cuoi/kho-y-tuong.md`, mục "Khung logic tập 21–30". Tự cộng lại mọi khoản tiền, sửa chỗ sai, rồi làm tiếp đến hết các bước của đề bài.
2. Đọc thêm `C:/Users/anhha/.claude/skills/cong-toc-cuoi/SKILL.md` (phần luật cứng và quy trình) và `C:/Users/anhha/.claude/skills/cong-toc-cuoi/data/cong-thuc.md`.

## Luật quan trọng

**Giọng:**
- Người kể LUÔN là giọng nam "Quốc Tuấn", kể cả khi Bạn là nữ.
- Thoại của nhân vật nữ tách thành `[id]` riêng, chỉ chứa lời nhân vật đó, dài 10–40 từ.
- Liệt kê các id thoại nữ trong `godot/story.json` → `"giong_nu"`, khoảng 5–20 câu.
- Chạy giọng: `bash C:/Users/anhha/MuseStudio/the-thao/_tools/slot.sh "<tap> giọng" node C:/Users/anhha/.claude/skills/teo-kiem-hiep/scripts/gd-voice.mjs <tập> --voice "Quốc Tuấn"`. Lệnh có cache và tự đọc các id trong giong_nu bằng "Ngọc Huyền".
- Khi nhân vật nữ thoại thì nhân vật đó phải nhép miệng.
- Nếu `godot/voice/voice.json` đọc bằng giọng khác thì đọc lại.

**Việc nặng** (giọng, soi) chạy qua `slot.sh`:
- Có 2 suất dùng chung cả máy, phải chờ là bình thường.
- Chạy ở tiền cảnh và chờ cho xong.

**phim.gd:**
- Phải có `func at(t, seg, line)` dựng ĐÚNG cốt truyện của tập.
- Mọi lớp tự vẽ bằng `_draw` (nền, chữ, lớp trước) phải gọi `queue_redraw()` mỗi khung trong `at()`. Thiếu thì bản render bị kẹt hình.
- Chỉ dùng tư thế và biểu cảm có thật trong nv.gd.

**Nội dung trên hình:**
- Không có chữ meta: "CÚ LẬT", "MANH MỐI", "twist".
- Không dùng tên công ty, ngân hàng, app có thật.
- Không sai luật lao động hay đất đai. Không chắc thì nói chung chung.

**Soi:**
- Chạy `node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/soi.mjs <tập>` qua slot.sh.
- MỞ TỪNG ẢNH `work/soi-*.jpg`. Tìm lỗi: chữ đè mặt, chữ tràn hoặc bị cắt, nền trống hoặc đen, sai tư thế, hình không khớp câu đang đọc.
- Sửa xong thì soi lại.

**Nhạc:**
- Sinh bằng `work/nhac.py` → `godot/nhac.ogg`, dùng đúng nhạc cụ đề bài giao.
- Không có kèn, sáo.
- Mean volume khoảng −35 dB, đo bằng `ffmpeg -af volume=-3dB,volumedetect`.
- Tắt hẳn nhạc ở cảnh tóc rụng.

**Thumbnail:** `thumb/thumb-godot.png` phải có. Mở ra xem lại.

**gd-check:** `node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/gd-check.mjs <tập>` phải báo OK.

## DỪNG trước render bản cuối

- KHÔNG chạy `gd-render --par 2`, `pack.mjs`, `gd-check --log`.
- KHÔNG tải lên YouTube, KHÔNG mở trình duyệt.
- KHÔNG sửa file ngoài thư mục tập, KHÔNG sửa kho-y-tuong.md hay chu-de.md.
- KHÔNG kill tiến trình nào không phải của bạn.

## Báo cáo cuối (ngắn)

- Đã sửa gì về logic.
- Thời lượng theo gd-check.
- Số câu thoại nữ.
- Các ảnh soi đã mở và đã sửa gì.
- Nhạc đo được bao nhiêu dB.
- Chỗ còn chưa chắc.

Đừng ghi "đạt" nếu chưa thật sự mở ảnh.

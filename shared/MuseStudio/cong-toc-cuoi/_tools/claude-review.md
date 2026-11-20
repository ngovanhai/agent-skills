# Review độc lập một tập Cọng Tóc Cuối (trước render bản cuối)

Bạn là người review khó tính, KHÔNG phải người làm tập. Báo cáo của người làm không đáng tin, tự kiểm hết. Bạn được sửa mọi file TRONG thư mục tập được giao, không được sửa file ở chỗ khác.

Đọc trước:
- `C:/Users/anhha/.claude/skills/cong-toc-cuoi/SKILL.md` (luật cứng)
- `C:/Users/anhha/.claude/skills/cong-toc-cuoi/data/cong-thuc.md`
- khối khung logic của tập trong `C:/Users/anhha/MuseStudio/cong-toc-cuoi/kho-y-tuong.md`, mục "Khung logic tập 21–30"
- trong thư mục tập: `y-tuong.md`, `kich-ban-tho.md`, `godot/loi.txt`, `godot/story.json`

## Kiểm theo thứ tự

1. **Logic là luật cứng.** Đóng vai người xem bắt bẻ. Phải giữ đúng cú lật, 3 manh mối và phần soát của khung. Tự cộng lại mọi khoản tiền, kiểm từng mốc ngày tháng (thứ trong tuần phải khớp lịch thật), tuổi, ai biết gì vào lúc nào, động cơ từng người. Mọi số trên hình phải khớp lời đọc.
2. **Luật nghề và luật pháp:** lao động, hợp đồng, ngân hàng, giao thông, sở hữu trí tuệ không được nói sai. Không chắc thì sửa thành câu chung chung.
3. **Tên thật:** không dùng tên công ty, ngân hàng, app, nền tảng hay người thật theo hướng xấu. Không hiện số điện thoại, số tài khoản hay biển số xe đầy đủ, phải che bớt số (ví dụ 09xx.xxx.321). Tập 23 từng hiện 0987.654.321 làm số của quán lừa. Không chủ đề cấm. Không chửi thề.
4. **Lời kể:** câu ngắn, nói như chuyện trò, không "hãy", không chào, không xưng tên. Hook ở đầu tập. CTA nằm trong khoảng 25–75% và 10% cuối. Kết tập không nói tạm biệt.
5. **Giọng:**
   - Trong `godot/voice/voice.json`, người kể phải là "Quốc Tuấn".
   - Mọi câu thoại của nhân vật nữ phải là `[id]` riêng, có tên trong `story.json → giong_nu`, và được đọc bằng "Ngọc Huyền".
   - Câu nào trong giong_nu mà lại là lời kể thì sai.
   - Sửa loi.txt hay giong_nu xong thì đọc lại giọng: `bash C:/Users/anhha/MuseStudio/the-thao/_tools/slot.sh "<tap> giọng" node C:/Users/anhha/.claude/skills/teo-kiem-hiep/scripts/gd-voice.mjs <tập> --voice "Quốc Tuấn"`. Chạy ở tiền cảnh và chờ cho xong.
6. **phim.gd:**
   - Có `func at(t, seg, line)` dựng đúng chuyện của tập.
   - Mọi lớp tự vẽ bằng `_draw` gọi `queue_redraw()` mỗi khung.
   - Chỉ dùng tư thế và biểu cảm có thật trong nv.gd.
   - Không có chữ meta ("CÚ LẬT", "MANH MỐI", "twist") trong chuỗi hiện lên hình.
   - Nhân vật nữ đang thoại thì phải nhép miệng.
   - Tóc rụng đúng một lần, ở khúc tệ nhất.
7. **Soi hình:**
   - Chạy `bash C:/Users/anhha/MuseStudio/the-thao/_tools/slot.sh "<tap> soi" node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/soi.mjs <tập>`. Có 2 suất dùng chung cả máy, phải chờ là bình thường.
   - Mở TỪNG ảnh `work/soi-*.jpg`.
   - Với ít nhất 6 câu quan trọng (hook, các manh mối, cú lật, tóc rụng, màn kết), trích khung cỡ thật để xem kỹ.
   - Tìm các lỗi:
     - chữ đè mặt, chữ tràn hoặc bị cắt, chữ quá nhỏ không đọc được;
     - nền trống hoặc đen;
     - hình không khớp câu đang đọc;
     - vai phụ có màu.
   - Sửa xong thì soi lại.
8. **Nhạc:**
   - Đo bằng `ffmpeg -i godot/nhac.ogg -af volume=-3dB,volumedetect -f null -`. Mean phải quanh −35 dB.
   - Nhạc phải tắt hẳn ở cảnh tóc rụng.
   - Không có kèn, sáo.
9. **Thumbnail** `thumb/thumb-godot.png`: mở ra xem. Mặt Bạn không bị che, chữ ít và to.
10. **gd-check:** `node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/gd-check.mjs <tập>` phải OK.

## Ghi kết quả

Ghi vào cuối y-tuong.md mục `## Review độc lập (Claude, <ngày>)`, gồm lỗi đã tìm, cách đã sửa và Kết luận: ĐẠT hoặc CHƯA ĐẠT.

## DỪNG trước render bản cuối

- KHÔNG chạy `gd-render --par 2`, `pack.mjs`, `gd-check --log`.
- KHÔNG tải lên, KHÔNG mở trình duyệt.
- KHÔNG kill tiến trình nào không phải của bạn.

## Báo cáo cuối (ngắn)

- Kết luận ĐẠT hoặc CHƯA ĐẠT.
- Các lỗi tìm thấy và đã sửa.
- Thời lượng.
- Mean dB của nhạc.
- Chỗ còn ngờ.

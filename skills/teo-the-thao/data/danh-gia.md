# Cổng chọn chủ đề và review kịch bản (bắt buộc mỗi tập, mỗi short riêng)

Người dùng yêu cầu (2026-10-26): chủ đề tin tức phải qua luật đánh giá trước khi chọn, và mỗi kịch bản phải được review lại.
Kết quả ghi vào `<tap>/y-tuong.md` hai mục `## Đánh giá chủ đề` và `## Review kịch bản`; gd-check chặn nếu thiếu hoặc chưa đạt.

## 1. Đánh giá chủ đề (trước khi viết kịch bản)

### 1a. Loại ngay (chỉ cần 1 điều là bỏ chủ đề)
- Chưa có **2 nguồn uy tín độc lập** xác nhận sự việc chính (tỉ số, ai ghi bàn, chuyển nhượng đã chính thức chưa…). Tin đồn chuyển nhượng, "theo nguồn tin", mạng xã hội = loại.
- Sự việc chưa kết thúc mà video sẽ lỗi thời trước khi đăng (trận đang đá, lễ trao giải chưa công bố, kết quả có thể đổi sau VAR/kháng cáo).
- Lõi chuyện là bi kịch hay đời tư: chấn thương nặng, qua đời, bạo lực, scandal pháp lý chưa kết luận, phân biệt chủng tộc, chính trị, cá cược/dàn xếp tỉ số.
- Chỉ kể được bằng clip/ảnh/nhạc truyền hình (không dựng lại được bằng hoạt hình chibi).
- Trùng chủ đề tập cũ (gd-check `chu_de` ≥80%) mà không có góc mới.
- Không đủ chất liệu cho ≥8 phút (video dài) mà không phải độn.

### 1b. Chấm điểm (1–5 mỗi mục, ghi lý do một dòng)
| mục | 5 điểm khi | trọng số |
|---|---|---|
| Độ nóng | xảy ra trong 72 giờ, đang lên báo lớn Việt Nam | ×2 |
| Sức hút với khán giả Việt | đội/cầu thủ có fan đông ở Việt Nam (MU, Real, Barca, Liverpool, Messi, Ronaldo, tuyển Việt Nam…) | ×2 |
| Tranh luận | có câu hỏi hai phía rõ ràng để bình luận | ×1 |
| Độ chắc dữ kiện | ≥3 nguồn khớp nhau ở mọi con số chính | ×1 |
| Dựng được | có ≥1 pha bóng/khoảnh khắc dựng lại hay bằng Godot | ×1 |
| Tuổi thọ | còn người xem sau 2 tuần (cột mốc, kỷ lục, kình địch) | ×1 |
Tổng tối đa 40. **Chọn khi ≥ 28** và không mục nào = 1. Dưới 28 thì chọn chủ đề kinh điển trong `chu-de.md` thay vì tin tức.
So 3 ý trong cùng bảng, ghi ý được chọn và vì sao.

### 1c. Kiểm thời điểm
- Ghi `story.so_lieu_ngay`. Nếu từ lúc chọn đến lúc tải lên có sự kiện mới làm sai câu nào (vòng đấu mới, kết quả giải thưởng), phải sửa lời trước khi tải.

## 2. Review kịch bản (sau khi viết `loi.txt`, trước khi đọc giọng)

### 2a. Tự soát theo checklist
1. **Dữ kiện:** mỗi con số, tên, phút, tỉ số trong lời có trong bảng dữ kiện với 2 nguồn. Câu so sánh lịch sử ("lần đầu", "tốt nhất trước đó", "kỷ lục", "duy nhất") phải tự WebSearch lại độc lập dù bảng đã ghi nguồn (tập 3: bảng ghi "tứ kết 2013 — Wikipedia en + vi" nhưng Việt Nam không dự 2013). Chi tiết chỉ 1 nguồn → bỏ hoặc nói chung chung. Không thêm diễn giải thành sự thật (ví dụ "rút một tiền vệ ra" khi không biết ai bị thay).
2. **Ý kiến:** mọi nhận định, chấm điểm, "hay nhất" nói rõ là ý kiến của Tèo; lời của người khác (HLV chỉ trích VAR…) nói rõ là lời họ.
3. **Cấm:** không từ cá cược (kể cả "đặt cược" theo nghĩa bóng), không chê ngoại hình/đời tư, không hạ nhục đội thua, không kích động fan, trích nguyên văn ≤1 câu.
4. **Cấu trúc tăng sub:** hook ≤30 s đúng 3 nhịp, Tèo giới thiệu vai sớm, vòng mở được trả lời, re-hook, xin đăng ký ở 30–50% có lợi ích, câu hỏi bình luận hai lựa chọn, câu kết móc tập sau không chào tạm biệt.
5. **Giọng đọc:** câu ≥10 từ, tên riêng viết theo cách đọc tiếng Việt, số đọc bằng chữ khi dễ đọc sai, không câu nào quá 40 từ.
6. **Độ dài:** ước 4,1 từ/giây, tổng 8:00–14:30.
7. **Lời hứa ở tiêu đề/thumbnail** được trả trong video.

### 2b. Review độc lập
Gọi một subagent (Agent tool) đọc **chỉ** `loi.txt` + bảng dữ kiện trong `y-tuong.md` + file này, không đưa nhận xét của mình, yêu cầu liệt kê: câu sai/thiếu nguồn, câu vi phạm luật, câu yếu (hook, CTA, kết), câu khó đọc. Sửa theo từng điểm hợp lý; điểm không sửa thì ghi lý do.

### 2c. Ghi kết quả vào `y-tuong.md`
```
## Review kịch bản
- Lần 1 (tự soát): <các điểm đã sửa>
- Lần 2 (review độc lập): <các điểm, đã sửa / không sửa vì…>
- Kết luận: ĐẠT
```
Sửa lời sau khi đã đọc giọng thì review lại phần sửa và thêm một dòng.

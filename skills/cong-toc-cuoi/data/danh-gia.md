# Cổng chọn chủ đề và review kịch bản (bắt buộc mỗi tập, mỗi short riêng)

Kết quả ghi vào `<tap>/y-tuong.md` hai mục `## Đánh giá chủ đề` và `## Review kịch bản`; gd-check chặn nếu thiếu hoặc chưa đạt.

## 1. Đánh giá chủ đề (trước khi viết kịch bản)

### 1a. Loại ngay (chỉ cần 1 điều là bỏ)
- Chuyện chỉ đứng được nếu dạy cách phạm pháp, hoặc phải dùng tên công ty/người thật để bôi xấu.
- Logic không khép được: twist phải vứt bỏ chi tiết đã kể, hoặc tiền/thời gian không cộng ra.
- Chuyện chỉ là kể lể đều đều, không có cú lật hay tình huống nào khiến người xem muốn biết "rồi sao nữa". Kiểu `thẳng` thì phải có các bước sai leo thang tới khúc tệ nhất.
- Trùng chủ đề tập cũ (gd-check `chu_de` ≥80%) mà không có góc mới.
- Không đủ chất liệu cho ≥10 phút mà không phải độn.

### 1b. Chấm điểm (1–5 mỗi mục, ghi lý do một dòng)
| mục | 5 điểm khi | trọng số |
|---|---|---|
| Nhiều người từng trải | phần lớn người 20–35 tuổi ở Việt Nam đã hoặc sắp gặp; với chủ đề nghề: nhiều người từng tiếp xúc với nghề đó (gọi tổng đài, họp phụ huynh) | ×2 |
| Đau mà buồn cười | có tình huống trớ trêu để mỉa nhẹ, không chỉ bi | ×2 |
| Tranh luận | có câu hỏi hai phía để bình luận (ở lại hay về quê, vay hay không) | ×1 |
| X: Twist (kiểu `lật`) hoặc Bài học (kiểu `thẳng`) | `lật`: có ít nhất một cú lật bất ngờ mà vẫn hợp lý (người tưởng tốt hoá ra…, việc tưởng lời hoá ra lỗ). `thẳng`: bài học người xem làm theo được ngay, có con số | ×1 |
| Cao trào tóc rụng | có một khoảnh khắc tệ nhất rõ ràng cho cọng tóc rụng | ×1 |
| Tuổi thọ | còn người tìm xem sau nhiều tháng | ×1 |
Tổng tối đa 40. **Chọn khi ≥ 28**. Cứ 10 video phải có ≥3 video "bên trong một nghề" (bên Lạnh, nhóm nghề có trung vị 617K, cao nhất kênh) dù điểm thấp hơn chuyện gia đình vài điểm. và không mục nào = 1. So 3 ý trong cùng bảng, ghi ý được chọn và vì sao. Dòng cuối: `Tổng: NN/40`.

### 1c. Kiểm thời điểm
Ghi `story.so_lieu_ngay`. Giá, lương tối thiểu, lãi suất, luật có thể đổi: nói "tính đến …" trong lời.

### 1d. Kho ý tưởng: tạo trước, lọc sau (bắt buộc từ tập 11)
Nguồn duy nhất là `cong-toc-cuoi/kho-y-tuong.md`. Không lấy ý ngoài kho để làm tập. Quy trình đi theo 4 tầng, tầng trước phải xong mới sang tầng sau:
1. **Tạo:**
   - Mỗi đợt tạo tối thiểu 50 ý.
   - Mỗi ý ghi một dòng gồm ID, ý, cú lật hoặc bài học, `Học từ` (nếu có), điểm T H C X R S, tổng và trạng thái.
   - Chưa cần tiêu đề, chưa cần kịch bản.
   - **Biến tấu từ kênh nhiều view** (`do-kenh.mjs`). Các công thức đã thấy ăn view:

     | Công thức | Kênh học từ | Biến tấu cho Bạn |
     |---|---|---|
     | Thang cấp bậc | Hypothetically | đời Bạn ở từng mức lương hoặc từng cấp, mỗi nấc một nền, tóc gục dần |
     | Đạo lý dạy dỗ | Dhar Mann, Quà Tặng Cuộc Sống | người sai tự trải qua và hiểu ra, kết bằng một câu dạy; kiểu `thẳng` |
     | Ngụ ngôn hai người | Quà Tặng Cuộc Sống | hai anh em hay hai bạn cùng xuất phát, 10 năm sau, kể song song |
     | Câu hỏi tiền vô lý | Infographics, Two Cents | "Vì sao lương X mà tiêu Y?", Bạn tự cộng từng khoản |
     | Soi lời khuyên trên mạng | Two Cents | Bạn làm theo một năm, lời nào đúng, lời nào chỉ hợp người đã giàu |
     | Nỗi sợ tiền có mốc năm | Rùa Tài Chính | so 2022 với 2026, lãi sau ưu đãi, đất không bán được |
     | Châm biếm không lời | Steve Cutts | Short 60 giây vòng đời đi làm của Bạn |
     | "Tại sao thật tệ khi…" | Lạnh Vcl | bên trong một nghề; không chép tiêu đề |

     - Chỉ học công thức. Không chép tiêu đề, chuyện hay nhân vật.
     - Video nước ngoài thì đổi sang bối cảnh Việt Nam: lương, giá, luật, thói quen.
2. **Loại:** ý vướng 1a thì ghi `bỏ` kèm lý do. Ý dưới 28 điểm cũng ghi `bỏ`.
3. **Chọn đợt 10:** chỉ chọn trong các ý `chờ` đạt từ 33 điểm trở lên. Đợt chọn phải thoả các điều kiện:
   - không quá 2 ý cùng nhóm;
   - có từ 3 ý nghề trở lên;
   - Bạn nam và Bạn nữ xen nhau;
   - hợp mùa;
   - không trùng nội dung 10 tập gần nhất.

   Ghi lý do chọn của từng ý, và vì sao 3 ý điểm cao nhất bị đẩy xuống dự phòng.
4. **Khung logic:** mỗi ý được chọn phải có 3 phần.

   Kiểu `lật`:
   - **Cú lật:** ai giấu gì, vì sao giấu.
   - **3 manh mối:** gieo trước cú lật, người xem tua lại phải thấy được.
   - **Soát:** cộng tiền, đếm năm tháng, ai biết gì vào lúc nào.

   Kiểu `thẳng`:
   - **Bài học:** một câu, kèm con số.
   - **3 bước sai:** leo thang tới khúc tệ nhất, chỗ tóc rụng.
   - **Cách làm đúng + soát:** làm lại thế nào; cộng tiền và đếm thời gian cho khớp.

   Ý không khép được logic thì đổi thành `bỏ` và lấy ý dự phòng.

Kho còn dưới 15 ý `chờ` đạt từ 33 điểm thì phải tạo đợt mới trước khi chọn. Sau khi có số view thật của các tập đã đăng, cập nhật điểm T và H của nhóm đó trong kho: nhóm nào view thấp thì trừ điểm.

## 2. Review kịch bản (sau khi viết `loi.txt`, trước khi đọc giọng)

### 2a. Tự soát
0. **Logic xuyên suốt (soi trước tiên):** đối chiếu `## Sổ logic` trong y-tuong.md: dòng thời gian, tuổi, sổ tiền cộng đúng, nhân vật không biết điều họ chưa thể biết, động cơ từng người hợp lý, twist có manh mối gieo trước và không phủ nhận chi tiết đã kể.
1. **Logic chuyện:** chuyện bịa được, nhưng tự nó phải khớp (lương 8 triệu thì không thuê phòng 10 triệu; twist có manh mối gieo trước). Con số/luật thật nào được nói ra thì có trong bảng dữ kiện với 2 nguồn.
2. **Ngôi kể:** "bạn" suốt video; không "tôi/mình là", không chào. Thoại vai phụ ngắn, đặt trong ngoặc kép.
3. **Cấm:** không chửi thề, không tục, không chê ngoại hình/vùng miền/giới tính, không nêu tên công ty/người thật theo hướng xấu (dùng tên bịa), không dạy cách phạm pháp. Chủ đề thì không cấm gì.
4. **Cấu trúc:** hook ≤30 s 3 nhịp, re-hook, xin đăng ký ở 30–50% có lợi ích, câu hỏi bình luận hai lựa chọn, đúng một khoảnh khắc tóc rụng ở khúc tệ nhất, kết móc video khác không chào tạm biệt.
5. **Giọng đọc:** câu ≥10 từ, ≤40 từ; số đọc dễ sai thì viết bằng chữ; viết tắt (KCN, BHXH) viết đủ chữ.
6. **Độ dài:** ≈4,2 từ/giây, tổng 10:00–18:00.
7. **Lời hứa ở tiêu đề/thumbnail** được trả trong video.

### 2b. Review độc lập
Gọi một subagent (Agent tool) đọc **chỉ** `loi.txt` + bảng dữ kiện trong `y-tuong.md` + file này, không đưa nhận xét của mình, yêu cầu liệt kê **trước tiên mọi lỗ hổng logic** (mâu thuẫn thời gian, tiền, ai biết gì, động cơ, twist gượng), rồi: câu sai/thiếu nguồn, câu vi phạm luật, câu yếu (hook, CTA, kết), câu khó đọc, chỗ nhàm (chặng nào kể lể không có tình huống). Sửa theo từng điểm hợp lý; điểm không sửa thì ghi lý do.

### 2c. Ghi vào `y-tuong.md`
```
## Review kịch bản
- Lần 1 (tự soát): <các điểm đã sửa>
- Lần 2 (review độc lập): <các điểm, đã sửa / không sửa vì…>
- Kết luận: ĐẠT
```

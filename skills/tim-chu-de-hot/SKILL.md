---
name: tim-chu-de-hot
description: Tìm chủ đề bóng đá ĐANG NÓNG trong ngày, tuần và tháng để làm video ăn ké view (đi theo sự kiện người xem đang theo dõi) hoặc ăn tìm kiếm (đúng cụm từ người xem đang gõ trên YouTube). Script quét Google Trends VN, RSS báo thể thao, YouTube (video nhiều view nhất hôm nay/tuần/tháng, cụm từ lặp trong tiêu đề) và gợi ý tìm kiếm YouTube, sau đó chấm điểm và ra 5 đề xuất có tiêu đề chứa từ khoá và hạn chót đăng. Dùng khi người dùng nói "tìm chủ đề hot", "đang hot gì", "chủ đề ăn view", "ăn ké trend", "trend bóng đá hôm nay", "chọn chủ đề tập sau", và BẮT BUỘC chạy ở bước 0 của mỗi tập teo-the-thao (job teo-tt-video-dai).
---

# Tìm chủ đề nóng để ăn view

`SKILL = thư mục chứa file này` · Kết quả ghi vào `C:/Users/anhha/MuseStudio/the-thao/_hot/`.

Vì sao có skill này (2026-10-30): các tập chọn theo series (lịch sử CLB, cuộc đời huyền thoại) gần như không có view. Ngày 29/10 kênh có 2 sub và CTR tập dài 0,8–1,0%. Video tốt nhất là Short Camavinga (1.100 view) làm ngay sau trận El Clásico. Kết luận: **đi theo thứ người xem đang theo dõi và đang gõ tìm**, không đi theo lịch của mình.

## Bước 1: quét số liệu (≈20 giây)

```bash
cd C:/Users/anhha/MuseStudio/the-thao/_hot
node ~/.claude/skills/tim-chu-de-hot/scripts/hot.mjs --out $(date +%F).md --json $(date +%F).json
# thêm hạt giống khi cần đào sâu: --seed "u15 việt nam,fifa asean cup,quả bóng vàng"
```

Báo cáo gồm:
1. **Tên đang nóng**: đếm số tin 48 giờ, số video và view trong tuần, Google Trends, kèm gợi ý tìm kiếm YouTube của từng tên.
   - 1b. **Cụm từ lặp** trong tiêu đề video nhiều view (tuần + tháng), có ≥2 kênh khác nhau. Mục này bắt được cả tiêu đề VIẾT HOA.
2. **Google Trends VN hôm nay**, đánh dấu mục thể thao.
3. **YouTube**: video nhiều view nhất hôm nay, tuần, tháng (view, lúc đăng, kênh).
4. **Câu hỏi người xem đang gõ**: gợi ý của các cụm "tại sao / vì sao / ai là / tiểu sử / lịch sử / câu chuyện / huyền thoại / so sánh" + bóng đá.
5. **Tin thể thao 48 giờ qua.**

Nếu một tên hoặc cụm nổi lên mạnh, chạy lại với `--seed "<tên>"` để xem view và gợi ý tìm kiếm riêng cho nó.

## Bước 2: bổ sung lịch (WebSearch, 3–5 truy vấn)

- Lịch thi đấu 7 ngày tới: Ngoại hạng Anh, Champions League, El Clásico, derby.
- Sự kiện trong tháng: Quả bóng vàng, kỳ chuyển nhượng, giải ASEAN/châu Á/World Cup, ngày bốc thăm.
- "Ngày này năm xưa" trong 7 ngày tới: kỷ niệm trận lớn hay chức vô địch (không lấy Việt Nam).
- Một truy vấn "<tên nóng nhất> tranh cãi" để biết người xem đang cãi điều gì.

## Bước 3: biến dữ liệu thành đề tài

Mỗi tên hoặc sự kiện nóng có thể đi theo 3 kiểu góc:

| kiểu | khi nào | ví dụ góc | hạn đăng |
|---|---|---|---|
| **Ăn ké sự kiện** | tin đang dồn dập (≥3 tin/48 giờ hoặc video tuần ≥1 triệu view) | câu chuyện đằng sau, người trong cuộc là ai, vì sao có tranh cãi, so sánh với lần trước | ≤48 giờ sau đỉnh tin |
| **Đón trước** | sự kiện sắp diễn ra trong 1–5 ngày | lịch sử đối đầu, "lần gần nhất…", 5 điều cần biết trước trận | trước giờ diễn ra 12–36 giờ |
| **Ăn tìm kiếm** | cụm có trong gợi ý YouTube (bước 1 mục 1 và 4) | đặt đúng cụm người xem gõ làm đầu tiêu đề: "Tiểu sử …", "Vì sao …", "… là ai" | không gấp, view đến dần |

**Chấm điểm** mỗi ứng viên (1–5 cho mỗi mục, tổng /25, chọn khi ≥17):
- **Nóng**: số tin, view video tuần, có trên Google Trends không.
- **Có người tìm**: cụm từ khoá có nằm trong gợi ý YouTube không, càng cụ thể càng tốt.
- **Còn khoảng trống**: video top đầu chỉ là highlight, livestream hay giả lập trận thì mảng kể chuyện/giải thích còn trống (điểm cao). Đã có nhiều video kể chuyện cùng góc thì điểm thấp.
- **Hợp kênh**: kể được bằng lời + chibi, đúng luật teo-the-thao (không clip, không logo, không cá cược, không bôi nhọ). Không cộng điểm góc Việt Nam (đề Việt Nam bị loại từ 2026-11-05)
- **Kịp**: làm xong và đăng trước hạn được không (một tập dài mất khoảng 3–5 giờ máy).

Loại ngay:
- Mọi đề bóng đá liên quan Việt Nam (người dùng chốt 2026-11-05 cho kênh Tèo Thể Thao): tuyển/U23/U17/CLB Việt Nam, V.League, cầu thủ Việt, Việt kiều, HLV ở Việt Nam.
- Tin đồn chưa xác nhận; chuyện đời tư, scandal, tai nạn hay cái chết để câu view.
- Đề tài chỉ có thể làm bằng highlight hay hình truyền hình.
- Tiêu đề hứa điều video không có.

## Bước 4: viết đề xuất

Ghi `_hot/<ngày>-de-xuat.md`, gồm 5 đề xuất xếp theo điểm. Mỗi đề xuất có:
- **Chủ đề + góc** (một câu) · **kiểu** (ăn ké / đón trước / ăn tìm kiếm) · **điểm /25** kèm lý do từng mục, dẫn số từ báo cáo.
- **3 tiêu đề**:
  - Từ khoá người xem gõ (tên + sự kiện, ví dụ "Yamal", "Quả bóng vàng mọi thời đại") đứng trong 40 ký tự đầu.
  - Có một vòng mở (vì sao, ai, bao nhiêu).
  - ≤60 ký tự, theo công thức trong `teo-the-thao/data/tang-truong.md` mục 2.
- **Chữ thumbnail** ≤4 từ, **hạn chót đăng** (ngày giờ), **video nguồn hoặc tin** để research.
- **3 Short gợi ý**, cắt từ tập dài đó. Short của chủ đề nóng nên đăng ngay trong ngày tập dài lên.

## Dùng trong kênh Tèo Thể Thao

- **Job `teo-tt-video-dai` bước 0:** chạy skill này trước khi chọn chủ đề. Đề xuất số 1 đạt ≥17/25 thì **làm nó, thay cho series** trong ke-hoach-30-ngay.md.
  - Series chỉ dùng khi không có gì nóng, và ưu tiên phần series dính tên đang nóng. Ví dụ: Ronaldo vừa thắng bầu chọn Quả bóng vàng mọi thời đại thì làm đúng góc đó.
  - Ghi điểm, kiểu và hạn đăng vào `y-tuong.md` mục "Đánh giá chủ đề".
- **Đề tài ăn ké phải lên lịch đăng sớm:** sau khi đẩy Drive, ghi `youtube/UU-TIEN.txt` chứa hạn chót. Job đăng (`dang-tu-drive.mjs chon`) đưa tập có file này lên trước các tập cũ.
- Mỗi tối job `teo-tt-so-lieu` so view của tập theo trend với tập theo series, rồi ghi bài học vào `tang-truong.md`.

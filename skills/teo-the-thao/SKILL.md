---
name: teo-the-thao
description: >-
  Làm một tập kênh Tèo Thể Thao (@TeoTheThao) về BÓNG ĐÁ (8–14:30 phút, tiếng Việt, giọng Hải Đăng) dựng toàn bộ bằng Godot 2D, theo cẩm nang tăng sub (tiêu đề, hook, CTA, câu kết) và kế hoạch 30 ngày 1.000 sub: research
  (≥2 nguồn/dữ kiện, ghi mốc số liệu) → kịch bản loi.txt → khung tự thiết kế → giọng → nhân vật chibi (nhan-vat-chibi + ve.mjs)
  → phim.gd riêng của tập (sân, pha bóng, sơ đồ chiến thuật) → soi sheet → render → nhạc, ảnh bìa, gói YouTube → đẩy Drive vào hàng chờ (job tự đăng 07:00 tin nóng / 19:00 kể chuyện). Short đang tắt.
  Có khung project (new-tap), bộ soát (gd-check) và sổ chống lặp. Dùng khi người dùng nói "Tèo thể thao", "Tèo bóng đá",
  "tập bóng đá mới", "video bóng đá của Tèo", "so sánh cầu thủ", "kể lại trận đấu", "quản lý kênh Tèo Thể Thao", "tăng sub kênh bóng đá".
---

# Tèo Thể Thao × Godot 2D: bóng đá, mỗi tập một kịch bản, một khung, một bộ code hình

`SKILL = thư mục chứa file này` · `KH = ~/.agent-skills/skills/teo-kiem-hiep` (mượn script giọng/render/mặt) · `LOCK = bash $HOME/MuseStudio/the-thao/_tools/slot.sh`
Godot 4.7.2: `$HOME/Godot/Godot.app/Contents/MacOS/Godot` · Thư mục tập: `$HOME/MuseStudio/the-thao/tap-<NN>-<slug>/` (slug không dấu, gạch nối).
Học cách dựng Godot từ tập mẫu kiếm hiệp `$HOME/MuseStudio/kiem-hiep/tap-01-tieu-phong-vs-quach-tinh/godot/` (chỉ đọc).

Skill này là bản bóng đá của `teo-kiem-hiep-godot`: cùng quy trình Godot, cùng hợp đồng render, nhưng luật nội dung, kho chủ đề và cảnh hành động là của bóng đá. **Không dùng `chuong-2d`** (đó là chưởng kiếm hiệp).

## Tăng sub: đọc trước mỗi tập

Người dùng giao quản lý kênh với mục tiêu **1.000 sub trong 30 ngày** (2026-10-26). Trước khi chọn chủ đề, đọc:
- `SKILL/data/tang-truong.md`: chọn chủ đề, công thức tiêu đề, thumbnail, hook 30 s, re-hook, xin đăng ký, câu kết, Shorts, đo và sửa, điều cấm.
- `SKILL/data/ke-hoach-30-ngay.md`: nhịp 2 tập dài/ngày (07:00 + 19:00, không Short từ 2026-11-03), lịch chủ đề, mốc sub, nhật ký đăng và số liệu (cập nhật sau mỗi lần đăng/xem Studio).

## Luật cứng

- **Lịch hiện hành (người dùng chốt 2026-11-03, sửa 2026-11-05):**
  - **KHÔNG làm chủ đề bóng đá liên quan Việt Nam** (người dùng chốt 2026-11-05): không tuyển/U23/U17/CLB Việt Nam, V.League, cầu thủ Việt, Việt kiều, HLV ở Việt Nam. Đề nóng nào dính Việt Nam thì LOẠI, kể cả điểm cao. Tập Việt Nam cũ đã đăng giữ nguyên.
  - **Chỉ làm và đăng TẬP DÀI. KHÔNG làm Short, KHÔNG đăng Short.** Bỏ bước 13 và mục "Shorts dọc". Job `teo-tt-short` đã tắt, `dang-tu-drive.mjs` đặt `MAX_SHORT = 0`. Chỉ bật lại khi người dùng bảo.
  - **Đăng 2 tập dài mỗi ngày: 07:00 là TIN NÓNG, 19:00 là KỂ CHUYỆN** (người dùng chốt 2026-11-05). Job `teo-tt-dang-bai` chạy 20:00 hẹn 19:00 hôm sau.
    - **Tin nóng 07:00: job `teo-tt-tin-sang` chạy 04:00 mỗi ngày** tìm tin mới nhất, làm 1 tập (Claude tự làm, 8–10 phút), ghi UU-TIEN.txt, đẩy Drive rồi `chon-mot` hẹn 07:00 cùng ngày (trễ thì giờ tròn kế tiếp trước 19:00). Không làm tin nóng trước nhiều ngày.
    - Kể chuyện 19:00: lịch sử CLB, cuộc đời cầu thủ, chuyện ít người biết (kho `the-thao/_hot/2026-11-05-kho-ben-le.md` + series trong chu-de.md), làm trước nhiều ngày. KHÔNG ghi UU-TIEN.txt; không đời tư/scandal. Job `teo-tt-dang-bai` chạy 20:00 mỗi tối, hẹn khe 19:00 NGÀY MAI bằng tập kể chuyện cũ nhất (người dùng chốt 2026-11-05).
  - **Phong cách hình ảnh theo khung giờ (người dùng chốt 2026-11-20):**
    - **Video sáng 07:00 (tin nóng, job `teo-tt-tin-sang`):** **GIỮ NGUYÊN** phong cách chibi rig v2 (`chibi.gd` + `ve-cartoon.mjs` + pha bóng + sân cỏ).
    - **Video 19:00 (kể chuyện, job `teo-tt-video-dai` / làm tay tập kể chuyện):** Dùng **ảnh nhân vật** (chân dung/cutout PNG nền trong suốt) rồi render dạng **ảnh hoạt hình (2.5D / cutout motion)** trong Godot — **KHÔNG** dùng nhân vật chuyển động `chibi.gd` rig v2 nữa.
  - **Sản xuất:** job `teo-tt-tin-sang` 04:00 (tin nóng, 1 tập); job `teo-tt-video-dai` 07:05, 14:05, 21:05 (Task Scheduler `\TeoTheThao\`) chỉ làm tập KỂ CHUYỆN, nghỉ lượt khi hàng chờ đã ≥4 tập kể chuyện. Làm dư thì tập nằm trong hàng chờ để dự phòng.
  - **agy hết hạn mức thì KHÔNG dùng agy nữa.** Trước khi gọi agy, đọc `the-thao/_tools/agy-het-han.txt`; mốc mở lại chưa tới thì không gọi. agy trả 429 / RESOURCE_EXHAUSTED / "Resets in …" thì ghi mốc mở lại vào file đó. Cả hai trường hợp đều không dừng job: **Claude tự làm trọn tập** theo quy trình dưới đây, vẫn review kịch bản bằng subagent độc lập, rồi pack → `drive-sync --xoa`. Chi tiết ở `SKILL/data/van-hanh.md`.
- **Quy trình đăng (người dùng chọn 2026-10-27): làm xong → review → pack → `drive-sync --xoa` lên Drive vào hàng chờ; KHÔNG tải lên YouTube khi sản xuất.** Job `teo-tt-dang-bai` mỗi sáng 05:30 lấy từ hàng chờ (`the-thao/_tools/dang-tu-drive.mjs`, sổ `_tools/da-dang.json`) tối đa 2 tập dài, tải lên và **tự hẹn giờ công khai** 07:00 và 19:00 (người dùng chọn tự công khai, không duyệt từng ngày). Cách tải và hẹn giờ: `SKILL/data/van-hanh.md`. Kiểm avatar góc phải là kênh Tèo Thể Thao. Không gửi tin nhắn, không bình luận ở kênh khác. Người dùng muốn **làm liên tục**: xong tập này làm ngay tập sau.
- Sản xuất theo `ke-hoach-30-ngay.md` khi người dùng bảo làm hoặc khi job theo lịch (người dùng đã tạo 2026-10-26) chạy; ghi mỗi lần chạy vào `$HOME/MuseStudio/the-thao/_tools/job-log.md`.
- Trước khi chọn chủ đề, đọc mục "Bài học từ số liệu" cuối `tang-truong.md`.
- Chỉ sửa thư mục tập đang làm, `$HOME/MuseStudio/ideas/DA-LAM.md` (mảng "Tèo thể thao"), dấu `(tập N)` trong `SKILL/data/chu-de.md` và hai nhật ký trong `ke-hoach-30-ngay.md`. Không sửa `kit/`.
- Không chia chương, không nói "Chương X". **Video dài 8:00–14:30** (người dùng chốt dưới 15 phút; nhắm 10–13 phút). gd-check chặn quá 14:30.
- **Bản quyền và hình ảnh:**
  - Được: tên cầu thủ/CLB/giải, tỉ số, số liệu, kể lại bằng lời của mình, bình luận, so sánh.
  - KHÔNG dùng clip, ảnh, âm thanh truyền hình; KHÔNG dùng nhạc chính thức (anthem Champions League, nhạc World Cup, nhạc cổ vũ CLB có bản quyền).
  - KHÔNG vẽ logo/huy hiệu CLB, logo FIFA/UEFA/giải, logo nhà tài trợ, cúp vẽ giống hệt thiết kế chính thức. Áo chỉ dùng **màu chủ đạo + số áo**, cúp vẽ cách điệu.
  - Cầu thủ thật luôn vẽ **chibi** (đầu to, thân 2–3 đầu); chỉ lấy nét đặc trưng phổ biến (kiểu tóc, râu, màu da, số áo), không vẽ theo ảnh chụp.
  - Trích nguyên văn lời phát biểu/bình luận viên tối đa 1 câu mỗi tập, có ghi ai nói.
- **Chính xác** (bóng đá bị soi số rất kỹ):
  - Mọi tỉ số, năm, phút ghi bàn, số bàn, danh hiệu, phí chuyển nhượng phải có ≥2 nguồn, ghi vào `story.facts` (≥5 dữ kiện). gd-check chặn nếu thiếu.
  - Nguồn ưu tiên: trang chính thức FIFA/UEFA/giải, Wikipedia (en/vi), RSSSF, Transfermarkt, FBref, BBC Sport, ESPN, The Athletic, VnExpress/Thể thao & Văn hoá/Bóng Đá+ cho bóng đá Việt Nam.
  - Số liệu cầu thủ đang thi đấu thay đổi liên tục: ghi `story.so_lieu_ngay` và **nói trong video** "tính đến ngày …".
  - Nguồn mâu thuẫn (số bàn tính cả giao hữu hay không, phí chuyển nhượng kèm điều khoản…) thì nói rõ cách tính. Không chắc thì bỏ, không bịa.
  - "Ai hay hơn", xếp hạng, điểm chấm đều là **ý kiến của Tèo**, phải nói rõ trước khi hiện bảng.
- **Tôn trọng:**
  - Cầu thủ, HLV, trọng tài là người thật: không bôi nhọ, không chế giễu ngoại hình, chấn thương, đời tư; chuyện scandal chỉ kể đúng dữ kiện đã được xác nhận, không suy đoán.
  - Không phân biệt chủng tộc, vùng miền, không kích động fan đội nọ ghét đội kia. Kình địch kể bằng giọng vui, công bằng cho hai bên.
  - Bên thua chỉ buồn, cúi đầu, ôm mặt, không bị hạ nhục. Không bạo lực cổ động viên, không chính trị.
  - **Không cá cược:** không nói kèo, tỉ lệ cược, nhà cái, soi kèo (gd-check chặn). Không quảng cáo.
- Hỏng mà không tự sửa được thì dừng lại, báo rõ lỗi kèm log.

## Format và chống trùng chủ đề

Kho format + chủ đề ở `SKILL/data/chu-de.md` (doi-dau, huyen-thoai, tran-dau, giai-dau, clb, top, chien-thuat, giai-ma, an-so, hlv, cuoc-doi, lich-su-clb, luat, neu-nhu, viet-nam, khoanh-khac, chuyen-nhuong, ky-luc).
- Hai series chính rút từ nghiên cứu đối thủ (`SKILL/data/nghien-cuu-kenh.md`): "Cuộc đời huyền thoại" (`cuoc-doi`, chia phần) và "Lịch sử CLB qua các thời kỳ" (`lich-su-clb`); thứ tự làm ở `ke-hoach-30-ngay.md`.
- `story.format` và `story.chu_de` (một câu nêu chủ đề + góc nhìn) ghi vào history khi `--log`.
- gd-check chặn `chu_de` giống tập cũ ≥80%. Không cùng `format` 3 tập liền (tự kiểm bằng history.json).
- Một cầu thủ được quay lại ở tập khác nếu góc mới (Messi vs Ronaldo rồi, sau này "Messi ở World Cup" vẫn được).

## Công cụ

| lệnh | việc |
|---|---|
| `node SKILL/scripts/new-tap.mjs <tap> --ten "<khung>"` | Tạo `<tap>/godot/` chỉ gồm hạ tầng: project.godot, main.gd (hợp đồng + xếp giờ theo giọng + phát giọng/nhạc/sfx), phim.gd chỗ giữ, loi.txt/story.json/cast.json mẫu, sfx. Không ghi đè. |
| `LOCK "<tap> giọng" node KH/scripts/gd-voice.mjs <tap>` | `loi.txt` → `godot/voice/<id>.wav` + `voice.json`. Có cache. `--dry` để ước thời lượng. |
| `node KH/scripts/gd-mat.mjs <tap>` | Mặt từng nhân vật bằng `<tap>/ve.mjs` → `godot/mat/<nv>/<biểu cảm>.svg`, đọc `godot/cast.json`. |
| `node SKILL/scripts/gd-check.mjs <tap>` | Soát: id, chữ "Chương", hook/Tèo/CTA, giọng khớp chữ, parse Godot, DUR 8:00–14:30, hook ≤30 s, không xin sub trong 60 s đầu, 20 s cuối móc sang video tiếp và không chào tạm biệt, phim.gd đã dựng, story.json khác 5 tập trước, cast có trong sổ, **facts ≥5 × ≥2 nguồn, so_lieu_ngay, chu_de không trùng, không cá cược**. `--no-godot` bỏ bước Godot. |
| `LOCK "<tap> xem" node KH/scripts/gd-render.mjs <tap> --preview --from A --to B --sheet 5 --out xa` | Preview 960×540 + `work/sheet-xa.jpg`. |
| `LOCK "<tap> render" node KH/scripts/gd-render.mjs <tap> --par 2` | Bản cuối `renders/final.mp4`. |
| `node SKILL/scripts/pack.mjs <tap>` | `youtube/`: mp4, thumbnail.png 1280×720, tieu-de, mo-ta (seo.mo_ta + seo.chan), tags (tự thêm "Tèo Thể Thao", "bóng đá"), hashtag #TeoTheThao #BongDa. |
| `node SKILL/scripts/gd-check.mjs <tap> --log` | Sau bản cuối: ghi story.json vào `SKILL/data/history.json`. |

Việc nặng (giọng, render) luôn chạy qua `LOCK` bằng Bash tool (Git Bash; trong PowerShell `bash` là WSL, không chạy được) (2 suất cho cả máy, khoá ở `MuseStudio/.slots/sN`; suất kẹt do tiến trình chết thì xem `who` rồi xoá thư mục đó). Lệnh dài chạy nền.

## Quy trình

0. **Research và chọn chủ đề** (tự chọn, không hỏi người dùng):
   - **Đầu tiên: chạy skill `tim-chu-de-hot`** (từ 2026-10-30: tập theo series không ăn view). Đề xuất số 1 đạt ≥17/25 thì làm đề xuất đó thay cho lịch series, và ghi `youtube/UU-TIEN.txt` để job đăng đưa tập lên trước.
   - Đọc `SKILL/data/history.json`, `SKILL/data/chu-de.md`, lịch và nhật ký số liệu trong `ke-hoach-30-ngay.md` (kiểu nào đang thắng thì làm tiếp series đó).
   - WebSearch tin bóng đá 48 giờ qua: có sự kiện nóng thì ưu tiên (mục 1 của tang-truong.md). Mở ô tìm kiếm YouTube trong profile teo-the-thao xem gợi ý và view của video cùng đề tài.
   - WebSearch/WebFetch 4–8 truy vấn: nguồn ở mục Luật cứng, thêm một truy vấn "<chủ đề> tranh cãi" hoặc "<A> hay <B> hơn" để biết người xem đang cãi gì.
   - Viết 3 ý (format, chu_de, logline, cảnh bóng đắt nhất, **5 phương án tiêu đề**, chữ thumbnail ≤4 từ) rồi qua **cổng chọn chủ đề** ở `SKILL/data/danh-gia.md` mục 1: loại ngay theo 1a, chấm theo 1b (tổng /40, chọn khi ≥28, không mục nào = 1), kiểm thời điểm 1c. Ghi `## Đánh giá chủ đề` vào `y-tuong.md` với dòng `Tổng: NN/40` của ý được chọn.
1. **Kịch bản thô, phân tích, khung.**
   - `<tap>/kich-ban-tho.md`: diễn biến, khoảnh khắc mạnh nhất, số liệu sẽ lên bảng, câu nói nổi tiếng (≤1 câu nguyên văn), tranh cãi của fan.
   - `<tap>/y-tuong.md` mục "Phân tích" trả lời 6 câu: lõi chuyện là gì (một trận, một kình địch, một kỷ lục, một sơ đồ, một cuộc đời, một quyết định của trọng tài…)? cảm xúc đổi thế nào? khoảnh khắc mạnh nhất ở đâu, có mở bằng nó không? ai/cái gì đứng gần nhất để kể (quả bóng, cột dọc, băng đội trưởng, tấm thẻ đỏ, khán đài, cái còi)? người xem muốn biết gì, cãi gì? chất liệu tự chia thành khối nào (theo phút, theo hiệp, theo mùa, theo cầu thủ, theo vị trí, theo bằng chứng)?
   - **Khung tự thiết kế từ phân tích, không chọn từ danh sách**. Ví dụ ý (không chép): "nhật ký của quả bóng chung kết", "phòng VAR xem lại từng pha", "bảng chiến thuật phấn trắng của HLV", "sổ tay tuyển trạch viên", "đài phát thanh thập niên 70", "album hình dán cầu thủ". Kiểm: thay tên cầu thủ mà khung vẫn dùng được cho tập khác là quá chung, phải bám chất liệu hơn.
   - `y-tuong.md` thêm: bảng dữ kiện (claim | nguồn 1 | nguồn 2 | tính đến ngày), điểm Tèo chấm kèm lý do, bảng "khác 5 tập trước" ≥6 điểm.
   - Đánh dấu `(tập N)` trong chu-de.md.
2. **Khung project:** `new-tap.mjs <tap> --ten "<tên khung>"`.
3. **Kịch bản `godot/loi.txt`.**
   - `## kNN tên | ghi chú dựng {pre=… post=…}` mở một đoạn; `[id] lời` là một câu Tèo đọc. Câu ≥10 từ (VieNeu đọc câu ngắn dễ méo). Giọng Hải Đăng đọc ~4,5 từ/giây → 8 phút ≈ 2.200 từ, 12 phút ≈ 3.000–3.300 từ; viết ≥2.300 từ cho chắc qua mốc 8:00, đừng vượt 3.800 từ.
   - 4–6 đoạn lớn, mỗi đoạn 1,5–3 phút; chia nhỏ thêm `## kNN` để dựng (đổi hình mỗi 5–10 s). Không thẻ chương.
   - Đoạn `k01` là **hook ≤30 s** theo khung 3 nhịp của tang-truong.md mục 4 (cảnh đắt → căng thẳng → lời hứa), khớp thumbnail. Ngay sau đó Tèo giới thiệu vai trong một câu (cấm "lại là Tèo đây", cấm "xin chào").
   - Vòng mở trong hook trả lời ở 70–80%; re-hook ở ~25/50/75%.
   - Xin đăng ký lần 1 ở 30–50% ngay sau khi trả một phần lời hứa, nói lợi ích cho người xem; câu hỏi bình luận hai lựa chọn ("bình luận M hoặc R"). Lần 2 ở 20 s cuối gắn với video tiếp.
   - **Câu kết**: móc sang một video khác của kênh (màn hình kết), không "tạm biệt"/"hẹn gặp lại" (tang-truong.md mục 7).
   - Chữ hiện trên hình (bảng tỉ số, thẻ số liệu, sơ đồ) phải có câu đọc đi kèm. Số liệu cầu thủ đang đá phải nói "tính đến …".
   - Điền `godot/story.json`: format, chu_de, so_lieu_ngay, facts, khung, teo_role, but, may_quay, palette, nhac, thumb, mat, font; `doan` (mỗi đoạn một kiểu dựng: sân nhìn từ trên, bảng chiến thuật, bảng điện tử, khán đài, phòng thay đồ, trang báo cũ, thẻ cầu thủ, dòng thời gian mùa giải…); `seo` (title ≤60 ký tự theo công thức tang-truong.md mục 2, tên quan trọng trong 40 ký tự đầu, không đuôi tên kênh; mo_ta: 2 dòng đầu có từ khoá + nguồn tham khảo + câu hỏi bình luận; `chan` viết theo giọng khung; tags có tên cầu thủ/CLB).
3b. **Review kịch bản (bắt buộc mỗi lần viết hoặc sửa lời):** theo `SKILL/data/danh-gia.md` mục 2: tự soát checklist, rồi một subagent review độc lập (chỉ đưa loi.txt + bảng dữ kiện + danh-gia.md), sửa theo kết quả, ghi `## Review kịch bản … Kết luận: ĐẠT` vào `y-tuong.md`. gd-check chặn nếu thiếu.
4. **Giọng:** gd-voice qua `LOCK`, giọng **Hải Đăng** (người dùng chốt 2026-11-03, không dùng Lóng). gd-voice tự chọn Hải Đăng cho tập trong `MuseStudio/the-thao`; tập đã có `voice.json` thì giữ giọng cũ để không lẫn hai giọng (muốn đổi hẳn thì `--voice "Hải Đăng"` cho cả tập). Rồi `gd-check --no-godot` xem thời lượng thật. Quá 14:30 thì cắt khối yếu nhất (không nói nhanh hơn); dưới 8:00 thì thêm chi tiết có giá trị, không kéo dài khoảng lặng.
5. **Nhân vật.**
   - **Nếu là tập KỂ CHUYỆN 19:00 (phong cách mới từ 2026-11-20 — ảnh nhân vật + ảnh hoạt hình 2.5D):**
     - Không dùng `chibi.gd` rig v2, không cần `export-chars.mjs` hay `ve-cartoon.mjs`.
     - Chuẩn bị **ảnh nhân vật** dạng PNG nền trong suốt trong `godot/assets/<id>.png` (ví dụ chân dung cutout, hedcut/mực báo, ảnh cắt nền sạch; không làm chớp mắt). Tuyệt đối không dính logo CLB/giải/nhà tài trợ hay watermark truyền hình.
     - Trong `godot/cast.json` để `{}` hoặc chỉ ghi tên hiển thị không có trường `char` (để `gd-check` không báo lỗi thiếu sổ chibi).
   - **Nếu là tập TIN NÓNG 07:00 (giữ nguyên phong cách chibi rig v2):**
     - Look lấy từ skill `nhan-vat-chibi` (chưa có thì tạo bằng skill đó và soi sheet): áo đấu màu đội + số áo, kiểu tóc đặc trưng, không logo. Tèo có thể mặc áo trọng tài, áo HLV, áo phóng viên… theo vai.
     - **Tèo của kênh này là nhân vật `teo-the-thao`** trong sổ nhan-vat-chibi (người dùng yêu cầu khác Tèo cũ, 2026-10-26): tóc đen mái bằng, da rám nắng, mắt nâu, áo xanh coban cổ trắng số 10, quần xanh than. **Không dùng `teo-tieu-nhi` hay preset `teo`** (kính tròn, khăn đỏ, tóc nâu gai là Tèo của kênh kiếm hiệp). Trang phục theo vai (áo trọng tài, áo HLV…) thì giữ tóc, da, mắt, chỉ đổi áo.
     - `godot/cast.json`: `{"teo": {"char": "teo-the-thao", "name": "Tèo"}, "messi": {"char": "messi", "name": "Messi"}}`.
     - **Kiểu nhân vật của kênh: CARTOON** (người dùng chọn 2026-10-26, thay mặt anime mắt to long lanh): đầu vẽ bằng `$HOME/MuseStudio/the-thao/_tools/ve-cartoon.mjs` (viền đậm một màu, mắt bầu dục trắng con ngươi đen, lông mày khối, mũi rõ, miệng rộng, tóc mảng phẳng), thân/tay chân là rig v2 (`chibi.gd`). Dùng chung cho mọi tập để nhận diện kênh, **không** viết ve.mjs riêng từng tập. Soi: `node ~/.agent-skills/skills/nhan-vat-chibi/scripts/char.mjs sheet <id> --ve <ve-cartoon.mjs>`.
     - Đưa nhân vật vào tập: trong `<tap>/godot/` chạy `node $HOME/MuseStudio/the-thao/_tools/export-chars.mjs <id>…` (ra `chars/<id>.json` mặt cartoon) và chép `~/.agent-skills/skills/thao-tac-chibi/engine/chibi.gd` vào `godot/`. Trong phim.gd: `var c = preload("res://chibi.gd").new(); add_child(c); c.setup(id)`, mỗi khung đặt `c.t = t` rồi `c.apply(pose, 0.0)` (tất định theo t), `c.set_expr(...)`; nói thì đổi `binh` ↔ `vui` để nhép miệng.
     - Tỉ lệ đầu to thân ngắn (2–3 đầu) giữ nguyên.
6. **Code hình.** Thay hết `phim.gd` (xoá dấu `CHUA_DUNG`) và thêm file vẽ riêng. Không chép code hình tập trước, chỉ đọc để học. Cấu trúc file do tập tự chọn.
   - main.gd gọi `phim.setup(main)` một lần (có `main.segs`, `main.lines`, `main.DUR`), `phim.at(t, seg, line)` mỗi khung, `phim.sfx()` → `[[giây, "whoosh", dB], …]`.
   - **Tập KỂ CHUYỆN 19:00 (ảnh hoạt hình 2.5D / cutout):**
     - Nạp ảnh nhân vật từ `res://assets/*.png` bằng `load(...)`, vẽ qua `draw_set_transform` + `draw_texture` hoàn toàn tất định theo `t`.
     - Tạo chuyển động ảnh hoạt hình mượt: camera zoom/pan (Ken Burns), tách lớp **parallax** (nền giấy/sân – vòng halftone – ảnh nhân vật – thẻ chữ/tiền cảnh), nhịp thở (`scale` theo `sin(t)`), nhún/nghiêng nhẹ (`bob`, `rot`), trượt vào/ra theo đường cong `smooth(u)`, hiệu ứng vignette và hạt giấy nhẹ (≤600 chấm/khung). Không làm chớp mắt.
     - Kết hợp thẻ hồ sơ, bảng tên, bảng số liệu, sơ đồ chiến thuật hoặc trang báo/tư liệu khớp từng câu đọc trong `loi.txt`.
   - **Tập TIN NÓNG 07:00 (giữ nguyên chibi rig v2):**
     - **Diễn xuất cầu thủ: tra skill `thao-tac-chibi`** và dùng lại thao tác có sẵn (đi, chạy, chỉ tay, giơ tay…). Thao tác bóng đá chưa có (sút, chuyền, rê bóng, đánh đầu, xoạc bóng, thủ môn bay người, ăn mừng trượt gối, giơ thẻ, thổi còi) thì thiết kế mới theo rig v2 rồi **ghi sổ bên thao-tac-chibi** để tập sau dùng lại.
     - **Pha bóng** (cảnh hành động chính của kênh): dựng theo giờ t, tất định. Mỗi pha 3 nhịp: chuẩn bị (lấy đà, nhìn cầu môn) → đòn (đường bóng, có vệt và slow-mo ở đỉnh) → hậu quả (lưới rung, thủ môn bay hụt, khán đài nổ). Đường bóng là đường cong Bézier/parabol theo t; xoáy thì cong ngang; bóng có bóng đổ trên cỏ.
   - **Sơ đồ chiến thuật:** sân nhìn từ trên, chấm cầu thủ, mũi tên chạy chỗ vẽ dần theo câu đọc.
   - **Bảng tỉ số / số liệu:** chữ ≤12 chữ, số to, tô sáng bên được Tèo chấm cao, khớp `y-tuong.md`.
   - Sửa `main.gd` được nhưng giữ hợp đồng ở dưới.
7. **Soát:** `gd-check <tap>` đến khi `OK`.
8. **Soi:** preview vài đoạn qua `LOCK` (2 đoạn song song nếu có 2 suất), mở `work/sheet-*.jpg` soi theo **Checklist**. Sửa rồi soi lại đúng đoạn đó.
9. **Nhạc:** tập tự sinh (`work/nhac.py` đọc `godot/timeline.json` đổi tâm trạng theo khung: trống cổ vũ, kèn, nền điện tử, organ sân vận động… khác kiểu tập trước). Có thể tự tổng hợp tiếng khán đài (nhiễu lọc + nhịp vỗ tay) làm sfx. Ghi wav rồi `ffmpeg -c:a libvorbis` ra `godot/nhac.ogg`. Không dùng nhạc có bản quyền.
   **Chống tiếng xì (người dùng phàn nàn 2026-10-28, tập 1/2/3/5 bị):** lớp nhiễu (khán đài, gió, tàu, hi-hat từ nhiễu trắng) phải lọc thấp (khán đài ≲1 kHz: `smooth(w, 40) - smooth(w, 400)` ở 44,1 kHz, không dùng `smooth(w, 6–15)`), chỉ bật ở cảnh cần, có điều biến thật (chuẩn hoá đường bao về ±1 rồi mới nhân; `smooth(randn, 0.6*SR) * 6` gần như phẳng → nghe như radio rè), và tổng các lớp nhiễu thấp hơn phần nhạc **≥ 20 dB** (đo RMS từng lớp trước khi trộn; tập 5 bản lỗi chỉ −9,8 dB). Nghe thử 10 s đoạn có nhiều lớp nhiễu nhất trước khi render.
10. **Bản cuối:** `gd-render --par 2` qua `LOCK`, chạy nền. Kiểm vài giây đầu/giữa/cuối có hình và tiếng.
11. **Ảnh bìa:** `godot/thumb.tscn` + `thumb.gd` vẽ bằng bút của tập, chạy có cửa sổ (không `--headless`), lưu `thumb/thumb-godot.png`. Theo tang-truong.md mục 3: tối đa 3 thứ, mặt chibi to biểu cảm mạnh, ≤4 chữ viền dày, không lặp chữ tiêu đề, đọc được khi thu về 160×90 (thu nhỏ ảnh để soi). Không logo.
12. **Gói:** `pack.mjs <tap>`, đọc lại `youtube/thumbnail.png`. Rồi `gd-check <tap> --log`. (DA-LAM.md thôi ghi từ 2026-11-04, sổ cái thay thế.)
   Ghi `youtube/binh-luan.txt` (câu hỏi hai lựa chọn để ghim). Tập theo chủ đề nóng ghi `youtube/UU-TIEN.txt` (điểm + hạn chót đăng).
   **Đẩy Drive rồi xoá video trong máy**: `node SKILL/scripts/drive-sync.mjs <tap> --xoa` (lên `G:/My Drive/TeoTheThao/<slug>/`, chỉ xoá khi SHA-256 khớp; xem van-hanh.md). Không tự tải lên YouTube ở bước này: job `teo-tt-dang-bai` đăng 07:00/19:00; riêng tập có UU-TIEN.txt thì job sản xuất được đăng gấp qua `dang-tu-drive.mjs chon-mot` (chỉ vào khe 07:00/19:00 còn trống). Sau drive-sync chạy `node $HOME/MuseStudio/_so-cai/so-cai.mjs quet tt` để tập vào sổ cái ở trạng thái "chờ đăng". Báo người dùng: tiêu đề, thumbnail, giờ sẽ đăng (`so-cai.mjs lich`).
13. ~~3 Shorts dọc~~ **TẮT từ 2026-11-03** (người dùng không làm Short nữa). Bỏ qua bước này và mục "Shorts dọc" bên dưới.

## Shorts dọc (3 short mỗi tập, 1080×1920, ≤ 60 s)

> **ĐANG TẮT (2026-11-03):** người dùng tắt làm và đăng Short. Mục này chỉ để tham khảo khi được bật lại.

Mỗi short là một project Godot dọc riêng ở `<tap>/shorts/<NN-ten>/godot/`, dùng lại bút, mặt, font, giọng của tập nhưng **dựng lại cho khung dọc**, không crop bản ngang. `S = <tap>/shorts/<NN-ten>`.

| lệnh | việc |
|---|---|
| `node SKILL/scripts/new-short.mjs <tap> <NN-ten> --tu kA-01..kB-05 [--tu …] [--nhac <giây>]` | Tạo `S/godot/` dọc, chép font/mat/sfx/file vẽ/cast; câu `--tu` kèm wav vào đoạn `s02 than`; chỗ viết hook `s01` và kết `s03`; story.json (kieu, phu_de, seo), phude.gd, nhac.ogg 70 s. |
| `LOCK "<tap> sNN giọng" node KH/scripts/gd-voice.mjs S` | Chỉ đọc câu mới / câu đã sửa. |
| `node SKILL/scripts/gd-check.mjs S` | Chế độ short: ≤60 s, có "đăng ký" trong 30% cuối, kieu khác short anh em, title ≤60, có mo_ta. |
| `LOCK "<tap> sNN xem" node KH/scripts/gd-render.mjs S --preview --sheet 2` | Preview + `S/work/sheet-preview.jpg`. |
| `LOCK "<tap> sNN render" node KH/scripts/gd-render.mjs S` | `S/renders/final.mp4` 1080×1920. |
| `node SKILL/scripts/pack.mjs S` | `<tap>/youtube/shorts/<NN-ten>.mp4` + `.txt`. |

Quy trình: chọn 3 đoạn đắt nhất, **mỗi short một kiểu** (một pha bóng trọn vẹn, một con số sốc, một bí mật ít ai biết, một màn đối đầu, một quyết định trọng tài gây tranh cãi…) → `new-short` (giọng ≈35–50 s) → hook `[s01-01]` ≤12 chữ, câu nối giới thiệu lại tên cầu thủ, kết `[s03-01]` có "đăng ký Tèo Thể Thao" kèm lý do ngắn, viết sao cho nối được vào câu hook (vòng lặp, tang-truong.md mục 8) → gd-voice, gd-check → `phim.gd` dọc (hình trong y 190–1350, dưới y 1350 và mép phải để trống cho phụ đề/nút; giây đầu đã có hình đắt + chữ hook ≤6 từ; một ý hình xuyên suốt; kết có Tèo + nút ĐĂNG KÝ) → preview, soi, render, pack. Đăng khi người dùng duyệt, gắn "video liên quan" là tập dài.
Short **luôn cắt từ một tập dài và dẫn về tập đó** (người dùng chốt 2026-10-27): mỗi tập dài 3 short, gắn "video liên quan" = tập dài lúc tải lên, dòng đầu mô tả là link tập dài. Không làm short riêng.

**Checklist short:** hook có hình đắt ngay giây đầu · không chạm vùng phụ đề/nút · phụ đề đọc được, không đè mặt · hình khớp câu đọc · 3 short khác kiểu · ≤60 s · kết có Tèo + đăng ký Tèo Thể Thao · câu kết nối vòng về hook.

## Hợp đồng với gd-render (main.gd sinh sẵn đã đúng)

- Cửa sổ 1920×1080 (short: 1080×1920), stretch `canvas_items`.
- Đọc `--from=` `--to=`; dựng mọi thứ **theo giờ t**, không phụ thuộc khung trước. Hạt, khán đài nhấp nháy, cờ vẫy: hàm băm theo t hoặc RNG seed cố định gieo lại theo t.
- `-- --dur` thì in `DUR=<giây>`, ghi `timeline.json` rồi thoát.
- Giọng/nhạc/sfx phát bằng `AudioStreamPlayer`; bắt đầu giữa chừng thì `play(offset)`.
- Tự `get_tree().quit()` khi t ≥ to hoặc hết phim.

## Bẫy GDScript / Godot đã gặp

- Lấy giá trị từ Array/Dictionary thì khai kiểu rõ: `var x: float = arr[i]`. Không khai nhiều biến một dòng.
- Lỗi parse chỉ hiện từng lỗi một: sửa xong chạy lại `gd-check`.
- **Font do tập tự chọn** (chép .ttf vào `godot/font/`, ghi `story.font`, khác tập trước), phải đủ dấu tiếng Việt: thử "Thường Châu ưởng ỹ Ỗ". Font bảng điện tử/dạng số thường thiếu dấu: chỉ dùng cho con số.
- sfx thư viện: `godot/sfx/lib-<tên>.mp3`, gọi bằng `<tên>`.
- Preview chạy ~2× thời gian thật; bản cuối 12 phút mất khoảng 25–40 phút với `--par 2`. ffmpeg chỉ ghép/nén ở bước cuối; chậm là do Godot vẽ từng khung.
- **Tăng tốc render (người dùng đồng ý 2026-10-26):** khung trung gian MJPEG chất lượng 0.75 (new-tap đã đặt sẵn; ffmpeg nén lại nên hình cuối không khác); khán đài/hạt nền ≤600 chấm mỗi khung (tập 1 vẽ 1.500 chấm là quá nặng), vẽ tĩnh thì nướng sẵn vào texture rồi dùng lại; giữ `--par 2` (máy chỉ có 2 suất, các job chạy song song).
- `draw_*` không có bộ lọc: bóng/nhoè tự vẽ bằng nhiều lớp alpha thấp. Sân cỏ sọc vẽ một lần vào texture rồi dùng lại, đừng vẽ lại từng sọc mỗi khung.

## Checklist soi sheet

- [ ] Đoạn đầu là hook dựng riêng (pha bóng/khoảnh khắc đắt nhất); Tèo hiện theo vai sớm.
- [ ] Mỗi đoạn một kiểu dựng khác hẳn; hình khớp câu đang đọc.
- [ ] Pha bóng có đủ chuẩn bị → đòn → hậu quả; đường bóng mượt, có bóng đổ; slow-mo ở đỉnh.
- [ ] Không logo CLB/giải/nhà tài trợ, không cúp giống hệt bản thật; áo chỉ màu + số.
- [ ] Nhân vật: tập sáng 07:00 là chibi rig v2 nhận ra qua tóc/số áo/màu áo, có cử động không đứng đơ; tập 19:00 dùng ảnh nhân vật PNG có chuyển động ảnh hoạt hình 2.5D (zoom/parallax/thở/nhịp), không đứng yên như slide tĩnh.
- [ ] Số trên bảng khớp `story.facts`/`y-tuong.md`; có câu "tính đến …" với số liệu đang thay đổi; điểm chấm nói rõ là ý kiến Tèo.
- [ ] Chữ trên hình ≤12 chữ, to, không đè mặt; có câu đọc đi kèm.
- [ ] Không thẻ chương; không nhắc cá cược; bên thua không bị hạ nhục.
- [ ] Màu và bút giữ một chất suốt video.
- [ ] `gd-check` OK; khung, vai Tèo, bút, máy quay, palette, nhạc, thumbnail, mặt, font, chân mô tả khác các tập trong history.json.

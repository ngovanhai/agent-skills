---
name: cong-toc-cuoi
description: >-
  Làm một tập kênh Cọng Tóc Cuối (@congtoccuoi): chuyện đời thường, drama công sở, tiền nong, thuê trọ, tình cảm, gia đình,
  mặt tối nghề, kể ngôi thứ hai "Bạn" (10–18 phút, người kể luôn giọng VieNeu "Quốc Tuấn", thoại nhân vật nữ chèn "Ngọc Huyền"), dựng bằng Godot 2D với nhân vật nét bút dạ
  (nv.gd: Bạn đầu tròn một cọng tóc tâm trạng + urgo, vai phụ đen trắng), nền mỗi tập tự dựng: research (≥2 nguồn cho số thật)
  → cổng chọn chủ đề → loi.txt → review độc lập → giọng → phim.gd → soi → render → nhạc, thumbnail, gói YouTube → 3 Shorts dọc;
  tải lên bằng FoxProfile profile cong-toc-cuoi. Dùng khi người dùng nói "Cọng Tóc Cuối", "tập Cọng Tóc", "video kiểu Lạnh", "tìm ý tưởng", "tìm chủ đề cho kênh", "tham khảo kênh khác",
  "chuyện đời thường", "drama công sở", "làm tập Bạn", "kênh cọng tóc", "short Cọng Tóc Cuối", "quản lý kênh Cọng Tóc Cuối".
---

# Cọng Tóc Cuối × Godot 2D

`SKILL = thư mục chứa file này` · `KH = ~/.gemini/config/skills/teo-kiem-hiep` (mượn gd-voice, gd-render) · `LOCK = bash C:/Users/anhha/MuseStudio/the-thao/_tools/slot.sh`
Godot 4.7.2: `C:/tool/Godot/Godot_v4.7.2-stable_win64_console.exe` · Tập: `C:/Users/anhha/MuseStudio/cong-toc-cuoi/tap-<NN>-<slug>/` (slug không dấu, gạch nối).
Engine nhân vật: `C:/Users/anhha/MuseStudio/cong-toc-cuoi/_tools/doodle/` (`nv.gd`, `cast.json`, `README.md`: tư thế, biểu cảm, tuỳ chọn vai). new-tap chép sẵn vào tập.
Kênh: ID `UClW6e47o_G4Jy1H0i2pBxig`, tài khoản thương hiệu dưới ngoh33889@gmail.com. Vận hành, đăng bài: `SKILL/data/van-hanh.md`.

Đọc trước mỗi tập: `SKILL/data/cong-thuc.md` (giữ gì / bỏ gì của Lạnh, mẫu tiêu đề, mạch tập, thumbnail) và `SKILL/data/danh-gia.md`.

## Luật cứng

- **Ngôi "Bạn"**, người kể không xưng tên, không chào. Không chửi thề, không tục. **Giọng (từ tập 21):** người kể LUÔN là **"Quốc Tuấn"**, kể cả khi Bạn là nữ. **"Ngọc Huyền"** chỉ đọc câu thoại của nhân vật nữ: tách thành `[id]` riêng chỉ chứa lời nhân vật đó, liệt kê id ở `story.giong_nu`. gd-voice tự đọc các id đó bằng giọng nữ, gd-check chặn sai. `story.ban_gioi` vẫn ghi giới của Bạn để vẽ. Tập ≤20 giữ luật cũ (cả tập một giọng theo giới). Bạn nữ thì vẽ thêm chi tiết nữ trong cast (tóc kẹp, váy) nhưng vẫn một cọng tóc tâm trạng.
- **Không né chủ đề nào** (người dùng chốt 2026-10-29): cờ bạc, gái gọi, ma tuý, giới ngầm… đều kể được. Vẫn giữ hai điều để kênh không bị gỡ video: không hướng dẫn cách làm điều phạm pháp (kể hậu quả, không dạy cách), không nêu tên công ty/app/người thật theo hướng bôi xấu (dùng tên bịa). Chủ đề nặng dễ bị giới hạn quảng cáo (vàng): chấp nhận. Không chép tiêu đề "Tại sao thật tệ khi…", không thumbnail mũi tên kiểu Lạnh.
- **Logic là luật cứng:** chuyện bịa nhưng trong một tập mọi thứ phải khớp nhau: mốc thời gian, tuổi, tiền vào ra cộng đúng, nhân vật biết gì lúc nào, động cơ của từng người, twist có manh mối gieo trước và không mâu thuẫn chi tiết đã kể. Ghi `y-tuong.md` mục `## Sổ logic` (dòng thời gian + sổ tiền + ai biết gì); review độc lập phải soi logic trước tiên.
- **Chuyện được bịa hoàn toàn** (người dùng chốt 2026-10-29): không cần dựa trên vụ việc có thật, không bắt buộc số liệu. Cứ phóng tay: tình huống trớ trêu, phóng đại, twist, kết bất ngờ (xem `cong-thuc.md` mục "Phóng khoáng"). Chỉ khi lời nói một con số/luật **thật** (lương tối thiểu, điều luật, lãi suất) thì ghi `story.facts` ≥2 nguồn + `so_lieu_ngay`; còn lại cứ để là chuyện kể. Mô tả video ghi "Câu chuyện hư cấu".
- **Luật tạo hình:**
  - Nhân vật chỉ vẽ bằng `nv.gd` (nét bút dạ, KHÔNG chibi).
  - Chỉ Bạn có màu áo, vai phụ đen trắng.
  - Đầu vuông là người có quyền (sếp, chủ trọ, cho vay).
  - Đồ vật được tô màu.
  - Cọng tóc gục dần theo chuyện; **rụng đúng một lần, ở khúc tệ nhất**.
  - Urgo cộng dồn 0–3.
- **Nền không cố định:** mỗi tập tự vẽ nền theo chuyện (nét bút dạ cùng chất: viền đen rung, tô phẳng nhạt), mỗi chặng một nền. Không chép code nền tập trước, chỉ đọc để học.
- Video dài 10:00–18:00 (nhắm 12–15 phút). Không chia chương.
- **Đăng:** pack xong là xong việc sản xuất. Job `ctc-dang-bai` (09:00, `_tools/ctc-hang-ngay.ps1`) tự tải lên bằng profile `cong-toc-cuoi` và **hẹn giờ công khai** 07:00/19:00 (người dùng chốt từ 2026-11-03), giữ lịch kín 3 ngày tới. **Không đụng profile `teo-the-thao`.**
- **Sổ cái** `C:/Users/anhha/MuseStudio/_so-cai/` (chung với Tèo Thể Thao): `node so-cai.mjs xem ctc | lich | can-xu-ly`, bảng `bang.html`. `ctc-dang.ps1` tự ghi đã tải / đã hẹn / lỗi; job 09:00 quét sổ và kiểm tập đã công khai chưa. Muốn biết tập nào đã đăng, chờ đăng hay lỗi thì xem sổ này, không đoán từ thư mục.
- Chỉ sửa thư mục tập đang làm, dấu `(tập N)` trong `SKILL/data/chu-de.md`, `SKILL/data/history.json` (qua `--log`). Sửa engine `_tools/doodle` khi cần tư thế mới (ghi README).
- Hỏng mà không tự sửa được thì dừng lại, báo rõ lỗi kèm log.

## Công cụ

| lệnh | việc |
|---|---|
| `node SKILL/scripts/new-tap.mjs <tap> --ten "<khung>"` | Tạo `<tap>/godot/`: project.godot, main.gd (hợp đồng render, xếp giờ theo giọng), phim.gd chỗ giữ, loi.txt/story.json mẫu, **nv.gd + cast.json**, sfx. Không ghi đè. |
| `LOCK "<tap> giọng" node KH/scripts/gd-voice.mjs <tap> --voice "Quốc Tuấn"` | `loi.txt` → `godot/voice/*.wav` + `voice.json`. Có cache. `--dry` ước thời lượng. |
| `node SKILL/scripts/gd-check.mjs <tap>` | Soát: id, không "Chương", không chào/xưng tên, "bạn" trong 3 câu đầu, giọng người kể Quốc Tuấn + thoại nữ đúng giong_nu, DUR 10:00–18:00, hook ≤30 s, CTA 25–75% + 10% cuối, kết không tạm biệt, phim.gd đã dựng, có nv.gd, phim đổi `.toc` và `.toc_roi`, cast có "ban", vai phụ không màu, story.json khác 5 tập trước, facts (nếu có) × 2 nguồn + so_lieu_ngay, chu_de không trùng, từ khoá cấm, y-tuong.md có Đánh giá ≥28/40 + Review ĐẠT (độc lập). `--no-godot` bỏ bước Godot. |
| `LOCK "<tap> xem" node KH/scripts/gd-render.mjs <tap> --preview --from A --to B --sheet 5 --out xa` | Preview 960×540 + `work/sheet-xa.jpg`. |
| `LOCK "<tap> soi" node SKILL/scripts/soi.mjs <tap> [--chi k01,k10]` | Chụp 1 khung/câu (70% câu) ở 960×540, ghép tờ 4×3 → `work/soi-NN.jpg`. Nhanh hơn preview cả tập; dùng soi bố cục, chữ đè mặt, nền lỗi. |
| `LOCK "<tap> render" node KH/scripts/gd-render.mjs <tap> --par 2` | Bản cuối `renders/final.mp4`. |
| `node SKILL/scripts/do-kenh.mjs [--tim] [--tu "<từ khoá>"] [--kenh <url>] [--tat-ca]` | Đo trung vị view của 40 video gần nhất ở các kênh trong `data/kenh-tham-khao.json`, đánh dấu video gấp 3 trung vị. `--tim` dò kênh mới nhiều view. Ra `_tools/do-kenh-<ngày>.md`. Dùng ở bước 0 khi tạo đợt ý mới. Mất 1–3 phút. |
| `node SKILL/scripts/tieu-de.mjs <tap> "<từ khoá>" …` | Gợi ý tìm kiếm YouTube (autocomplete vi-VN) + video nổi/mới đăng cùng chủ đề xếp theo view/ngày → `work/tieu-de.md`. Chạy trước khi chốt tiêu đề (cong-thuc.md "Tìm tiêu đề"); gd-check bắt buộc có file này + `seo.tu_khoa` nằm trong tiêu đề. ~20 s/từ khoá. |
| `node SKILL/scripts/pack.mjs <tap>` | `youtube/`: mp4, thumbnail.png 1280×720, tieu-de, mo-ta, tags (+ "Cọng Tóc Cuối", "chuyện đời thường"), #CongTocCuoi. |
| `node SKILL/scripts/gd-check.mjs <tap> --log` | Sau bản cuối: ghi story.json vào `SKILL/data/history.json`. |
| `node SKILL/scripts/drive-sync.mjs <tap> --xoa` | Sau khi tải lên: chép `youtube/` lên `G:/My Drive/CongTocCuoi/<slug>/`, khớp SHA-256 mới xoá video trong máy. |

**Quản lý quota và tự động hoá:** agy vận hành độc lập qua Task Scheduler (`ctc-tao-video`). Khi chạy qua `chay-job-ctc.ps1`, script tự động kiểm tra hàng chờ sổ cái trước khi tạo tập mới. Review kịch bản thực hiện độc lập trước bước render bản cuối.

Việc nặng (giọng, render) chạy qua `LOCK` bằng Bash tool (Git Bash) — 2 suất dùng chung cả máy với kênh Tèo. Lệnh dài chạy nền.

## Quy trình

0. **Chọn ý từ kho: tạo trước, lọc sau** (người dùng chốt 2026-10-29, tự làm, không hỏi). Nguồn duy nhất là `C:/Users/anhha/MuseStudio/cong-toc-cuoi/kho-y-tuong.md`, theo `danh-gia.md` mục 1d:
   - **Bổ sung kho khi cạn:** kho còn dưới 15 ý `chờ` đạt từ 33 điểm trở lên thì tạo đợt mới trước, tối thiểu 50 ý.
     - Đủ các nhóm, nhóm "bên trong một nghề" chiếm từ 1/5 trở lên.
     - **Nguồn ý** (người dùng chốt 2026-11-05: "sửa lại skill để tìm ý tưởng cho tao"). Dùng đủ 4 nguồn:
       1. **Dò kênh nhiều view:** chạy `node SKILL/scripts/do-kenh.mjs --tim` và đọc `_tools/do-kenh-<ngày>.md`.
          - Danh sách kênh nằm ở `SKILL/data/kenh-tham-khao.json`, có cả kênh VN và nước ngoài.
          - Với mỗi video gấp 3 trung vị, gọi tên công thức của nó, rồi biến tấu thành đời của Bạn. Cách biến tấu ở `danh-gia.md` mục 1d.
          - Mỗi đợt có ít nhất 1/3 số ý ghi cột `Học từ`.
          - Kênh mới tìm được mà hợp chất kênh thì đo bằng `--kenh <url>` rồi thêm vào json.
       2. **Chuyện đang được bàn:** WebSearch 3–6 truy vấn. Chỉ lấy tình huống, không chép câu chữ.
       3. **Gợi ý tìm kiếm:** `tieu-de.mjs` cho từ khoá của nhóm, xem người ta đang gõ gì.
       4. **Dữ liệu nội bộ:** `chu-de.md`, "Bài học từ số liệu" trong `cong-thuc.md`, số view thật của các tập đã đăng.
     - **Hai kiểu kể**, mỗi đợt nên có cả hai:
       - `lật`: chuyện có cú lật. Chấm cột X là độ bất ngờ.
       - `thẳng`: không cú lật. Bạn làm sai, trả giá, rồi rút ra cách làm đúng, cuối tập là bài học kèm con số. Chấm cột X là bài học dùng được. Người dùng chốt kiểu này ngày 2026-11-05 cho chủ đề chăm chỉ, làm giàu, dạy dỗ.
     - Mỗi ý có ID, ý, `Cú lật / Bài học`, `Học từ` (nếu có), điểm T H C X R S, trạng thái. Ý vướng 1a thì ghi `bỏ` kèm lý do.
   - **Lọc theo đợt 10 tập:** lấy ý `chờ` từ 33 điểm trở lên, rồi cân:
     - không quá 2 ý cùng nhóm;
     - có từ 3 ý nghề trở lên;
     - Bạn nam và nữ xen nhau;
     - hợp mùa;
     - không trùng nội dung 10 tập gần nhất.
     Ghi bảng "Chọn 10 tập" kèm lý do so với ý bị đẩy xuống.
   - **Khung logic trước khi làm:** ý được chọn phải có khung logic ghi trong kho. Ý chưa có thì viết ngay.
     - Kiểu `lật`: cú lật, 3 manh mối gieo trước, một dòng soát tiền/thời gian.
     - Kiểu `thẳng`: bài học, 3 bước sai dẫn tới khúc tệ nhất, cách làm đúng kèm con số, một dòng soát.
     - Khung không khép được thì ý về `bỏ` và chọn ý dự phòng.
     - Đợt 10 tập nên có cả hai kiểu, trừ khi người dùng bảo khác.
   - **Mở tập:**
     - Đổi trạng thái của ý thành `chọn tập N`.
     - `y-tuong.md` của tập có dòng `Kho: <ID>`, chép khung logic vào `## Khung logic`, viết `## Đánh giá chủ đề` + `Tổng: NN/40` (5 phương án tiêu đề, chữ thumbnail ≤4 từ).
     - Thêm chủ đề vào `chu-de.md`.
     - Render xong thì đổi trạng thái thành `đã làm tập N`.
   - **Kiểm tra:** từ tập 11, gd-check chặn tập nào không có `Kho: <ID>` hoặc ID chưa ghi `chọn tập N` trong kho.
1. **Kịch bản thô + khung:** `<tap>/kich-ban-tho.md` (dòng đời Bạn theo chặng, các cú đánh làm urgo tăng, khúc tệ nhất, thoại vai phụ). `y-tuong.md`: twist/cú lật của chuyện, bảng dữ kiện nếu có số thật (claim | nguồn 1 | nguồn 2 | tính đến), danh sách nền từng chặng, đường cọng tóc (k01…: toc 0→1, urgo 0→3, toc_roi ở đoạn nào), bảng "khác 5 tập trước" ≥5 điểm.
1b. **Chia phần:** ước thời lượng kịch bản thô (≈4,2 từ/giây), đếm cú lật và điểm dừng treo được → quyết 1, 2 hay 3 phần theo `cong-thuc.md` mục "Series". Ghi `## Chia phần` vào `y-tuong.md`. Nhiều phần thì mỗi phần một thư mục `tap-NN-<slug>-p<N>` (phần 1 giữ `kich-ban-tho.md` gốc cho cả series; phần sau chép `y-tuong.md` của phần trước, giữ Đánh giá chủ đề + Chia phần, nối tiếp Sổ logic, viết Review kịch bản riêng cho phần đó), làm lần lượt từ bước 2.
2. `new-tap.mjs <tap> --ten "<khung>"`. Vai mới (chưa có trong 9 vai) thì thêm vào `godot/cast.json` của tập theo tuỳ chọn trong README engine; vai dùng lại nhiều tập thì thêm luôn vào `_tools/doodle/cast.json`.
3. **`godot/loi.txt`** theo mạch trong `cong-thuc.md`: `## kNN tên | ghi chú {pre post}`, `[id] lời` ≥10 từ ≤40 từ; ≈4,2 từ/giây. Đoạn cuối `post=20` cho màn hình kết. Điền `story.json`: format, chu_de, so_lieu_ngay, facts, khung, nen, may_quay, palette, nhac, thumb, font, cao_trao, toc, doan (mỗi đoạn một kiểu dựng), seo (**chạy `tieu-de.mjs` trước**, theo `cong-thuc.md` mục "Tìm tiêu đề": tu_khoa lấy từ gợi ý tìm kiếm, ăn theo video ★ đang nổi; title ≤60, mo_ta 2 dòng đầu có từ khoá + "Câu chuyện hư cấu" + nguồn (nếu có facts) + câu hỏi bình luận, chan, tags).
3b. **Review kịch bản** theo `danh-gia.md` mục 2 (tự soát + subagent độc lập), ghi `## Review kịch bản … Kết luận: ĐẠT`.
4. **Giọng:** gd-voice `--voice "Quốc Tuấn"` qua LOCK → `gd-check --no-godot` xem thời lượng thật; lệch khung thì cắt/thêm chi tiết có giá trị.
5. **Code hình** (`phim.gd` + file nền riêng của tập):
   - `var b = preload("res://nv.gd").new(); add_child(b); b.setup("ban")`; mỗi khung: `b.t = t`, `b.set_pose(a, b2, k)`, `b.expr`, `b.talk` (khi đọc thoại của vai), `b.toc`, `b.toc_roi`, `b.urgo`. Quay mặt: `scale.x = -1`. Dựng mọi thứ theo t (tất định), không phụ thuộc khung trước.
   - Nền: vẽ bằng `_draw` cùng kiểu nét rung (đổi seed 8 lần/giây như nv.gd), tô phẳng nhạt; nền tĩnh nướng vào texture một lần.
   - Chữ trên hình (số tiền, giờ, tên chặng) ≤12 chữ, có câu đọc đi kèm; số âm/mất tiền tô đỏ `d8392b`.
   - Cảnh tóc rụng: quay cận đầu Bạn, rơi chậm 1,5–2,5 s, lặng tiếng, rồi cọng tóc nằm dưới sàn.
   - Tư thế thiếu thì thêm vào `POSES` của engine (ghi README), không vá riêng trong tập.
6. **Soát** `gd-check <tap>` đến khi OK. **Soi** preview vài đoạn qua LOCK, mở `work/sheet-*.jpg` theo Checklist.
7. **Nhạc** tự sinh (`work/nhac.py` → `godot/nhac.ogg`): nền nhẹ, đời thường (piano, ukulele, lo-fi, đàn dây gảy), tắt hẳn ở cảnh tóc rụng. **Không dùng kèn, sáo, clarinet hay tiếng thổi nào** (người dùng chốt sau tập 2). **Nhạc phải nhỏ: mean_volume của nhac.ogg (sau −3 dB của main.gd) thấp hơn giọng ≥15 dB, khoảng −35 dB** — đo bằng `ffmpeg -af volume=-3dB,volumedetect`. Lớp nhiễu thấp hơn nhạc ≥20 dB. Không nhạc bản quyền.
   Chỉ sửa nhạc sau khi đã render: không cần render lại hình, trộn lại tiếng (giọng đặt theo `timeline.json` + nhac.ogg −3 dB) rồi ghép vào video bằng `ffmpeg -c:v copy`.
8. **Bản cuối** `gd-render --par 2` qua LOCK (nền). Kiểm đầu/giữa/cuối có hình và tiếng.
9. **Thumbnail:** `godot/thumb.tscn` + `thumb.gd` dùng nv.gd, theo `cong-thuc.md` mục Thumbnail, chạy có cửa sổ, lưu `thumb/thumb-godot.png`; thu về 160×90 soi.
10. **Gói:** `pack.mjs <tap>`, đọc lại thumbnail → `gd-check <tap> --log` → `node C:/Users/anhha/MuseStudio/_so-cai/so-cai.mjs quet ctc` (tập vào sổ ở trạng thái "chờ đăng") → báo người dùng: tiêu đề, thumbnail, khung giờ sẽ đăng (`so-cai.mjs lich`), câu bình luận ghim. Job `ctc-dang-bai` lo tải lên, hẹn giờ và đẩy Drive.
11. **3 Shorts** (dưới).

## Series Phần 1 / 2 / 3

Ý nào cũng có thể thành 1, 2 hoặc 3 phần: **quyết sau khi viết kịch bản thô, theo lượng chuyện và số cú lật**, không định trước theo chủ đề (bước 1b). Luật đủ ở `cong-thuc.md` mục "Series". Tóm tắt:
- Lên mạch + `## Sổ logic` cho **cả series** trong `y-tuong.md` phần 1 trước khi viết chữ nào; phần sau chỉ được nối tiếp, không sửa ngược.
- Mỗi phần: thư mục `tap-NN-<slug>-p<N>`, `story.series = { ten, phan, tong }`, hook riêng + tóm tắt phần trước ≤20 s, cú lật riêng, kết phần 1–2 bằng câu treo, màn hình kết trỏ phần sau.
- Cọng tóc xuyên series: gục dần qua các phần, **chỉ rụng ở phần cuối** (gd-check cảnh báo nếu phần giữa có `toc_roi`).
- Cùng chất hình/nhạc/font cho cả series (gd-check không so trùng giữa các phần cùng `series.ten`); tiêu đề "(Phần N)", thumbnail nhãn "PHẦN N", một playlist.
- Làm xong cả series rồi mới đóng gói các phần (job đăng lấy tập số nhỏ trước, nên các phần sẽ lên liền nhau).

## Shorts dọc (3 short mỗi tập, 1080×1920, ≤60 s)

`node SKILL/scripts/new-short.mjs <tap> <NN-ten> --tu kA-01..kB-05 [--nhac <giây>]` tạo `<tap>/shorts/<NN-ten>/godot/` (chép nv.gd, cast, file vẽ của tập). Hook `[s01-01]` ≤12 chữ có "bạn", câu nối kể lại bối cảnh, kết `[s03-01]` có "đăng ký Cọng Tóc Cuối" nối vòng về hook. gd-voice `--voice "Quốc Tuấn"`, gd-check, `phim.gd` dọc (hình trong y 190–1350; dưới 1350 và mép phải để trống), preview, render, `pack.mjs <short>`. Mỗi short một kiểu (con số sốc / khoảnh khắc tóc rụng / đoạn thoại đắt). Tải lên sau tập dài, dòng đầu mô tả là link tập dài.

## Hợp đồng với gd-render (main.gd sinh sẵn đã đúng)

Cửa sổ 1920×1080 (short 1080×1920), stretch `canvas_items`; đọc `--from= --to=`; `--dur` in `DUR=` + ghi `timeline.json`; giọng/nhạc/sfx bằng `AudioStreamPlayer` (`play(offset)` khi vào giữa); tự quit khi hết.

## Bẫy đã gặp

- **Bản cuối mất tiếng** (tập 6, 29/10/2026: cả video −91 dB dù giọng và nhạc đủ file).
  - Sau mỗi render phải đo `volumedetect` ở 3 chỗ. Giọng bình thường khoảng −19,5 dB.
  - Nếu im thì không render lại. Chạy `python SKILL/scripts/tron-tieng.py <đường dẫn tập>`: script trộn giọng theo `timeline.json` với nhac.ogg −3 dB, ghép vào video bằng `-c:v copy`, giữ bản cũ là `final-cam.mp4`.
  - Script chưa có sfx, nên tập nào có `phim.sfx()` không rỗng thì phải thêm sfx tay.
  - Trộn xong chạy lại `pack.mjs`.
- **Bản cuối kẹt hình** (tập 19, 30/10/2026: từ phần render thứ 2 trở đi nền + thẻ chữ đứng yên ở cảnh k06, chỉ nhân vật cử động; ảnh soi vẫn đúng vì mỗi khung soi dựng lại từ đầu).
  - Nguyên nhân: lớp `nen`/`truoc`/`chu` tự viết không gọi `queue_redraw()` mỗi khung trong `phim.at()`. gd-check giờ chặn.
  - Sau render, trích 1 khung giữa MỖI đoạn kNN từ final.mp4 (giờ lấy ở `timeline.json`) và so với soi; đừng chỉ xem 4 khung.

- GDScript: lấy giá trị từ Array/Dictionary thì khai kiểu rõ (`var x: float = arr[i]`); gọi hàm của nv.gd qua biến **không khai kiểu** (`var b = …`), khai `Node2D` thì lỗi biên dịch.
- nv.gd: polygon tam giác hoá lỗi đã có fallback convex hull; tay cầm điện thoại vẽ sau thân.
- Font tự chọn mỗi tập, đủ dấu tiếng Việt (thử "Thường Châu ưởng ỹ Ỗ"); chữ viết tay: "Segoe Print" có sẵn trên máy.
- Ẩn cửa sổ Godot: gd-render tự thêm `--position -10000,-10000` (cửa sổ ngoài màn hình, vẫn vẽ; `GD_HIEN=1` để thấy). Tự chạy Godot (ảnh bìa, sheet) thì cũng thêm cờ đó; KHÔNG dùng `--headless` khi cần hình (ra đen).
- Chụp ảnh/ảnh bìa bằng Godot: chạy có cửa sổ (đẩy ra ngoài màn hình như trên); cần đúng 1920×1080 thì đặt `window/stretch/mode` (cửa sổ bị màn hình cắt còn 1061 px cao).

## Checklist soi

- [ ] Hook là khoảnh khắc tệ nhất/con số sốc, có "bạn"; Bạn hiện ngay giây đầu.
- [ ] Mỗi chặng một nền tự dựng, hợp chuyện; hình khớp câu đang đọc.
- [ ] Cọng tóc gục dần, urgo tăng đúng các cú đánh; tóc rụng đúng một lần ở khúc tệ nhất, quay cận, lặng.
- [ ] Chỉ Bạn có màu áo; vai phụ nhận ra qua món đồ đặc trưng; có cử động, nhép miệng khi thoại.
- [ ] Số trên hình khớp bảng dữ kiện; có "tính đến …"; chữ ≤12 chữ, không đè mặt.
- [ ] Không chủ đề cấm, không tên công ty/người thật bị bôi xấu, không chửi thề.
- [ ] 20 s cuối là màn hình kết, câu cuối móc video khác.
- [ ] `gd-check` OK; khung, nền, máy quay, palette, nhạc, thumbnail, font, cao trào khác 5 tập trước.

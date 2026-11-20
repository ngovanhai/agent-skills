# Vận hành tự động kênh Tèo Thể Thao (các job theo lịch)

Kênh: @TeoTheThao · ID `UCmVa984PvbXOWKsLKYXbZHw` · tài khoản ngoh33889@gmail.com.
Trình duyệt: FoxProfile profile `teo-the-thao`, điều khiển qua REST `http://127.0.0.1:8000/api/v1/browser/teo-the-thao/page/...`.
Nhật ký chung của các job: `C:/Users/anhha/MuseStudio/the-thao/_tools/job-log.md` (mỗi lần chạy thêm một dòng: ngày giờ, job, kết quả, việc người dùng cần làm).

## Bộ hẹn giờ: Windows Task Scheduler (từ 2026-10-28)

Bộ hẹn giờ của app Claude Desktop ngừng chạy từ 2026-10-27 chiều (app báo oauth 403). Vì vậy 4 job đã chuyển sang Windows Task Scheduler, thư mục `\TeoTheThao\`. Mỗi job gọi `pwsh -File C:/Users/anhha/MuseStudio/the-thao/_tools/chay-job.ps1 -Job <id>`; script này đọc đề ở `~/.claude/scheduled-tasks/<id>/SKILL.md` rồi chạy `claude -p --dangerously-skip-permissions` trong `C:/Users/anhha/MuseStudio`.
- Log mỗi lượt ở `_tools/job-runs/<id>-<giờ>.log`. Lượt trước còn chạy thì lượt sau tự bỏ (file `.lock`).
- **Từ 2026-11-03 người dùng TẮT Short:** job `teo-tt-short` đã tắt (Disabled), job đăng không đăng Short (MAX_SHORT = 0), `teo-tt-video-dai` chạy 07:05/14:05/21:05 và không làm Short. Dòng lịch dưới đây là lịch cũ.
- Lịch hiện tại: `teo-tt-video-dai` 07:05/14:05/21:05, `teo-tt-dang-bai` 05:30 (2 tập dài 07:00 + 19:00, 0 Short), `teo-tt-so-lieu` 22:30. `teo-tt-short` tắt. (Lịch cũ trước 03/11: 2 dài + 6 Short mỗi ngày.)
- Muốn sửa việc của job thì sửa SKILL.md của job đó. Muốn đổi giờ thì dùng `Get-ScheduledTask -TaskPath \TeoTheThao\` / `Set-ScheduledTask`. Muốn chạy ngay thì `Start-ScheduledTask -TaskPath \TeoTheThao\ -TaskName <id>`.
- 4 job cùng tên trong app Desktop đã tắt (`enabled:false`). Không bật lại, nếu bật sẽ chạy trùng.

## Luật đăng (bắt buộc, kể cả khi chạy theo lịch)

- **(Luật cũ, đã thay từ 2026-10-27 — xem mục "Quy trình đăng mới" bên dưới.)** Hiện tại: job `teo-tt-dang-bai` tải lên rồi **hẹn giờ công khai** 07:00/19:00, không cần duyệt từng video.
- **Sổ cái (từ 2026-11-04):** `C:/Users/anhha/MuseStudio/_so-cai/teo-the-thao.json`, công cụ `so-cai.mjs` dùng chung với Cọng Tóc Cuối. `dang-tu-drive.mjs xong` tự ghi "đã hẹn". `danh-sach` coi tập có trong sổ ở trạng thái đã tải/đã hẹn là đã đăng. Xem nhanh: `node so-cai.mjs xem tt | lich | can-xu-ly`, bảng `bang.html`. Hẹn hoặc tải tay ngoài `xong` thì ghi: `node so-cai.mjs ghi tt <slug> da-hen --id <ID> --gio "YYYY-MM-DD HH:MM"`. Xác nhận công khai: `node so-cai.mjs kiem` (hỏi oEmbed công khai của YouTube, không cần trình duyệt).
- Không bình luận ở kênh khác, không nhắn tin, không đổi cài đặt tài khoản.

## Sản xuất bằng agy (Gemini 3.8 Flash), Claude review (người dùng chọn 2026-10-27)

agy: `C:/Users/anhha/AppData/Local/agy/bin/agy.exe` (Antigravity CLI). Người dùng chọn cho agy tự duyệt mọi lệnh (`--dangerously-skip-permissions`).
- Bản giao việc: `C:/Users/anhha/MuseStudio/the-thao/_tools/agy-video-dai.md` và `agy-short.md` (cấm tải lên/đụng kênh/Drive). Thêm dòng "NHIỆM VỤ CỤ THỂ" ở cuối khi cần.
- **Chạy (từ 2026-10-29): KHÔNG gọi agy.exe thẳng từ Bash.** Ngày 29/10, gọi agy thẳng từ phiên Claude headless làm chết chính phiên đó (mã 0xC000013A/137); lượt 09:18 còn kéo chết cả các job khác đang chạy. Cách chạy: ghi bản giao việc (agy-video-dai.md + dòng NHIỆM VỤ CỤ THỂ) ra một file, rồi
  `pwsh -NoProfile -File C:/Users/anhha/MuseStudio/the-thao/_tools/chay-agy.ps1 -Tag <việc-ngày-giờ> -PromptFile <file giao việc> [-Continue]`
  Lệnh này mở agy thành một tác vụ Task Scheduler riêng (`\TeoTheThaogy\`) rồi trả về ngay, in đường dẫn `log=` và `done=`. Chờ agy xong bằng Bash `run_in_background` với vòng `until [ -f <done> ]; do sleep 5; done`; file `.done` chứa mã thoát của agy. Muốn dừng agy thì chạy `Stop-ScheduledTask -TaskPath \TeoTheThaogy\ -TaskName agy-<tag>`.
- **agy hết hạn mức thì KHÔNG dùng agy nữa (người dùng chốt 2026-11-03).** Trước khi gọi agy, đọc `C:/Users/anhha/MuseStudio/the-thao/_tools/agy-het-han.txt`: nếu file có và mốc mở lại trong đó chưa tới thì KHÔNG gọi agy. agy trả 429 / RESOURCE_EXHAUSTED / "Resets in …" thì ghi mốc mở lại (giờ hiện tại + thời gian chờ) vào file đó. Hai trường hợp này đều không DỪNG job: **Claude tự sản xuất toàn bộ** theo skill `teo-the-thao` (tập dài: quy trình bước 0–13; Short: mục Shorts dọc), vẫn qua `slot.sh`, vẫn review kịch bản bằng subagent độc lập, rồi pack → drive-sync --xoa như thường. Ghi job-log "Claude tự làm (agy hết hạn mức đến …)".
- Trước khi chạy ghi job-log dòng "ĐANG LÀM: agy …" để job khác không làm trùng; xong thì thay bằng kết quả.
- **Claude review trước khi tải lên** (không tin báo cáo của agy):
  1. `gd-check <tập>` (hoặc `<short>`) phải OK; mở `y-tuong.md` xem Đánh giá chủ đề (≥28/40) và Review kịch bản ĐẠT.
  2. Đọc `godot/loi.txt`, đối chiếu từng con số/tên/phút với bảng dữ kiện (≥2 nguồn); kiểm luật cấm (cá cược, hạ nhục, trích >1 câu, "tạm biệt"), hook, CTA, câu kết. Nghi ngờ dữ kiện thì tự WebSearch kiểm.
  3. Xem ảnh: sheet preview `work/sheet-*.jpg`, thumbnail, và lấy 4–6 khung từ mp4 cuối bằng ffmpeg; tìm chữ chồng/tràn, nhân vật bị che, khung trống, logo CLB.
  4. Lỗi nhỏ → tự sửa và render lại phần đó; lỗi lớn → `agy.exe --continue -p "<danh sách lỗi cần sửa>" …` hoặc làm lại; lỗi dữ kiện không sửa được → không tải lên, ghi job-log.
  5. Đạt mới tải lên (Riêng tư) → job-log → drive-sync --xoa.

## Quy trình đăng mới: Drive → hàng chờ → đăng mỗi ngày (người dùng chọn 2026-10-27, thay mọi chỗ "Riêng tư, chờ duyệt" bên dưới)

- **Sản xuất** (job teo-tt-video-dai, teo-tt-short, hoặc làm tay): review xong → `pack.mjs` → ghi `<tập>/youtube/binh-luan.txt` (câu hỏi hai lựa chọn) → `drive-sync.mjs <tập> --xoa`. KHÔNG tải lên YouTube.
- **Hàng chờ:** `node C:/Users/anhha/MuseStudio/the-thao/_tools/dang-tu-drive.mjs danh-sach` đọc `G:/My Drive/TeoTheThao/*` và sổ đã đăng `_tools/da-dang.json`.
- **Đăng** (job teo-tt-dang-bai, 8:00 mỗi ngày): `dang-tu-drive.mjs chon` chọn 1 tập dài (cũ nhất; bỏ nếu ngày đó đã có tập dài hẹn) + 3 Short (ưu tiên Short có tập dài đã đăng ngày trước; Short của tập dài cùng ngày chỉ xếp sau 19:00), chép tạm về `the-thao/_dang/` (FoxProfile chỉ tải file trong the-thao) → `Upload-Video` (`_tools/dang-bai.ps1`) → `Schedule-Video` (`_tools/yt-schedule.ps1`) → `dang-tu-drive.mjs xong <id> <link> "<ngày giờ>"`. Giờ: tập dài 19:00, Short 11:30, 15:30, 21:30 (GMT+7).
- Người dùng chọn tự công khai theo giờ: job đăng KHÔNG cần duyệt từng ngày. "duyệt hết" chỉ còn dùng cho video cũ còn nằm ở mục "Chờ duyệt".
- Bình luận câu hỏi: job đăng hôm sau đăng dưới video đã công khai hôm trước.

## Duyệt gộp: người dùng nhắn "duyệt hết" (2026-10-27)

Người dùng không duyệt từng video; chỉ cần một câu trong chat ("duyệt hết", "đăng hết", "duyệt tất cả video chờ") là đồng ý cho **mọi video đang nằm ở mục "Chờ duyệt" của job-log tại thời điểm đó**. Khi nhận câu ấy (trong phiên chat với người dùng, không phải trong job tự chạy):
1. Đọc mục "Chờ duyệt" trong `C:/Users/anhha/MuseStudio/the-thao/_tools/job-log.md`, liệt kê lại ngắn cho người dùng biết sẽ đăng gì.
2. Với từng video: giờ đề xuất còn ở tương lai → **Lên lịch** đúng giờ đó (GMT+07:00); giờ đã qua → Công khai ngay (Short cách nhau ≥2 giờ thì lên lịch rải tiếp trong ngày).
3. Bình luận câu hỏi đề xuất: video công khai ngay thì đăng luôn; video hẹn giờ thì tạo một scheduled task một lần (fireAt = giờ đăng + 5 phút) đăng bình luận, như teo-tt-binh-luan-tap2.
4. Chuyển các dòng sang "Nhật ký đăng" của ke-hoach-30-ngay.md, xoá khỏi "Chờ duyệt", báo lại danh sách + giờ.
Video tải lên SAU câu "duyệt hết" chưa được duyệt — chờ câu duyệt tiếp theo. Job tự chạy không bao giờ tự công khai.

## Bước 0: bảo đảm trình duyệt chạy

```powershell
try { Invoke-RestMethod http://127.0.0.1:8000/api/v1/health } catch {
  Start-Process C:\Users\anhha\foxprofile\.venv\Scripts\pythonw.exe -ArgumentList '"C:\Users\anhha\foxprofile\launch_hidden.pyw"' -WorkingDirectory C:\Users\anhha\foxprofile
  # chờ tối đa 40 s cho /health
}
# profile chưa chạy thì: POST /api/v1/browser/teo-the-thao/launch
```
Sau khi mở, chụp `GET .../page/screenshot` xem avatar góc phải. Nếu không phải kênh Tèo Thể Thao (profile còn đăng nhập tài khoản chính có Tèo Tửu Lâu) thì bấm avatar → "Chuyển đổi tài khoản" → chọn Tèo Thể Thao.
Đã chạy thật 2026-10-28: Studio báo "Rất tiếc, bạn không có quyền xem trang này". Cách sửa: mở `https://www.youtube.com/`, bấm `#avatar-btn` → mục "Chuyển đổi tài khoản" → bấm mục có chữ "Tèo Thể Thao" (thuộc ngoh33889). Bước này chỉ đổi sang tài khoản Google ngoh33889 và có thể vào nhầm kênh Cọng Tóc Cuối. Vì vậy mở tiếp `https://www.youtube.com/channel_switcher`, rồi `evaluate` click phần tử `tp-yt-paper-icon-item` cuối cùng có chữ "Tèo Thể Thao". Sau đó Studio mới mở được. Gặp trang đăng nhập Google: **dừng**, báo người dùng đăng nhập lại (không nhập mật khẩu).

## Các lệnh trang hay dùng

- `POST navigate {url}` · `GET text?max_chars=` · `GET snapshot` (cây truy cập, để tìm selector) · `GET screenshot` (đọc ảnh để biết toạ độ)
- `POST click {selector}` · `POST click-at {x,y}` · `POST type {selector,text,clear}` · `POST press {key}` · `POST wait {selector}`
- `POST upload {selector, path, index}`: đặt file vào `<input type=file>`. Chỉ nhận file trong `C:\Users\anhha\MuseStudio\the-thao` (biến `FOXPROFILE_UPLOAD_ROOT` trong `foxprofile/.env`).
- `POST evaluate {script}` (≤200.000 ký tự).
Gửi body JSON có tiếng Việt bằng bytes UTF-8 (`[Text.Encoding]::UTF8.GetBytes(...)`), nếu không chữ sẽ lỗi dấu.

## Tải video lên Studio (ở chế độ Riêng tư)

1. `navigate https://studio.youtube.com/channel/UCmVa984PvbXOWKsLKYXbZHw/videos/upload?d=ud` (mở hộp tải lên).
2. `upload {selector:"input[type=file]", path:"<tap>/youtube/<slug>.mp4"}`; chờ vài giây cho bảng chi tiết hiện.
3. Tiêu đề: ô `#title-textarea #textbox` (contenteditable) → `type`. Mô tả: `#description-textarea #textbox`.
4. Thumbnail: `upload {selector:"input#file-loader", path:"<tap>/youtube/thumbnail.png"}` (kênh cần xác minh điện thoại mới đổi thumbnail; nếu bị khoá thì ghi vào job-log để người dùng xác minh).
5. Danh sách phát: chọn series hợp (tạo mới nếu chưa có).
6. "Dành cho trẻ em": chọn **Không** (`tp-yt-paper-radio-button[name=VIDEO_MADE_FOR_KIDS_NOT_MFK]`).
7. "Hiện thêm" → thẻ (tags) từ `youtube/tags.txt`; ngôn ngữ video Tiếng Việt.
8. Bấm "Tiếp" (`#next-button`) đến bước Chế độ hiển thị → chọn **Riêng tư** (`tp-yt-paper-radio-button[name=PRIVATE]`) → "Lưu" (`#done-button`).
9. Màn hình kết + thẻ: ở bước "Thành phần video" thêm màn hình kết (video đề xuất + nút đăng ký) nếu kênh đã có video khác.
10. Chụp màn hình xác nhận, lấy link video, ghi vào job-log mục "Chờ duyệt".
Selector Studio đổi theo thời gian: nếu một selector không thấy, dùng `snapshot`/`screenshot` để tìm lại, rồi **sửa file này** cho lần sau.

**Đã chạy thật (2026-10-26, tập 1), dùng theo cách này:**
- File: `upload {selector:"input[type=file]", path:…mp4}` → video lưu Riêng tư ngay, mở bảng Chi tiết.
- Tiêu đề/mô tả: `type` vào `#title-textarea #textbox` và `#description-textarea #textbox` (clear=true). Gõ mô tả có `#` sẽ bật bảng gợi ý hashtag vô hình **chặn click-at** về sau → từ đó trở đi bấm bằng `evaluate` (`element.click()`), không dùng click-at.
- Trẻ em: `evaluate` click `tp-yt-paper-radio-button[name=VIDEO_MADE_FOR_KIDS_NOT_MFK]`, kiểm `aria-checked=true`. "Hiện thêm": click `#toggle-button`.
- Thẻ: `type {selector:'input[aria-label="Thẻ (từ khóa)"]', text:<tags.txt>, clear:false, submit:true}` → tách thành chip theo dấu phẩy.
- Thumbnail: `input#file-loader` nhận file nhưng **kênh chưa xác minh SĐT thì không áp** (ô "Tải tệp lên" có dấu ?). Người dùng phải tự xác minh tại https://www.youtube.com/verify ; xác minh xong mới thay ảnh bìa.
- Bấm `#next-button` 3 lần (cách 3 s), click `tp-yt-paper-radio-button[name=PRIVATE]`, rồi `#done-button`. Link video hiện ở bảng (youtu.be/<id>); trang sửa: `https://studio.youtube.com/video/<id>/edit`.
- Gọi API page có lúc treo >2 phút: đặt `-TimeoutSec 40` và thử lại thay vì chờ.
- **2026-10-30 (job đăng 09:03), Studio chậm:** `type` của FoxProfile hết hạn 10 s với chuỗi dài → `Upload-Video` để lại **bản nháp tên file** (tiêu đề/thẻ không vào). Cách chạy được (script mẫu `_tools/job-runs/full2-0903.ps1`, `dlg-0903.ps1`, `ev-0903.ps1`, `hen-0903.ps1`):
  1. Tải file, **chờ tới khi thanh tiến trình báo "Đã hoàn tất quá trình tải lên"** (rời trang khi đang "Đã tải được x%" là mất bản tải).
  2. Lấy id từ hàng trong tab Shorts (`innerHTML` có `vi/<id>`), mở `studio.youtube.com/video/<id>/edit`, JS-click nút "Chỉnh sửa bản nháp" → hộp tải lên mở (click-at/Playwright click vào nút ở danh sách thường không ăn).
  3. Trong `ytcp-uploads-dialog`: mô tả bằng `focus()` + `document.execCommand('selectAll')` + `execCommand('insertText', false, text)`; trẻ em: Không; `#next-button` ×3; `PRIVATE`; `#done-button`.
  4. Ở trang sửa: tiêu đề và thẻ bằng `execCommand('insertText')` (thẻ: chuỗi "a, b, c,"), bấm `ytcp-button#save`, chờ `aria-disabled=true`.
  5. Hẹn giờ: mở hàng, JS-click `p#visibility-title` "Lên lịch"; gõ giờ (`input:visible >> nth=2`); **mở ô ngày bằng phím: `press Shift+Tab` rồi `press Enter`** (click không mở); click-at vào ô chữ ngày trong lịch, `type {selector:'input:focus', text:'30 thg 10, 2026', submit:true}`; đọc lại rồi bấm nút "Lên lịch".
  6. Luôn đọc lại cột "Chế độ hiển thị" sau khi hẹn: lượt 08:00 ngày 30/10 ghi da-dang.json là đã hẹn tập 05 nhưng Studio vẫn "Riêng tư".
- **2026-10-31 (job đăng 08:00), cách gọn hơn, đã chạy được cả 7 video:** `_tools/job-runs/dang2-1031.ps1` (cùng `dlg-1031.ps1`, `ev-1031.ps1`, `hen-0903.ps1`, kế hoạch `plan-1031.json`). Tải file xong thì **không rời trang**: lấy id từ link `youtube.com/shorts/<id>` / `youtu.be/<id>` trong `ytcp-uploads-dialog`, chờ tải xong rồi điền ngay trong hộp đang mở. Cách cũ (rời trang rồi tìm hàng theo tên file) có 2 lần không thấy hàng. Bình luận: `bl-1031.ps1 -Vid -Text` (nếu kênh đã có bình luận thì bỏ qua).

**Đổi chế độ hiển thị / hẹn giờ (đã chạy thật 2026-10-27, chỉ làm khi người dùng duyệt):**
- Trang danh sách: `…/videos/upload` (video dài) hoặc `…/videos/short` (Shorts). Tìm dòng bằng `[...document.querySelectorAll('ytcp-video-row')].find(x=>x.innerText.includes('<tiêu đề>'))`, mở bảng bằng click `.tablecell-visibility .icon-text-edit-triangle-wrap` của **đúng dòng đó** (không đụng video khác).
- Công khai ngay: click `tp-yt-paper-radio-button[name=PUBLIC]` đang hiện → nút "Xuất bản".
- Hẹn giờ: click chữ "Lên lịch" để mở; mở ô ngày bằng click `ytcp-dropdown-trigger` có chữ "thg"; `type {selector:'input:visible >> nth=3', text:'27 thg 10, 2026', submit:true}` (ô ngày trong lịch), `type {selector:'input:visible >> nth=2', text:'19:30', submit:true}` (ô giờ); "Múi giờ" chọn `(GMT+0700)`; bấm "Lên lịch". Mở lại bảng để đọc lại ngày/giờ rồi "Hủy".
- Shorts: ô "Video có liên quan" nằm ở bước **"Các thành phần của video"** lúc tải lên (sau đó trang sửa không còn). Bấm "Thêm" trong hàng đó (evaluate: tìm nút "Thêm" trong tổ tiên của chữ "Video có liên quan"). 2026-10-27: hộp chọn không mở khi tập dài nguồn còn Riêng tư/đã lên lịch — nên tải Short SAU khi tập dài đã công khai; nếu không được thì vẫn để link tập dài ở dòng đầu mô tả. Hàm dùng sẵn: `the-thao/_tools/yt-lib.ps1` (YPost, YEv, YNav, YShot, Read-Pack).
- Bình luận: trang xem → click `#simplebox-placeholder` → `type #contenteditable-root` → click `#submit-button`. Ghim cần kênh đã xác minh.

## Sau khi tải lên: đẩy Drive rồi xoá video trong máy (người dùng yêu cầu 2026-10-27)

Ngay sau khi video (dài hoặc Short) đã tải lên YouTube xong và ghi job-log:
```
node C:/Users/anhha/.claude/skills/teo-the-thao/scripts/drive-sync.mjs <thư mục tập> --xoa
```
- Chép `<tập>/youtube/` (kể cả `youtube/shorts/`) sang `G:/My Drive/TeoTheThao/<slug>/`, so SHA-256 từng file, **chỉ khi khớp hết** mới xoá mp4/avi/wav nặng trong máy (giữ project godot, kịch bản, thumbnail, file chữ).
- Short cắt từ tập dài: chạy trên thư mục tập dài (file đã xoá trước đó vẫn còn trên Drive, chỉ file mới được chép).
- Không thấy ổ G: (Drive chưa mở/đăng nhập) → KHÔNG xoá gì, ghi job-log "chưa lên Drive" để người dùng mở Google Drive; lần chạy sau làm bù.
- Không bao giờ xoá trước khi tải lên YouTube xong.

## Đọc số liệu (chỉ đọc)

- Tổng quan kênh: `https://studio.youtube.com/channel/UCmVa984PvbXOWKsLKYXbZHw/analytics/tab-overview/period-default` → `GET text`.
- Từng video: Studio → Nội dung → video → Số liệu phân tích (tab Phạm vi tiếp cận: CTR; tab Mức độ tương tác: thời lượng xem trung bình, giữ chân 30 s). Shorts: tỉ lệ "đã xem" và "vuốt qua".
- Số sub hiện tại: trang tổng quan hoặc `https://www.youtube.com/@TeoTheThao`.
- Ghi vào bảng "Nhật ký số liệu" trong `ke-hoach-30-ngay.md`.

## Tự tối ưu (sau mỗi lần đọc số liệu)

So các video theo bảng chỉ số ở `tang-truong.md` mục 10, rồi ghi **bài học** vào mục "Bài học từ số liệu" cuối `tang-truong.md`:
- dạng: `- YYYY-MM-DD: <quan sát có số> → <thay đổi áp dụng cho tập/short sau>`;
- chỉ ghi điều có số liệu chứng minh (ít nhất 2 video cùng xu hướng), không đổi luật cứng hay điều cấm;
- đổi lịch chủ đề trong `ke-hoach-30-ngay.md` nếu một series/kiểu short thắng rõ (làm thêm phần tiếp theo).
Các job sản xuất đọc mục "Bài học từ số liệu" trước khi chọn chủ đề và viết kịch bản.

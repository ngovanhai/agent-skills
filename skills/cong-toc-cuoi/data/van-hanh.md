# Vận hành kênh Cọng Tóc Cuối

Kênh: @congtoccuoi · ID `UClW6e47o_G4Jy1H0i2pBxig` · tài khoản thương hiệu dưới ngoh33889@gmail.com (cùng Google account với Tèo Thể Thao `UCmVa984PvbXOWKsLKYXbZHw`).
Trình duyệt: FoxProfile profile **`cong-toc-cuoi`** (tạo 2026-10-28, cookie chép từ `teo-the-thao` theo yêu cầu người dùng, kênh mặc định đã chọn là Cọng Tóc Cuối). REST: `http://127.0.0.1:8000/api/v1/browser/cong-toc-cuoi/page/...`.
**Không dùng profile `teo-the-thao` cho kênh này** (profile đó phải luôn ở kênh Tèo cho job đăng bài 8:00).
Nhật ký: `C:/Users/anhha/MuseStudio/cong-toc-cuoi/_tools/job-log.md` (mỗi lần tải lên một dòng; job 09:00 vẫn đọc file này để chặn tải trùng, nên đừng sửa mẫu dòng).
**Sổ cái (từ 2026-11-04):** `C:/Users/anhha/MuseStudio/_so-cai/cong-toc-cuoi.json`, chung công cụ `so-cai.mjs` với Tèo Thể Thao. Trạng thái: đang làm → chờ đăng (đã đóng gói) → đã tải → đã hẹn → công khai, hoặc LỖI. `ctc-dang.ps1` tự ghi. Tải hoặc hẹn tay ngoài script thì ghi bằng: `node so-cai.mjs ghi ctc <slug> da-hen --id <ID> --gio "YYYY-MM-DD HH:MM"`.

## Luật
- Job `ctc-dang-bai` (09:00, `_tools/ctc-hang-ngay.ps1`) tự tải lên và **hẹn giờ công khai** 07:00/19:00, giữ lịch kín 3 ngày tới (người dùng chốt 2026-11-03). Tập bị LỖI mà chưa có mã video thì lượt sau tự thử lại. Đăng tay: `pwsh -File _tools/ctc-dang.ps1 -Tap <slug> -Ngay YYYY-MM-DD -Gio 07:00`.
- Trước mọi thao tác trên Studio: chụp màn hình, avatar góc phải phải là Bạn (đầu tròn, cọng tóc, áo xanh), URL Studio phải chứa `UClW6e47o_G4Jy1H0i2pBxig`. Sai kênh → mở `https://studio.youtube.com/channel/UClW6e47o_G4Jy1H0i2pBxig` hoặc channel_switcher chọn Cọng Tóc Cuối.
- Gặp trang đăng nhập Google: **dừng**, báo người dùng đăng nhập lại trong profile `cong-toc-cuoi` (không nhập mật khẩu). Cookie chép từ profile khác có thể bị Google thu hồi; nếu profile `teo-the-thao` cũng bị đăng xuất thì báo ngay.
- Không bình luận ở kênh khác, không nhắn tin, không đổi cài đặt tài khoản.

## Mở trình duyệt
```powershell
try { Invoke-RestMethod http://127.0.0.1:8000/api/v1/health } catch {
  Start-Process C:\Users\anhha\foxprofile\.venv\Scripts\pythonw.exe -ArgumentList '"C:\Users\anhha\foxprofile\launch_hidden.pyw"' -WorkingDirectory C:\Users\anhha\foxprofile
}
# POST /api/v1/browser/cong-toc-cuoi/launch ; xong việc POST .../stop
```
Body JSON có tiếng Việt gửi bằng bytes UTF-8. `GET page/text` có lúc trả rỗng trên trang YouTube dù DOM đã có: dùng `evaluate` đọc phần tử.

## Tải file lên
FoxProfile chỉ nhận file dưới `C:\Users\anhha\MuseStudio\the-thao` (`FOXPROFILE_UPLOAD_ROOT` trong `foxprofile/.env`). Chép tạm vào `C:\Users\anhha\MuseStudio\the-thao\_dang_ctc\`, tải lên, rồi **xoá thư mục đó** (đừng để file kênh này lẫn vào hàng chờ của Tèo).

## Tải video lên Studio
Selector và mẹo giống hệt kênh Tèo: đọc mục "Tải video lên Studio" và "Đổi chế độ hiển thị / hẹn giờ" trong `~/.claude/skills/teo-the-thao/data/van-hanh.md`, chỉ thay ID kênh thành `UClW6e47o_G4Jy1H0i2pBxig`:
1. `navigate https://studio.youtube.com/channel/UClW6e47o_G4Jy1H0i2pBxig/videos/upload?d=ud`
2. `upload {selector:"input[type=file]", path:"…\_dang_ctc\<slug>.mp4"}` → tiêu đề, mô tả (`type` vào `#title-textarea #textbox`, `#description-textarea #textbox`), thumbnail `input#file-loader`, không dành cho trẻ em, thẻ, Riêng tư, Lưu.
3. Hẹn giờ công khai, ghi job-log và sổ cái (`ctc-dang.ps1` làm hết các bước này).
Sau khi tải xong: `node ~/.claude/skills/cong-toc-cuoi/scripts/drive-sync.mjs <tap> --xoa` (lên `G:/My Drive/CongTocCuoi/<slug>/`, chỉ xoá trong máy khi SHA-256 khớp).

## Ảnh kênh
Avatar/banner gốc: `C:/Users/anhha/MuseStudio/cong-toc-cuoi/kenh/`. Vẽ lại: trong `_tools/doodle` chạy `godot --path . -- --mode=avatar|banner --out=<png>` rồi ffmpeg (avatar: `crop=1080:1080:420:0,scale=800:800`; banner: `scale=2560:1440`, vùng an toàn 1546×423 giữa). Tải lên ở Studio → Tùy chỉnh → Hồ sơ (input file thứ 0 = banner, thứ 1 = ảnh) → Xong → Xuất bản.

## Đọc số liệu (chỉ đọc)
`https://studio.youtube.com/channel/UClW6e47o_G4Jy1H0i2pBxig/analytics/tab-overview/period-default`. Ghi bài học có số (≥2 video cùng xu hướng) vào cuối `cong-thuc.md` mục "Bài học từ số liệu".

## Sản xuất tự động bằng AGY CLI (Cập nhật 2026-11-06)
agy: `C:/Users/anhha/AppData/Local/agy/bin/agy.exe` (Antigravity CLI), model mặc định `gemini-3.8-flash-high`.
- **Tác vụ Windows Task Scheduler:** `ctc-tao-video` (chạy tự động lúc 02:00 và 14:00).
- **Bộ điều phối:** `C:/Users/anhha/MuseStudio/cong-toc-cuoi/_tools/chay-job-ctc.ps1`.
- **Đề bài tự động:** `C:/Users/anhha/MuseStudio/cong-toc-cuoi/_tools/ctc-video-dai-prompt.md`.
- **Quy trình:**
  1. Script kiểm tra sổ cái `_so-cai/so-cai.mjs`. Nếu số tập chờ đăng $\ge 6$ thì nghỉ lượt để tránh dư thừa và nghẽn máy.
  2. Khi hàng chờ $< 6$ hoặc có cờ `-Force`, agy tự động chọn ý từ `kho-y-tuong.md`, tạo tập mới, viết kịch bản, chạy TTS (Quốc Tuấn + thoại nữ Ngọc Huyền), code Godot, tạo nhạc, soi hình, tự review độc lập, render bản cuối `gd-render.mjs --par 2`, đóng gói `pack.mjs` và cập nhật sổ cái `quet ctc`.
  3. Lệnh chạy bằng tay:
     - Kiểm tra và làm nếu thiếu hàng chờ: `pwsh -File C:\Users\anhha\MuseStudio\cong-toc-cuoi\_tools\chay-job-ctc.ps1`
     - Ép làm ngay 1 tập: `pwsh -File C:\Users\anhha\MuseStudio\cong-toc-cuoi\_tools\chay-job-ctc.ps1 -Force`

## Sản xuất trước đây bằng agy bán tự động (lịch sử 2026-10-29 đến 2026-11-05)
agy: `C:/Users/anhha/AppData/Local/agy/bin/agy.exe` (Antigravity CLI), tự duyệt mọi lệnh (`--dangerously-skip-permissions`).
- **Bản giao việc:** `C:/Users/anhha/MuseStudio/cong-toc-cuoi/_tools/agy-tap.md`. agy làm từ chọn chủ đề đến kịch bản, giọng, phim.gd, soi, thumbnail, nhạc, rồi **dừng trước khi render bản cuối**. Muốn giao chủ đề cụ thể thì thêm dòng "NHIỆM VỤ CỤ THỂ: …" vào cuối prompt.
- **Chạy** (Git Bash, chạy nền):
  `cd /c/Users/anhha/MuseStudio/cong-toc-cuoi && /c/Users/anhha/AppData/Local/agy/bin/agy.exe -p "$(cat _tools/agy-tap.md)" --model gemini-3.8-flash-high --dangerously-skip-permissions --print-timeout 0 > _tools/agy-<việc>.log 2>&1`
- **agy hết quota thì thôi dùng agy** (người dùng chọn 2026-11-03). Log có `RESOURCE_EXHAUSTED` / `Individual quota reached` (mã 429) nghĩa là hết quota:
  - Không chờ quota hồi rồi chạy lại.
  - Không viết vòng thử lại.
  - Phần việc dở của đợt đó giao cho subagent Claude (general-purpose). Đưa subagent nguyên file `_tools/agy-tapNN-prompt.md` làm đề bài, kèm phần việc agy đã làm dở trong thư mục tập. Mỗi subagent làm 1 tập.
  - Sau đó review và render như thường.
  - Đợt sau chỉ thử agy lại khi người dùng bảo.
- **Không kill bash cha của agy đang chạy.** Ngày 2026-11-03 tao kill vòng chờ quota thì agy mất console, mọi lệnh của nó bị lỗi hook `0xc0000142`. Muốn dừng thì dừng hẳn agy.exe (kiểm command line trước khi dừng, vì kênh Tèo cũng chạy agy). Muốn chạy lại thì mỗi cặp tập một lệnh nền riêng.
- **Claude review**, không tin báo cáo của agy:
  1. Đọc `kich-ban-tho.md`, `y-tuong.md` và `loi.txt`. Tự cộng lại sổ tiền và dòng thời gian. Gọi subagent review độc lập để soi lỗ hổng logic. Kiểm giọng kể tự nhiên, hook, CTA, kết, và tiêu đề có từ khoá đúng.
  2. Tự chạy `soi.mjs`, mở từng ảnh `work/soi-*.jpg` và thumbnail. Dò trong phim.gd các chuỗi `draw_string` có width vì chúng làm cắt chữ.
  3. Đo nhạc khoảng −35 dB, không có kèn hay sáo. `gd-check` phải OK.
  4. Lỗi nhỏ thì tự sửa. Lỗi lớn thì gọi `agy.exe --continue -p "<danh sách lỗi>" …` hoặc tự dựng lại.
  5. Đạt thì render `gd-render --par 2`, `pack.mjs`, `gd-check --log`, trích 4 khung full-size và đo tiếng từ bản cuối, rồi báo người dùng.
- **Chạy song song** (người dùng chọn 2026-10-29): nhiều agy cùng lúc, mỗi agy một tập với số tập, ý tưởng, font và kiểu nhạc giao sẵn trong file `_tools/agy-tapNN-prompt.md` để các tập không trùng nhau. agy không sửa chu-de.md; Claude đánh dấu khi review. Giọng và soi hình vẫn đi qua slot.sh. **Render bản cuối do Claude chạy, lần lượt từng tập**, vì mỗi tập chiếm 2 suất khoảng 30 phút. Bạn nữ dùng vai `ban_nu` có sẵn trong engine (nơ hồng + váy).

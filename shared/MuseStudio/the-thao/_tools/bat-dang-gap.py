# Bật "đăng gấp" cho job teo-tt-video-dai: tập theo chủ đề nóng (có youtube/UU-TIEN.txt) được tự tải lên
# và hẹn giờ ngay trong ngày (19:00 hoặc giờ tròn kế tiếp, muộn nhất 21:00), không chờ job 8:00 hôm sau.
# Người dùng tự chạy: ! python C:/Users/anhha/MuseStudio/the-thao/_tools/bat-dang-gap.py
import os
p = os.path.expanduser(r'~\.claude\scheduled-tasks\teo-tt-video-dai\SKILL.md')
s = open(p, encoding='utf-8').read()
a = '5. TUYỆT ĐỐI không tải lên YouTube, không mở Studio ở job này.'
if '4b. **ĐĂNG GẤP' in s:
    print('đã bật từ trước')
else:
    assert a in s, 'không thấy dòng 5 trong đề job'
    s = s.replace(a, '''4b. **ĐĂNG GẤP tập theo chủ đề nóng (người dùng bật 2026-10-30).** Chỉ áp dụng cho tập có `youtube/UU-TIEN.txt`, tức đề xuất ≥17/25 của tim-chu-de-hot. Chạy `node C:/Users/anhha/MuseStudio/the-thao/_tools/dang-tu-drive.mjs chon-mot <tên thư mục tập>`.
   - Ra `"gio": "de-mai"` thì dừng ở đây; job 8:00 sẽ đăng tập này trước.
   - Ra kế hoạch thì đăng đúng theo đề `C:/Users/anhha/.claude/scheduled-tasks/teo-tt-dang-bai/SKILL.md`: bước 1 (FoxProfile, đúng kênh Tèo Thể Thao), bước 3 a, c, d, e (Upload-Video, Schedule-Video theo `gio`, `xong`), bước 5 (ghi job-log + Nhật ký đăng).
   - Không đăng Short ở bước này.
5. Ngoài bước 4b, TUYỆT ĐỐI không tải lên YouTube, không mở Studio ở job này.''', 1)
    open(p, 'w', encoding='utf-8').write(s)
    print('đã bật đăng gấp cho job teo-tt-video-dai')

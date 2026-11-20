Bạn SỬA tập 3 của kênh "Cọng Tóc Cuối" theo review độc lập. Trả lời tiếng Việt.
Thư mục: C:/Users/anhha/MuseStudio/cong-toc-cuoi/tap-03-nha-vo-hoi-luong/ (đọc kich-ban-tho.md, y-tuong.md, godot/loi.txt, godot/phim.gd, story.json).
Danh sách lỗi bắt buộc sửa: C:/Users/anhha/MuseStudio/cong-toc-cuoi/tap-03-nha-vo-hoi-luong/work/review-claude.md — sửa TỪNG điểm, không bỏ sót.
Luật & công cụ như trong C:/Users/anhha/.claude/skills/cong-toc-cuoi/SKILL.md (đọc lại phần lệnh). Sau khi sửa:
1. Cập nhật kich-ban-tho.md + mục "## Sổ logic" trong y-tuong.md cho khớp; tự cộng lại mọi con số. Thêm vào cuối mục "## Review kịch bản" một đoạn "Review độc lập (Claude) lần 1: CHƯA ĐẠT → đã sửa: …" và giữ dòng "Kết luận: ĐẠT" chỉ khi đã sửa hết.
2. Sửa godot/loi.txt. Thêm/bớt câu thì PHẢI sửa phim.gd theo chỉ số câu mới (li, T(i), lk(i)) để hình khớp lời.
3. Đọc lại giọng: bash C:/Users/anhha/MuseStudio/the-thao/_tools/slot.sh "tap03 giọng" node C:/Users/anhha/.claude/skills/teo-kiem-hiep/scripts/gd-voice.mjs <tập> --voice "Quốc Tuấn" (có cache, chỉ đọc câu đổi).
4. node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/gd-check.mjs <tập> phải OK; chạy lại work/nhac.py (nhạc ~ −35 dB, tắt ở cảnh tóc rụng); render lại thumbnail.
5. Soi lại: bash .../slot.sh "tap03 soi" node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/soi.mjs <tập>, MỞ TỪNG ẢNH work/soi-*.jpg, sửa chữ đè, khung trống/lặp, hình không khớp lời.
DỪNG trước render bản cuối. KHÔNG tải lên YouTube, không đụng tập khác, không sửa skill. Báo cáo ngắn: đã sửa từng điểm thế nào, thời lượng mới.

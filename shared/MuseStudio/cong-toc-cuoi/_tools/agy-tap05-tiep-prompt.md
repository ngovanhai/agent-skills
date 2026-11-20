Bạn TIẾP TỤC tập 5 kênh "Cọng Tóc Cuối": C:/Users/anhha/MuseStudio/cong-toc-cuoi/tap-05-dong-nghiep-cuop-cong/ (kịch bản, phim.gd, thumbnail, nhac.py đã có; giọng CHƯA đọc vì lượt trước thoát sớm). Trả lời tiếng Việt. Luật trong C:/Users/anhha/.claude/skills/cong-toc-cuoi/SKILL.md.
QUAN TRỌNG: chạy các lệnh dài Ở TIỀN CẢNH (chờ lệnh xong), KHÔNG để chạy nền rồi kết thúc phiên — lượt trước bị huỷ tác vụ nền khi thoát.
Việc còn lại:
1. bash C:/Users/anhha/MuseStudio/the-thao/_tools/slot.sh "tap05 giọng" node C:/Users/anhha/.claude/skills/teo-kiem-hiep/scripts/gd-voice.mjs <tập> --voice "Quốc Tuấn" (có thể phải chờ suất máy vài phút đến hàng chục phút — cứ chờ).
2. node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/gd-check.mjs <tập> → sửa đến OK (có timeline.json).
3. python work/nhac.py <tập> → godot/nhac.ogg; đo ffmpeg -af volume=-3dB,volumedetect ~ −35 dB; không kèn/sáo.
4. bash .../slot.sh "tap05 soi" node C:/Users/anhha/.claude/skills/cong-toc-cuoi/scripts/soi.mjs <tập>; MỞ TỪNG ẢNH work/soi-*.jpg, sửa chữ đè mặt/ảnh, chữ tràn, khung trống/lặp, hình không khớp lời; soi lại.
DỪNG trước render bản cuối. Không tải lên, không đụng tập khác, không sửa skill. Báo cáo ngắn.

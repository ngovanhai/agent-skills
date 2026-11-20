# Claude review tập 07: chữ trên hình khớp lời, bỏ tên giải/thương hiệu
P = 'C:/Users/anhha/MuseStudio/the-thao/tap-07-park-hang-seo-phan-1/godot/phim.gd'
M = [
('Park Hang-seo: từ HLV ngủ gật đến đỉnh cao 2018 (Phần 1)', "Park Hang-seo: ông thầy 'ngủ gật' và cúp vàng 2018 (Phần 1)"),
('CHUNG KẾT LƯỢT VỀ AFF CUP 2018', 'CHUNG KẾT LƯỢT VỀ ĐÔNG NAM Á 2018'),
('40.000 KHÁN GIẢ NHUỘM ĐỎ KHÁN ĐÀI', '40.000 KHÁN GIẢ KÍN MỸ ĐÌNH'),
('14 THÁNG TRƯỚC: BỊ GÁN MÁC', '14 THÁNG TRƯỚC: BỊ HOÀI NGHI'),
('«HLV NGỦ GẬT VÀ HẾT THỜI»', '«ÔNG THẦY NGỦ GẬT»'),
('SA BÀN CHIẾN THUẬT THẦY PARK', 'SA BÀN CỦA TÈO'),
('SƠ ĐỒ 3 TRUNG VỆ ĐỔI VẬN BÓNG ĐÁ VIỆT', 'KỂ LẠI TỪNG TRẬN ĐÁNH'),
('TIỀN VỆ K LEAGUE 1985', 'TIỀN VỆ · VÔ ĐỊCH 1985'),
('99 TRẬN · 15 BÀN · ĐỘI HÌNH TIÊU BIỂU', 'GẦN 100 TRẬN · 15 BÀN'),
('WORLD CUP 2002 LỊCH SỬ', 'MÙA HÈ 2002 LỊCH SỬ'),
('TRỢ LÝ SỐ 1 CỦA GUUS HIDDINK', 'TRỢ LÝ CỦA GUUS HIDDINK'),
('LUÂN LƯU: 5 - 3 · SA THẢI SAU HCĐ', 'THUA LUÂN LƯU 3-5 · RỜI GHẾ'),
('DẠT XUỐNG HẠNG 3 CHANGWON CITY', '2017: CHANGWON CITY (HẠNG 3)'),
('HÒA 0-0 AFGHANISTAN → VÉ ASIAN CUP 2019', 'HÒA 0-0 AFGHANISTAN · CÓ VÉ CHÂU Á'),
('«TẠI SAO PHẢI CÚI ĐẦU KHI ĐÃ CỐ HẾT SỨC?»', '«ĐÃ CỐ HẾT SỨC, SAO PHẢI CÚI ĐẦU»'),
('CHUẨN BỊ CHO AFF CUP 2018', 'CHUẨN BỊ CÚP ĐÔNG NAM Á 2018'),
('ĐIỂM TÈO CHẤM: 10/10', 'QUYẾT ĐỊNH TÁO BẠO (Ý TÈO)'),
('HÀNH TRÌNH AFF CUP 2018', 'HÀNH TRÌNH ĐÔNG NAM Á 2018'),
('VÒNG BẢNG: 10 ĐIỂM · 0 BÀN THUA', 'VÒNG BẢNG: 10 ĐIỂM · KHÔNG THỦNG LƯỚI'),
('BUKIT JALIL (80.000 KHÁN GIẢ)', 'BUKIT JALIL · HƠN 80.000 KHÁN GIẢ'),
('QUANG HẢI TẠT BÓNG ĐẲNG CẤP', 'QUANG HẢI CHUYỀN BỔNG'),
('ANH ĐỨC BẮT VÔ-LÊ CHÁY LƯỚI (1 - 0)', 'ANH ĐỨC VÔ-LÊ (1-0)'),
('Bấm ĐĂNG KÝ TÈO THỂ THAO để đón xem Phần 2', 'Bấm ĐĂNG KÝ TÈO THỂ THAO để xem Phần 2'),
('Phần 2: Kỳ tích Vòng loại World Cup 2022', 'Phần 2: HCV 2019 và vòng loại thế giới'),
]
s = open(P, encoding='utf-8').read()
miss = [a for a, b in M if a not in s]
for a, b in M: s = s.replace(a, b)
open(P, 'w', encoding='utf-8').write(s)
print('miss', miss)

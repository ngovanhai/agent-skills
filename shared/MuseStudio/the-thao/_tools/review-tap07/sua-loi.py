# Claude review tập 07: thay lời theo id (bỏ chi tiết bịa / thiếu nguồn)
import re, sys
P = 'C:/Users/anhha/MuseStudio/the-thao/tap-07-park-hang-seo-phan-1/godot/loi.txt'
S = {
'k01-02': 'Nhưng mười bốn tháng trước, người đàn ông Hàn Quốc gần sáu mươi tuổi này đến Hà Nội khi rất ít người biết tên, rồi còn bị gọi đùa là ông thầy ngủ gật vì dáng ngồi trên ghế chỉ đạo.',
'k02-03': 'Để hiểu vì sao ông làm được điều đó, chúng ta hãy quay về Hàn Quốc, nơi câu chuyện bắt đầu từ một chàng tiền vệ chạy không biết mệt.',
'k03-01': 'Thầy Pắc sinh ra ở huyện Xan-chơng thuộc tỉnh Ki-oong-sang Nam, miền nam Hàn Quốc, và lớn lên cùng trái bóng tròn.',
'k03-02': 'Thời trẻ, ông là đội trưởng đội U hai mươi Hàn Quốc giành chức vô địch châu Á năm một nghìn chín trăm bảy mươi tám.',
'k03-03': 'Ông chỉ khoác áo đội tuyển quốc gia Hàn Quốc đúng một lần, trong trận thắng Nhật Bản một không năm một nghìn chín trăm tám mươi mốt.',
'k03-04': 'Gia nhập câu lạc bộ Lắc-ki Gôn-xta Hoang-xô, tức ép-xê Xơ-un ngày nay, ông thi đấu ở vị trí tiền vệ trong năm mùa giải.',
'k04-02': 'Huấn luyện viên người Hà Lan Gút Híp-đinh dẫn dắt đội tuyển chủ nhà, và thầy Pắc là một trong hai trợ lý của ông.',
'k04-03': 'Theo Tèo, những tháng làm việc bên Híp-đinh là bài học lớn về thể lực, kỷ luật chiến thuật và cách khiến cầu thủ tin vào chính mình.',
'k04-06': 'Ở Hàn Quốc, ban huấn luyện mùa hè năm ấy trở thành một ký ức đẹp, và thầy Pắc là một phần của ký ức ấy.',
'k05-03': 'Đội bóng của ông dừng bước ở bán kết trước I-ran, hoà không không sau hiệp phụ rồi thua ba năm trên chấm luân lưu.',
'k05-05': 'Ông rời ghế huấn luyện viên đội Ô-lim-pích ngay sau giải đấu giữa làn sóng chỉ trích, khép lại giấc mơ lớn đầu tiên trong sự nghiệp cầm quân.',
'k06-02': 'Dù hai lần đưa Sang-ju Sang-mu vô địch giải hạng hai Hàn Quốc, tên tuổi ông vẫn không còn được nhắc đến nhiều như mùa hè năm hai nghìn lẻ hai.',
'k06-03': 'Năm hai nghìn mười bảy, thầy Pắc dẫn dắt câu lạc bộ Chang-uôn Xi-ti, một đội bóng chơi ở giải bán chuyên nghiệp hạng ba.',
'k06-04': 'Ở tuổi gần sáu mươi, nhiều người nghĩ ông sẽ lặng lẽ khép lại sự nghiệp huấn luyện ở một đội bóng nhỏ.',
'k06-05': 'Không ai ngờ rằng chương đẹp nhất trong đời cầm quân của ông lại đang chờ ở một đất nước phía nam, cách quê nhà mấy giờ bay.',
'k07-01': 'Năm hai nghìn mười bảy, một lời đề nghị bất ngờ đã đến với ông từ dải đất hình chữ ét.',
'k07-02': 'Sau khi đội U hai mươi hai Việt Nam bị loại ngay từ vòng bảng Xi Gêm hai nghìn mười bảy, liên đoàn bóng đá Việt Nam đi tìm một thuyền trưởng mới.',
'k07-04': 'Khi đó nhiều người hâm mộ còn hoài nghi, vì ông không phải cái tên lớn và chưa từng làm việc ở Đông Nam Á.',
'k08-01': 'Không nói nhiều, thầy Pắc bước vào trận ra mắt chính thức vào ngày mười bốn tháng mười một năm hai nghìn mười bảy.',
'k08-02': 'Tiếp Áp-ga-ni-xtan tại sân Mỹ Đình ở vòng loại cúp châu Á, đội tuyển Việt Nam chơi chưa thật sự thuyết phục và bỏ lỡ nhiều cơ hội.',
'k08-03': 'Thủ môn Tuấn Mạnh có một đêm thi đấu xuất thần, nhiều lần cứu thua để giữ sạch lưới đến phút cuối cùng.',
'k08-04': 'Sau trận hoà không bàn thắng ấy, Việt Nam có vé dự vòng chung kết cúp bóng đá châu Á năm hai nghìn mười chín.',
'k08-05': 'Trên sa bàn chiến thuật, thầy Pắc bắt đầu đặt những quân cờ đầu tiên cho sơ đồ ba trung vệ phòng ngự phản công.',
'k08-06': 'Theo Tèo, điều ông thay đổi đầu tiên không nằm trên sa bàn, mà là niềm tin của các cầu thủ trẻ vào chính mình.',
'k09-03': 'Dưới mưa tuyết trắng xoá, Việt Nam thua U-dơ-bê-ki-xtan vì bàn thua ở phút cuối cùng của hiệp phụ, các cầu thủ trẻ gục xuống sân.',
'k09-04': 'Sau tiếng còi, thầy Pắc đi an ủi các học trò đang ngồi gục trên mặt sân phủ tuyết trắng.',
'k09-05': 'Theo báo chí thuật lại, ông động viên các em bằng một câu: chúng ta đã cố gắng hết sức, tại sao phải cúi đầu.',
'k09-06': 'Theo Tèo, câu nói ấy giúp các cầu thủ trẻ tin rằng mình có thể đứng ngang hàng với những đội mạnh của châu Á.',
'k10-03': 'Thầy Pắc quyết định triệu tập tiền đạo kỳ cựu ba mươi ba tuổi Nguyễn Anh Đức để làm điểm tựa kinh nghiệm cho dàn cầu thủ trẻ.',
'k10-05': 'Toàn đội bước vào giải đấu với sự chuẩn bị kỹ lưỡng về thể lực và một sự tự tin rất cao sau năm hai nghìn mười tám.',
'k12-04': 'Chỉ ba phút sau, Phạm Đức Huy ghi bàn thứ hai, nhân đôi cách biệt cho đội khách ngay trên sân Bu-kít Gia-lin.',
'k12-05': 'Ma-lay-xi-a vùng lên ghi hai bàn ở phút ba mươi sáu và sáu mươi mốt, nhưng trận hoà hai đều trên sân khách vẫn là lợi thế lớn cho Việt Nam.',
'k13-03': 'Quang Hải nhận bóng ở phía bên trái rồi đưa bóng bổng vào vòng cấm của Ma-lay-xi-a.',
'k13-04': 'Tiền đạo kỳ cựu Anh Đức băng vào, tung cú vô-lê một chạm đưa bóng vào lưới đội khách.',
'k14-03': 'Thầy Pắc ôm các học trò trong niềm vui vỡ oà, người từng bị gọi đùa là ông thầy ngủ gật giờ là vị thuyền trưởng được cả nước yêu mến.',
}
txt = open(P, encoding='utf-8').read()
miss = []
for k, v in S.items():
    pat = re.compile(r'^\[' + re.escape(k) + r'\] .*$', re.M)
    if not pat.search(txt): miss.append(k); continue
    txt = pat.sub(lambda m: f'[{k}] {v}', txt)
open(P, 'w', encoding='utf-8').write(txt)
print('sửa', len(S) - len(miss), 'câu; không thấy id:', miss)

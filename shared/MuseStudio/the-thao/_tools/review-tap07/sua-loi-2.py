import re
P = 'C:/Users/anhha/MuseStudio/the-thao/tap-07-park-hang-seo-phan-1/godot/loi.txt'
S = {
'k01-02': 'Nhưng mười bốn tháng trước, người đàn ông Hàn Quốc gần sáu mươi tuổi này đến Hà Nội giữa muôn vàn hoài nghi, và còn bị đùa là ông thầy ngủ gật.',
'k02-02': 'Chiếc sa bàn màu xanh lục cùng những quân cờ nam châm đỏ trắng này là thứ Tèo dùng để kể lại từng trận đánh của ông.',
'k03-02': 'Tuổi trẻ của ông gắn liền với trái bóng, từ đội tuyển trẻ Hàn Quốc cho đến đội bóng của trường đại học Han-dang.',
'k03-05': 'Năm một nghìn chín trăm tám mươi lăm, ông cùng đội bóng ấy giành chức vô địch giải quốc gia Hàn Quốc.',
'k03-06': 'Với gần một trăm trận và mười lăm bàn thắng cho câu lạc bộ, tiền vệ Pắc Hang-xơ có một sự nghiệp cầu thủ đáng nể.',
'k04-02': 'Huấn luyện viên người Hà Lan Gút Híp-đinh dẫn dắt đội tuyển chủ nhà, và thầy Pắc là một trợ lý người Hàn Quốc trong ban huấn luyện của ông.',
'k05-01': 'Bạn nghĩ sau Uân Cúp con đường của thầy Pắc sẽ trải đầy hoa hồng, nhưng chỉ vài tháng sau ông đã nhận cú ngã đầu tiên ở Á vận hội Bu-san.',
'k05-02': 'Được giao dẫn dắt đội Ô-lim-pích Hàn Quốc ngay trên sân nhà, vị tân huấn luyện viên trưởng mang trên vai áp lực rất lớn.',
'k06-04': 'Ông còn bị báo chí đùa gọi là ông thầy ngủ gật, chỉ vì hay nhắm mắt trầm ngâm trên ghế chỉ đạo trong lúc trận đấu diễn ra.',
'k07-03': 'Ngày mười một tháng mười năm hai nghìn mười bảy, lễ ký hợp đồng giữa thầy Pắc và liên đoàn bóng đá Việt Nam diễn ra tại Hà Nội.',
'k07-05': 'Nếu bạn muốn nghe tiếp phần hai về Xi Gêm và vòng loại Uân Cúp, hãy bấm đăng ký Tèo Thể Thao để không lỡ tập tiếp theo nhé.',
'k07-06': 'Theo bạn thành công của thầy Pắc đến từ chiến thuật hay tâm lý, hãy bình luận chữ C cho chiến thuật hoặc chữ T cho tâm lý nhé.',
'k08-02': 'Tiếp Áp-ga-ni-xtan tại sân Mỹ Đình ở vòng loại cúp châu Á, đội tuyển Việt Nam chơi chật vật và nhiều lần bị đối thủ dồn ép.',
'k08-05': 'Trên sa bàn chiến thuật, thầy Pắc dần đặt những quân cờ cho sơ đồ ba trung vệ, thứ về sau trở thành dấu ấn của ông.',
'k09-04': 'Sau tiếng còi mãn cuộc, thầy Pắc đến bên các học trò vẫn đang buồn bã trên mặt sân phủ tuyết trắng.',
'k09-05': 'Báo chí thuật lại rằng ông nhắc các học trò: đã cố gắng hết sức thì không việc gì phải cúi đầu.',
'k10-05': 'Đến đây bạn nghĩ chặng đường đến chiếc cúp vàng sẽ dễ dàng, chưa đâu, thử thách nghẹt thở nhất vẫn đang chờ ở phía trước.',
'k11-01': 'Tại vòng bảng, cỗ máy đỏ của thầy Pắc thắng Lào, Ma-lay-xi-a, Cam-pu-chia và hoà Mi-an-ma để đứng đầu bảng một cách thuyết phục.',
'k12-02': 'Trước hơn tám vạn cổ động viên của đội chủ nhà Ma-lay-xi-a, các cầu thủ áo đỏ bước vào trận với sức ép cực lớn từ khán đài.',
'k12-05': 'Ma-lay-xi-a vùng lên ghi hai bàn ở cuối hiệp một và đầu hiệp hai, nhưng trận hoà hai đều trên sân khách vẫn là lợi thế lớn cho Việt Nam.',
'k13-06': 'Trong hơn tám mươi phút còn lại, hàng thủ ba trung vệ của thầy Pắc đứng vững trước sức ép của đối thủ và giữ sạch lưới đến cuối trận.',
'k14-03': 'Thầy Pắc chia vui cùng các học trò, và người từng bị đùa là ông thầy ngủ gật giờ là vị thuyền trưởng được cả nước yêu mến.',
'k14-05': 'Còn nếu bạn muốn biết vì sao ba trận một trăm hai mươi phút ở Thường Châu làm cả nước thức trắng, video đó đang ở ngay trên màn hình, bấm vào xem và đăng ký Tèo Thể Thao nhé.',
}
txt = open(P, encoding='utf-8').read()
miss=[]
for k, v in S.items():
    pat = re.compile(r'^\[' + re.escape(k) + r'\] .*$', re.M)
    if not pat.search(txt): miss.append(k); continue
    txt = pat.sub(lambda m: f'[{k}] {v}', txt)
open(P, 'w', encoding='utf-8').write(txt)
print('sửa', len(S)-len(miss), 'miss', miss)

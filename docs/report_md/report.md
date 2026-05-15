### 1. Domain Task 1: Phân tích Thị trường và Phân bố không gian

Câu hỏi nghiệp vụ: \"Khu vực nào tại New York đang có mức giá cho thuê
cao nhất/thấp nhất, và cơ cấu loại phòng ở từng quận phân bố như thế
nào?\"

Mục đích: Giúp hiểu rõ bức tranh giá cả và cấu trúc nguồn cung theo từng
vùng địa lý để định vị phân khúc thị trường.

#### 1.1. Biểu đồ 1: Bản đồ phân bố giá trung bình theo khu vực (Choropleth Map)

A. Thiết kế Idiom

+-------+-----------------------------------------------------------+
| Đặc   | Chi tiết                                                  |
| điểm  |                                                           |
+-------+-----------------------------------------------------------+
| Idiom | Choropleth Map (Bản đồ phân bố sắc độ)                    |
+-------+-----------------------------------------------------------+
| What  | Tọa độ (Longitude/Latitude): Q, Khu vực (Neighbourhood):  |
|       | C, Giá trung bình (AVG Price): Q, Nhãn ngoại lệ (Price Is |
|       | Outlier): C                                               |
+-------+-----------------------------------------------------------+
| Why   | produce (derive) → explore-\>locate → summarize, compare  |
|       |                                                           |
|       | \- Tạo ra (derive) giá trị trung bình của từng khu vực để |
|       | so sánh.                                                  |
|       |                                                           |
|       | \- Khám phá (Explore) bức tranh tổng quan về phân bố giá  |
|       | thuê trên toàn bộ không gian địa lý của 5 quận New York.  |
|       |                                                           |
|       | \- Xác định vị trí (Locate) các cụm khu vực đắt đỏ nhất   |
|       | hoặc bình dân nhất.                                       |
|       |                                                           |
|       | \- Tóm tắt (Summarize) và so sánh (Compare) mức chênh     |
|       | lệch giá trị bất động sản/lưu trú giữa vùng trung tâm và  |
|       | vùng lân cận.                                             |
+-------+-----------------------------------------------------------+
| How   | **Encode:**                                               |
|       |                                                           |
|       | \- Mark: Area (vùng bản đồ)                               |
|       |                                                           |
|       | \- Channel:                                               |
|       |                                                           |
|       | \+ PosX, PosY: Vị trí địa lý (Kinh độ, Vĩ độ) thực tế.    |
|       |                                                           |
|       | \+ Color (Luminance/Độ sáng tối - Sequential Blue): Biểu  |
|       | diễn độ lớn của giá trung bình (đậm = giá cao, nhạt = giá |
|       | thấp).                                                    |
|       |                                                           |
|       | **Manipulate**:                                           |
|       |                                                           |
|       | \- Navigate: Tích hợp tính năng Zoom/Pan giúp người dùng  |
|       | tự do phóng to, và di chuyển trên bản đồ để quan sát vi   |
|       | mô các phường nhỏ nằm sát nhau                            |
|       |                                                           |
|       | \- Select: Cung cấp Tooltip để người dùng Hover chuột vào |
|       | từng phân khu để xem chi tiết tên khu vực và con số AVG   |
|       | Price chính xác.                                          |
|       |                                                           |
|       | **Reduce**:                                               |
|       |                                                           |
|       | \- Filter: Sử dụng bộ lọc Price Is Outlier                |
|       | (True/False/All) để kiểm soát việc hiển thị. Có thể chọn  |
|       | \"False\" để loại bỏ các căn siêu sang, giúp màu sắc bản  |
|       | đồ phản ánh đúng mức giá đại trà của thị trường.          |
+-------+-----------------------------------------------------------+
| Scale | \- Main key: Tọa độ không gian giới hạn trong khu vực NYC |
|       | (hàng trăm phường/neighbourhoods).                        |
|       |                                                           |
|       | \- Color Range: Dải màu liên tục (Continuous) biểu diễn   |
|       | giá trị từ \$126.5 đến \$830.6.                           |
+=======+===========================================================+

![](media/media/image13.png){width="6.267716535433071in"
height="4.125in"}

Hình 1.1. Biểu đồ phân bố giá trung bình theo khu vực

B. Đánh giá biểu đồ

1\. Nguyên lý biểu đạt (Expressiveness):

- Thuộc tính: Vị trí địa lý (Q), Khu vực (C), Giá trung bình (Q).

- Channel:

  - PosX, PosY: định vị tọa độ địa lý -\> dùng cho thuộc tính không gian
    (Q).

  - Color (Luminance - độ đậm nhạt): thể hiện độ lớn của giá trị định
    lượng -\> dùng cho thuộc tính AVG Price (Q).

- Đánh giá mức độ quan trọng:

  - Ưu tiên 1 - Vị trí không gian (PosX, PosY): Trong bản đồ, yếu tố cốt
    lõi nhất là định vị chính xác khu vực. Theo Mackinlay, kênh Vị trí
    (Position) là kênh mạnh nhất cho mọi loại dữ liệu. Việc gán tọa
    độ (Q) vào PosX/PosY đảm bảo tính chính xác tuyệt đối của ranh giới
    địa lý.

  - Ưu tiên 2 - Màu sắc (Color Luminance): Giá trị trung bình (Q) là
    thuộc tính quan trọng thứ hai. Do kênh Vị trí đã bị chiếm dụng cho
    tọa độ, thuộc tính này buộc phải sử dụng kênh Color Luminance (Độ
    sáng tối). Theo thang đo Mackinlay cho dữ liệu định lượng (Q), Color
    Luminance xếp hạng khá thấp, nhưng nó lại cực kỳ phù hợp cho mục
    đích Discover (nhìn ra bức tranh vĩ mô, xu hướng) thay vì so sánh
    con số tuyệt đối.

- Kết luận: Dùng hoàn toàn chuẩn xác các kênh biểu đạt. Cấu trúc bản đồ
  tôn trọng tuyệt đối tính không gian thực tế của dữ liệu.

2\. Nguyên lý hiệu quả (Effectiveness):

- Độ chính xác (Accuracy):

  - Kênh vị trí (PosX, PosY) có độ chính xác tuyệt đối theo dữ liệu địa
    lý.

  - Tuy nhiên, kênh độ sáng màu (Color Luminance) biểu diễn dữ liệu định
    lượng (AVG Price) tuân theo định luật Stevens\' Psychophysical law
    có sự sai lệch cảm nhận khá lớn, độ lỗi Log_error rơi vào khoảng T9
    \<=2.5. Mắt người chỉ nhận biết được vùng nào đắt hơn (đậm hơn) dưới
    dạng thứ tự (Ordinal), chứ khó cảm nhận được lượng chênh lệch cụ thể
    là bao nhiêu USD. Thao tác Manipulate (Hover xem Tooltip) đã được
    thiết lập để bù đắp hoàn toàn nhược điểm này.

- Khả năng phân biệt (Discriminability):

  - Các khu vực (mark area) được chia theo đường ranh giới rõ ràng. Dải
    màu chuyển sắc (Sequential Blue) từ nhạt sang đậm có thể phân biệt
    được khoảng 5-7 cấp độ màu. Với các vùng liền kề có mức giá xấp xỉ
    nhau, màu sắc sẽ có xu hướng hòa vào nhau tạo thành các \"cụm khu
    vực đắt đỏ\" (ví dụ: cụm Manhattan bôi đậm), giúp mắt người nhìn ra
    xu hướng thay vì bị phân tâm bởi từng điểm nhỏ.

- Khả năng tách biệt (Separability):

  - Kênh vị trí (Pos) và kênh màu sắc (Color) tách biệt tốt, không bị
    can thiệp lẫn nhau. Vùng diện tích địa lý lớn hay nhỏ không làm sai
    lệch quá nhiều màu sắc tổng thể của vùng đó. Thao tác Reduce (Filter
    Price Is Outlier) giúp loại bỏ các giá trị nhiễu, giữ cho dải màu
    không bị bóp méo bởi một vài căn hộ giá hàng chục ngàn đô.

#### 1.2. Biểu đồ 2: Phân bố loại phòng cho thuê ở từng quận (100% Stacked Bar Chart)

A. Idiom

+------------+-----------------------------------------------------+
| Đặc điểm   | Chi tiết                                            |
+------------+-----------------------------------------------------+
| Idiom      | 100% Stacked Bar Chart                              |
+------------+-----------------------------------------------------+
| What       | Quận (Neighbourhood Group): C, Loại phòng (Room     |
|            | Type): C, Tỷ trọng đóng góp (% of count): Q         |
+------------+-----------------------------------------------------+
| Why        | Produce -\>Compare -\> Discover                     |
|            |                                                     |
|            | \- Tính toán (produce) tỉ lệ phần trăm(%) đóng góp  |
|            | của từng loại phòng theo từng quận                  |
|            |                                                     |
|            | \- So sánh cơ cấu nguồn cung giữa các quận, so sánh |
|            | giữa các loại phòng và biết được mỗi loại phòng     |
|            | chiếm tỷ trọng bao nhiêu phần trăm trong tổng số    |
|            | listing của khu vực đó.                             |
|            |                                                     |
|            | \- Khám phá (Discover) ra đặc trưng phân khúc thị   |
|            | trường của từng quận (ví dụ: khu vực nào chuyên     |
|            | phục vụ khách thuê nguyên căn, khu vực nào tập      |
|            | trung phòng chia sẻ giá rẻ).                        |
+------------+-----------------------------------------------------+
| How        | **Encode:**                                         |
|            |                                                     |
|            | \- Mark: Area(Bar Chart)                            |
|            |                                                     |
|            | \- Glyph: Sub-bars xếp chồng lên mức 100%           |
|            |                                                     |
|            | \- Channel:                                         |
|            |                                                     |
|            | \+ PosX: Phân biệt các quận.                        |
|            |                                                     |
|            | \+ PosY: So sánh tỷ trọng (0% - 100%).              |
|            |                                                     |
|            | \+ Hue Color: Phân biệt 4 loại phòng.               |
|            |                                                     |
|            | **Manipulate:**                                     |
|            |                                                     |
|            | \- Change alignment + Selection: Chọn một loại      |
|            | phòng (thông qua Parameter) để đưa sub-bar tương    |
|            | ứng xuống dưới cùng (trục 0%) giúp tạo đường cơ sở  |
|            | chung dễ so sánh. Hover để xem chi tiết %.          |
|            |                                                     |
|            | \- Highlight: Chọn trên Legend để làm nổi bật một   |
|            | loại phòng cụ thể.                                  |
|            |                                                     |
|            | **Reduce:**                                         |
|            |                                                     |
|            | \- Sort: Sắp xếp các quận trên trục X giảm dần theo |
|            | tỷ trọng của loại phòng chiếm ưu thế (Entire        |
|            | home/apt).                                          |
+------------+-----------------------------------------------------+
| Scale      | \- Main key: 5 (Năm quận của NYC)                   |
|            |                                                     |
|            | \- Stacked key: 4 (Các loại phòng: Entire home,     |
|            | Private room, Shared room, Hotel room)              |
|            |                                                     |
|            | \- Y-axis range: 0% -\> 100%                        |
|            |                                                     |
|            | \- Color scale: 4 màu sắc rời rạc                   |
+============+=====================================================+

![](media/media/image10.png){width="6.267716535433071in"
height="3.736111111111111in"}

Hình 1.2. Biểu đồ phân bố loại phòng theo từng quận

B. Đánh giá biểu đồ

1\. Nguyên lý biểu đạt:

- Thuộc tính: Quận (C), Loại phòng (C), Tỷ trọng (Q).

- Channel:

  - PosX: sắp xếp các quận -\> cho thuộc tính C.

  - PosY: thể hiện độ dài của tỷ lệ % -\> cho thuộc tính Q.

  - Color (Hue): phân biệt các loại phòng -\> cho thuộc tính C.

- Đánh giá mức độ quan trọng: PosY (1), PosX (2), Color (3). Dùng chuẩn
  xác các kênh biểu đạt.

- Đánh giá mức độ quan trọng và phân bổ kênh theo Mackinlay:

<!-- -->

- Ưu tiên 1 - Chiều dài (Length / PosY): Thuộc tính quan trọng nhất cần
  so sánh là Tỷ trọng phần trăm (Q). Theo thang đo của Mackinlay đối với
  dữ liệu Quantitative, Position/Length là kênh có độ chính xác cao
  nhất. Việc dùng PosY để mã hóa tỷ trọng giúp mắt người so sánh cực kỳ
  chuẩn xác.

- Ưu tiên 2 - Vị trí trục hoành (PosX): Thuộc tính phân rã chính là Quận
  (C). Kênh Vị trí (Position) cũng là kênh số 1 để phân tách các danh
  mục (Categorical), giúp tách biệt rõ ràng 5 cột của 5 quận.

- Ưu tiên 3 - Màu sắc (Color Hue): Thuộc tính phân rã phụ là Loại phòng
  (C). Theo Mackinlay, đối với dữ liệu Categorical, Color Hue (Sắc độ
  màu) là kênh hiệu quả thứ 2 ngay sau Position. Việc dùng 4 màu khác
  biệt mã hóa 4 loại phòng giúp nhận diện dễ dàng mà không làm rối cấu
  trúc cột.

2\. Nguyên lý hiệu quả:

- Độ chính xác (Accuracy):

  - PosY biểu diễn thông qua chiều dài (Length) chung một trục chuẩn
    từ 0. Theo định luật Stevens, Length có \$n = 1.0\$, do đó mắt người
    cảm nhận cực kỳ chính xác. Độ lỗi Log_error rất thấp.

  - Lưu ý: Các khối màu nằm ở giữa (không bám vào trục 0 hay 100%) sẽ bị
    giảm đi sự chính xác một chút khi so sánh chéo giữa các quận (do
    không chung gốc).

- Khả năng phân biệt (Discriminability): \* Biểu đồ sử dụng 4 màu
  (Categorical) cho 4 loại phòng. Nhận thức màu hoàn toàn không bị ảnh
  hưởng vì số lượng màu \$\< 7\$. Rất dễ để nhìn ra 4 phần trong mỗi
  cột.

- Khả năng tách biệt (Separability):

  - Kênh chiều dài (Length) và kênh màu (Color) tách biệt hoàn toàn, có
    thể vừa nhìn độ dài vừa nhận diện màu mà không bị nhiễu.

C. Phân tích biểu đồ (Insight)

- Cấu trúc nguồn cung khác biệt rất lớn theo quận: Manhattan có tỷ trọng
  \"Entire home/apt\" cao nhất (vượt \$60\\%\$), tập trung vào khách có
  nhu cầu thuê nguyên căn.

- Trong khi đó, các quận như Queens, Bronx và Brooklyn có \"Private
  room\" chiếm tỷ trọng lớn nhất (từ \$50\\%\$ trở lên), phù hợp với
  phân khúc phòng chia sẻ giá rẻ.

### 2. Domain Task 2: Phân tích Tỷ lệ lấp đầy theo thời gian

Câu hỏi nghiệp vụ: \"Tỷ lệ lấp đầy phòng thay đổi như thế nào qua các
tháng, và tính mùa vụ ảnh hưởng thế nào đến từng quận?\"

Mục đích: Xác định xu hướng mùa cao điểm, thấp điểm để từ đó có cái nhìn
chi tiết về hiệu suất kinh doanh qua thời gian của từng khu vực.

#### 2.1. Biểu đồ 1: Tỷ lệ lấp đầy theo tháng của các quận (Multi-line Chart)

A. Thiết kế Idiom

+-------+-----------------------------------------------------------+
| Đặc   | Chi tiết                                                  |
| điểm  |                                                           |
+-------+-----------------------------------------------------------+
| Idiom | Multi-line Chart (Biểu đồ đa đường)                       |
+-------+-----------------------------------------------------------+
| What  | Tháng (Month): O, Quận (Neighbourhood Group): C, Tỷ lệ    |
|       | lấp đầy (Avg. is Booked): Q                               |
+-------+-----------------------------------------------------------+
| Why   | produce (derive) → browse, lookup →summarize, compare     |
|       |                                                           |
|       | \- Dẫn xuất (derive) dữ liệu tỷ lệ lấp đầy từ trạng thái  |
|       | đặt phòng theo ngày .                                     |
|       |                                                           |
|       | \- Duyệt (browse) và tìm kiếm (lookup) xu hướng biến động |
|       | lấp đầy theo tiến trình thời gian 12 tháng .              |
|       |                                                           |
|       | \- Tóm tắt (summarize) và so sánh (compare) hiệu suất     |
|       | kinh doanh, tính mùa vụ giữa 5 quận để nhận diện sự khác  |
|       | biệt về nhu cầu thị trường.                               |
+-------+-----------------------------------------------------------+
| How   | **Encode:**                                               |
|       |                                                           |
|       | \- Mark: Point, Line (Đường nối các điểm dữ liệu) .       |
|       |                                                           |
|       | \- Channel:                                               |
|       |                                                           |
|       | \+ PosX: Trục thời gian tiến lên (Tháng - Ordinal) .      |
|       |                                                           |
|       | \+ PosY: Mức độ lấp đầy (Tỷ lệ % - Quantitative) .        |
|       |                                                           |
|       | \+ Hue Color: Phân biệt 5 quận (Categorical) .            |
|       |                                                           |
|       | **Manipulate:**                                           |
|       |                                                           |
|       | \- Hover + Highlight: Rê chuột vào một đường để highlight |
|       | xu hướng của riêng quận đó, giúp khắc phục hiện tượng rối |
|       | mắt khi các đường cắt nhau (line crossing).               |
|       |                                                           |
|       | \- Selection: Chọn một quận trên Legend để quan sát riêng |
|       | biệt dữ liệu của khu vực đó.                              |
|       |                                                           |
|       | **Reduce:**                                               |
|       |                                                           |
|       | \- Filter: Có thể lọc theo Năm (Year) để so sánh xu hướng |
|       | lấp đầy giữa các giai đoạn khác nhau (ví dụ: trước và sau |
|       | đại dịch).                                                |
+-------+-----------------------------------------------------------+
| Scale | \- Main key: 12 (Tháng trong năm) .                       |
|       |                                                           |
|       | \- Categorical key: 5 (Nhóm các quận của NYC).            |
|       |                                                           |
|       | \- Y-axis range: 0.0 - \> 0.6                             |
+=======+===========================================================+

![](media/media/image5.png){width="6.267716535433071in"
height="3.7777777777777777in"}

Hình 2.1. Biểu đồ phân tích sự lấp đầy theo tháng của các quận

B. Đánh giá biểu đồ

1\. Nguyên lý biểu đạt (Expressiveness):

- Thuộc tính: Tháng (O), Quận (C), Tỷ lệ lấp đầy (Q).

- Channel:

  - PosX: tiến trình thời gian -\> dùng cho thuộc tính Ordinal (O).

  - PosY: định lượng tỷ lệ phần trăm -\> dùng cho thuộc tính
    Quantitative (Q).

  - Color (Hue): phân loại các quận -\> dùng cho thuộc tính Categorical
    (C).

- Đánh giá mức độ quan trọng và phân bổ kênh theo Mackinlay:

  - Ưu tiên 1 - Vị trí trục tung (PosY): Sự biến động của Tỷ lệ lấp
    đầy (Q) là mục tiêu quan sát chính. Việc gán vào trục PosY tuân thủ
    đúng nguyên tắc: dùng kênh biểu đạt mạnh nhất (Position) cho biến
    định lượng cốt lõi nhất.

  - Ưu tiên 2 - Vị trí trục hoành (PosX): Thời gian/Tháng (O) là chiều
    quan trọng thứ hai để tạo thành chuỗi sự kiện. Dùng PosX tạo cảm
    giác tiến trình (sequential) là lựa chọn tối ưu theo quy luật nhận
    thức.

  - Ưu tiên 3 - Màu sắc (Color Hue): Phân nhóm các quận (C) đóng vai trò
    đối chiếu. Dùng Color Hue là lựa chọn chuẩn xác nhất cho dữ liệu
    phân loại (Categorical) khi kênh vị trí đã được dùng để vẽ line.

- Kết luận: Áp dụng hoàn toàn chính xác các kênh biểu đạt. Line chart
  kết hợp với Hue Color là quy chuẩn tối ưu nhất để phân tích chuỗi thời
  gian có phân rã theo nhóm.

2\. Nguyên lý hiệu quả (Effectiveness):

- Độ chính xác (Accuracy): Trục PosY (vị trí điểm trên một thang đo
  chung) tuân theo Stevens\' Psychophysical law với \$n = 1.0\$. Việc
  ước lượng độ lớn và so sánh khoảng cách giữa các điểm là cực kỳ chính
  xác, độ lỗi Log_error là thấp nhất. Người xem dễ dàng nhận ra khoảng
  cách chênh lệch giữa các quận ở cùng một tháng.

- Khả năng phân biệt (Discriminability): Biểu đồ sử dụng 5 màu (Hue
  Color) cho 5 quận. Số lượng phân loại \$\< 7\$ nên nhận thức màu của
  mắt hoàn toàn không bị ảnh hưởng, rất dễ phân biệt. Tuy nhiên, ở các
  giai đoạn tháng 8 đến tháng 10, các đường (lines) có hiện tượng tiệm
  cận và cắt nhau (line crossing/clutter), gây đôi chút khó khăn cho
  mắt, nhưng thao tác Highlight khi hover đã giúp giải quyết vấn đề này.

- Khả năng tách biệt (Separability): Kênh vị trí (Pos) và kênh màu sắc
  (Color) tách biệt hoàn toàn. Việc các điểm nằm ở vị trí cao/thấp không
  làm ảnh hưởng đến khả năng nhận diện màu sắc của quận đó.

C. Phân tích biểu đồ (Insight)

- Vì dữ liệu ban đầu được cào vào đầu tháng 11 năm 2025 nên ta thấy ở cả
  3 quận tháng 11/2025 luôn là tháng có tỷ lệ đặt phòng cao nhất. Bên
  cạnh đó, khi nhìn vào giá trị đặt phòng trong tương lai thì ta cũng
  thấy sự vượt trội của tháng 11, người dân có vẻ chuẩn bị phòng kĩ càng
  cho tháng phục sinh vào cả năm sau.

<!-- -->

- Manhattan (đường màu đỏ) thể hiện sự bứt phá mạnh mẽ vào cuối năm, đạt
  đỉnh cao nhất toàn thị trường vào tháng 11 (gần 60%).

- Queens duy trì phong độ ổn định và dẫn đầu trong suốt giai đoạn giữa
  năm (tháng 5 - tháng 10), trong khi Staten Island và Bronx luôn nằm ở
  nhóm dưới với tỷ lệ lấp

#### 2.2. Biểu đồ 2: Tỷ lệ lấp đầy của các quận theo tháng (Heatmap)

A. Thiết kế Idiom

+-------+-----------------------------------------------------------+
| Đặc   | Chi tiết                                                  |
| điểm  |                                                           |
+-------+-----------------------------------------------------------+
| Idiom | Heatmap (Bản đồ nhiệt)                                    |
+-------+-----------------------------------------------------------+
| What  | Tháng (Month): O, Quận (Neighbourhood Group Cleansed): C, |
|       | Tỷ lệ lấp đầy (Avg. Is Booked): Q                         |
+-------+-----------------------------------------------------------+
| Why   | produce (derive) → browse, lookup → summarize, compare    |
|       |                                                           |
|       | \- Dẫn xuất (derive) tỷ lệ lấp đầy từ trạng thái đặt      |
|       | phòng.                                                    |
|       |                                                           |
|       | \- Quét mắt (browse) toàn cảnh ma trận để tìm ra các mảng |
|       | màu đặc trưng và tra cứu (lookup) điểm giao cắt giữa một  |
|       | tháng và một quận cụ thể.                                 |
|       |                                                           |
|       | \- Tóm tắt (summarize) bức tranh mùa vụ và so sánh        |
|       | (compare) mức độ nhạy cảm/ổn định về hiệu suất kinh doanh |
|       | giữa các quận.                                            |
+-------+-----------------------------------------------------------+
| How   | Encode:                                                   |
|       |                                                           |
|       | \- Mark: Point (Area/Square mark - Các ô vuông ma trận).  |
|       |                                                           |
|       | \- Channel:                                               |
|       |                                                           |
|       | \+ PosX: Phân rã theo tiến trình thời gian (Tháng - O).   |
|       |                                                           |
|       | \+ PosY: Phân rã theo không gian (Quận - C).              |
|       |                                                           |
|       | \+ Color (Diverging Red - Blue): Thể hiện độ lớn của tỷ   |
|       | lệ lấp đầy (Đỏ: thấp \$\\rightarrow\$ Xanh: cao).         |
|       |                                                           |
|       | Manipulate:                                               |
|       |                                                           |
|       | \- Hover + Tooltip: Rê chuột vào từng ô vuông để xem      |
|       | chính xác con số % lấp đầy tại điểm giao cắt đó.          |
|       |                                                           |
|       | Reduce:                                                   |
|       |                                                           |
|       | \- (Gợi ý) Có thể sử dụng thao tác Sort trên trục Y để    |
|       | sắp xếp các quận theo tổng tỷ lệ lấp đầy giảm dần, giúp   |
|       | các cụm màu xanh/đỏ gom lại với nhau rõ ràng hơn.         |
+-------+-----------------------------------------------------------+
| Scale | \- Main keys: 12 (Tháng) x 5 (Quận) = 60 bins (ô vuông).  |
|       |                                                           |
|       | \- Color Range: Dải màu phân kỳ từ 0.0980 (đỏ sẫm) đến    |
|       | 0.5857 (xanh sẫm).                                        |
+=======+===========================================================+

![](media/media/image12.png){width="6.267716535433071in"
height="2.3333333333333335in"}

Hình 2.2: Biểu đồ phân tích sự lấp đầy của các quận theo tháng

B. Đánh giá biểu đồ

1\. Nguyên lý biểu đạt (Expressiveness):

- Thuộc tính: Tháng (O), Quận (C), Tỷ lệ lấp đầy (Q).

- Channel:

  - Kênh vị trí (PosX, PosY): Tạo cấu trúc ma trận phân rã các nhóm
    \$\\rightarrow\$ biểu diễn hoàn hảo cho thuộc tính Ordinal và
    Categorical.

  - Kênh màu sắc (Diverging Color): Thể hiện độ nóng/lạnh của mức độ lấp
    đầy \$\\rightarrow\$ dùng cho thuộc tính Quantitative.

- Đánh giá mức độ quan trọng và sự đánh đổi kênh theo Mackinlay:

  - Ưu tiên định vị danh mục (PosX, PosY): Heatmap ưu tiên dùng kênh
    mạnh nhất (Position) để thiết lập cấu trúc lưới ma trận cho 2 thuộc
    tính phân rã: Tháng (O) ở PosX và Quận (C) ở PosY. Điều này giúp mắt
    người dễ dàng Lookup chính xác giao điểm.

  - Sự đánh đổi ở thuộc tính định lượng (Color): Khác với Line Chart, do
    kênh Vị trí đã gán cho danh mục, thuộc tính Tỷ lệ lấp đầy (Q) bắt
    buộc phải đẩy xuống dùng kênh Diverging Color. Theo Mackinlay, Color
    xếp hạng thấp trong việc biểu diễn độ lớn định lượng. Đây là một sự
    \"đánh đổi\" (trade-off) có chủ ý: chấp nhận giảm độ chính xác toán
    học (Accuracy) để đổi lấy khả năng nhận diện cụm nóng/lạnh (Macro
    pattern) một cách nhanh chóng.

  - 

- Kết luận: Channel phù hợp hoàn toàn với cấu trúc dữ liệu 3 chiều (3D),
  không có sự sai lệch về mặt ngữ nghĩa.

2\. Nguyên lý hiệu quả (Effectiveness):

- Độ chính xác (Accuracy): Sử dụng Heatmap (dựa trên sự thay đổi
  Hue/Saturation của màu sắc) để diễn đạt độ lớn định lượng có sự hạn
  chế về độ chính xác nhận thức. Theo định luật Stevens\' Psychophysical
  law, độ lỗi Log_error khá cao (\$T9 \\pm 2.5\$). Mắt người rất khó để
  nhẩm tính xem ô màu xanh này cao hơn ô màu xanh kia chính xác là bao
  nhiêu %. Tuy nhiên, thao tác Manipulate (Tooltip) đã khắc phục điểm
  yếu này.

- Khả năng phân biệt (Discriminability): Việc chia lưới thành 60 ô vuông
  (bins) giúp mắt đếm và phân biệt ranh giới cực kỳ rõ ràng. Đặc biệt,
  việc sử dụng dải màu phân kỳ (Red - Blue) là một thiết kế xuất sắc,
  giúp mắt người lập tức phân tách dữ liệu thành 2 thái cực: \"nhóm hiệu
  suất kém\" (đỏ) và \"nhóm hiệu suất tốt\" (xanh), bù đắp lại khiếm
  khuyết về độ chính xác định lượng ở trên.

- Khả năng tách biệt (Separability): Kênh vị trí (Pos) và kênh màu sắc
  (Color) kết hợp rất tốt. Kích thước các ô vuông luôn bằng nhau (Area
  không đổi) giúp loại bỏ hoàn toàn nhiễu tương tác thị giác giữa kích
  thước và màu sắc, người xem chỉ tập trung vào sắc độ màu.

C. Phân tích biểu đồ (Insight):

- Insight 1: Staten Island và Bronx chịu ảnh hưởng nặng nề nhất bởi tính
  mùa vụ và bộc lộ sức hút kém. Hai khu vực này chìm trong dải màu đỏ
  sẫm (tỷ lệ lấp đầy cực thấp, xấp xỉ \$10\\% - 20\\%\$) suốt từ đầu năm
  cho đến tháng 7, và chỉ hơi khởi sắc (chuyển sang màu xanh nhạt) vào
  giai đoạn cuối năm.

- Insight 2: Ngược lại, Manhattan và Brooklyn chứng tỏ năng lực thu hút
  khách ổn định và mạnh mẽ hơn nhiều. Các quận này thoát khỏi vùng màu
  đỏ rất nhanh và duy trì tỷ lệ lấp đầy ở mức an toàn (hiện sắc xanh
  nhạt đến xanh đậm) xuyên suốt từ giữa năm đến cuối năm. Sự tương phản
  này cho thấy rủi ro trống phòng ở các quận vùng ven là rất cao so với
  vùng lõi trung tâm.

### 5. Domain task 5: Phân bố mức giá theo khu vực

Câu hỏi: Giá niêm yết phân bổ như thế nào theo từng borough? Loại phòng
ảnh hưởng thế nào đến phân phối giá?

#### 

#### 5.1 -- Box-and-Whisker Plot: Phân phối giá niêm yết theo borough

A. Thiết kế Idiom

+------------+----------------------------------------------------+
| Idiom      | Box-and-Whisker Plot                               |
+------------+----------------------------------------------------+
| What       | Borough (neighbourhood_group_cleansed):            |
|            | Categorical\                                       |
|            | Price: Quantitative\                               |
|            | Room Type: Categorical                             |
+------------+----------------------------------------------------+
| How        | **Encode:**                                        |
|            |                                                    |
|            | -Mark:                                             |
|            |                                                    |
|            | +Glyph (Mark phức hợp bao gồm Area cho thân hộp,   |
|            | Line cho râu/trung vị, và Point cho ngoại lệ).\    |
|            | **-Channel:**\                                     |
|            | + Pos X: Borough (Categorical -- phân biệt 5       |
|            | borough)\                                          |
|            | +Pos Y: Price (Quantitative -- IQR, median,        |
|            | whiskers)\                                         |
|            | +Hue Color: Room Type (Categorical -- 4 loại       |
|            | phòng)                                             |
|            |                                                    |
|            | **Manipulate:**                                    |
|            |                                                    |
|            | +Selection: hover để xem chi tiết (median, Q1, Q3, |
|            | min, max, count)                                   |
|            |                                                    |
|            | **Reduce:**                                        |
|            |                                                    |
|            | +Filter: price_is_outlier = False (loại extreme    |
|            | outliers bằng IQR method)                          |
|            |                                                    |
|            |                                                    |
|            |                                                    |
|            |                                                    |
|            |                                                    |
|            |                                                    |
+------------+----------------------------------------------------+
| Why        | produce-\>compare → discover\                      |
|            | So sánh phân phối giá đầy đủ giữa 5 borough. Glyph |
|            | là idiom duy nhất hiển thị Q1, median, Q3,         |
|            | whiskers đồng thời --- bar chart chỉ cho median,   |
|            | histogram chỉ cho 1 nhóm.                          |
+------------+----------------------------------------------------+
| Scale      | Main key: 5 (borough)\                             |
|            | Color key: 4 (room type)\                          |
|            | Items: \~21,000 listing (sau lọc)                  |
+============+====================================================+

![](media/media/image3.png){width="6.0in" height="7.958015091863517in"}

Hình 5.1.Glyph phân phối giá niêm yết theo borough tại NYC

B. Đánh giá biểu đồ

1\. Nguyên lý biểu đạt (Expressiveness):

- Thuộc tính: Quận / Borough -- neighbourhood_group_cleansed (C), Giá
  niêm yết / Price (Q), Loại phòng / Room Type (C), price_is_outlier (C
  -- filter).

<!-- -->

- Channel:

  - PosX: phân biệt 5 borough (C) → phù hợp. Spatial region là channel
    hiệu quả nhất cho categorical attribute.

  - PosY: thể hiện phạm vi phân phối giá (Q1, Median, Q3, whiskers) →
    phù hợp Quantitative. Position on common scale là channel chính xác
    nhất cho quantitative.

  - Hue Color: phân biệt loại phòng (C) → phù hợp. Số màu = 4 ≤ 7 → nằm
    trong giới hạn discriminability của HUE channel.

- Đánh giá mức độ quan trọng:

  - Ưu tiên 1 - Vị trí dọc (PosY --- Position on common scale): PosY là
    kênh quan trọng nhất trong Glyph. Kênh này mã hóa toàn bộ phân phối
    giá (Quantitative) của từng borough: giá trị Q1, Median, Q3,
    whiskers và outlier đều được biểu diễn theo thang đo chung trên trục
    dọc. Theo Mackinlay, Position on a common scale là kênh hiệu quả
    nhất cho dữ liệu định lượng, cho phép người xem ước lượng và so sánh
    khoảng cách giá giữa các borough với độ chính xác cao nhất --- đây
    là nền tảng để thực hiện task compare (so sánh phân phối) và
    discover (phát hiện outlier).

  - Ưu tiên 2 - Vị trí ngang (PosX --- Position / Spatial region): PosX
    phân tách 5 borough thành các nhóm rời nhau theo chiều ngang, mã hóa
    thuộc tính Borough (Categorical/Nominal). Theo Mackinlay, Position
    cũng là kênh hiệu quả nhất cho dữ liệu danh mục, giúp người xem lập
    tức nhận biết và phân biệt ranh giới giữa từng borough --- tạo khung
    không gian cần thiết để so sánh phân phối giá một cách có cấu trúc.

  - Ưu tiên 3 - Màu sắc (Color Hue): Color Hue mã hóa Room Type
    (Categorical/Nominal) bằng màu sắc phân biệt cho từng loại phòng.
    Theo Mackinlay, Color Hue phù hợp nhất cho dữ liệu danh mục vì mỗi
    màu được cảm nhận là ngang hàng nhau, không ngụ ý thứ tự hay mức độ.
    Kênh này cho phép người xem đồng thời so sánh phân phối giá giữa các
    loại phòng trong cùng một borough mà không cần tách thành nhiều biểu
    đồ riêng biệt --- tăng mật độ thông tin mà không làm tăng độ phức
    tạp hiển thị, với điều kiện số màu ≤ 7 như hiện tại.

- Kết luận: Các channel đúng với bản chất dữ liệu. Glyph là idiom chuẩn
  mực nhất để biểu diễn phân phối liên tục theo nhóm --- đặc biệt khi
  cần so sánh IQR chứ không chỉ median.

2\. Nguyên lý hiệu quả (Effectiveness):

- Độ chính xác (Accuracy):

  - PosY (Position on common scale) là channel chính xác nhất theo
    channel effectiveness ranking --- xếp hạng 1 trong hierarchy. Hue
    Color dùng cho categorical không liên quan đến sai số định lượng.

- Khả năng phân biệt (Discriminability): 4 màu cho 4 room type trong
  phạm vi ≤ 7 → mắt người phân biệt hoàn toàn tốt. Whiskers và box IQR
  hiển thị rõ ràng trên nền trắng.

- Khả năng tách biệt(Separability): PosX, PosY và Color tách biệt hoàn
  toàn. Filter price_is_outlier = False loại bỏ extreme outliers giúp
  chart dễ đọc hơn.

C. Phân tích biểu đồ (Insight)

- Manhattan có median price cao nhất (\~\$150--200) và IQR rộng nhất ---
  tồn tại cả phân khúc bình dân lẫn cao cấp trong cùng một borough.

- Bronx và Staten Island có IQR hẹp và median thấp (\~\$92--99) --- thị
  trường giá ổn định, phù hợp du khách cần ngân sách dự đoán được.

- Loại phòng Entire home/apt luôn có box cao hơn Private room ở mọi
  borough --- sự phân tầng giá theo loại phòng nhất quán trên toàn thành
  phố.

- Khuyến nghị: Du khách ngân sách trung bình nên cân nhắc Brooklyn ---
  vị trí gần Manhattan nhưng median giá thấp hơn đáng kể.

#### 5.2 -- Bar Chart: Median giá niêm yết theo borough

+--------+-------------------------------------------------------+
| Idiom  | Bar Chart                                             |
+--------+-------------------------------------------------------+
| What   | Borough: Categorical\                                 |
|        | Median Price: Quantitative (aggregate: MEDIAN)        |
+--------+-------------------------------------------------------+
| How    | **Encode:**                                           |
|        |                                                       |
|        | -Mark: Bar\                                           |
|        | -Channel:\                                            |
|        | +Pos X: Borough (Categorical)\                        |
|        | +Pos Y: MEDIAN(Price) (Quantitative -- length từ gốc  |
|        | 0)\                                                   |
|        | +Hue Color: Borough (Categorical -- redundant         |
|        | encoding)\                                            |
|        | +Label: giá trị MEDIAN trên đầu cột\                  |
|        | +Order: sort descending theo median price             |
|        +-------------------------------------------------------+
|        | **Manipulate**                                        |
|        |                                                       |
|        | Selection: Hover để xem median price chính xác theo   |
|        | từng borough                                          |
|        +-------------------------------------------------------+
|        | ---                                                   |
|        +-------------------------------------------------------+
|        | **Reduce**                                            |
|        |                                                       |
|        | Filter: price_is_outlier = False\                     |
|        | Aggregate: MEDIAN(price) theo borough                 |
+--------+-------------------------------------------------------+
| Why    | produce-\>compare → summarize\                        |
|        | Tóm tắt median giá thành 1 số đại diện dễ so sánh.    |
|        | Sort descending giúp nhận diện borough đắt/rẻ nhất    |
|        | ngay lập tức. Bar chart phù hợp khi task là Compare   |
|        | giá trị tuyệt đối.                                    |
+--------+-------------------------------------------------------+
| Scale  | Main key: 5 (borough)\                                |
|        | Items: \~21,000 listing (sau lọc)                     |
+========+=======================================================+

![](media/media/image2.png){width="6.0in" height="7.487265966754156in"}

Hình 5.2. Bar chart median giá niêm yết theo borough tại NYC

B. Đánh giá biểu đồ

1\. Tính biểu đạt (Expressiveness):

- Thuộc tính: Quận / Borough -- neighbourhood_group_cleansed (C), Giá
  trung vị / Median Price (Q -- MEDIAN aggregate), price_is_outlier (C
  -- filter).

- Channel:

  - PosX: phân biệt borough (C) → đúng.

  - PosY (Length từ gốc 0): thể hiện MEDIAN Price (Q) → đúng. Baseline =
    0 bắt buộc để length channel có ý nghĩa chính xác.

  - Hue Color: phân biệt borough (C) → đúng. Redundant encoding (cả PosX
    lẫn Color encode Borough) gửi thông điệp mạnh hơn.

- Đánh giá mức độ quan trọng:

  - Ưu tiên 1 - Chiều dài cột (Length / PosY): Length là kênh quan trọng
    nhất trong bar chart. Kênh này mã hóa MEDIAN Price (Quantitative) từ
    baseline = 0, phản ánh trực tiếp độ lớn tuyệt đối của giá trung vị
    tại từng borough. Theo Mackinlay, Length xếp hạng thứ ba cho dữ liệu
    định lượng (sau Position on common scale và Position on unaligned
    scale), nhưng trong bar chart với baseline cố định bằng 0, Length và
    Position thực chất tương đương về mặt nhận thức --- người xem có thể
    so sánh giá trị một cách nhanh chóng và chính xác. Label số trên đầu
    cột tiếp tục loại bỏ hoàn toàn sai số cảm nhận thị giác.

  - Ưu tiên 2 - Vị trí ngang (PosX): PosX phân biệt 5 borough dọc theo
    trục ngang, mã hóa thuộc tính Borough (Categorical/Nominal) theo
    không gian. Đây là kênh quan trọng thứ hai vì nó thiết lập cấu trúc
    so sánh chính của biểu đồ: người xem định vị từng borough theo vị
    trí ngang trước khi đọc độ cao cột. Thứ tự cột được sắp xếp giảm dần
    theo giá median giúp việc so sánh diễn ra tức thì và trực quan hơn.

  - Ưu tiên 3 - Màu sắc (Color Hue --- redundant encoding): Color Hue mã
    hóa Borough (Categorical) --- cùng thuộc tính đã được mã hóa bởi
    PosX. Đây là redundant encoding có chủ ý: mặc dù không bổ sung thêm
    thông tin mới, kỹ thuật này tăng cường tính nhận diện trực quan,
    giúp người xem liên kết màu sắc với borough ngay cả khi nhìn vào
    legend hoặc kết hợp với các chart khác trong dashboard. Theo
    Mackinlay, Color Hue phù hợp cho dữ liệu danh mục và không gây hiểu
    nhầm về thứ tự hay mức độ.

- Kết luận: Mọi channel phù hợp và đúng với bản chất dữ liệu.

2\. Tính hiệu quả (Effectiveness):

- Độ chính xác (Accuracy): Kênh Length xếp hạng thứ 3 trong channel
  effectiveness ranking (sau Position on common scale và Position on
  unaligned scale). Label số ở đầu cột loại bỏ hoàn toàn sai số cảm nhận
  thị giác.

- Khả năng phân biệt (Discriminability): 5 cột màu khác nhau, phân cách
  rõ ràng, sort descending giúp so sánh nhanh từ đắt đến rẻ.

- Khả năng tách biệt (Separability): PosX, PosY và Color tách biệt hoàn
  toàn.

C. Phân tích biểu đồ (Insight)

- Manhattan (\$200) đắt hơn gấp đôi so với Bronx (\$93) --- mức chênh
  lệch rất lớn, cho thấy sự phân cực giá rõ rệt theo vị trí địa lý tại
  NYC.

- Brooklyn (\$129) đứng thứ hai --- lựa chọn cân bằng giữa vị trí và chi
  phí, rẻ hơn Manhattan \$71/đêm.

- Queens (\$100), Staten Island (\$99) và Bronx (\$93) có median tương
  đương nhau --- phù hợp cho du khách ngân sách thấp.

- Khuyến nghị: Với nhóm du khách muốn cân bằng tiện lợi và tiết kiệm,
  Brooklyn là lựa chọn tối ưu; với ngân sách tối thiểu, Queens hoặc
  Bronx phù hợp nhất.

### 6.Domain task 6 : Phân tích bản đồ giá bất thường và giá trị thực

Câu hỏi: Listing nào có giá bất thường (outlier)? Listing nào có giá
thấp nhưng đánh giá cao (good deal)?

#### 6.1 -- Point Map: Phân bố listing theo giá bất thường

+-----------+-----------------------------------------------------+
| Idiom     | Point Map (Geographic Scatter Map)                  |
+-----------+-----------------------------------------------------+
| What      | Longitude: Quantitative/Geographic (Key)\           |
|           | Latitude: Quantitative/Geographic (Key)\            |
|           | price_is_outlier (derived): Categorical             |
|           | (True/False)\                                       |
|           | Price: Quantitative\                                |
|           | Room Type: Categorical                              |
+-----------+-----------------------------------------------------+
| How       | **Encode**                                          |
|           |                                                     |
|           | Mark: Point (Circle)\                               |
|           | Channel:\                                           |
|           | Pos X: Longitude (Geographic)\                      |
|           | Pos Y: Latitude (Geographic)\                       |
|           | Hue Color: price_is_outlier (Categorical --         |
|           | đỏ=True, xanh=False)\                               |
|           | Size: Price (Quantitative -- điểm lớn = giá cao)    |
|           +-----------------------------------------------------+
|           | **Manipulate**                                      |
|           |                                                     |
|           | Selection: Hover để xem id, price, room_type,       |
|           | neighbourhood, price_is_outlier                     |
|           +-----------------------------------------------------+
|           | ---                                                 |
|           +-----------------------------------------------------+
|           | **Reduce**                                          |
|           |                                                     |
|           | Giải pháp overplotting: giảm opacity điểm False     |
|           | (xanh) để outlier (đỏ) nổi bật;\                    |
|           | hoặc filter theo borough để zoom vào từng khu vực   |
+-----------+-----------------------------------------------------+
| Why       | produce-\>locate → explore\                         |
|           | Point Map là idiom duy nhất trả lời câu hỏi \'ở     |
|           | đâu\' --- không thể thay thế bằng bar chart hay     |
|           | Glyph cho phân tích spatial distribution.           |
+-----------+-----------------------------------------------------+
| Scale     | Main key: \~21,000 listings\                        |
|           | Color: 2 (True/False outlier)                       |
|           |                                                     |
|           | Value range(Price): 9 -\> 50138                     |
+===========+=====================================================+

![](media/media/image7.png){width="6.0in" height="4.640668197725284in"}

Hình 6.1. Bản đồ phân bố listing theo giá bất thường tại NYC

B. Đánh giá biểu đồ

1\. Tính biểu đạt (Expressiveness):

- Thuộc tính: Kinh độ / Longitude (Q -- spatial), Vĩ độ / Latitude (Q --
  spatial), Cờ giá bất thường / price_is_outlier (C), Giá niêm yết /
  Price (Q -- Size), Loại phòng / Room Type (C -- filter/Tooltip), Khu
  vực / Neighbourhood Cleansed (C -- Tooltip).

- Channel:

  - PosX (Longitude), PosY (Latitude): vị trí địa lý thực tế → phù hợp
    Quantitative/Geographic. Geographic position là cách duy nhất đúng
    để encode tọa độ không gian.

  - Hue Color: phân biệt nhị phân True/False outlier (C) → phù hợp. Chỉ
    2 màu → discriminability tuyệt đối.

  - Size: thể hiện mức giá (Q) → phù hợp --- điểm lớn hơn = giá cao hơn,
    nhất quán với convention.

- Đánh giá mức độ quan trọng:

  - Ưu tiên 1 - Vị trí không gian địa lý (PosX/PosY ---
    Longitude/Latitude): Geographic Position là kênh cốt lõi và quan
    trọng nhất trong bản đồ điểm. PosX/PosY mã hóa tọa độ địa lý thực tế
    (Quantitative/Geographic) của từng listing, đặt mỗi điểm vào đúng vị
    trí tương ứng trên bản đồ NYC. Theo Mackinlay, Geographic Position
    là ứng dụng đặc biệt của kênh Position --- vừa chính xác tuyệt đối
    về mặt không gian, vừa truyền tải ngữ cảnh địa lý mà không có kênh
    nào khác có thể thay thế được. Task chính của biểu đồ là locate (xác
    định vị trí), nên Geographic Position phải là kênh được ưu tiên số
    một.

  - Ưu tiên 2 - Màu sắc (Color Hue): Color Hue mã hóa Price Is Outlier
    (Categorical --- True/False) bằng hai màu tương phản (đỏ/xanh). Đây
    là kênh phù hợp nhất cho thuộc tính danh mục nhị phân theo lý thuyết
    Mackinlay. Chỉ cần 2 màu giúp discriminability đạt mức tuyệt đối ---
    người xem phân biệt outlier và non-outlier ngay tức thì mà không cần
    đọc legend. Màu đỏ nổi bật trên nền bản đồ trắng xám, tăng cường khả
    năng phát hiện nhanh các vùng tập trung listing bất thường theo
    không gian địa lý.

  - Ưu tiên 3 - Kích thước điểm (Size / Area): Size mã hóa Price
    (Quantitative) theo diện tích điểm tròn --- điểm lớn hơn tương ứng
    với giá cao hơn. Theo Mackinlay, Area là kênh kém chính xác hơn cho
    dữ liệu định lượng so với Position hay Length (hệ số Stevens n ≈
    0.7, Log_error cao hơn), nhưng phù hợp với mục tiêu của biểu đồ này:
    task là locate, không phải so sánh chính xác giá trị. Thêm vào đó,
    outlier thường có giá cao nên đồng thời có Size lớn --- hiệu ứng kép
    giúp listing bất thường nổi bật gấp đôi so với phần còn lại ngay cả
    trong vùng dày đặc điểm như Manhattan.

- Kết luận: Point Map là idiom tối ưu để phân tích dữ liệu có thành phần
  địa lý.

2\. Tính hiệu quả (Effectiveness):

- Độ chính xác (Accuracy):PosX, PosY (geographic position) có độ chính
  xác tuyệt đối về không gian. Kênh Size (Area) xếp thấp trong channel
  effectiveness ranking --- khó ước lượng chênh lệch giá chính xác.
  Trade-off chấp nhận được vì mục tiêu là Locate, không phải Compare.

- Khả năng phân biệt (Discriminability): 2 màu nhị phân (đỏ/xanh) rất dễ
  phân biệt. Với \~21k điểm, các vùng dày đặc bị overlap nghiêm trọng.
  Giải pháp: giảm opacity điểm False (xanh), hoặc áp dụng filter theo
  borough.

- Khả năng tách biệt (Separability): PosX/PosY và Color tách biệt tốt.
  Size và Color có thể tương tác nhẹ khi điểm lớn che điểm nhỏ.

C. Phân tích biểu đồ (Insight)

- Outlier giá cao (điểm đỏ lớn) tập trung dày đặc ở Manhattan --- đặc
  biệt Midtown và Upper East Side, khẳng định Manhattan là thị trường
  giá cao và biến động nhất.

- Bronx và Staten Island hầu như không có điểm đỏ --- thị trường giá
  bình ổn, an toàn hơn cho du khách về khả năng dự đoán giá.

- Brooklyn có một số outlier tập trung ở Brooklyn Heights, DUMBO --- nơi
  host định giá cao hơn mức phổ thông do view đẹp và gần Manhattan.

- Khuyến nghị: Du khách nên kết hợp với Task 5 để chọn borough; tránh
  listing Manhattan không có nhiều reviews và có giá bất thường cao.

#### 6.2 -- Scatter Plot: Giá vs Rating --- Phát hiện Good Deal

+----------+------------------------------------------------------+
| Idiom    | Scatter Plot                                         |
+----------+------------------------------------------------------+
| What     | Price: Quantitative (Key trục X)\                    |
|          | review_scores_rating: Quantitative (Key trục Y)\     |
|          | good_deal_flag (derived): Categorical (Good Deal /   |
|          | Normal)\                                             |
|          | number_of_reviews: Quantitative (Size -- proxy độ    |
|          | tin cậy)                                             |
+----------+------------------------------------------------------+
| How      | **Encode**                                           |
|          |                                                      |
|          | Mark: Point (Circle)\                                |
|          | Channel:\                                            |
|          | Pos X: Price (Quantitative)\                         |
|          | Pos Y: review_scores_rating (Quantitative)\          |
|          | Hue Color: good_deal_flag (Categorical -- xanh=Good  |
|          | Deal, xám=Normal)\                                   |
|          | Size: number_of_reviews (Quantitative)\              |
|          | Reference Lines:\                                    |
|          | Dọc (trục X): MEDIAN(price) -- phân cách giá         |
|          | cao/thấp\                                            |
|          | Ngang (trục Y): Constant = 4.8 -- ngưỡng Good Deal   |
|          | Flag                                                 |
|          +------------------------------------------------------+
|          | **Manipulate**                                       |
|          |                                                      |
|          | Hover để xem giá, rating, room_type, neighbourhood,  |
|          | number_of_reviews                                    |
|          +------------------------------------------------------+
|          | **Facet**                                            |
|          |                                                      |
|          | Superimpose: Reference Lines đặt lên scatter plot    |
|          +------------------------------------------------------+
|          | **Reduce**                                           |
|          |                                                      |
|          | Filter: number_of_reviews ≥ 5 (loại listing ít đánh  |
|          | giá, không đủ tin cậy)                               |
+----------+------------------------------------------------------+
| Why      | produce-\>discover → compare\                        |
|          | Scatter plot tối ưu cho phân tích 2Q correlation. 4  |
|          | góc phần tư từ reference lines giúp nhận diện Good   |
|          | Deal (góc trên trái: price \< median VÀ rating ≥     |
|          | 4.8).                                                |
+----------+------------------------------------------------------+
| Scale    | Color: 2 (Good Deal / Normal)\                       |
|          | Items: listing với ≥ 5 reviews, price_is_outlier =   |
|          | False                                                |
+==========+======================================================+

![](media/media/image9.png){width="6.0in" height="5.763513779527559in"}

Hình 6.2. Scatter plot giá niêm yết vs. điểm đánh giá --- phát hiện Good
Deal

B. Đánh giá biểu đồ

1\. Tính biểu đạt (Expressiveness):

- Thuộc tính: Giá niêm yết / Price (Q), Điểm đánh giá / Review Scores
  Rating (Q), Cờ \"Món hời\" / Good Deal Flag (C), Số lượng đánh giá /
  Number of Reviews (Q -- Size), Median Price (Q -- Reference Line dọc),
  Ngưỡng Rating 4.8 (Q -- Reference Line ngang), price_is_outlier (C --
  filter), Number of Reviews ≥ 5 (Q -- filter).

- Channel:

  - PosX (Price -- Q): vị trí ngang thể hiện giá → đúng.

  - PosY (Rating -- Q): vị trí dọc thể hiện chất lượng → đúng. Rating
    cao hơn = vị trí cao hơn nhất quán với convention \'up = good\'.

  - Hue Color: phân biệt Good Deal / Normal (C) → đúng. Chỉ 2 giá trị,
    discriminability tuyệt đối.

  - Size: thể hiện Number of Reviews (Q) → đúng. Size phù hợp cho Q thứ
    cấp (proxy trust level).

- Đánh giá mức độ quan trọng:

  - Ưu tiên 1 - Vị trí hai trục (PosX và PosY): PosX/PosY là cặp kênh
    quan trọng nhất trong scatter plot. PosX mã hóa Price (Quantitative)
    và PosY mã hóa Review Scores Rating (Quantitative) --- cả hai đều là
    dữ liệu định lượng liên tục. Theo Mackinlay, Position on a common
    scale là kênh hiệu quả nhất cho dữ liệu định lượng, cho phép người
    xem nhận biết chính xác vị trí từng listing theo hai chiều, đồng
    thời suy luận về mối quan hệ (hoặc sự vắng mặt của tương quan) giữa
    giá và rating. Reference lines (median giá dọc, average rating
    ngang) được superimpose lên hai trục này để tạo framework bốn góc
    phần tư --- phục vụ trực tiếp task discover và compare của biểu đồ.

  - Ưu tiên 2 - Màu sắc (Color Hue): Color Hue mã hóa Good Deal Flag
    (Categorical --- Good Deal / Normal) bằng hai màu tương phản (xanh
    lá / xám). Theo Mackinlay, Color Hue là kênh phù hợp nhất cho dữ
    liệu danh mục nhị phân. Màu xanh lá nổi bật trên nền xám giúp người
    xem lập tức xác định vùng \"Good Deal\" trong không gian scatter
    plot --- phục vụ trực tiếp task discover (phát hiện cơ hội). Kênh
    này hoạt động song song với reference lines: PosX/PosY xác định vị
    trí, Color Hue xác nhận nhãn --- cả hai cùng nhau tạo ra thông điệp
    rõ ràng mà không cần người xem tự tính toán.

  - Ưu tiên 3 - Kích thước điểm (Size / Area): Size mã hóa Number of
    Reviews (Quantitative) --- listing có nhiều review tương ứng với
    điểm lớn hơn. Theo Mackinlay, Area không phải kênh mạnh nhất cho dữ
    liệu định lượng về độ chính xác, nhưng đây là kênh phụ với mục tiêu
    encode độ tin cậy (trust level) thay vì giá trị chính xác: người xem
    không cần biết số review cụ thể, chỉ cần nhận biết listing nào \"đã
    được nhiều người kiểm chứng\" để củng cố độ tin tưởng vào Good Deal
    được phát hiện.

<!-- -->

- Kết luận: Scatter plot là idiom tối ưu để phân tích mối quan hệ giữa 2
  biến định lượng với phân nhóm categorical.

2\. Tính hiệu quả (Effectiveness):

- Độ chính xác (Accuracy):PosX và PosY (position on common scale) ---
  channel chính xác nhất. Kênh Size (Area) --- accuracy thấp hơn, khó so
  sánh chính xác số reviews; đây là channel phụ nên chấp nhận được.

- Khả năng phân biệt (Discriminability): 2 màu (xanh/xám) rất dễ phân
  biệt. Reference lines tạo 4 góc phần tư rõ ràng, giúp người xem định
  vị ngay vùng \'good deal\' (góc trên-trái). Overplotting tại rating
  4.8--5.0 là hạn chế --- có thể cải thiện bằng jitter hoặc
  transparency.

- Khả năng tách biệt (Separability): PosX, PosY, Color và Size tách biệt
  tốt.

C. Phân tích biểu đồ (Insight)

- Vùng góc trên-trái (price \< median, rating ≥ 4.8) là vùng \'Good
  Deal\' --- tập trung nhiều điểm xanh, chủ yếu thuộc Brooklyn và
  Queens.

- Manhattan có nhiều listing ở phần bên phải chart (giá cao) với rating
  không tương xứng --- không phải lựa chọn tối ưu về cost-efficiency.

- Listing \'Good Deal\' có Size lớn (nhiều reviews) là những nơi đã được
  kiểm chứng bởi nhiều khách --- độ tin cậy cao.

- Quan trọng: Không có tương quan dương rõ ràng giữa giá cao và rating
  cao --- nhiều listing Brooklyn/Queens giá thấp vẫn đạt rating
  4.7--5.0, chứng minh giá không phải là proxy của chất lượng trên
  Airbnb.

- Khuyến nghị: Ưu tiên listing trong vùng \'Good Deal\' tại
  Brooklyn/Queens với number_of_reviews ≥ 20--30.

### 7. Domain task 7: Phân tích hiệu quả chi phí lưu trú

Câu hỏi: Borough và loại phòng nào có chi phí mỗi người thấp nhất? Sức
chứa tác động thế nào đến giá/người?

#### 7.1 -- Grouped Bar Chart: Median chi phí mỗi người theo borough và loại phòng

+---------+------------------------------------------------------+
| Idiom   | Grouped Bar Chart                                    |
+---------+------------------------------------------------------+
| What    | Borough: Categorical (Key nhóm chính)\               |
|         | Room Type: Categorical (Key nhóm phụ)\               |
|         | price_per_person (derived): Quantitative (price /    |
|         | accommodates)                                        |
+---------+------------------------------------------------------+
| How     | **Encode**                                           |
|         |                                                      |
|         | Mark: Bar (grouped -- Stack Marks OFF)\              |
|         | Channel:\                                            |
|         | Pos X: Borough × Room Type (Categorical -- tạo cụm   |
|         | cột cạnh nhau)\                                      |
|         | Pos Y: MEDIAN(price_per_person) (Quantitative --     |
|         | length)\                                             |
|         | Hue Color: Room Type (Categorical -- 4 màu)\         |
|         | Label: giá trị median ở đầu mỗi cột\                 |
|         | Note: Analysis → Stack Marks → Off (bắt buộc để tạo  |
|         | Grouped, không phải Stacked)                         |
|         +------------------------------------------------------+
|         | **Selection**:                                       |
|         |                                                      |
|         | Hover để xem median price/person theo từng borough × |
|         | room type                                            |
|         +------------------------------------------------------+
|         | ---                                                  |
|         +------------------------------------------------------+
|         | **Reduce**:                                          |
|         |                                                      |
|         | Filter: price_is_outlier = False\                    |
|         | Aggregate: MEDIAN(price_per_person) theo borough ×   |
|         | room type                                            |
+---------+------------------------------------------------------+
| Why     | compare → summarize\                                 |
|         | So sánh chi phí/người theo 2 chiều categorical đồng  |
|         | thời (borough × room type). Grouped bar (không phải  |
|         | Stacked) vì task là Compare giá trị tuyệt đối, không |
|         | phải part-to-whole.                                  |
+---------+------------------------------------------------------+
| Scale   | Main key: 5 borough × 4 room type = 20 cột\          |
|         | Items: \~21,000 listing (sau lọc)                    |
+=========+======================================================+

![](media/media/image8.png){width="6.0in" height="4.0112357830271215in"}

Hình 7.1. Grouped bar chart median giá/người theo borough và loại phòng

B. Đánh giá biểu đồ

1\. Nguyên lý biểu đạt (Expressiveness):

- Thuộc tính: Quận / Borough -- neighbourhood_group_cleansed (C -- Panel
  Facet), Loại phòng / Room Type (C), Chi phí mỗi người / Price Per
  Person -- price_per_person (Q -- MEDIAN aggregate), price_is_outlier
  (C -- filter).

- Channel:

  - PosX: phân biệt borough (C) → đúng.

  - PosY (Length từ 0): thể hiện MEDIAN price/person (Q) → đúng. Length
    là channel chính xác nhất cho Q.

  - Hue Color: phân biệt room type (C) trong grouped bar → đúng.

- Đánh giá mức độ quan trọng:

  - Ưu tiên 1 - Chiều dài cột (Length / PosY): Length là kênh quan trọng
    nhất trong grouped bar chart. Kênh này mã hóa MEDIAN
    price_per_person (Quantitative) từ baseline = 0, phản ánh hiệu quả
    chi phí thực tế của từng tổ hợp borough × room type. Theo Mackinlay,
    Length là kênh hiệu quả cao cho dữ liệu định lượng với baseline cố
    định, cho phép so sánh độ lớn tương đối giữa các cột nhanh chóng và
    trực quan. Label số trên đầu cột loại bỏ hoàn toàn sai số cảm nhận
    thị giác, tăng độ chính xác lên mức tuyệt đối --- quan trọng vì task
    của biểu đồ là compare (so sánh chi phí theo đầu người giữa nhiều
    nhóm cùng lúc).

  - Ưu tiên 2 - Vị trí ngang (PosX): PosX phân tách 5 borough theo chiều
    ngang, mã hóa thuộc tính Borough (Categorical/Nominal) theo không
    gian. Đây là kênh quan trọng thứ hai vì nó tạo ra cấu trúc nhóm
    chính của biểu đồ: người xem điều hướng theo borough (vị trí ngang)
    trước, sau đó so sánh room type trong nội bộ borough (màu sắc). Thứ
    tự borough theo vị trí ngang giúp định vị dễ dàng và phản ánh cấu
    trúc thị trường NYC quen thuộc.

  - Ưu tiên 3 - Màu sắc (Color Hue): Color Hue mã hóa Room Type
    (Categorical/Nominal), xác định cấu trúc grouped bên trong mỗi
    borough. Theo Mackinlay, Color Hue phù hợp cho dữ liệu danh mục, đặc
    biệt khi cần phân biệt các nhóm nhỏ trong cùng một vị trí ngang.
    Kênh này cho phép biểu đồ truyền tải đồng thời hai chiều so sánh:
    liên borough (theo PosX) và liên room type (theo Color Hue) trong
    một view duy nhất --- đây là lợi thế đặc trưng của grouped bar chart
    so với faceting riêng biệt.

<!-- -->

- Kết luận: Grouped Bar Chart là lựa chọn đúng đắn khi cần so sánh đồng
  thời theo 2 chiều categorical.

2\. Nguyên lý hiệu quả (Effectiveness):

- Độ chính xác (Accuracy): Length (từ gốc 0) --- channel có độ chính xác
  cao. Label số trên đầu cột loại bỏ sai số cảm nhận hoàn toàn.

- Khả năng phân biệt (Discriminability): 4 màu trong phạm vi ≤ 7 → phân
  biệt tốt. Grouped layout rõ ràng hơn stacked bar.

- Khả năng tách biệt (Separability): PosX, PosY và Color hoạt động độc
  lập tốt.

C. Phân tích biểu đồ (Insight)

- Entire home/apt có price/person cao nhất nhìn chung --- nhưng khi chia
  theo nhiều người (4--6 người), đây vẫn cạnh tranh với Private room ở
  Manhattan.

- Bronx và Staten Island có price/person thấp nhất trong mọi room type
  --- lựa chọn tối ưu cho nhóm khách ngân sách thấp.

- Private room và Shared room luôn có price/person thấp hơn Entire home
  --- phù hợp cho khách solo hoặc đôi.

- Khuyến nghị: Nhóm 4--6 người nên so sánh Entire home/apt ở
  Queens/Bronx với Private room ở Brooklyn --- kết hợp với Task 7.2 để
  xác định crossover point.

#### 7.2 -- Scatter Plot: Sức chứa vs Chi phí mỗi người

+-------+--------------------------------------------------------+
| Idiom | Scatter Plot với Trend Line                            |
+-------+--------------------------------------------------------+
| What  | accommodates: Quantitative (Key trục X -- sức chứa     |
|       | 1--16)\                                                |
|       | price_per_person (derived): Quantitative (Value trục   |
|       | Y)\                                                    |
|       | Room Type: Categorical (Color)                         |
+-------+--------------------------------------------------------+
| How   | **Encode**                                             |
|       |                                                        |
|       | Mark: Point (Circle)\                                  |
|       | Channel:\                                              |
|       | Pos X: accommodates (Quantitative -- giữ từng giá trị  |
|       | riêng 1--16)\                                          |
|       | Pos Y: MEDIAN(price_per_person) (Quantitative)\        |
|       | Hue Color: Room Type (Categorical -- 4 màu)            |
|       +--------------------------------------------------------+
|       | **Manipulate**                                         |
|       |                                                        |
|       | Selection :Hover để xem accommodates, median           |
|       | price/person, room_type, count                         |
|       +--------------------------------------------------------+
|       | **Facet**                                              |
|       |                                                        |
|       | Superimpose: Trend Line (Linear) cho từng room type    |
|       +--------------------------------------------------------+
|       | **Reduce**                                             |
|       |                                                        |
|       | Filter: accommodates ≤ 16, price_is_outlier = False    |
+-------+--------------------------------------------------------+
| Why   | discover → explore\                                    |
|       | Phát hiện xu hướng giảm của price/person khi sức chứa  |
|       | tăng (economies of scale). Scatter + Trend Line là     |
|       | idiom chuẩn để phân tích relationship giữa 2 biến Q,   |
|       | đặc biệt để xác định crossover point giữa các room     |
|       | type.                                                  |
+-------+--------------------------------------------------------+
| Scale | Key: 16 (giá trị accommodates 1--16)\                  |
|       | Color key: 4 room type                                 |
+=======+========================================================+

![](media/media/image11.png){width="6.0in" height="4.644981408573928in"}

Hình 7.2. Mối quan hệ giữa sức chứa và chi phí mỗi người

B. Đánh giá biểu đồ

1\. Nguyên lý biểu đạt (Expressiveness):

- Thuộc tính: Sức chứa / Accommodates (Q), Chi phí mỗi người / Price Per
  Person -- price_per_person (Q -- MEDIAN aggregate), Loại phòng / Room
  Type (C), Đường xu hướng / Trend Line (Q -- linear regression),
  price_is_outlier (C -- filter), Accommodates 1--16 (Q -- filter).

- Channel:

  - PosX (Accommodates -- Q/Ordinal): position thích hợp.

  - PosY (MEDIAN price/person -- Q): position thích hợp.

  - Hue Color: Room Type (C) → đúng, phân biệt 3--4 loại phòng.

  - Trend Line: hiển thị xu hướng tổng thể → tăng thêm thông tin về
    dependency.

- Đánh giá mức độ quan trọng:

  - Ưu tiên 1 - Vị trí hai trục (PosX và PosY): PosX/PosY là cặp kênh
    quan trọng nhất. PosX mã hóa Accommodates (Quantitative/Ordinal ---
    số người từ 1 đến 16) và PosY mã hóa MEDIAN price_per_person
    (Quantitative). Theo Mackinlay, Position là kênh hiệu quả nhất cho
    cả dữ liệu định lượng lẫn thứ tự. Accommodates được giữ nguyên thứ
    tự tăng dần trên trục X, cho phép người xem theo dõi xu hướng giảm
    của price/person khi sức chứa tăng --- insight cốt lõi về economies
    of scale. Đây là lý do scatter plot với 2 trục Position là idiom tối
    ưu để phân tích mối quan hệ giữa hai biến định lượng/thứ tự.

  - Ưu tiên 2 - Màu sắc (Color Hue): Color Hue mã hóa Room Type
    (Categorical/Nominal), phân biệt các nhóm điểm và đường xu hướng
    theo loại phòng. Đây là kênh quan trọng thứ hai vì nó cho phép so
    sánh đồng thời xu hướng giữa các room type trên cùng một biểu đồ ---
    phát hiện crossover point (điểm giao nhau về chi phí) giữa Entire
    home và Private room. Theo Mackinlay, Color Hue phù hợp cho dữ liệu
    danh mục và đặc biệt hiệu quả khi cần phân biệt các nhóm trong
    scatter plot đa chiều. Màu trend line tương ứng với màu điểm duy trì
    tính nhất quán thị giác.

  - Ưu tiên 3 - Đường xu hướng (Trend Line --- superimposed): Mặc dù
    Trend Line không phải một kênh thị giác theo định nghĩa Mackinlay,
    đây là lớp thông tin bổ sung (superimposed) quan trọng về mặt thiết
    kế. Trend Line mã hóa hướng và độ dốc của mối quan hệ giữa
    Accommodates và Price/person --- thuộc tính mà Position điểm rời rạc
    không thể truyền tải rõ ràng khi dữ liệu có noise. Đường xu hướng
    dốc xuống của Entire home/apt và đường gần phẳng của Private room
    trực tiếp minh họa insight economies of scale, phục vụ task discover
    (phát hiện xu hướng) mà không yêu cầu người xem tự suy diễn từ đám
    mây điểm.

- Kết luận: Scatter plot với Trend Line là lựa chọn chuẩn mực để phân
  tích mối quan hệ giữa 2 biến Q và so sánh xu hướng giữa các nhóm.

2\. Nguyên lý hiệu quả (Effectiveness):

- Độ chính xác (Accuracy): PosX và PosY (position on common scale) ---
  rất chính xác. Trend Line thể hiện xu hướng dốc xuống rõ ràng. MEDIAN
  aggregation giúp giảm nhiễu so với raw data.

- Khả năng phân biệt (Discriminability): 3--4 màu dễ phân biệt. Số lượng
  điểm vừa phải (\~42--64 marks) không bị clutter.

- Khả năng tách biệt (Separability): PosX, PosY và Color tách biệt hoàn
  toàn. Trend lines không làm rối các điểm dữ liệu thực.

C. Phân tích biểu đồ (Insight)

- Trend line của Entire home/apt dốc xuống mạnh nhất --- xác nhận
  \'economies of scale\': càng nhiều người chia phòng, giá mỗi người
  càng giảm. Sweet spot rõ ràng ở 4--6 người.

- Private room gần như phẳng --- sức chứa không ảnh hưởng nhiều đến
  price/person.

- Crossover point: Với 4+ người, Entire home trở nên rẻ hơn Private room
  tính theo đầu người --- insight quan trọng nhất của Task 7.

- Khuyến nghị: Nhóm ≥ 4 người nên ưu tiên Entire home/apt, ưu tiên
  Queens/Brooklyn để tối ưu cả vị trí lẫn chi phí mỗi người.

### 8. Domain task 8: Phân tích mùa vụ và cơ hội đặt phòng

Câu hỏi: Tỷ lệ lấp đầy thay đổi như thế nào theo mùa? Chính sách minimum
nights ảnh hưởng thế nào?

#### 8.1 -- Line Chart: Tỷ lệ lấp đầy theo tháng

+-------+--------------------------------------------------------+
| Idiom | Line Chart                                             |
+-------+--------------------------------------------------------+
| What  | Month: Ordinal (tháng 1--12, cyclic -- seasonality lặp |
|       | lại theo năm)\                                         |
|       | occupancy_rate_pct (derived): Quantitative             |
|       | (AVG(is_booked) × 100)                                 |
+-------+--------------------------------------------------------+
| How   | **Encode**                                             |
|       |                                                        |
|       | Mark: Line + Point\                                    |
|       | Channel:\                                              |
|       | Pos X: Month (Ordinal, Discrete -- tiến trình thời     |
|       | gian tháng 1--12)\                                     |
|       | Pos Y: Occupancy Rate (%) (Quantitative)\              |
|       | Reference Line: Average (ngang -- mức trung bình tổng  |
|       | thể \~30%)                                             |
|       +--------------------------------------------------------+
|       | **Manipulate**\                                        |
|       | Hover để xem tháng, occupancy rate (%) cụ thể          |
|       +--------------------------------------------------------+
|       | **Facet**                                              |
|       |                                                        |
|       | Superimpose: Reference Line (average occupancy ngang)  |
|       +--------------------------------------------------------+
|       | **Reduce**                                             |
|       |                                                        |
|       | Filter: Year = 2026 (dữ liệu calendar 2025 chỉ có từ   |
|       | tháng 11, không đủ để phân tích seasonality)           |
+-------+--------------------------------------------------------+
| Why   | discover → browse\                                     |
|       | Line chart (không phải bar) vì Month là Ordinal có thứ |
|       | tự -- đường kết nối nhấn mạnh tính liên tục và xu      |
|       | hướng thời gian, không phải giá trị tại từng điểm rời  |
|       | rạc.                                                   |
+-------+--------------------------------------------------------+
| Scale | Key: 12 (tháng); Items: dữ liệu 2026 (tháng 1--11)     |
+=======+========================================================+

![](media/media/image4.png){width="6.0in" height="5.833333333333333in"}

Hình 8.1. Tỷ lệ lấp đầy (occupancy rate) theo tháng tại NYC (2026)

B. Đánh giá biểu đồ

1\. Nguyên lý biểu đạt (Expressiveness):

- Thuộc tính: Tháng / Month (O), Tỷ lệ lấp đầy / Occupancy Rate Pct (Q
  -- AVG aggregate), Đường trung bình / Average Occupancy Rate (Q --
  Reference Line), Năm / Year (O -- filter bối cảnh, Year = 2026).

- Channel:

  - PosX (Month -- Ordinal): trục thời gian có thứ tự → đúng. Không dùng
    Categorical vì mất thứ tự thời gian.

  - PosY (Occupancy Rate -- Q): thể hiện mức độ lấp đầy → đúng.

  - Reference Line Average: cung cấp mốc tham chiếu tổng thể → tăng thêm
    thông tin phân tích.

- Đánh giá mức độ quan trọng:

  - Ưu tiên 1 - Vị trí dọc (PosY --- Position on common scale): PosY là
    kênh quan trọng nhất trong line chart. Kênh này mã hóa Occupancy
    Rate (%) (Quantitative) trên thang đo chung, phản ánh trực tiếp mức
    độ lấp đầy của thị trường tại từng thời điểm. Theo Mackinlay,
    Position on a common scale là kênh hiệu quả nhất cho dữ liệu định
    lượng, cho phép người xem so sánh mức occupancy giữa các tháng với
    độ chính xác cao và nhận diện biên độ dao động mùa vụ (từ \~20% đến
    \~40%) một cách tức thì. Kênh này là nền tảng để thực hiện task
    discover (phát hiện xu hướng) và browse (duyệt qua từng tháng).

  - Ưu tiên 2 - Vị trí ngang (PosX --- trục thời gian Ordinal): PosX mã
    hóa Month (Ordinal --- tháng 1 đến 12) theo trục thời gian. Đây là
    kênh quan trọng thứ hai vì nó thiết lập chiều thời gian của biểu đồ
    --- nền tảng của phân tích seasonality. Theo Mackinlay, Position phù
    hợp cho dữ liệu thứ tự (Ordinal), và việc sử dụng trục ngang liên
    tục phản ánh đúng bản chất thứ tự tháng (T1 → T12), không bị mất
    thông tin thứ tự như khi dùng Categorical. Các điểm được kết nối
    bằng đường thẳng giúp người xem nhận diện xu hướng liên tục theo
    thời gian.

  - Ưu tiên 3 -- Reference Line (Average): Reference line ngang tại mức
    trung bình (\~30%) là channel bổ trợ giúp người xem định vị nhanh
    các tháng vượt/dưới ngưỡng bình thường mà không cần đọc chính xác
    giá trị trục Y. Đây là annotation tĩnh (không encode data mới) nhưng
    tăng đáng kể khả năng thực hiện action Locate Extremes --- xác định
    tháng cao điểm và thấp điểm một cách tức thì. Theo phân loại
    Munzner, đây là dạng derived encoding bổ trợ cho channel chính thay
    vì thay thế nó.

- Kết luận: Line chart là idiom tối ưu cho dữ liệu chuỗi thời gian, đặc
  biệt khi cần phát hiện trend và seasonality.

2\. Nguyên lý hiệu quả (Effectiveness):

- Độ chính xác (Accuracy): PosY (position on common scale) --- rất chính
  xác. Người xem dễ dàng so sánh mức occupancy giữa các tháng.

- Discriminability: Reference line Average tạo mốc tham chiếu để xác
  định tháng nào trên/dưới trung bình.

- Separability: PosX và PosY tách biệt hoàn toàn.

C. Phân tích biểu đồ (Insight)

- Tháng 1--4 là low season rõ rệt (occupancy \~20--21%) --- cơ hội tốt
  cho khách muốn giá thấp và dễ tìm phòng.

- Từ tháng 5 trở đi, occupancy tăng dần và đạt đỉnh vào tháng 11 (\~40%)
  --- phản ánh nhu cầu du lịch mùa thu và dịp lễ Thanksgiving.

- Dữ liệu sử dụng: calendar 2026 (tháng 1--11); dữ liệu 2025 chỉ có từ
  tháng 11 nên không đủ để so sánh liên năm.

- Khuyến nghị cho du khách: Đặt phòng tháng 1--3 để có giá thấp nhất;
  tháng 11 cần đặt sớm do cầu rất cao.

- Khuyến nghị cho host: Tháng 1--4 nên linh hoạt hóa chính sách (giảm
  minimum nights, giảm giá nhẹ); tháng 11--12 có thể tăng giá.

#### 8.2 -- Heatmap: Tỷ lệ lấp đầy theo tháng và chính sách minimum nights

+---------------+-------------------------------------------------+
| Idiom         | Heatmap (Matrix Chart)                          |
+---------------+-------------------------------------------------+
| What          | Month: Ordinal (tháng 1--12, cyclic)\           |
|               | minimum_nights_group (derived): Categorical     |
|               | (Short ≤3 / Medium 4--7 / Long \>7)\            |
|               | occupancy_rate_pct (derived): Quantitative      |
+---------------+-------------------------------------------------+
| How           | **Encode**                                      |
|               |                                                 |
|               | Mark: Point (Được hiển thị dưới dạng vùng diện  |
|               | tích hình vuông - Square/Area lấp đầy ô lưới ma |
|               | trận)\                                          |
|               | Channel:\                                       |
|               | Pos X: Month (Ordinal -- 12 cột)\               |
|               | Pos Y: Minimum Nights Group (Categorical --     |
|               | Short/Medium/Long, top→bottom)\                 |
|               | Color (Luminance/Sequential): Occupancy Rate    |
|               | (Quantitative -- đậm=cao, nhạt=thấp)            |
|               +-------------------------------------------------+
|               | **Manipulate**                                  |
|               |                                                 |
|               | Hover để xem month, Minimum Nights Group,       |
|               | occupancy_rate_pct (%)                          |
|               +-------------------------------------------------+
|               | ---                                             |
|               +-------------------------------------------------+
|               | **Recude**:                                     |
|               |                                                 |
|               | Binning minimum_nights → 3 nhóm (giảm số chiều  |
|               | từ hàng trăm giá trị → 3 nhóm)\                 |
|               | Sort thủ công: Short → Medium → Long (thứ tự    |
|               | logic nghiệp vụ, không alphabetical)            |
+---------------+-------------------------------------------------+
| Why           | discover → compare\                             |
|               | Phát hiện pattern 2 chiều đồng thời (month ×    |
|               | minimum_nights_group). Heatmap theo nguyên lý   |
|               | \'2 keys → heatmap\' --- encode 3 biến trong    |
|               | cấu trúc ma trận. Color Luminance/Sequential    |
|               | đúng cho quantitative trong heatmap vì kích     |
|               | thước ô đồng đều loại bỏ bias từ Area.          |
+---------------+-------------------------------------------------+
| Scale         | Key: 12 (tháng) × 3 (nhóm) = 36 ô\              |
|               | Bin: 3 (Short ≤3, Medium 4--7, Long \>7 đêm)    |
+===============+=================================================+

![](media/media/image1.png){width="6.0in" height="1.0232556867891514in"}

Hình 8.2. Heatmap tỷ lệ lấp đầy theo tháng và nhóm minimum nights

B. Đánh giá biểu đồ

1\. Nguyên lý biểu đạt (Expressiveness):

- Thuộc tính: Tháng / Month (O), Nhóm đêm tối thiểu / Minimum Nights
  Group (C -- derived: Short ≤3 / Medium 4--7 / Long \>7), Tỷ lệ lấp đầy
  / Occupancy Rate Pct (Q -- Color Luminance).

- Channel:

  - PosX (Month -- O): trục thời gian theo thứ tự → đúng.

  - PosY (Minimum Nights Group -- C): phân loại chính sách → đúng.
    Spatial region cho categorical.

  - Color (Luminance/Sequential): thể hiện độ lớn occupancy (Q) → phù
    hợp. Sequential colormap (nhạt→đậm) đúng cho quantitative attribute
    có hướng sequential.

- Đánh giá mức độ quan trọng:

  - Ưu tiên 1 - Vị trí ngang (PosX --- chiều thời gian Ordinal): PosX mã
    hóa Month (Ordinal --- tháng 1 đến 12) dọc theo trục ngang của ma
    trận heatmap. Đây là kênh quan trọng nhất vì chiều thời gian là trục
    phân tích chính của task (seasonality). Theo Mackinlay, Position là
    kênh mạnh nhất cho dữ liệu thứ tự (Ordinal), đảm bảo thứ tự tháng
    được duy trì chính xác và người xem có thể theo dõi sự thay đổi của
    occupancy theo thời gian một cách tự nhiên từ trái sang phải --- phù
    hợp với convention đọc phương Tây và nhận thức thời gian tuyến tính.

  - Ưu tiên 2 - Vị trí dọc (PosY --- Spatial Region cho Categorical):
    PosY mã hóa Minimum Nights Group (Categorical --- Short/Medium/Long
    stay) theo hàng của ma trận. Đây là kênh quan trọng thứ hai vì nó
    xác định chiều so sánh thứ hai của biểu đồ: người xem so sánh giữa
    các chính sách minimum nights theo trục dọc. Theo Mackinlay, Spatial
    Region (phân vùng không gian) phù hợp cho dữ liệu danh mục --- mỗi
    hàng heatmap đóng vai trò như một spatial region riêng biệt, phân
    tách rõ ràng ba nhóm chính sách mà không cần dùng màu sắc (vốn đã
    được dùng cho kênh thứ ba).

  - Ưu tiên 3 - Độ sáng màu sắc (Color Luminance / Sequential): Color
    Luminance mã hóa Occupancy Rate (Quantitative) thông qua thang màu
    tuần tự (nhạt → đậm). Theo Mackinlay, Color Luminance không phải
    kênh tối ưu nhất cho dữ liệu định lượng về độ chính xác tuyệt đối
    (kém hơn Position hay Length), nhưng trong heatmap --- nơi cả PosX
    và PosY đã được dùng để mã hóa hai biến phân loại/thứ tự --- đây là
    kênh duy nhất khả dụng để mã hóa giá trị định lượng thứ ba trong
    không gian hai chiều. Color Luminance phù hợp để phát hiện pattern
    (nhận biết ô đậm/nhạt) và so sánh tương đối giữa các ô, phục vụ đúng
    mục tiêu discover của heatmap. Kích thước ô đồng đều (square) loại
    bỏ nhiễu từ kênh Area, giúp người xem chỉ tập trung vào màu sắc.

- Kết luận: Heatmap là idiom phù hợp nhất khi cần phân tích 3 biến (2
  keys + 1 value) trong cấu trúc ma trận.

2\. Nguyên lý hiệu quả (Effectiveness):

- Độ chính xác (Accuracy): Color (Luminance) --- accuracy thấp hơn
  Position, khó ước lượng chính xác % chênh lệch. Tuy nhiên mục tiêu là
  phát hiện pattern (cao/thấp), không phải đọc giá trị chính xác ---
  trade-off chấp nhận được.

- Khả năng phân biệt (Discriminability): 36 ô vuông đều nhau. Sequential
  palette giúp phân biệt \~5--7 cấp độ màu.

- Khả năng tách biệt (Separability): PosX, PosY và Color kết hợp tốt.
  Area đồng đều không tạo bias về kích thước.

C. Phân tích biểu đồ (Insight)

- Short minimum stay (≤3 đêm) có occupancy cao và ổn định quanh năm ---
  chính sách linh hoạt thu hút nhiều khách nhất, đặc biệt trong mùa thấp
  điểm.

- Long minimum stay (\>7 đêm) có occupancy thấp hơn trong phần lớn các
  tháng, nhưng tăng vào cuối năm --- phù hợp cho khách công tác dài hạn.

- Tháng 11--12 có màu đậm nhất ở hầu hết các nhóm --- xác nhận high
  season với nhu cầu cao bất kể chính sách minimum nights.

- Khuyến nghị cho host: Tháng 1--4 nên chuyển sang Short minimum stay;
  tháng 11--12 có thể giữ Medium/Long stay vì cầu cao tự nhiên bù đắp
  tính hạn chế của chính sách.

### 9. Domain Task 9: Phân tích danh mục chủ nhà(Host Portfolio Analysis)

Câu hỏi nghiệp vụ: Nhóm chủ nhà cá nhân và chủ nhà chuyên nghiệp có cơ
cấu phân bố như thế nào, và có sự chênh lệch ra sao về hiệu suất kinh
doanh (điểm đánh giá, tỷ lệ lấp đầy)?

Mục đích: Đánh giá mức độ thương mại hóa của thị trường Airbnb NYC và so
sánh lợi thế cạnh tranh giữa mô hình kinh doanh cá thể so với tổ
chức/chuỗi phòng.

#### 9.1. Biểu đồ 1: Tỉ trọng cơ cấu loại chủ nhà(Pie Chart)

A. Thiết kế Idiom

+-------+-----------------------------------------------------------+
| Đặc   | Chi tiết                                                  |
| điểm  |                                                           |
+-------+-----------------------------------------------------------+
| Idiom | Pie Chart(Biểu đồ tròn)                                   |
+-------+-----------------------------------------------------------+
| What  | Loại chủ nhà(Host Type):C, Tỷ trọng đóng góp(% of         |
|       | count):Q                                                  |
+-------+-----------------------------------------------------------+
| Why   | produce (derive) → explore → summarize                    |
|       |                                                           |
|       | Derive: phân loại chủ nhà dựa trên số lượng listing sở    |
|       | hữu(1 phòng = Cá nhân, \> 1 phòng = Chuyên nghiệp)        |
|       |                                                           |
|       | Explore và Summarize : xem nhóm nào đang chiếm ưu thế     |
|       | kiểm soát nguồn cung trên thị trường                      |
|       |                                                           |
|       | \-                                                        |
+-------+-----------------------------------------------------------+
| How   | Encode:                                                   |
|       |                                                           |
|       | \- Mark: Area (vùng góc quạt)                             |
|       |                                                           |
|       | \- Channel: Angle: Độ lớn của tỷ trọng phần trăm(0%-100%) |
|       |                                                           |
|       | \+ Color : Phân biệt 2 nhóm chủ nhà                       |
|       |                                                           |
|       | Manipulate:                                               |
|       |                                                           |
|       | \- Hover + Tooltip: Rê chuột vào từng phần quạt để xem    |
|       | chi tiết tên nhóm và tỷ lệ% chính xác                     |
|       |                                                           |
|       | Reduce:                                                   |
|       |                                                           |
|       | \- Không áp dụng                                          |
+-------+-----------------------------------------------------------+
| Scale | \- Main key: 2(Cá nhân, Chuyên nghiệp)                    |
|       |                                                           |
|       | \- Value range: 0%-100%                                   |
+=======+===========================================================+

![](media/media/image16.png){width="6.267716535433071in"
height="4.597222222222222in"}

Hình 9.1 Biểu đồ tỉ trọng cơ cấu loại chủ nhà

B. Đánh giá biểu đồ

1\. Nguyên lý biểu đạt (Expressiveness):

- Thuộc tính: Loại chủ nhà(C), Tỷ trọng(Q)

- Channel:

  - Angle: Thể hiện tỉ lệ phần trăm -\> dùng cho thuộc tính Q mang tính
    part-to-whole

  - Color (Hue): Phân loại chủ nhà -\> dùng cho thuộc tính
    Categorical(C)

- Đánh giá mức độ quan trọng:

  - Ưu tiên 1 - Góc (Angle): Trong biểu đồ tròn, thuộc tính định lượng
    (Tỷ trọng %) được ưu tiên hàng đầu để thấy được độ lớn thị phần.
    Theo Mackinlay, kênh Angle nằm ở mức khá cho dữ liệu (Q) và là chuẩn
    mực cho cấu trúc part-to-whole (thành phần trên tổng thể).

  - Ưu tiên 2 - Màu sắc (Hue Color): Thuộc tính phân loại (Loại chủ
    nhà - C) được gán vào kênh Hue. Theo Mackinlay, Hue là kênh mạnh
    nhất để biểu diễn dữ liệu Categorical, giúp mắt người phân định ngay
    lập tức 2 nhóm mà không cần đọc text.

2\. Nguyên lý hiệu quả (Effectiveness):

- Độ chính xác (Accuracy): \* Kênh Area/Angle có độ chính xác không cao.

  - Việc ước lượng định lượng thông qua Góc/Diện tích có n xấp xỉ 0.7,
    độ lỗi Log_error khá lớn. Mắt người khó so sánh chuẩn xác nếu 2 phần
    quạt có kích thường gần bằng nhau.Tuy nhiên, ở dây mức chênh lệch
    khá rõ(62.69% và 37.31%), kết hợp thao tác Manipulate(Hover xem
    Tooltip) đã bù đắp hoàn toàn nhược điểm này

- Khả năng phân biệt (Discriminability): \* Biểu đồ sử dụng 2 màu tương
  phản(Xanh/Cam). Số lượng phần loại \<7 nên nhận thức màu hoàn toàn
  không bị ảnh hưởng, rất dễ phân biệt bằng mắt thường.

- Khả năng tách biệt (Separability):

  - Kênh góc(Angle) và kênh màu sắc(Color) tách biệt hoàn toàn, không
    gây nhiễu cho nhau trong quá trình cảm nhận

C. Phân tích biểu đồ (Insight)

- Thị trường Airbnb NYC mang tính thương mại hóa cao khi các chủ nhà
  "Chuyên nghiệp"(sở hữu \>1 phòng) áp đảo nguồn cung với 62.69% thị
  phần

- Chủ nhà "Cá nhân"(Kinh doanh phòng lẻ) chỉ chiếm phần nhỏ với 37.31%.

#### 9.2. Biểu đồ 2: So sánh hiệu suất kinh doanh theo loại chủ nhà nhà(Bar chart)

A. Idiom

+------------+-----------------------------------------------------+
| Đặc điểm   | Chi tiết                                            |
+------------+-----------------------------------------------------+
| Idiom      | Bar chart                                           |
+------------+-----------------------------------------------------+
| What       | Loại chủ nhà(Host Type): C, Điểm đánh giá(Avg       |
|            | Rating): Q, Tỷ lệ lấp đầy(Avg Is Booked):Q          |
+------------+-----------------------------------------------------+
| Why        | produce(derive)-\> lookup-\>compare                 |
|            |                                                     |
|            | derive: tính trung bình cho Rating và tỉ lệ lấp đầy |
|            |                                                     |
|            | Compare: trực diện chất lượng dịch vụ và khả năng   |
|            | thu hút khách hàng giữa 2 nhóm chủ nhà              |
+------------+-----------------------------------------------------+
| How        | Encode:                                             |
|            |                                                     |
|            | \- Mark: Line(Bar mark)                             |
|            |                                                     |
|            | \- Channel:                                         |
|            |                                                     |
|            | - PosX: Phân biệt 2 loại chủ nhà                    |
|            |                                                     |
|            | - PosY: thể hiện độ lớn của AvgRating/Avg Is Booked |
|            |                                                     |
|            | - Hue Color: Phân biệt loại chủ nhà                 |
|            |                                                     |
|            | Manipulate:                                         |
|            |                                                     |
|            | -Hover + Tooltip: Xem chi tiết các con số           |
|            |                                                     |
|            | -Facet(Juxtapose): tách thành 2 biểu đồ xếp dọc     |
|            | nhau(1 cho rating, 1 cho IsBooked) dùng chung trục  |
|            | X để dễ đối chiếu                                   |
+------------+-----------------------------------------------------+
| Scale      | \- Main key: 2(Loại chủ nhà)                        |
+============+=====================================================+

![](media/media/image14.png){width="6.267716535433071in"
height="4.597222222222222in"}

Hình 9.2 Biểu đồ so sánh hiệu suất kinh doanh theo loại chủ nhà

B. Đánh giá biểu đồ

1\. Nguyên lý biểu đạt:

- Thuộc tính: Loại chủ nhà(C), các chỉ số hiệu suất(Q)

- Channel:

  - PosX: Định vị nhóm -\> dùng hoc thuộc tính (C)

  - PosY: Chiều dài cột -\> dùng hco thuộc tính định lượng(Q)

  - Color (Hue): Nhấn mạnh sự phân loại -\> dùng cho thuộc tính(C)

- Đánh giá mức độ quan trọng:

  - Ưu tiên 1 - Chiều dài (PosY / Length): Hiệu suất kinh doanh (Q) là
    thông tin cốt lõi nhất cần so sánh. Theo Mackinlay, Position/Length
    trên một trục chung là kênh mạnh nhất, chính xác tuyệt đối nhất cho
    dữ liệu (Q).

  - Ưu tiên 2 - Vị trí không gian (PosX): Dùng để chia tách 2 loại chủ
    nhà (C). Kênh Position cũng là kênh mạnh nhất cho dữ liệu định danh
    (Categorical).

  - Ưu tiên 3 - Màu sắc (Hue Color): Việc dùng Hue để tô màu cho các cột
    là một dạng mã hóa lặp (Redundant Encoding). Tuy không bắt buộc do
    đã có PosX phân tách, nhưng nó đóng vai trò liên kết thị giác (nhấn
    mạnh Xanh = Cá nhân, Cam = Chuyên nghiệp) xuyên suốt từ biểu đồ 9.1
    sang.

2\. Nguyên lý hiệu quả:

- Độ chính xác (Accuracy):

  - Trục PosY biểu diễn thông qua chiều dài (Length) bám sát gốc 0. Theo
    định luật Stevens, Length có \$n = 1.0\$, do đó mắt người cảm nhận
    cực kỳ chính xác. Độ lỗi Log_error rất thấp.

- Khả năng phân biệt (Discriminability): \* 2 cột đứng cạnh nhau với 2
  màu tương phản mạnh(Xanh/Cam) giúp mắt người đọc ngay lập tực nhận ra
  bên nào cao hơn mà không cần suy nghĩ

- Khả năng tách biệt (Separability):

  - Sử dụng Facet(Juxtapose) giải quuyeest việc tách biệt 2 hệ đo lượng
    khác nhau(Rating thang 5, IsBooked là tỷ lệ %)=\> không xảy ra hiện
    tượng nhiễu trục

C. Phân tích biểu đồ (Insight)

- Dù yếu thế về số lượng nguồn cung, chủ nhà "Cá nhân"(màu xanh) lại
  mang đến trải nghiệm tốt hơn so với nhóm chuyên nghiệp

- Hệ quả là tỷ lệ lấp đầy của chủ nhà"Cá nhân" cũng cao hơn nhóm chuyên
  nghiệp. Điều này chứng minh khách hàng đề cao tính cá nhân hóa, sự
  thân thiện của các cá thể hơn là dịch vụ rập khuôn của các tổ chức

### 10. Domain Task 10: Trải nghiệm khách hàng thông qua Khai phá văn bản

Câu hỏi nghiệp vụ: Khách hàng thường đề cập đến những từ khóa nào nhất?
Những yếu tố cốt lõi nào tạo nên sự hài lòng(Điểm cao) và yếu tố nào dẫn
đến sự phàn nàn(Điểm thấp)?

Mục đích: Ứng dụng Khai phá văn bản(NLP)để lượng hóa cảm xúc từ bình
luận, giúp chủ nhà/ nền tảng biết chính xác các điểm cần tối ưu

#### 10.1. Biểu đồ 1: Đám mây từ vựng trải nghiệm(Word Cloud)

A. Thiết kế Idiom

+-------+-----------------------------------------------------------+
| Đặc   | Chi tiết                                                  |
| điểm  |                                                           |
+-------+-----------------------------------------------------------+
| Idiom | Word Cloud(Đám mây từ vựng)                               |
+-------+-----------------------------------------------------------+
| What  | Từ khóa(Keyword):C, Tần suất xuất hiện(Count):Q           |
+-------+-----------------------------------------------------------+
| Why   | produce (derive) -\>explore-\>summarize                   |
|       |                                                           |
|       | \- Dẫn xuất (derive): bóc tách văn bản loại bỏ stopwords  |
|       | để lấy ra các unigram/bigram(1-2) từ có ý nghĩa           |
|       |                                                           |
|       | \- Explore Khám phá nhanh và tóm tắt(summarize) các chủ   |
|       | đề/ ngữ cảnh lưu trú được thảo luận nhiều nhất            |
+-------+-----------------------------------------------------------+
| How   | Encode:                                                   |
|       |                                                           |
|       | \- Mark:Text(Chữ viết)                                    |
|       |                                                           |
|       | \- Channel:                                               |
|       |                                                           |
|       | +Size(Kích thước chữ): Tỷ lệ thuận với tần suất đếm được  |
|       |                                                           |
|       | +Color: Biểu diễn độ lớn của Tần suất (Q) (chữ càng đậm = |
|       | xuất hiện càng nhiều).                                    |
|       |                                                           |
|       | Reduce:                                                   |
|       |                                                           |
|       | \- Filter: Áp dụng tập stopwwords mở rộng để loại bỏ các  |
|       | từ vô nghĩa                                               |
+-------+-----------------------------------------------------------+
| Scale | \- Main key: Top các từ khóa xuất hiện nhiều nhất         |
+=======+===========================================================+

![](media/media/image6.png){width="6.267716535433071in"
height="3.3194444444444446in"}

Hình 10.1 Biểu đồ đám mây từ vựng trải nghiệm của khách hàng

B. Đánh giá biểu đồ

1\. Nguyên lý biểu đạt (Expressiveness):

- Thuộc tính: Keyword(C), Count(Q)

- Channel: Sử dụng Mark là Text để trực tiếp hiển thị thuộc tính Keyword
  (C). Sử dụng Channel Kích thước (Size) và Channel Độ đậm nhạt (Color
  Luminance) để cùng biểu diễn độ lớn định lượng (Q).

- Đánh giá mức độ quan trọng:

  - Ưu tiên 1 - Kích thước (Size/Area): Thuộc tính định lượng (Tần suất
    xuất hiện - Q) được gán vào Size. Theo Mackinlay, Area/Size là kênh
    yếu đối với dữ liệu (Q), nhưng trong đặc thù của Word Cloud, nó là
    yếu tố duy nhất tạo ra hiệu ứng nổi bật cho các từ khóa chính.

  - Ưu tiên 2 - Độ đậm nhạt màu (Color Luminance): Vì kênh Size bị ảnh
    hưởng bởi độ dài của text (chữ dài trông to hơn chữ ngắn dù cùng tần
    suất), kênh Color Luminance được bổ sung để biểu diễn Tần suất (Q).
    Theo Mackinlay, Luminance tuy xếp hạng thấp cho (Q) nhưng ở đây nó
    hỗ trợ đắc lực cho kênh Size: Từ nào vừa to vừa đậm (như stay,
    clean, great) chắc chắn là từ phổ biến nhất.

2\. Nguyên lý hiệu quả (Effectiveness):

- Độ chính xác (Accuracy): Kênh Area/Size có độ chính xác rất thấp. Mắt
  người có xu hướng ước lượng sai lệch diện tích của chữ cái, bị nhiễu
  bởi độ dài của từ (ví dụ chữ \"recommendation\" tự nhiên trông to hơn
  chữ \"nice\" dù cùng count). Log_error rất lớn, không phù hợp để so
  sánh định lượng khắt khe

- Khả năng phân biệt (Discriminability):Biểu đồ có hiện tượng lộn xộn
  (clutter). Chỉ nổi bật được vài từ vựng lớn nhất ở trung tâm, các từ
  nhỏ xung quanh rất khó đọc và khó phân biệt cấp độ.

- Khả năng tách biệt (Separability): Kênh vị trí (Pos) và kênh màu sắc
  (Color) tách biệt hoàn toàn. Việc các điểm nằm ở vị trí cao/thấp không
  làm ảnh hưởng đến khả năng nhận diện màu sắc của quận đó.

C. Phân tích biểu đồ (Insight)

- Nhìn tổng quan, trải nghiệm của khách hàng xoay quanh 3 trụ cột chính:
  Vị trí (location, subway, close), Không gian (clean, comfortable,
  apartment) và Chủ nhà (host, responsive, helpful).

#### 10.2. Biểu đồ 2: Tỷ lệ lấp đầy của các quận theo tháng (Heatmap)

A. Idiom

+--------+-------------------------------------------------------+
| Đặc    | Chi tiết                                              |
| điểm   |                                                       |
+--------+-------------------------------------------------------+
| Idiom  | Diverging Bar Chart (Biểu đồ thanh phân kỳ)           |
+--------+-------------------------------------------------------+
| What   | Từ khóa thuộc Whitelist (Keyword): C, Nhóm đánh giá   |
|        | (Dominant Group): C, Độ lệch đặc trưng (Strength /    |
|        | Log-Odds Ratio): Q                                    |
+--------+-------------------------------------------------------+
| Why    | produce(derive)-\>locate0\>compare                    |
|        |                                                       |
|        | Derive:Tính toán chỉ số toán học Strength (Log-Odds   |
|        | Ratio) để đo lường mức độ đặc trưng của cụm từ thuộc  |
|        | về nhóm Điểm Cao hay Điểm Thấp (loại bỏ nhiễu do mất  |
|        | cân bằng dữ liệu lượng review)                        |
|        |                                                       |
|        | Xác định (locate) chính xác các yếu tố khiến khách    |
|        | ghét và yếu tố khiến khách khen để so sánh (compare)  |
|        | mức độ nghiêm trọng.                                  |
+--------+-------------------------------------------------------+
| How    | Mark: Line(bar mark)                                  |
|        |                                                       |
|        | Channel:                                              |
|        |                                                       |
|        | \- PosX: Trục X phân kỳ ở giữa(0). Đâm sang phải      |
|        | (Dương) thể hiện sự Hài lòng. Đâm sang trái (Âm) thể  |
|        | hiện sự Phàn nàn                                      |
|        |                                                       |
|        | \- PosY: Danh sách từ khóa                            |
|        |                                                       |
|        | \- Color :Phân biệt Nhóm Đánh giá (Xanh = Hài lòng,   |
|        | Cam = Phàn nàn).                                      |
|        |                                                       |
|        | Reduce:                                               |
|        |                                                       |
|        | \- Filter: Áp dụng Whitelist để chỉ giữ lại các       |
|        | n-grams thực sự mang ý nghĩa Insight (loại bỏ tên     |
|        | riêng, địa danh).                                     |
|        |                                                       |
|        | \- Sort: Sắp xếp giảm dần theo chỉ số Strength trên   |
|        | trục Y.                                               |
+========+=======================================================+

![](media/media/image15.png){width="6.267716535433071in" height="3.0in"}

Hình 10.2 Biểu đồ yếu tố thúc đầy sự hài lòng và phàn nàn

B. Đánh giá biểu đồ

1\. Nguyên lý biểu đạt:

- Thuộc tính: Keyword (C), Nhóm (C), Strength (Q).

- Channel:

  - PosX: Đâm về 2 hướng -\> Biểu đạt tính chất đối lập (Dương/Âm) của
    chỉ số Log-Odds.

  - PosY:

  - Color : Xanh/Cam -\> Mang tính ngữ nghĩa cảm xúc rất chuẩn xác.

- Đánh giá mức độ quan trọng:

  - Ưu tiên 1 - Chiều dài và Hướng (PosX / Length): Trọng tâm của biểu
    đồ là độ lệch Strength (Q). Theo Mackinlay, việc gán (Q) vào kênh
    Position/Length trên thang đo chung là lựa chọn số 1 về độ chính
    xác. Trục giữa (0) phân kỳ ra 2 bên làm tăng khả năng biểu đạt tính
    đối lập.

  - Ưu tiên 2 - Màu sắc (Hue Color): Thuộc tính nhóm đánh giá (Hài
    lòng/Phàn nàn - C) được gán cho kênh Hue. Phù hợp hoàn hảo với định
    luật Mackinlay cho dữ liệu Categorical, đồng thời mang ý nghĩa cảnh
    báo về mặt cảm xúc.

  - Ưu tiên 3 - Vị trí dọc (PosY): Dùng để xếp hạng các từ khóa Keyword
    (C).

2\. Nguyên lý hiệu quả:

- Độ chính xác (Accuracy): \* Việc áp dụng thuật toán NLP(Log-Odds cơ
  số 2) thay vì đếm Count thông thường đã giải quyết triệt để sự chênh
  lệch giữa lượng reivew tốt và xấu.Chiều dài cột(Length) tuân thủ định
  luật Stevens( n=1.0), cung cấp độ chính xác, Log_error vô cùng thấp

- Khả năng phân biệt (Discriminability): \* Cực kỳ cao. Trục Diverging
  chẻ làm 2 phía trái/phải kết hợp màu Xanh (an toàn) và Cam (cảnh báo)
  giúp não bộ người xem phân loại rạch ròi vùng Khen và vùng Chê ngay
  lập tức mà không gặp trở ngại nào.

- Khả năng tách biệt (Separability): \* Kênh PosX, PosY và Hue Color kết
  hợp đồng nhất, tách biệt hoàn hảo, tối ưu hóa quá trình nhận thức thị
  giác.

C. Phân tích biểu đồ (Insight)

- Yếu tố tạo sự Hài lòng ( màu Xanh): Khách hàng bị chinh phục hoàn toàn
  bởi tính thẩm mỹ và vệ sinh tuyệt đối (các từ khóa đứng đầu là
  \"beautifully decorated\", \"immaculate\", \"gorgeous\"). Các dịch vụ
  gia tăng như \"stocked kitchen\" hay \"warm welcome\" là chìa khóa
  giúp chủ nhà đạt điểm tuyệt đối.

- Yếu tố gây Phàn nàn ( màu Cam): Biểu đồ phơi bày các yếu tố khiến điểm
  số sụt giảm. Tiêu biểu nhất là các vấn đề chi phí ẩn (\"hidden fees\",
  \"security deposit\"). Kế đến là thái độ dịch vụ (\"terrible
  experience\", \"unresponsive\", \"scam\", \"refused\") và tệ nhất là
  vấn đề môi trường phòng (\"infestation\", \"smelly\", \"cigarette\").
  Khuyến nghị chủ nhà cần minh bạch về giá cả và khử mùi/côn trùng lập
  tức.

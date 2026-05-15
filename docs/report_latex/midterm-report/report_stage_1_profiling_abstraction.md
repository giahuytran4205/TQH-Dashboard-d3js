

| ĐẠI HỌC QUỐC GIA THÀNH PHỐ HỒ CHÍ MINH TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN  *KHOA CÔNG NGHỆ THÔNG TIN*   ![][hcmus-logo.png] Môn học: Trực quan hóa dữ liệu Lớp: 23HTTT2  BÁO CÁO ĐỒ ÁN LÝ THUYẾT Data Profiling & Data Abstraction & Task Abstraction Giáo viên hướng dẫn Tiết Gia Hồng Nguyễn Trường Sơn Phạm Minh Tú —o0o— Sinh viên                                                 23127001 \- Nguyễn Lê Quan Anh   23127006 \- Trần Nguyễn Khải Luân                                                 23127011 \- Lê Anh Duy                                                 23127179 \- Nguyễn Bảo Duy                                                 23127199 \- Trần Gia Huy Thành phố Hồ Chí Minh, tháng 3 năm 2026 |
| ----- |

# **MỤC LỤC**

**[DATA PROFILING	6](#data-profiling)**

[1\. Mục tiêu và phạm vi	6](#1.-mục-tiêu-và-phạm-vi)

[1.1 Quy ước chung	6](#1.1-quy-ước-chung)

[2\. Phiên bản dữ liệu (raw → selected → clean)	6](#2.-phiên-bản-dữ-liệu-\(raw-→-selected-→-clean\))

[3\. Profiling và chất lượng dữ liệu (tổng quan)	7](#3.-profiling-và-chất-lượng-dữ-liệu-\(tổng-quan\))

[3.1 Quy mô dữ liệu ban đầu	7](#3.1-quy-mô-dữ-liệu-ban-đầu)

[3.2 Vấn đề chất lượng quan trọng và tác động phân tích	7](#3.2-vấn-đề-chất-lượng-quan-trọng-và-tác-động-phân-tích)

[3.3 Mức sẵn sàng của dữ liệu không gian (GeoJSON)	7](#3.3-mức-sẵn-sàng-của-dữ-liệu-không-gian-\(geojson\))

[4\. Quy trình làm sạch dữ liệu	8](#4.-quy-trình-làm-sạch-dữ-liệu)

[5\. Tóm tắt dữ liệu sau làm sạch	8](#5.-tóm-tắt-dữ-liệu-sau-làm-sạch)

[5.1 Quy mô sau làm sạch	8](#5.1-quy-mô-sau-làm-sạch)

[5.2 Thuộc tính trọng yếu được giữ	8](#5.2-thuộc-tính-trọng-yếu-được-giữ)

[6\. Kết luận profiling	9](#6.-kết-luận-profiling)

[6.1 Dữ liệu khả dụng cho phân tích	9](#6.1-dữ-liệu-khả-dụng-cho-phân-tích)

[6.2 Liên kết chất lượng dữ liệu \-\> quyết định phân tích	9](#6.2-liên-kết-chất-lượng-dữ-liệu--\>-quyết-định-phân-tích)

[6.3 Kết luận phạm vi bài toán	9](#6.3-kết-luận-phạm-vi-bài-toán)

[**DATA ABSTRACTION	10**](#data-abstraction)

[1\. Dataset Abstraction	10](#1.-dataset-abstraction)

[2\. Attribute Abstraction	10](#2.-attribute-abstraction)

[2.1 Thuộc tính – listings\_clean	10](#2.1-thuộc-tính-–-listings_clean)

[2.2 Thuộc tính – calendar\_clean	11](#2.2-thuộc-tính-–-calendar_clean)

[2.3 Thuộc tính – reviews\_clean	12](#2.3-thuộc-tính-–-reviews_clean)

[2.4 Thuộc tính – neighbourhoods.geojson	12](#2.4-thuộc-tính-–-neighbourhoods.geojson)

[3\. Data Relationship & Structure	13](#3.-data-relationship-&-structure)

[3.1 Cardinality	13](#3.1-cardinality)

[3.2 Spatial Join	13](#3.2-spatial-join)

[3.3 Hierarchical Attributes	13](#3.3-hierarchical-attributes)

[4\. Derived Attributes	13](#4.-derived-attributes)

[5\. Data Abstraction Summary	13](#5.-data-abstraction-summary)

[**TASK ABSTRACTION	15**](#task-abstraction)

[1\. Domain Tasks (User Stories)	15](#1.-domain-tasks-\(user-stories\))

[Task 1 – Thị trường & phân bố	15](#task-1-–-thị-trường-&-phân-bố)

[Task 2 – Phân tích tỷ lệ lấp đầy theo thời gian	15](#task-2-–-phân-tích-tỷ-lệ-lấp-đầy-theo-thời-gian)

[Task 3 – Cấu trúc nguồn cung và sức chứa	15](#task-3-–-cấu-trúc-nguồn-cung-và-sức-chứa)

[Task 4  – Chỉ số chất lượng và đánh giá khách hàng	15](#task-4-–-chỉ-số-chất-lượng-và-đánh-giá-khách-hàng)

[Task 5 – Phân bố mức giá theo khu vực	15](#task-5-–-phân-bố-mức-giá-theo-khu-vực)

[Task 6 – Bản đồ Giá Bất thường & Giá trị Thực	16](#task-6-–-bản-đồ-giá-bất-thường-&-giá-trị-thực)

[Task 7 – Hiệu quả Chi phí lưu trú	16](#task-7-–-hiệu-quả-chi-phí-lưu-trú)

[Task 8 – Phân tích Mùa vụ và Cơ hội Đặt phòng	16](#task-8-–-phân-tích-mùa-vụ-và-cơ-hội-đặt-phòng)

[Task 9 – Phân tích Danh mục Chủ nhà	16](#task-9-–-phân-tích-danh-mục-chủ-nhà)

[Task 10 – Trải nghiệm khách hàng	16](#task-10-–-trải-nghiệm-khách-hàng)

[2\. Task Abstraction	17](#2.-task-abstraction)

[2.1 Domain Task 1 – Thị trường và phân bố	17](#2.1-domain-task-1-–-thị-trường-và-phân-bố)

[Analyze	17](#analyze)

[Search	17](#search)

[Query	17](#query)

[Summary	17](#summary)

[2.2 Domain Task 2 – Phân tích tỷ lệ lấp đầy theo thời gian	17](#2.2-domain-task-2-–-phân-tích-tỷ-lệ-lấp-đầy-theo-thời-gian)

[Analyze	17](#analyze-1)

[Search	17](#search-1)

[Query	17](#query-1)

[Summary	17](#summary-1)

[2.3 Domain Task 3 – Cấu trúc nguồn cung và sức chứa	17](#2.3-domain-task-3-–-cấu-trúc-nguồn-cung-và-sức-chứa)

[Analyze	17](#analyze-2)

[Search	18](#search-2)

[Query	18](#query-2)

[Summary	18](#summary-2)

[2.4 Domain Task 4 – Chỉ số chất lượng và đánh giá khách hàng	18](#2.4-domain-task-4-–-chỉ-số-chất-lượng-và-đánh-giá-khách-hàng)

[Analyze	18](#analyze-3)

[Search	18](#search-3)

[Query	18](#query-3)

[Summary	19](#summary-3)

[2.5 Domain Task 5– Phân bố giá theo khu vực	19](#2.5-domain-task-5–-phân-bố-giá-theo-khu-vực)

[2.6 Domain Task 6 – Bản đồ giá bất thường và giá trị thực	19](#2.6-domain-task-6-–-bản-đồ-giá-bất-thường-và-giá-trị-thực)

[2.7 Domain Task 7 – Hiệu quả chi phí lưu trú	20](#2.7-domain-task-7-–-hiệu-quả-chi-phí-lưu-trú)

[2.8 Domain Task 8 – Phân tích mùa vụ và cơ hội đặt phòng	20](#2.8-domain-task-8-–-phân-tích-mùa-vụ-và-cơ-hội-đặt-phòng)

[2.9 Domain Task 9 – Phân tích danh mục chủ nhà	21](#2.9-domain-task-9-–-phân-tích-danh-mục-chủ-nhà)

[2.10 Domain Task 10 – Trải nghiệm khách hàng	21](#2.10-domain-task-10-–-trải-nghiệm-khách-hàng)

[**Appendix \- Bảng Profiling Chi Tiết	22**](#appendix---bảng-profiling-chi-tiết)

[A.1 Bảng kiểm tra tính hợp lệ (regex/rule)	22](#a.1-bảng-kiểm-tra-tính-hợp-lệ-\(regex/rule\))

[A.2 Bảng thống kê mô tả số (raw selected)	22](#a.2-bảng-thống-kê-mô-tả-số-\(raw-selected\))

[A.3 Bảng hai chiều theo từng thuộc tính (raw)	23](#a.3-bảng-hai-chiều-theo-từng-thuộc-tính-\(raw\))

[A.4 Bảng mẫu định dạng phổ biến (top patterns)	24](#a.4-bảng-mẫu-định-dạng-phổ-biến-\(top-patterns\))

[A.5 Bảng hồ sơ ngoại lệ (IQR)	24](#a.5-bảng-hồ-sơ-ngoại-lệ-\(iqr\))

[A.6 Bảng phân tích giá trị thiếu	24](#a.6-bảng-phân-tích-giá-trị-thiếu)

[A.7 Bảng ví dụ bản ghi lỗi minimum\_nights \> maximum\_nights	25](#a.7-bảng-ví-dụ-bản-ghi-lỗi-minimum_nights-\>-maximum_nights)

[A.8 Bảng quyết định làm sạch (cleaning decision)	25](#a.8-bảng-quyết-định-làm-sạch-\(cleaning-decision\))

[A.9 Bảng tổng quan chỉ số của file GeoJSON	26](#a.9-bảng-tổng-quan-chỉ-số-của-file-geojson)

[A.10 Bảng kiểm tra tọa độ và bbox	27](#a.10-bảng-kiểm-tra-tọa-độ-và-bbox)

[A.11 Bảng coverage join theo neighbourhood	27](#a.11-bảng-coverage-join-theo-neighbourhood)

[A.12 Bảng quy mô giảm sau làm sạch	27](#a.12-bảng-quy-mô-giảm-sau-làm-sạch)

[A.13 Bảng toàn vẹn khóa sau làm sạch	28](#a.13-bảng-toàn-vẹn-khóa-sau-làm-sạch)

[A.14 Bảng occupancy theo tháng	28](#a.14-bảng-occupancy-theo-tháng)

[A.15 Phân loại toàn bộ 28 thuộc tính được phân tích	28](#a.15-phân-loại-toàn-bộ-28-thuộc-tính-được-phân-tích)

# 

# **DATA PROFILING** {#data-profiling}

## **1\. Mục tiêu và phạm vi** {#1.-mục-tiêu-và-phạm-vi}

- **Dữ liệu đầu vào gồm 4 nguồn:** listings, calendar, reviews, neighbourhoods.geojson.  
- **Mục tiêu nghiệp vụ**:  
  - Task 1: Phân tích tổng quan thị trường và không gian (Market Overview & Spatial Distribution).  
  - Task 2: Phân tích xu hướng theo thời gian (Temporal Trends).  
- **Trọng tâm báo cáo**: Nêu rõ logic đánh giá dữ liệu (profiling) → định hướng làm sạch → cấu trúc dữ liệu để vẽ biểu đồ.

### **1.1 Quy ước chung** {#1.1-quy-ước-chung}

Để bài toán dễ theo dõi, thay vì dùng toàn bộ hàng chục cột dữ liệu gốc, chúng ta chỉ lấy ra các cột thật sự mang ý nghĩa:

- **Với Task 1 (Thị trường & Không gian):** Cần trả lời câu hỏi “Bán loại phòng gì, ở đâu, giá bao nhiêu?”. Do đó, price (giá) là thước đo chính, room\_type (loại phòng) để phân nhóm, còn neighbourhood (khu vực) và latitude/longitude (tọa độ) dùng để chấm lên bản đồ.  
- **Với Task 2 (Xu hướng thời gian):** Lẽ ra ta sẽ xem giá thay đổi thế nào qua các tháng. Tuy nhiên, vì phát hiện cột giá theo ngày (calendar.price) bị bỏ trống 100%, nên ta đổi sang quan sát tỷ lệ cư trú. Hai cột date và available (trạng thái phòng) trở thành cốt lõi để vẽ nên biểu đồ mùa vụ.

## 2\. Phiên bản dữ liệu (raw → selected → clean) {#2.-phiên-bản-dữ-liệu-(raw-→-selected-→-clean)}

| Phiên bản | Ý nghĩa | Dùng cho bước nào |
| :---- | :---- | :---- |
| raw | Dữ liệu gốc sau khi nạp file | Kiểm tra hiện trạng và phát hiện lỗi chính |
| selected | Tập con thuộc tính phục vụ profiling theo task | Đo lường chất lượng trên biến trọng yếu |
| clean | Dữ liệu sau pipeline làm sạch và kiểm tra toàn vẹn | Phân tích, tổng hợp KPI, thiết kế biểu đồ |

Quy ước sử dụng trong báo cáo:

- Profiling chủ yếu đọc trên raw/selected để nhận diện vấn đề (đọc ở phần phụ lục).  
- Phân tích và dashboard dùng \*\_clean để đảm bảo nhất quán và khả năng tái lập.

## **3\. Profiling và chất lượng dữ liệu (tổng quan)** {#3.-profiling-và-chất-lượng-dữ-liệu-(tổng-quan)}

### **3.1 Quy mô dữ liệu ban đầu** {#3.1-quy-mô-dữ-liệu-ban-đầu}

| Dataset | Rows (raw) | Cột profiling chính |
| :---- | :---- | :---- |
| Listings | 36,353 | 13 |
| Calendar | 13,268,858 | 10 |
| Reviews | 1,000,870 | 3 |
| GeoJSON (neighbourhoods) | 233 features | 2 thuộc tính vùng chính |

### **3.2 Vấn đề chất lượng quan trọng và tác động phân tích** {#3.2-vấn-đề-chất-lượng-quan-trọng-và-tác-động-phân-tích}

Chú thích tra cứu bảng chi tiết (Appendix):

- **Kiểm tra tính hợp lệ**: xem Bảng A.1.  
- **Thống kê mô tả số**: xem Bảng A.2.  
- **Cấu trúc dữ liệu theo thuộc tính**: xem Bảng A.3.  
- **Mẫu định dạng**: xem Bảng A.4.  
- **Hồ sơ ngoại lệ (IQR)**: xem Bảng A.5.  
- **Bảng giá trị thiếu**: xem Bảng A.6.  
- **Ví dụ bản ghi lỗi minimum\_nights \> maximum\_nights**: xem Bảng A.7.  
- **calendar.price thiếu 100% (source-missing)**: không thể triển khai xu hướng giá theo thời gian.  
- **listings.reviews\_per\_month và listings.review\_scores\_rating thiếu theo ngữ nghĩa (MAR)**: gắn với listing chưa có review, không nội suy cưỡng bức.  
- **Tồn tại mâu thuẫn logic minimum\_nights \> maximum\_nights trong calendar raw**: cần xử lý trước khi tổng hợp theo thời gian.  
- **maximum\_nights có giá trị cực đại bất thường (2,147,483,647)**: cần kiểm soát khi tóm tắt ràng buộc đặt phòng.

Ví dụ lỗi dữ liệu tiêu biểu:

1. **calendar.price**: thiếu toàn bộ \-\> loại khỏi mọi phân tích giá theo ngày/tháng.  
2. **minimum\_nights \> maximum\_nights**: biểu hiện mâu thuẫn nghiệp vụ \-\> vô hiệu cặp trường nights ở bản ghi lỗi.

### **3.3 Mức sẵn sàng của dữ liệu không gian (GeoJSON)** {#3.3-mức-sẵn-sàng-của-dữ-liệu-không-gian-(geojson)}

Chú thích tra cứu bảng chi tiết (Appendix):

- **Tổng quan chỉ số của file GeoJSON**: xem Bảng A.9.  
- **Kiểm tra tọa độ/bbox**: xem Bảng A.10.  
- **Coverage join theo neighbourhood**: xem Bảng A.11.  
- n\_features=233, n\_neighbourhood=230, n\_neighbourhood\_group=5.  
- **Coverage join dựa theo neighbourhood**: match 222, listing-only 0, GeoJSON-only 8\.  
- Ý nghĩa: đủ điều kiện cho point map hoặc choropleth;

## **4\. Quy trình làm sạch dữ liệu** {#4.-quy-trình-làm-sạch-dữ-liệu}

1. **Standardize**: chuẩn hóa kiểu dữ liệu (giá, ngày, nhãn availability) và tạo biến thời gian mới (ngày, tháng).  
2. **Deduplicate**: loại trùng theo mức độ chi tiết của từng bảng (id, listing\_id-date, review event).  
3. **Handle missing**: giữ missing có ý nghĩa nghiệp vụ (các trường về reviews), loại hoặc bỏ biến thiếu hoàn toàn (calendar.price với missing 100%).  
4. **Remove invalid/inconsistent**: loại bản ghi không hợp lệ, xử lý mâu thuẫn min \> max, lọc orphan để đảm bảo 2 bảng hợp lại là 1-n.  
5. **Outlier policy**: không xóa outlier giá, gắn cờ để phân tích thêm theo bối cảnh thị trường.

Chú thích tra cứu bảng quyết định làm sạch chi tiết: xem Bảng A.8.

## **5\. Tóm tắt dữ liệu sau làm sạch** {#5.-tóm-tắt-dữ-liệu-sau-làm-sạch}

### **5.1 Quy mô sau làm sạch** {#5.1-quy-mô-sau-làm-sạch}

| Dataset | Clean rows | Clean cols | Vai trò phân tích |
| :---- | :---- | :---- | :---- |
| listings\_clean | 21,415 | 14 | Bảng số liệu chính dạng cho thị trường/không gian |
| calendar\_clean | 7,816,487 | 11 | Bảng số liệu chính theo thời gian cho tỷ lệ lấp đầy (occupancy/phòng không trống) hoặc khả dụng |
| reviews\_clean | 787,325 | 3 | Tín hiệu bổ trợ chất lượng/hoạt động |

Chú thích tra cứu bảng hậu làm sạch chi tiết (Appendix):

- **Quy mô giảm theo pipeline**: xem Bảng A.12.  
- **Toàn vẹn khóa sau làm sạch**: xem Bảng A.13.

### **5.2 Thuộc tính trọng yếu được giữ** {#5.2-thuộc-tính-trọng-yếu-được-giữ}

- **Không gian**: neighbourhood\_group\_cleansed, neighbourhood\_cleansed, latitude, longitude.  
- **Thời gian**: date, year, month.  
- **Measure chính:** price (listings), is\_available, is\_booked, review\_scores\_rating, reviews\_per\_month, number\_of\_reviews.  
- **Khóa**: listings.id, calendar.listing\_id, reviews.listing\_id.

## **6\. Kết luận profiling** {#6.-kết-luận-profiling}

### **6.1 Dữ liệu khả dụng cho phân tích** {#6.1-dữ-liệu-khả-dụng-cho-phân-tích}

- **Khả dụng**: listings\_clean, calendar\_clean, reviews\_clean, neighbourhoods.geojson.  
- **Không khả dụng theo mục tiêu ban đầu**: temporal price từ calendar.price do thiếu 100%.

### **6.2 Liên kết chất lượng dữ liệu \-\> quyết định phân tích** {#6.2-liên-kết-chất-lượng-dữ-liệu-->-quyết-định-phân-tích}

- Vì calendar.price không dùng được, Task 2 chuyển từ xu hướng giá theo thời gian sang xu hướng lấp đầy/khả dụng (xem Bảng A.6 và A.8).  
- Vì missing review fields mang ý nghĩa nghiệp vụ, giữ missing để tránh làm méo diễn giải chất lượng listing (xem Bảng A.6, A.8).  
- Vì có mâu thuẫn và outlier nghiệp vụ, pipeline làm sạch áp dụng nguyên tắc sửa bằng cách đánh dấu thay vì xóa (xem Bảng A.5, A.7, A.8).

### **6.3 Kết luận phạm vi bài toán** {#6.3-kết-luận-phạm-vi-bài-toán}

- Giữ Task 1 (market \+ spatial) trên dữ liệu clean.  
- Giữ Task 2 theo lấp đầy/khả dụng.  
- Loại xu hướng giá theo thời gian trên dữ liệu hiện có.

Phần tiếp theo chuyển từ bằng chứng chất lượng dữ liệu sang đặc tả mô hình dữ liệu và quy tắc tổng hợp dùng cho dashboard.

# **DATA ABSTRACTION** {#data-abstraction}

## **1\. Dataset Abstraction** {#1.-dataset-abstraction}

| Dataset | Dataset type | Granularity (Item) | Data availability | Vai trò trong mô hình |
| :---- | :---- | :---- | :---- | :---- |
| listings\_clean | Table (Entity table – snapshot) | 1 dòng \= 1 listing | Static | Bảng fact chính cho phân tích thị trường & không gian |
| calendar\_clean | Table (Temporal event table) | 1 dòng \= 1 listing–ngày | Temporal (time-varying) | Fact chính cho phân tích xu hướng theo thời gian |
| reviews\_clean | Table (Event \+ text) | 1 dòng \= 1 review | Temporal | Tín hiệu bổ trợ về chất lượng & hoạt động |
| neighbourhoods.geojson | Spatial dataset (polygon layer) | 1 feature \= 1 neighbourhood | Static | Lớp tham chiếu không gian cho bản đồ |

## **2\. Attribute Abstraction** {#2.-attribute-abstraction}

### **2.1 Thuộc tính – listings\_clean** {#2.1-thuộc-tính-–-listings_clean}

| Attribute | Type (Q/O/C) | Direction | Discrete / Continuous | Role |
| :---- | :---- | :---- | :---- | :---- |
| id | C | Nominal | Discrete | Key (PK) |
| host\_id | C | Nominal | Discrete | Key (FK) |
| neighbourhood\_group\_cleansed | C | Nominal | Discrete | Dimension (spatial – cấp quận) |
| neighbourhood\_cleansed | C | Nominal | Discrete | Dimension (spatial – join GeoJSON) |
| latitude | Q | Sequential | Continuous | Spatial coordinate (Y) |
| longitude | Q | Sequential | Continuous | Spatial coordinate (X) |
| room\_type | C | Nominal | Discrete | Dimension (category) |
| price | Q | Sequential | Continuous | Measure (financial) |
| availability\_365 | Q | Sequential | Discrete | Measure (availability) |
| accommodates | Q | Sequential | Discrete | Measure (capacity) |
| number\_of\_reviews | Q | Sequential | Discrete | Measure (activity) |
| reviews\_per\_month | Q | Sequential | Continuous | Measure (rate) |
| review\_scores\_rating | Q | Sequential | Continuous | Measure (quality signal) |

### **2.2 Thuộc tính –** calendar\_clean {#2.2-thuộc-tính-–-calendar_clean}

| Attribute | Type | Direction | Discrete / Continuous | Role |
| :---- | :---- | :---- | :---- | :---- |
| listing\_id | C | Nominal | Discrete | Key (FK) |
| date | O | Sequential | Discrete | Temporal dimension |
| available | C | Nominal | Discrete | Raw state |
| minimum\_nights | Q | Sequential | Discrete | Constraint |
| maximum\_nights | Q | Sequential | Discrete | Constraint |
| is\_available | C | Nominal | Discrete | Derived state |
| is\_booked | Q | Sequential | Discrete | Measure (occupancy proxy) |
| year | O | Sequential | Discrete | Time aggregation |
| month | O | Cyclic | Discrete | Time aggregation (seasonality) |

### **2.3 Thuộc tính –** reviews\_clean {#2.3-thuộc-tính-–-reviews_clean}

| Attribute | Type | Direction | Discrete / Continuous | Role |
| :---- | :---- | :---- | :---- | :---- |
| listing\_id | C | Nominal | Discrete | Key (FK) |
| date | O | Sequential | Discrete | Temporal dimension |
| comments | C | Nominal | Discrete | Text attribute |

### **2.4 Thuộc tính –** neighbourhoods.geojson {#2.4-thuộc-tính-–-neighbourhoods.geojson}

| Attribute | Type | Direction | Discrete / Continuous | Role |
| :---- | :---- | :---- | :---- | :---- |
| neighbourhood | C | Nominal | Discrete | Spatial key |
| neighbourhood\_group | C | Nominal | Discrete | Spatial grouping |

## **3\. Data Relationship & Structure** {#3.-data-relationship-&-structure}

### **3.1 Cardinality** {#3.1-cardinality}

Với **id** trong bảng listings là khóa chính, các **listing\_id** ở các bảng còn lại sẽ là khóa ngoại, tham chiếu đến bảng listings.

* listings (1) → (n) calendar  
* listings (1) → (n) reviews

### **3.2 Spatial Join** {#3.2-spatial-join}

* listings.neighbourhood\_cleansed → geojson.neighbourhood

### **3.3 Hierarchical Attributes** {#3.3-hierarchical-attributes}

* **Không gian (spatial hierarchy):** neighbourhood\_group\_cleansed → neighbourhood\_cleansed.  
* **Thời gian (temporal hierarchy):** year → month → date.

Hai cấu trúc phân cấp này là cơ sở để roll-up/drill-down nhất quán khi tổng hợp số liệu trên dashboard.

## **4\. Derived Attributes** {#4.-derived-attributes}

| Attribute | Definition | Purpose |
| :---- | :---- | :---- |
| is\_available | map từ available | Chuẩn hóa trạng thái |
| is\_booked | 1 \- is\_available | Đo occupancy |
| year, month | extract từ date | Time aggregation |
| price\_is\_outlier | IQR flag | Robust analysis |
| occupancy\_rate\_pct | mean(is\_booked) | KPI theo thời gian |

## **Ghi chú: occupancy\_rate\_pct: số phòng không trống, được tính bằng số phòng không trống / tổng số phòng**

## **5\. Data Abstraction Summary** {#5.-data-abstraction-summary}

* Dữ liệu được tổ chức thành:  
  * **Entity (listings)**  
  * **Temporal events (calendar, reviews)**  
  * **Spatial layer (GeoJSON)**


* Phân tách rõ:  
  * **Dimension** (space, time, category)  
  * **Measure** (price, occupancy, rating)


* Hỗ trợ trực tiếp cho:  
  * Spatial analysis (map)  
  * Distribution analysis (price)  
  * Temporal trend (occupancy)  
  * Hierarchical aggregation theo không gian và thời gian

# 

# **TASK ABSTRACTION** {#task-abstraction}

## **1\. Domain Tasks (User Stories)** {#1.-domain-tasks-(user-stories)}

### **Task 1 – Thị trường & phân bố**  {#task-1-–-thị-trường-&-phân-bố}

Người dùng muốn hiểu:

* Giá phân bố như thế nào theo khu vực  
* Loại phòng nào chiếm ưu thế  
* Khu vực nào đắt / rẻ bất thường

### **Task 2 – Phân tích tỷ lệ lấp đầy theo thời gian** {#task-2-–-phân-tích-tỷ-lệ-lấp-đầy-theo-thời-gian}

Người dùng muốn:

* Quan sát occupancy theo tháng  
* Nhận diện mùa cao / thấp điểm  
* So sánh xu hướng theo thời gian

### **Task 3 – Cấu trúc nguồn cung và sức chứa** {#task-3-–-cấu-trúc-nguồn-cung-và-sức-chứa}

Người dùng muốn hiểu:

*  Cấu trúc nguồn cung trên thị trường Airbnb NYC theo loại phòng, sức chứa và khu vực.  
* Để xác định phân khúc nào đang chiếm ưu thế và khu vực nào phù hợp với từng quy mô khách.

### **Task 4  – Chỉ số chất lượng và đánh giá khách hàng** {#task-4-–-chỉ-số-chất-lượng-và-đánh-giá-khách-hàng}

Người dùng muốn:

* Quan sát chất lượng dịch vụ của listing thông qua điểm đánh giá và mức độ hoạt động của review.  
* Nhận diện khu vực hoặc nhóm listing có trải nghiệm tốt, ổn định, hoặc cần cải thiện.  
* So sánh rating và số lượng review giữa các khu vực hoặc nhóm listing

### **Task 5 – Phân bố mức giá theo khu vực** {#task-5-–-phân-bố-mức-giá-theo-khu-vực}

Người dùng muốn hiểu:

* Mức giá thuê trung bình chênh lệch như thế nào giữa 5 quận của New York.  
* Quận nào tập trung nhiều phòng giá rẻ, quận nào đắt đỏ nhất.

### **Task 6 – Bản đồ Giá Bất thường & Giá trị Thực** {#task-6-–-bản-đồ-giá-bất-thường-&-giá-trị-thực}

Người dùng muốn:

* Tìm kiếm các listing bị gắn cờ ngoại lệ (price\_is\_outlier \= True) để xem chúng tập trung ở đâu.  
* Nhận diện các "món hời" (giá dưới mức trung vị nhưng điểm đánh giá lại cực cao) trong cùng một khu vực/loại phòng.

### **Task 7 – Hiệu quả Chi phí lưu trú** {#task-7-–-hiệu-quả-chi-phí-lưu-trú}

Người dùng muốn hiểu:

* Khu vực nào mang lại "giá trị tốt nhất" tính trên đầu người (Price / Accommodates).  
* Chi phí bình quân đầu người thay đổi ra sao khi quy mô **nhóm khách tăng lên.**

### **Task 8 – Phân tích Mùa vụ và Cơ hội Đặt phòng** {#task-8-–-phân-tích-mùa-vụ-và-cơ-hội-đặt-phòng}

Người dùng muốn:

* Quan sát tỷ lệ lấp đầy thay đổi như thế nào theo các tháng trong năm.  
* Nhận diện xem ràng buộc đêm tối thiểu (minimum\_nights) có làm giảm cơ hội tiếp cận phòng của khách thuê vào mùa cao điểm không.

### **Task 9 – Phân tích Danh mục Chủ nhà** {#task-9-–-phân-tích-danh-mục-chủ-nhà}

Người dùng muốn hiểu:

* Mức độ chuyên nghiệp hóa của thị trường (chủ nhà sở hữu nhiều listing vs. cá nhân lẻ tẻ).  
* So sánh lợi thế cạnh tranh (mức độ lấp đầy, điểm đánh giá) của chủ nhà lớn so với chủ nhà cá nhân.

### **Task 10 – Trải nghiệm khách hàng** {#task-10-–-trải-nghiệm-khách-hàng}

Người dùng muốn:

* Khai phá dữ liệu ngôn ngữ tự nhiên từ cột bình luận (comments).  
* Nhận diện các từ khóa/chủ đề (sự sạch sẽ, vị trí, thái độ) xuất hiện nhiều nhất ở nhóm phòng điểm cao so với nhóm phòng điểm thấp.

## 2\. Task Abstraction {#2.-task-abstraction}

### **2.1 Domain Task 1 – Thị trường và phân bố** {#2.1-domain-task-1-–-thị-trường-và-phân-bố}

#### **Analyze** {#analyze}

* Action: "Discover" → Target: "Distribution" Phát hiện phân bố giá theo khu vực  
* Action: "Discover" → Target: "Outliers" Nhận diện các khu vực có giá bất thường

#### **Search** {#search}

* Action: "Explore" → Target: "Features" Khám phá các khu vực và loại phòng  
* Action: "Locate" → Target: "Outliers" Xác định vị trí các khu vực giá cao/thấp

#### **Query** {#query}

* Action: "Compare" → Target: "Distribution" So sánh giá giữa các khu vực hoặc loại phòng  
* Action: "Summarize" → Target: "Distribution" Tính giá trung bình theo khu vực

#### **Summary** {#summary}

Discover \+ Explore \+ Locate \+ Compare \+ Summarize → Distribution \+ Outliers \+ Features

### **2.2 Domain Task 2 – Phân tích tỷ lệ lấp đầy theo thời gian** {#2.2-domain-task-2-–-phân-tích-tỷ-lệ-lấp-đầy-theo-thời-gian}

#### **Analyze** {#analyze-1}

* Action: "Discover" → Target: "Trends" Phát hiện xu hướng occupancy theo thời gian

#### **Search** {#search-1}

* Action: "Browse" → Target: "Trends" Duyệt dữ liệu theo timeline  
* Action: "Locate" → Target: "Extremes" Xác định các tháng cao điểm / thấp điểm

#### **Query** {#query-1}

* Action: "Compare" → Target: "Trends" So sánh occupancy giữa các tháng  
* Action: "Summarize" → Target: "Trends" Tính occupancy trung bình theo tháng

#### **Summary** {#summary-1}

Discover \+ Browse \+ Locate \+ Compare \+ Summarize → Trends \+ Extremes

### **2.3 Domain Task 3 – Cấu trúc nguồn cung và sức chứa** {#2.3-domain-task-3-–-cấu-trúc-nguồn-cung-và-sức-chứa}

#### **Analyze** {#analyze-2}

* Action: "Discover" → Target: "Distribution" Phát hiện phân bố nguồn cung theo room\_type và accomodates.  
* Action: "Discover" → Target: "Features" Nhận diện các đặc trưng từng khu vực theo cấu trúc loại phòng và sức chứa.

#### **Search** {#search-2}

* Action: "Explore" → Target: "Features" Khám phá sự khác biệt về nguồn cung giữa các nhóm vùng (borough) hoặc neighborhood.  
* Action: "Locate" → Target: "Outliers" Xác định các khu vực có sức chứa lớn hoặc cấu trúc nguồn cung khác biệt.

#### **Query** {#query-2}

* Action: "Compare" → Target: "Distribution" So sánh phân bố room\_type hoặc accommodates giữa các khu vực.  
* Action: "Compare" → Target: "Dependency" So sánh mối quan hệ giữa sức chứa (accommodates) và giá (price).  
* Action: "Summarize" → Target: "Distribution" Tính số lượng listing, sức chứa trung bình.

#### **Summary** {#summary-2}

Discover \+ Explore+ Locate \+ Compare \+ Summarize → Distribution+ Features+Outliers+Dependency

### **2.4 Domain Task 4 – Chỉ số chất lượng và đánh giá khách hàng** {#2.4-domain-task-4-–-chỉ-số-chất-lượng-và-đánh-giá-khách-hàng}

#### **Analyze** {#analyze-3}

* Action: "Discover" → Target: "Distribution"  
   Phát hiện phân bố điểm đánh giá giữa các nhóm listing hoặc khu vực.  
* Action: "Discover" → Target: "Outliers"  
   Nhận diện các listing hoặc khu vực có rating quá cao hoặc quá thấp.

#### **Search** {#search-3}

* Action: "Explore" → Target: "Features"  
   Khám phá các tín hiệu chất lượng theo room\_type, neighbourhood\_group\_cleansed, hoặc neighbourhood\_cleansed.  
* Action: "Locate" → Target: "Outliers"  
   Xác định các khu vực có rating thấp bất thường hoặc số lượng review quá thấp/cao.

#### **Query** {#query-3}

* Action: "Compare" → Target: "Distribution"  
   So sánh phân bố rating giữa các khu vực hoặc các loại phòng.  
* Action: "Compare" → Target: "Dependency"  
   So sánh mối quan hệ giữa review\_scores\_rating và number\_of\_reviews hoặc reviews\_per\_month.  
* Action: "Summarize" → Target: "Distribution"  
   Tính rating trung bình hoặc số review trung bình theo khu vực / loại phòng.

#### **Summary** {#summary-3}

Discover \+ Explore \+ Locate \+ Compare \+ Summarize  → Distribution \+ Outliers \+ Features \+ Dependency

### **2.5 Domain Task 5– Phân bố giá theo khu vực** {#2.5-domain-task-5–-phân-bố-giá-theo-khu-vực}

**Analyze**

* Action: "Discover" → Target: "Distribution" Phát hiện sự phân bố mức giá trên toàn bộ 5 quận. 

**Search**

* Action: "Explore" → Target: "Features" Khám phá đặc trưng về giá trị bất động sản của từng khu vực.  
* Action: "Locate" → Target: "Extremes" Xác định vị trí của các quận đắt đỏ nhất và rẻ nhất.

**Query**

* Action: "Compare" → Target: "Distribution" So sánh sự chênh lệch và khoảng biến thiên giá giữa các quận.  
* Action: "Summarize" → Target: "Distribution" Tính toán mức giá trung bình/trung vị theo từng quận. 

**Summary** Discover \+ Explore \+ Locate \+ Compare \+ Summarize → Distribution \+ Features \+ Extremes

### **2.6 Domain Task 6 – Bản đồ giá bất thường và giá trị thực** {#2.6-domain-task-6-–-bản-đồ-giá-bất-thường-và-giá-trị-thực}

**Analyze**

* Action: "Discover" → Target: "Outliers" Phát hiện các listing có mức giá và chất lượng bất thường. 

**Search**

* Action: "Explore" → Target: "Features" Khám phá sự phân bổ không gian của các "món hời" trên bản đồ.  
* Action: "Locate" → Target: "Outliers" Xác định chính xác vị trí các listing có giá trị thực vượt trội.

**Query**

* Action: "Compare" → Target: "Dependency" So sánh tương quan giữa mức giá và điểm đánh giá để tìm ra độ lệch. 

**Summary** Discover \+ Explore \+ Locate \+ Compare → Outliers \+ Features \+ Dependency

### **2.7 Domain Task 7 – Hiệu quả chi phí lưu trú** {#2.7-domain-task-7-–-hiệu-quả-chi-phí-lưu-trú}

**Analyze**

* Action: "Discover" → Target: "Dependency" Phát hiện mối quan hệ phụ thuộc giữa sức chứa (quy mô khách) và biến động chi phí bình quân. 

**Search**

* Action: "Explore" → Target: "Features" Khám phá xu hướng thay đổi giá khi số lượng người lưu trú thay đổi. 

**Query**

* Action: "Compare" → Target: "Distribution" So sánh chi phí bình quân đầu người giữa các khu vực.  
* Action: "Compare" → Target: "Dependency" So sánh sự tối ưu chi phí giữa các nhóm quy mô khách khác nhau.  
* Action: "Summarize" → Target: "Distribution" Tính toán chi phí đầu người trung bình theo quy mô và khu vực. 

**Summary** Discover \+ Explore \+ Compare \+ Summarize → Dependency \+ Features \+ Distribution

### **2.8 Domain Task 8 – Phân tích mùa vụ và cơ hội đặt phòng** {#2.8-domain-task-8-–-phân-tích-mùa-vụ-và-cơ-hội-đặt-phòng}

**Analyze**

* Action: "Discover" → Target: "Trends" Phát hiện xu hướng lấp đầy theo mùa vụ.  
* Action: "Discover" → Target: "Dependency" Phát hiện mối quan hệ giữa chính sách `minimum_nights` và tỷ lệ lấp đầy. 

**Search**

* Action: "Browse" → Target: "Trends" Duyệt dữ liệu lấp đầy dọc theo trục thời gian (timeline).  
* Action: "Locate" → Target: "Extremes" Xác định chính xác các tháng cao điểm (cháy phòng) và thấp điểm. 

**Query**

* Action: "Compare" → Target: "Trends" So sánh tỷ lệ lấp đầy giữa các tháng.  
* Action: "Compare" → Target: "Dependency" Đối chiếu tỷ lệ lấp đầy giữa nhóm phòng có `minimum_nights` ngắn và dài. 

**Summary** Discover \+ Browse \+ Locate \+ Compare → Trends \+ Extremes \+ Dependency

### **2.9 Domain Task 9 – Phân tích danh mục chủ nhà** {#2.9-domain-task-9-–-phân-tích-danh-mục-chủ-nhà}

**Analyze**

* Action: "Discover" → Target: "Dependency" Phát hiện mối quan hệ giữa quy mô danh mục của chủ nhà và hiệu suất kinh doanh (occupancy & rating). 

**Search**

* Action: "Explore" → Target: "Features" Khám phá đặc trưng của nhóm listing thuộc quyền sở hữu của các chủ nhà sở hữu nhiều phòng. 

**Query**

* Action: "Compare" → Target: "Distribution" So sánh phân bố điểm đánh giá và tỷ lệ lấp đầy giữa nhóm chủ nhà lớn và chủ nhà nhỏ lẻ.  
* Action: "Summarize" → Target: "Distribution" Tính trung bình điểm đánh giá và lấp đầy theo phân loại quy mô chủ nhà. 

**Summary** Discover \+ Explore \+ Compare \+ Summarize → Dependency \+ Features \+ Distribution

### **2.10 Domain Task 10 – Trải nghiệm khách hàng** {#2.10-domain-task-10-–-trải-nghiệm-khách-hàng}

**Analyze**

* Action: "Discover" → Target: "Features" Phát hiện các chủ đề và từ khóa (keywords) nổi bật phản ánh trải nghiệm khách hàng. 

**Search**

* Action: "Explore" → Target: "Features" Khám phá ngôn ngữ và ngữ cảnh mà khách hàng sử dụng khi mô tả các nhóm listing khác nhau. 

**Query**

* Action: "Compare" → Target: "Distribution" So sánh tần suất xuất hiện của các từ khóa tích cực/tiêu cực giữa nhóm phòng điểm cao và điểm thấp.  
* Action: "Summarize" → Target: "Features" Tổng hợp thành tập hợp các từ vựng cốt lõi nhất. 

**Summary** Discover \+ Explore \+ Compare \+ Summarize → Features \+ Distribution

# 

# **Appendix \- Bảng Profiling Chi Tiết** {#appendix---bảng-profiling-chi-tiết}

Phụ lục này tập hợp các bảng chi tiết đã được lược khỏi phần profiling chính để giữ mạch trình bày ngắn gọn.

## **A.1 Bảng kiểm tra tính hợp lệ (regex/rule)** {#a.1-bảng-kiểm-tra-tính-hợp-lệ-(regex/rule)}

| Dataset | Field | Rule | Valid | Invalid | Validity (%) |
| :---- | :---- | :---- | ----- | ----- | ----- |
| listings\_raw | price | numeric\_string\_currency | 21,415 | 0 | 100.00 |
| listings\_standardized | price | positive\_numeric | 21,415 | 0 | 100.00 |
| listings\_standardized | review\_scores\_rating | rating\_0\_100 | 25,007 | 0 | 100.00 |
| listings\_standardized | latitude | lat\_nyc | 36,353 | 0 | 100.00 |
| listings\_standardized | longitude | lon\_nyc | 36,353 | 0 | 100.00 |
| calendar\_raw | date | date\_yyyy\_mm\_dd | 13,268,858 | 0 | 100.00 |
| calendar\_raw | available | available\_tf | 13,268,858 | 0 | 100.00 |
| reviews\_raw | date | date\_yyyy\_mm\_dd | 1,000,870 | 0 | 100.00 |

## **A.2 Bảng thống kê mô tả số (raw selected)** {#a.2-bảng-thống-kê-mô-tả-số-(raw-selected)}

| Dataset | Field | Min | Max | Mode | AVG | Median |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| listings\_raw\_selected | price | 9 | 50,138 | 150 | 519.6229 | 154 |
| listings\_raw\_selected | review\_scores\_rating | 0 | 5 | 5 | 4.7213 | 4.86 |
| listings\_raw\_selected | availability\_365 | 0 | 365 | 0 | 165.38 | 156 |
| calendar\_raw\_selected | minimum\_nights | 1 | 1,124 | 30 | 29.3969 | 30 |
| calendar\_raw\_selected | maximum\_nights | 1 | 2,147,483,647 | 1125 | 647,712.2799 | 365 |

## **A.3 Bảng hai chiều theo từng thuộc tính (raw)** {#a.3-bảng-hai-chiều-theo-từng-thuộc-tính-(raw)}

| Dataset | Field | Null | Missing | Actual | Completeness (%) | Cardinality | Uniqueness (%) | Distinctness (%) |
| :---- | :---- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| listings | id | 0 | 0 | 36,353 | 100.00 | 36,353 | 100.00 | 100.00 |
| listings | price | 14,938 | 14,938 | 21,415 | 58.91 | 1,106 | 5.16 | 3.04 |
| listings | reviews\_per\_month | 11,346 | 11,346 | 25,007 | 68.79 | 825 | 3.30 | 2.27 |
| listings | review\_scores\_rating | 11,346 | 11,346 | 25,007 | 68.79 | 161 | 0.64 | 0.44 |
| calendar | listing\_id | 0 | 0 | 13,268,858 | 100.00 | 36,353 | 0.27 | 0.27 |
| calendar | price | 13,268,858 | 13,268,858 | 0 | 0.00 | 0 | 0.00 | 0.00 |
| calendar | minimum\_nights | 0 | 0 | 13,268,858 | 100.00 | 155 | 0.00 | 0.00 |
| calendar | maximum\_nights | 0 | 0 | 13,268,858 | 100.00 | 287 | 0.00 | 0.00 |
| reviews | listing\_id | 0 | 0 | 1,000,870 | 100.00 | 25,007 | 2.50 | 2.50 |
| reviews | comments | 257 | 257 | 1,000,613 | 99.97 | 960,213 | 95.96 | 95.94 |

## **A.4 Bảng mẫu định dạng phổ biến (top patterns)** {#a.4-bảng-mẫu-định-dạng-phổ-biến-(top-patterns)}

| Dataset | Field | Pattern | Count | Pct |
| :---- | :---- | :---- | ----: | ----: |
| listings | room\_type | ssssss ssss-sss | 19,427 | 53.44 |
| listings | room\_type | sssssss ssss | 16,306 | 44.85 |
| calendar | date | dddd-dd-dd | 13,268,858 | 100.00 |
| calendar | available | s | 13,268,858 | 100.00 |
| reviews | date | dddd-dd-dd | 1,000,870 | 100.00 |
| reviews | comments | sssss ssss- | 1,965 | 0.20 |
| reviews | comments | \- | 1,836 | 0.18 |

## **A.5 Bảng hồ sơ ngoại lệ (IQR)** {#a.5-bảng-hồ-sơ-ngoại-lệ-(iqr)}

| Field | Lower | Upper | Outlier count | Outlier pct |
| :---- | :---- | :---- | :---- | :---- |
| listings.price (clean) | \-178.5 | 537.5 | 1,385 | 6.47 |
| calendar.minimum\_nights (raw) | 30 | 30 | 2,532,685 | 19.09 |
| calendar.maximum\_nights (raw) | \-775 | 2,265 | 6,553 | 0.05 |

## **A.6 Bảng phân tích giá trị thiếu** {#a.6-bảng-phân-tích-giá-trị-thiếu}

| Dataset | Field | Missing count | Missing pct | Missing type |
| :---- | :---- | :---- | :---- | :---- |
| listings | price | 14,938 | 41.09 | MCAR/technical |
| listings | reviews\_per\_month | 11,346 | 31.21 | MAR/semantic |
| listings | review\_scores\_rating | 11,346 | 31.21 | MAR/semantic |
| calendar | price | 13,268,858 | 100.00 | MCAR/source-missing |
| reviews | comments | 257 | 0.03 | MCAR/empty-text |

## **A.7 Bảng ví dụ bản ghi lỗi minimum\_nights \> maximum\_nights** {#a.7-bảng-ví-dụ-bản-ghi-lỗi-minimum_nights->-maximum_nights}

| listing\_id | date | minimum\_nights | maximum\_nights |
| :---- | :---- | :---- | :---- |
| 6601284 | 2025-11-14 | 30 | 5 |
| 6601284 | 2025-11-15 | 30 | 4 |
| 6601284 | 2025-11-16 | 30 | 3 |
| 6601284 | 2025-11-17 | 30 | 2 |
| 6601284 | 2025-11-26 | 30 | 7 |

## **A.8 Bảng quyết định làm sạch (cleaning decision)** {#a.8-bảng-quyết-định-làm-sạch-(cleaning-decision)}

| Dataset | Vấn đề phát hiện | Quyết định làm sạch | Lý do quyết định | Tác động đến phân tích |
| :---- | :---- | :---- | :---- | :---- |
| listings | price thiếu 41.09% và có bản ghi không đạt điều kiện cốt lõi | Loại các dòng thiếu price hoặc price \<= 0; loại bản ghi thiếu khóa/categorical cốt lõi; giữ outlier bằng cờ price\_is\_outlier | price là measure chính của Task 1, cần dữ liệu hợp lệ; giữ outlier để không mất tín hiệu thị trường cao cấp | Tăng độ tin cậy phân tích giá và không gian, đồng thời vẫn hỗ trợ phân tích nhạy cảm với outlier |
| listings | reviews\_per\_month, review\_scores\_rating thiếu theo ngữ nghĩa (listing chưa có review) | Giữ missing, không nội suy cưỡng bức; diễn giải theo điều kiện number\_of\_reviews | Missing mang ý nghĩa nghiệp vụ, không phải lỗi thu thập thuần túy | Tránh sai lệch khi so sánh chất lượng review giữa các nhóm listing |
| calendar | Khóa logic trùng (listing\_id, date) và bản ghi availability không hợp lệ | Loại trùng theo khóa logic; loại dòng thiếu khóa/ngày; loại availability không hợp lệ | Đảm bảo mức độ chi tiết listing-ngày nhất quán cho chuỗi thời gian | Ổn định phép tổng hợp theo tháng và tránh đếm trùng occupancy |
| calendar | Mâu thuẫn minimum\_nights \> maximum\_nights | Gán NaN cho cặp nights mâu thuẫn thay vì loại toàn dòng | Giữ lại thông tin availability/time còn hợp lệ, chỉ vô hiệu phần constraint sai | Giảm mất dữ liệu không cần thiết cho Task 2 |
| calendar | price thiếu 100% | Không dùng calendar.price cho phân tích giá theo thời gian; chuyển trọng tâm Task 2 sang khả dụng/lấp đầy | Không có tín hiệu giá để ước lượng đáng tin cậy | Task 2 được điều chỉnh phạm vi: giữ xu hướng lấp đầy theo thời gian, loại xu hướng giá theo thời gian |
| reviews | Thiếu/không hợp lệ ở listing\_id, date, comments; tồn tại trùng toàn dòng | Loại trùng toàn dòng; loại bản ghi thiếu khóa/ngày/comments; loại comments rỗng | Bảo toàn toàn vẹn khóa và chất lượng văn bản tối thiểu cho khai thác nội dung | Tăng độ tin cậy cho thống kê theo thời gian và phân tích text |
| Liên bảng | Bản ghi mồ côi trong calendar/reviews không tồn tại trong listings\_clean | Loại orphan theo tập valid\_listing\_ids từ listings\_clean | Đảm bảo toàn vẹn tham chiếu 1-n giữa bảng thực thể và bảng sự kiện | Tránh sai lệch khi join và tổng hợp cross-table |

## **A.9 Bảng tổng quan chỉ số của file GeoJSON** {#a.9-bảng-tổng-quan-chỉ-số-của-file-geojson}

| Chỉ số | Giá trị |
| :---- | ----: |
| Số feature không gian (n\_features) | 233 |
| Số neighbourhood duy nhất (n\_neighbourhood) | 230 |
| Số neighbourhood\_group duy nhất (n\_neighbourhood\_group) | 5 |

## **A.10 Bảng kiểm tra tọa độ và bbox** {#a.10-bảng-kiểm-tra-tọa-độ-và-bbox}

| Chỉ số | Giá trị |
| :---- | ----: |
| latitude min | 40.50456 |
| latitude max | 40.91114683573623 |
| longitude min | \-74.251907 |
| longitude max | \-73.71365 |
| Tỷ lệ bản ghi nằm trong bbox NYC mở rộng (lat \[40.4, 41.0\], lon \[-74.3, \-73.6\]) | 100.00% |

## **A.11 Bảng coverage join theo neighbourhood** {#a.11-bảng-coverage-join-theo-neighbourhood}

| Chỉ số | Giá trị |
| :---- | ----: |
| Số khu vực trong listings\_clean | 222 |
| Số khu vực trong geojson | 230 |
| Khu vực chỉ có trong listings\_clean | 0 |
| Khu vực chỉ có trong geojson | 8 |

Các khu vực chỉ có trong GeoJSON (không xuất hiện trong listings\_clean): Bloomfield, Charleston, Glen Oaks, New Dorp, New Springville, Pleasant Plains, Port Ivory, Richmondtown.

## **A.12 Bảng quy mô giảm sau làm sạch** {#a.12-bảng-quy-mô-giảm-sau-làm-sạch}

| Bảng | Raw rows | Clean rows | Giảm | Tỷ lệ giảm |
| :---- | ----: | ----: | ----: | ----: |
| Listings | 36,353 | 21,415 | 14,938 | 41.09% |
| Calendar | 13,268,858 | 7,816,487 | 5,452,371 | 41.09% |
| Reviews | 1,000,870 | 787,325 | 213,545 | 21.34% |

## **A.13 Bảng toàn vẹn khóa sau làm sạch** {#a.13-bảng-toàn-vẹn-khóa-sau-làm-sạch}

| Chỉ số | Giá trị |
| :---- | ----: |
| listings\_clean.id cardinality | 21,415 |
| calendar\_clean.listing\_id cardinality | 21,415 |
| reviews\_clean.listing\_id cardinality | 14,999 |

## **A.14 Bảng occupancy theo tháng** {#a.14-bảng-occupancy-theo-tháng}

| Tháng | Tỷ lệ lấp đầy (%) |
| ----: | ----: |
| 1 | 20.56 |
| 2 | 21.97 |
| 3 | 21.02 |
| 4 | 21.10 |
| 5 | 29.07 |
| 6 | 28.41 |
| 7 | 27.95 |
| 8 | 36.98 |
| 9 | 37.23 |
| 10 | 37.14 |
| 11 | 51.66 |
| 12 | 35.86 |

## **A.15 Phân loại toàn bộ 28 thuộc tính được phân tích** {#a.15-phân-loại-toàn-bộ-28-thuộc-tính-được-phân-tích}

Bảng dưới đây là danh sách phân rã và gán vai trò chi tiết cho toàn bộ 28 thuộc tính được sử dụng (bao gồm các trường gốc và trường dẫn xuất đã chốt sau làm sạch), phục vụ cho quá trình xây dựng Dashboard trực quan hóa.

| STT | Dataset | Tên cột (Attribute) | Nhóm thuộc tính | Kiểu dữ liệu (Q/O/C) | Vai trò phân tích (Analytical Role) chi tiết |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | listings | id | Khóa (Key/PK) | Categorical (C) | Định danh duy nhất căn hộ, dùng đếm tổng cung (Total Listings). |
| 2 | listings | host\_id | Khóa ngoại (Key/FK) | Categorical (C) | Định danh chủ nhà, dùng đếm số lượng chủ nhà hoặc nhóm chủ tập đoàn. |
| 3 | listings | neighbourhood\_group\_cleansed | Không gian | Categorical (C) | Phân nhóm tổng hợp cấp Quận (Borough), làm filter hoặc group by cho Bar/Boxplot. |
| 4 | listings | neighbourhood\_cleansed | Không gian | Categorical (C) | Phân nhóm tổng hợp cấp Phường/Khu vực nhỏ, là khóa Join với mảng GeoJSON. |
| 5 | listings | latitude | Tọa độ điểm | Quantitative (Q) | Trục Y không gian, dùng thả ghim lên bản đồ (Point Map). |
| 6 | listings | longitude | Tọa độ điểm | Quantitative (Q) | Trục X không gian, dùng thả ghim lên bản đồ (Point Map). |
| 7 | listings | room\_type | Phân loại nhà | Categorical (C) | Gom cụm so sánh cơ cấu thị trường (Entire home vs Private room). |
| 8 | listings | price | Tài chính | Quantitative (Q) | Đo lường mức giá, tìm phân bố giá trị trung vị và ngoại lệ qua Chart. |
| 9 | listings | availability\_365 | Mức sẵn sàng | Quantitative (Q) | Đo lường tổng số ngày trống trong năm tiếp theo. |
| 10 | listings | accommodates | Quy mô nhà | Quantitative (Q) | Đo sức chứa tối đa của phòng, dùng đánh giá quy mô tệp khách phù hợp. |
| 11 | listings | number\_of\_reviews | Mức độ hoạt động | Quantitative (Q) | Đếm tổng số nhận xét, đo độ "hot" và mật độ khách thuê thực tế. |
| 12 | listings | reviews\_per\_month | Mức độ hoạt động | Quantitative (Q) | Tốc độ tăng trưởng mức độ nhận xét bình quân trên tháng. |
| 13 | listings | review\_scores\_rating | Tín hiệu chất lượng | Quantitative (Q) | Chấm điểm sự hài lòng trung bình để nhận diện rủi ro / chất lượng phòng. |
| 14 | calendar | listing\_id | Khóa ngoại (Key/FK) | Categorical (C) | Khóa liên kết dữ liệu chuỗi thời gian về đúng căn nhà mục tiêu. |
| 15 | calendar | date | Thời gian | Ordinal (O) | Dòng mốc thời gian chi tiết của sự kiện. |
| 16 | calendar | available | Trạng thái gốc | Categorical (C) | Ký tự gốc (t/f) biểu thị nhà có ai đặt hay chưa. |
| 17 | calendar | price | Tài chính | Quantitative (Q) | (Vô hiệu hóa do missing 100%) Gốc là đo giá biến động theo thời gian. |
| 18 | calendar | minimum\_nights | Quy định | Quantitative (Q) | Ràng buộc số đêm thuê tối thiểu của chủ nhà theo mùa. |
| 19 | calendar | maximum\_nights | Quy định | Quantitative (Q) | Ràng buộc số đêm thuê tối đa của chủ nhà theo mùa. |
| 20 | calendar | is\_available | Trạng thái phòng | Categorical (C) | Trường dẫn xuất T/F quy chuẩn tỷ lệ phòng trống. |
| 21 | calendar | is\_booked | Trạng thái phòng | Quantitative (Q) | Trường dẫn xuất nhị phân (0/1) dùng tính trực tiếp % lấp đầy (Occupancy) khi đo mean(). |
| 22 | calendar | year | Thời gian tổng hợp | Ordinal (O) | Lọc hoặc phân rã biểu đồ đường theo các năm riêng biệt. |
| 23 | calendar | month | Thời gian tổng hợp | Ordinal (O) | Trục X chính giúp hiện thực hóa User Story về Tính Mùa Vụ. |
| 24 | reviews | listing\_id | Khóa ngoại (Key/FK) | Categorical (C) | Cầu nối ghép nội dung review về đối tượng căn nhà. |
| 25 | reviews | date | Thời gian đánh giá | Ordinal (O) | Dùng để dò mật độ khách đến lưu trú theo các mốc thời gian cũ. |
| 26 | reviews | comments | Nội dung Text | Categorical (C) | Đọc, dò mẫu từ khoá cảm xúc, hỗ trợ đánh giá chất lượng thay vì chỉ có số. |
| 27 | geojson | neighbourhood | Không gian vùng | Categorical (C) | Key không gian để nối màu mức giá/số nhà vào bản đồ Choropleth. |
| 28 | geojson | neighbourhood\_group | Nhóm vùng rộng | Categorical (C) | Cung cấp ranh giới cấp Borough to nhất cho tổng quan bản đồ. |


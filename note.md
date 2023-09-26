## Nhược điểm của cách kết nối cũ 
## Cách kết nối thay thế khuyên dùng
## Kiểm tra hệ thống có bao nhiêu connect hiện tại
## Thông báo khi hệ thống quá tải server
## Có nên disConnect() liên tục hay không ?
## PoolSize là  gì ? Vì sao lại quan trọng

## Nếu vượt quá kết nối PoolSize

thì nó sẽ xếp hàng để 1 connect xong thì nó sẽ vào trong đó
Tăng tùy chọn poolsize phù hợp với tài nguyên sẵn có của chúng ta
Connect poolsize để sử dụng tốt 

Helper 
Utils file function

# Section 4 cách kết hợp env và configs cho dự án nhiều môi trường và Members
## Env
 giúp lamf việc dễ dàng 
 phát triển cục bộ không ảnh hưởng đến chung
 ### Không cần file env cũng được
###
Dùng lưu trữ thông tin nhạy cảm không muốn mã hóa cứng trong code của mình 
Giúp code sạch sẽ và bảo trì trơn tru 
Khi push code lên 
Nên phải dùng file env
## Cofing 
lưu Trữ cài đặt và cấu hình cho chúng ta
config dùng để kiểm soát được code được phiên bản
 


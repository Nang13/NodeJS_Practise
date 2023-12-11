## Section 2 : Setup - reStart 
### morgan
nó là 1 thư viện để ghi log khi người dùng chạy request
+ Dev 
Báo real time khi server nhận request
+ Common 
+ Short 
+ Tiny 
+ Compile
Theo tiêu chuẩn của apache

### helmet 
để tránh hacker thăm dò công nghệ mình đang sử dụng 

### compression
khi vận chuyển quá nhiều tốn băng thông của chúng ra

## Section 2 Connect MongoDB to Node.js Using Mongoose và 7 điều cần triển khai trong hệ thống.
### Phân biệt util và helper
#### Util
+ Là viết những function 
Ví dụ : chuyển ký tự hoa sang ký tự thường

#### Help


## Section 4 .evn and config

- Chuyển đổi môi trường không cần chỉnh sửa mã code 
### .env
- Dùng để lưu trữ những thông tin nhạy cảm 
- Tách biệt thông tin nhạy cảm , bảo trì trơn tru, 

### config 
- lưu trữ cài đặt và cấu hình cho chúng ta 
- config dùng để kiểm soát code và phiên bản 

### [Section 7]
Việc handle code lỗi trong chương trình phải báo trực tiếp phải có một chốt chặn ở phía middle


Nguyên tắc trong lập trình khi hàm được sử dụng 2 lần thì hãy  viết util

### [Section 18] PUT VS PATCH
#### Put
+ dùng để tạo tài nguyên hay một sản phẩm mới 

#### Patch 
+ dùng chỉ để cập nhật những thuộc tính muốn cập nhật

#### Inventories Model and Service
Thường tách biệt và phục vụ những mục đích khác nhau 
##### Collection Product 
+ để duyệt mua , hiển thị trên websitee
##### Collection Inventories
+ quản lý tồn kho khi  

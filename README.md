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
### Chương 2 Redissss
#### section 27,28
##### Những câu hỏi phổ biến về redis 
Redis là gì? 
- Lưu trong bộ nhớ về ghi và đọc rất nhanh 
- Redis thường dùng cho khóa phân tán , hỗ trợ nhiều điều khác nhau 

#### tại sao là sử dụng redis 
Memcached vs Redis 


#### redis có bao nhiêu kiểu dữ liệu ? và kịch bản sử dụng
#### redis giải quyết cơ chế hết hạn dữ liệu thế nào ?
#### String (SDS)
Kịch bản ứng dụng : đối tượng bộ đệm ,số lượng thông thường ,khóa phân tán , thông tin phiên được chia sẻ ,....
Type : embstring ,raw , int
##### Commang using 
- Set multiple key-value : MSET - MGET -SETNX( check exist)
- Set/increment/decreasement : set -  incr - incrby - decr - decrby 
- Finding keys : KEYS '001:*
- Expire time : expire name time - ttl name (check time)
- 
#### Hash 
##### Using
- using in create cart 
##### Commands
- Get/Set : HGET - HSET
- Delete : HDLE
- return field : HLEN
- show all : HGETALL
- icre/decrease : HINCRBY /

#### List
##### Using 
stack/queue
hàng đợi tin nhắn ( bảo vệ hàng đợi tin nhắn )
- Xử lý tin nhắn trùng lập 
- Độ tin cậy của tin nhắn 
##### Command 
-  chèn vào bên trái : lpush
-  chèn vào bên phải : rpush
- get all : lrange
-----
- context using block ( using message queue)
a và b mua vé 
- BLPOP l:ticket 0 
#### Sets
##### Commands
- add to set : SADD
- delete : SREM
- check it exist : SISEMEBER 
- choose radom element : SRANMEMBER
##### Using 
- Like features : 
- Tìm điểm chung : 

#### Zset
##### Using 
- 



### Hiểu khái niệm về transaction
hỗ trợ làm nhiều lệnh cũng lúc 
các lệnh trong hàng đợi 
-> tuần tự và độc quyền
-> có tính mức cô lập 
#### 
- Watch (vi pham bien transaction bi loi)
- Multi
- Exec 
- Discard
multi in transaction of redis 
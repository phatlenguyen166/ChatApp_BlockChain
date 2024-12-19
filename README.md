# DApp Nhắn Tin Đa Phương Tiện 📡
Một ứng dụng nhắn tin phi tập trung (DApp) hỗ trợ đa phương tiện, được xây dựng trên nền tảng Blockchain và IPFS.
## 🛠 Công nghệ sử dụng
- **React.js**: Giao diện người dùng.
- **Web3.js**: Tương tác với mạng Blockchain.
- **IPFS**: Lưu trữ dữ liệu phi tập trung.
- **ipfs-http-client**: Thư viện kết nối với IPFS.
- **node-forge**: Mã hóa dữ liệu.
- **IndexedDB**: Lưu trữ cục bộ trên trình duyệt.
## 🎯 Tính năng chính
- Đăng nhập/Đăng ký tài khoản.
- Tìm kiếm người dùng và thêm bạn mới.
- Gửi/nhận tin nhắn:
  - Văn bản.
  - Hình ảnh.
  - Video.
  - Âm thanh.
- Dữ liệu được lưu trữ và bảo mật bằng Blockchain và IPFS.
## 🖥 Môi trường phát triển
- **VSCode**: Môi trường phát triển chính.
- **Ganache**: Blockchain giả lập.
- **IPFS Desktop**: Triển khai IPFS cục bộ.
- **IndexedDB**: Lưu trữ dữ liệu ứng dụng trên trình duyệt.

## 🚀 Cài đặt và sử dụng

### Yêu cầu hệ thống
- Node.js >= 16.x
- Trình duyệt hiện đại hỗ trợ IndexedDB
- Ganache và IPFS Desktop đã được cài đặt

### Hướng dẫn cài đặt
#### 1. Clone dự án: `git clone https://github.com/phatlenguyen166/ChatApp_BlockChain.git`
#### 2. Cài đặt các phần mềm cần thiết:
- Gói truffle: `npm install -g truffle`
- Ganache: Truy cập `https://archive.trufflesuite.com/ganache/` và tải về phiên bản Ganache phù hợp
- IPFS Desktop: Truy cập `https://github.com/ipfs/ipfs-desktop/releases` và tải về phiên bản IPFS Desktop phù hợp
#### 3. Cấu hình IPFS Desktop:
1.  Mở IPFS Destop -> Settings
2.  Kéo xuống phần IPFS CONFIG và bổ sung thuộc tính `HTTPHeaders` cho `API`:
```JSON
"API": {
		"HTTPHeaders": {
			"Access-Control-Allow-Origin": [
				"http://localhost:3000",
				"http://127.0.0.1:5001"
			]
		}
	}
```
3.  Khởi động lại IPFS Desktop
#### 4. Cấu hình để có tạo tài khoản
1.  Khởi động Ganache và chọn Quickstart
2.  Trong danh sách 10 tài khoản, hãy chọn biểu tượng chìa khóa của 1 tài khoản để hiện thị Keys của tài khoản đó
3.  Copy thông tin ACCOUNT ADDRESS vào VITE_PROVIDER_PUBLIC_KEY trong thư mục `/frontend/.env`
4.  Copy thông tin PRIVATE KEY vào VITE_PROVIDER_PRIVATE_KEY trong thư mục `/frontend/.env`
#### 5. Chạy dự án 
- Mở PowerShell và di chuyển đến thư mục `/compiler`, thực thi câu lệnh `./deploy.ps1` để triển khai Smart Contract 
- Di chuyển đến thư mục `/frontend` và thực thi câu lệnh `npm run dev` để chạy giao diện
#### _Ghi chú: trong trường hợp bị ngăn quyền thực thi của Window thì sử dụng câu lệnh: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` để cấp quyền sau đó tiếp tục các bước sau như bình thường_
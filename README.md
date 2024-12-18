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
  - Ghi âm.
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
1. Clone dự án:
  
   git clone https://github.com/phatlenguyen166/ChatApp_BlockChain.git
2. Chạy giao diện
    + Vào thư mục chứa dự án:
      ```bash
      cd ChatApp_BlockChain/
    + Vào thư mục chứa giao diện của dự án:
      ```bash
       cd frontend/
    + Cài đặt dependencies:
       ```bash
       npm install
    ```bash
      Khởi chạy giao diện: npm run dev
3. Chạy smart contract
    + Vào thư mục chứa contract:
      ```bash
      cd compiler
    + Cài đặt truffle:
      ```bash
       npm i -g truffle
    + Chạy file ./deploy.ps1
4. Khởi chạy Ganache và IPFS Desktop






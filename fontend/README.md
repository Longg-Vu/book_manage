# Book Management Frontend

Frontend React/Vite cho màn hình Home quản lý sách.

## Chạy local

```powershell
npm install
npm run dev
```

Truy cập:

```text
http://127.0.0.1:5173
```

Backend cần chạy ở:

```text
http://127.0.0.1:8000
```

Vite proxy đã chuyển `/api` về backend, nên không cần cấu hình CORS khi chạy local.

## Chức năng

- Login JWT bằng `/api/token/`.
- Logout bằng `/api/logout/`.
- Hiển thị danh sách sách từ `/api/books/`.
- Phân trang 20 hoặc 100 record.
- Filter theo `title` và `author`.
- Thêm sách mới.
- Xem chi tiết sách.
- Cập nhật sách bằng `PATCH /api/books/<id>/`.
- Xóa sách sau khi confirm.

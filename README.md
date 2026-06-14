# Book Management

Ứng dụng quản lý sách gồm backend Django REST Framework và frontend React/Vite.

## Chức năng

- CRUD sách tại `/api/books/` và `/api/books/<id>/`.
- Phân trang mặc định 20 record, cho phép chọn 20 hoặc 100 record.
- Custom filter theo `title`, `author`, `price` và `quantity`.
- Xác thực bằng JWT.
- Màn hình Home hiển thị danh sách, filter, thêm, xem chi tiết, sửa và xóa sách.

## Chạy backend

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
docker compose up -d db
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend chạy tại:

```text
http://127.0.0.1:8000
```

## Chạy frontend

Mở terminal khác:

```powershell
cd fontend
npm install
npm run dev
```

Frontend chạy tại:

```text
http://127.0.0.1:5173
```

Vite đã cấu hình proxy `/api` sang backend `http://127.0.0.1:8000`, nên frontend gọi API bằng đường dẫn `/api/books/`.

Lấy access token:

```http
POST /api/token/
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

Khi gọi API sách, thêm header:

```text
Authorization: Bearer <access_token>
```

## Endpoint

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| GET | `/api/books/` | Lấy danh sách sách |
| POST | `/api/books/` | Thêm sách |
| GET | `/api/books/<id>/` | Xem chi tiết |
| PUT | `/api/books/<id>/` | Cập nhật toàn bộ |
| PATCH | `/api/books/<id>/` | Cập nhật một phần |
| DELETE | `/api/books/<id>/` | Xóa sách |

## Pagination và filter

```text
/api/books/?page=1
/api/books/?page=1&page_size=100
/api/books/?title=python
/api/books/?author=John
/api/books/?price=19.99
/api/books/?quantity=10
```

Các filter có thể được kết hợp trong cùng một request.

## Frontend Home

Màn hình Home có các phần:

1. API Login: đăng nhập bằng tài khoản Django để lấy JWT.
2. Filter Books: lọc theo `title` và `author`.
3. Add Book: thêm sách mới với `title`, `author`, `price`, `quantity`.
4. Book List: hiển thị danh sách, page size 20/100, nút Next và Previous.
5. Detail, Edit, Delete: thao tác cho từng dòng sách.

## Chạy test

Test sử dụng SQLite trong bộ nhớ nên không cần bật PostgreSQL:

```powershell
python manage.py test book --settings=book_manage.test_settings
```

## Minh chứng cần chụp

1. Link GitHub source code backend và frontend.
2. Screenshot Home hiển thị danh sách sách lấy từ API.
3. Screenshot có phân trang 20 hoặc 100 record.
4. Screenshot filter theo `title` hoặc `author`.
5. Screenshot thêm, sửa, xem chi tiết hoặc xóa sách nếu giáo viên yêu cầu thêm minh chứng.

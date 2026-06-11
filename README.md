# Book Management API

REST API quản lý sách được xây dựng bằng Django REST Framework, PostgreSQL và JWT.

## Chức năng

- CRUD sách tại `/api/books/` và `/api/books/<id>/`.
- Phân trang mặc định 20 record, cho phép chọn 20 hoặc 100 record.
- Custom filter theo `title`, `author`, `price` và `quantity`.
- Xác thực bằng JWT.

## Cài đặt

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
docker compose up -d db
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

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

## Chạy test

Test sử dụng SQLite trong bộ nhớ nên không cần bật PostgreSQL:

```powershell
python manage.py test book --settings=book_manage.test_settings
```

## Minh chứng cần chụp

1. Danh sách có các trường `count`, `next`, `previous`, `results`.
2. Filter theo `title` hoặc `author`.
3. Filter theo `price` hoặc `quantity`.
4. Các request CRUD thành công trong Postman hoặc trình duyệt DRF.

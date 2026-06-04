
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from book import views
from book.view_books import books, book_detail

router = DefaultRouter()
router.register(r'books', views.BookViewSet, basename='book')

urlpatterns = [
    path('home', views.home, name='home'),
    path('books_old/', books, name='books_old'), # Rename original to avoid conflict
    path('books/<int:book_id>/', book_detail, name='book_detail'),
    path('', include(router.urls)),
]


from django.urls import path
from book import views
from book.view_books import books, book_detail

urlpatterns = [
    path('home', views.home, name='home'),
    path('books/', books, name='books'),
    path('books/<int:book_id>/', book_detail, name='book_detail'),
]

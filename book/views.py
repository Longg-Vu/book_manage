from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .filters import filter_books
from .models import Book
from .pagination import BookPagination
from .serializers import BookSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by("id")
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = BookPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        return filter_books(queryset, self.request.query_params)

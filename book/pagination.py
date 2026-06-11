from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination


class BookPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_page_size(self, request):
        value = request.query_params.get(self.page_size_query_param)

        if value is None:
            return self.page_size

        try:
            value = int(value)
        except (TypeError, ValueError):
            raise ValidationError({"page_size": "Page size phải là số."})

        if value not in (20, 100):
            raise ValidationError({"page_size": "Chỉ chấp nhận 20 hoặc 100."})

        return value

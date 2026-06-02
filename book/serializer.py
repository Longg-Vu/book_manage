from rest_framework import serializers

from book.models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Giá sách phải lớn hơn 0"
            )
        return value
    def validate_title(self, value):
        if len(value) < 0:
            raise serializers.ValidationError(
                "Tiêu đề sách phải có ít nhất 1 ký tự"
            )
        return value
    def validate_author(self,value):
        if len(value)< 0:
            raise serializers.ValidationError(
                "Tên tác giả phải có ít nhất 1 ký tự"
            )
        return value
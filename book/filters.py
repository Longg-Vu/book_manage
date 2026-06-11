from decimal import Decimal, InvalidOperation

from rest_framework.exceptions import ValidationError


def parse_price(value):
    try:
        price = Decimal(value)
    except (InvalidOperation, ValueError):
        raise ValidationError({"price": "Price không hợp lệ."})

    if not price.is_finite():
        raise ValidationError({"price": "Price không hợp lệ."})

    return price


def parse_quantity(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        raise ValidationError({"quantity": "Quantity phải là số nguyên."})


def filter_books(queryset, params):
    title = params.get("title")
    author = params.get("author")
    price = params.get("price")
    quantity = params.get("quantity")

    if title:
        queryset = queryset.filter(title__icontains=title.strip())

    if author:
        queryset = queryset.filter(author__icontains=author.strip())

    if price is not None and price != "":
        queryset = queryset.filter(price=parse_price(price))

    if quantity is not None and quantity != "":
        queryset = queryset.filter(quantity=parse_quantity(quantity))

    return queryset

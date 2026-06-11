from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from .models import Book


class BookApiTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = get_user_model().objects.create_user(
            username="book_tester",
            password="test-password",
        )
        Book.objects.bulk_create(
            [
                Book(
                    title=f"Book {index}",
                    author=f"Author {index % 5}",
                    price=Decimal(index),
                    quantity=index,
                )
                for index in range(1, 106)
            ]
        )
        cls.special_book = Book.objects.create(
            title="Learning Python",
            author="Guido van Rossum",
            price=Decimal("55.50"),
            quantity=999,
        )

    def setUp(self):
        self.client.force_authenticate(user=self.user)
        self.list_url = reverse("book-list")

    def test_authentication_is_required(self):
        client = APIClient()

        response = client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_default_pagination_returns_twenty_books(self):
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 106)
        self.assertEqual(len(response.data["results"]), 20)
        self.assertIsNotNone(response.data["next"])

    def test_page_size_accepts_one_hundred_and_rejects_other_values(self):
        response = self.client.get(self.list_url, {"page_size": 100})
        invalid_response = self.client.get(self.list_url, {"page_size": 50})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 100)
        self.assertEqual(invalid_response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_filters_books_by_supported_fields(self):
        filters = {
            "title": "python",
            "author": "guido",
            "price": "55.50",
            "quantity": "999",
        }

        for field, value in filters.items():
            with self.subTest(field=field):
                response = self.client.get(self.list_url, {field: value})

                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertEqual(response.data["count"], 1)
                self.assertEqual(
                    response.data["results"][0]["id"],
                    self.special_book.id,
                )

    def test_invalid_numeric_filters_return_bad_request(self):
        price_response = self.client.get(self.list_url, {"price": "invalid"})
        quantity_response = self.client.get(
            self.list_url,
            {"quantity": "invalid"},
        )

        self.assertEqual(
            price_response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertEqual(
            quantity_response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_create_rejects_invalid_price_and_quantity(self):
        invalid_price_response = self.client.post(
            self.list_url,
            {
                "title": "Invalid Price",
                "author": "Author",
                "price": "0.00",
                "quantity": 1,
            },
            format="json",
        )
        invalid_quantity_response = self.client.post(
            self.list_url,
            {
                "title": "Invalid Quantity",
                "author": "Author",
                "price": "10.00",
                "quantity": -1,
            },
            format="json",
        )

        self.assertEqual(
            invalid_price_response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("price", invalid_price_response.data)
        self.assertEqual(
            invalid_quantity_response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("quantity", invalid_quantity_response.data)

    def test_create_retrieve_update_patch_and_delete_book(self):
        create_response = self.client.post(
            self.list_url,
            {
                "title": "New Book",
                "author": "New Author",
                "price": "20.00",
                "quantity": 10,
            },
            format="json",
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)

        detail_url = reverse("book-detail", args=[create_response.data["id"]])
        retrieve_response = self.client.get(detail_url)
        self.assertEqual(retrieve_response.status_code, status.HTTP_200_OK)

        update_response = self.client.put(
            detail_url,
            {
                "title": "Updated Book",
                "author": "Updated Author",
                "price": "25.00",
                "quantity": 20,
            },
            format="json",
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)

        patch_response = self.client.patch(
            detail_url,
            {"quantity": 30},
            format="json",
        )
        self.assertEqual(patch_response.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_response.data["quantity"], 30)

        delete_response = self.client.delete(detail_url)
        self.assertEqual(
            delete_response.status_code,
            status.HTTP_204_NO_CONTENT,
        )
        self.assertFalse(
            Book.objects.filter(pk=create_response.data["id"]).exists()
        )

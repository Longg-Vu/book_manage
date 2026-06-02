import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from book.models import Book
from book.serializer import BookSerializer

# Create your views here.

def get_request_data(request):
    if request.content_type and "application/json" in request.content_type:
        try:
            return json.loads(request.body.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            return None
    return request.POST.dict()


@csrf_exempt
def books(request):
    if request.method == "GET":
        queryset = Book.objects.all()
        data_books = BookSerializer(queryset, many=True)
        return JsonResponse({"books": data_books.data})

    if request.method == "POST":
        data = get_request_data(request)
        if data is None:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)

        serializer = BookSerializer(data=data)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)

        serializer.save()
        return JsonResponse(
            {"message": "Book created successfully", "book": serializer.data},
            status=201
        )

    return JsonResponse({"error": "Method not allowed"}, status=405)


@csrf_exempt
def book_detail(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return JsonResponse({"error": "Book not found"}, status=404)

    if request.method == "GET":
        return JsonResponse({"book": BookSerializer(book).data})

    if request.method == "PUT":
        data = get_request_data(request)
        if data is None:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)

        serializer = BookSerializer(book, data=data)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=400)
        serializer.save()
        return JsonResponse({"message": "Book updated successfully", "book": serializer.data})

    if request.method == "DELETE":
        book.delete()
        return JsonResponse({"message": "Book deleted successfully"}, status=200)

    return JsonResponse({"error": "Method not allowed"}, status=405)
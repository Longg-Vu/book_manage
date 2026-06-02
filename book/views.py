from django.shortcuts import render
from django.http import JsonResponse


# Create your views here.
def home(request):
    data ={
        "book":[
            {
                "title":"Học lỏm C++",
                "author":"John Doe",
                "price":19.99,
                "isbn":"978-1234567890",
            },
            {
                "title":"Lập trình Python",
                "author":"Jane Smith",
                "price":24.99,
                "isbn":"978-0987654321",
            },
            {
                "title":"Cơ sở dữ liệu MySQL",
                "author":"Alice Johnson",
                "price":29.99,
                "isbn":"978-1122334455",
            },
        ]
    }
    return JsonResponse(data)
        

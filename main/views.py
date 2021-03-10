from django.shortcuts import render
from main.numbers.numbers import Number
from django.http import Http404, HttpResponse
import json
import threading

# Create your views here.
def landing_page(request):
    return render(request, 'landing_page.html')

def get_data(request, n):
    number = Number()
    data = number.run(n)
    if not data:
        return HttpResponse(status=404)
    return HttpResponse(json.dumps(data))

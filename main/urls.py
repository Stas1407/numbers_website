from django.contrib import admin
from django.urls import path
from . import views 

urlpatterns = [
    path('', views.landing_page, name="landing_page"),
    path('get_data/<int:n>', views.get_data, name="get_data")
]

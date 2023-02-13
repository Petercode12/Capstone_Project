from django.urls import path
from src.views import *
# http://127.0.0.1:8000/
urlpatterns = [
    path('all_exams/', query_all_exams_api, name="allExams"),
]
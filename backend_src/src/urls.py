from django.urls import path
from src import views
# http://127.0.0.1:8000/
urlpatterns = [
    path('all_exams/', views.query_all_exams_api, name="allExams"),
    path('posts/', views.test_api, name = "postsALL"),
    path('posts/<int:event_id>', views.delete_api, name = "deleteOne"),
    path('all_exams/<int:event_id>', views.query_exam_by_id, name="queryExamById")
]
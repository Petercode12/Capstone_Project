from django.urls import path
from src import views

# http://127.0.0.1:8000/
urlpatterns = [
    path("all_exams/", views.query_all_exams_api, name="allExams"),
    path("all_exams/<int:event_id>", views.query_exam_by_id, name="queryExamById"),
    path("exams/", views.query_exams_by_userid, name="queryExamByUserId"),
    path("posts/", views.test_api, name="postsALL"),
    path("posts/<int:event_id>", views.delete_api, name="deleteOne"),
    path("save_exam/", views.insert_new_exam, name="insertNewExam"),
    path("practice_tests/", views.query_all_practice_tests, name="allTests"),
    path(
        "practice_tests/<int:event_id>",
        views.query_practice_test_by_id,
        name="queryTestById",
    ),
    path(
        "save_questions_and_answers/<int:exam_id>",
        views.insert_questions_and_answers,
        name="insertQuestionsAnswers",
    ),
    path(
        "query_questions_and_answers_by_examid/<int:exam_id>",
        views.query_questions_and_answers_by_examid,
        name="queryQuestionsAnswersByExamId",
    ),
]

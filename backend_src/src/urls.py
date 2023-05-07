from django.urls import path
from src import views

# http://127.0.0.1:8000/
urlpatterns = [
    path("all_exams/<int:user_id>", views.query_all_exams_api, name="allExamsByUserId"),
    path(
        "all_exams/<int:user_id>/<int:event_id>",
        views.query_exam_by_id,
        name="queryExamById",
    ),
    path("exams/<int:user_id>", views.query_exams_by_userid, name="queryExamByUserId"),
    path(
        "recent_practice_exams/<int:user_id>",
        views.query_recent_practice_exams_by_userid,
        name="queryRecentPracticeExamsByUserId",
    ),
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
    path("test_result/<int:exam_id>", views.test_result, name="insertGetTestResult"),
    path(
        "test_result_specific/<int:exam_id>",
        views.insert_test_result_specific,
        name="insertTestResultSpecific",
    ),
    path("all_users/", views.query_all_users, name="queryAllUsers"),
    path("save_user/", views.insert_new_user, name="insertNewUser"),
    path(
        "save_shared_info/<int:exam_id>",
        views.insert_shared_info,
        name="insertSharedInfo",
    ),
    path(
        "query_shared_info_by_examid/<int:exam_id>",
        views.query_shared_info_by_examid,
        name="querySharedInfoByExamId",
    ),
    path(
        "query_exam_tags/",
        views.query_exam_tags,
        name="queryExamTags",
    ),
    path(
        "auth/",
        views.authentication,
        name="authentication",
    ),
    path("my_account/tests/<int:user_id>", views.query_total_test_result, name="queryAllTestResults"),
    path("my_account/tests/created/<int:user_id>", views.query_total_test_created_result, name="queryAllTestCreatedResults"),
]

from rest_framework import serializers
from src.models import *


class exams_collection_serializer(serializers.ModelSerializer):
    class Meta:
        model = EXAMS_COLLECTION
        fields = (
            "id",
            "Name",
            "Created_Date",
            "Last_Modified_Date",
            "User_id",
        )


class exams_collection_serializer2(serializers.ModelSerializer):
    class Meta:
        model = EXAMS_COLLECTION
        fields = (
            "id",
            "Name",
            "Created_Date",
            "Last_Modified_Date",
            "Last_Modified_Date_Time",
            "User_id",
            "duration",
            "image",
            "description",
        )


# class test_serializer(serializers.ModelSerializer):
#     class Meta:
#         model = TEST_API
#         fields = ("userID", "id", "title", "body")


class questions_and_answers_serializer(serializers.ModelSerializer):
    class Meta:
        model = QUESTIONS_AND_ANSWERS
        fields = (
            "id",
            "Ordinal",
            "Question",
            "Correct_answer",
            "Answer_a",
            "Answer_b",
            "Answer_c",
            "Answer_d",
            "Solution",
            "Type",
            "audioName",
            "audio",
            "exam_id",
        )


class test_result_serializer(serializers.ModelSerializer):
    class Meta:
        model = TEST_RESULT
        fields = (
            "id",
            "Score",
            "Date",
            "Start_time",
            "End_time",
            "exam_id",
            "user_id",
        )

class test_result_specific_serializer(serializers.ModelSerializer):
    class Meta:
        model = TEST_RESULT_SPECIFIC
        fields = (
            "id",
            "Ordinal",
            "Question",
            "Type",
            "Answer_a",
            "Answer_b",
            "Answer_c",
            "Answer_d",
            "Correct_answer",
            "Solution",
            "User_answer_MCQ",
            "User_answer_CONS",
            "User_answer_FIB",
            "Mark",
            "Mark_FIB",
            "test_result_id",
        )


class user_serializer(serializers.ModelSerializer):
    class Meta:
        model = USER
        fields = ("id", "Username", "Password", "Email", "Created_Date", "Avatar", "Banner")


class shared_users_serializer(serializers.ModelSerializer):
    class Meta:
        model = SHARED_USERS
        fields = ("id", "exam_id", "User_id", "Shared_user_id")


class exam_tags_serializer(serializers.ModelSerializer):
    class Meta:
        model = EXAM_TAGS
        fields = ("id", "exam_id", "tag")

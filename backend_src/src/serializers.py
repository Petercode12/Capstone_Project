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
            "Is_split",
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
            "Is_split",
            "User_id",
            "duration",
            "image",
            "description",
        )


class test_serializer(serializers.ModelSerializer):
    class Meta:
        model = TEST_API
        fields = ("userID", "id", "title", "body")


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
            "Split_content",
            "Is_MCQ",
            "exam_id",
        )

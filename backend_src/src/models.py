from django.db import models
from django.core.files.base import ContentFile
from django.db.models import CharField, Model
from django_mysql.models import ListTextField
import datetime
# Create your models here.
class USER(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    Username = models.CharField(max_length=15, blank=False)
    Password = models.CharField(max_length=200, blank=False)
    Email = models.EmailField(max_length=200, unique=True, blank=True)
    Avatar = models.TextField(default=None)
    Banner = models.TextField(default="")
    Created_Date = models.DateField()


class EXAMS_COLLECTION(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    Name = models.CharField(max_length=200, blank=False)
    Created_Date = models.DateField()
    Last_Modified_Date = models.DateField()
    Last_Modified_Date_Time = models.DateTimeField(default = str(datetime.datetime.now()))
    User = models.ForeignKey(USER, on_delete=models.CASCADE, related_name="User_id1")
    duration = models.FloatField(default=0)
    image = models.TextField(null=False, default="")
    description = models.TextField(default=None)


class QUESTIONS_AND_ANSWERS(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    Ordinal = models.IntegerField()
    Question = models.TextField()
    Correct_answer = models.CharField(max_length=1, blank=False, null=True)  # For MCQ
    Answer_a = models.TextField(null=True)
    Answer_b = models.TextField(null=True)
    Answer_c = models.TextField(null=True)
    Answer_d = models.TextField(null=True)
    Solution = models.TextField(null=True)  # For constructive
    Type = models.TextField(default="")
    audioName = models.TextField(null=False, default="")
    audio = models.TextField(null=False, default="")
    exam = models.ForeignKey(EXAMS_COLLECTION, on_delete=models.CASCADE)


class AUDIO_QUESTIONS_AND_SOLUTIONS(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    Question = models.TextField()
    Solution = models.TextField()
    Ordinal = models.IntegerField()
    exam = models.ForeignKey(EXAMS_COLLECTION, on_delete=models.CASCADE)


class AUDIO(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    Audio_name = models.CharField(max_length=200, blank=False)
    Audio_link = models.URLField()
    exam = models.ForeignKey(EXAMS_COLLECTION, on_delete=models.CASCADE)


class TEST_RESULT(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    Score = models.IntegerField(null=True)  # điểm trong TH full trắc nghiệm
    Date = models.DateTimeField(null=True)
    Start_time = models.TimeField(null=False)
    End_time = models.TimeField(null=False)
    exam = models.ForeignKey(EXAMS_COLLECTION, on_delete=models.CASCADE)
    user = models.ForeignKey(USER, on_delete=models.CASCADE)


class EXAM_TAGS(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    exam = models.ForeignKey(EXAMS_COLLECTION, on_delete=models.CASCADE)
    tag = models.IntegerField()


class TEST_RESULT_SPECIFIC(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    Ordinal = models.IntegerField(null=True)
    Question = models.TextField(null=True)
    Type = models.TextField(default="")
    Answer_a = models.TextField(null=True)
    Answer_b = models.TextField(null=True)
    Answer_c = models.TextField(null=True)
    Answer_d = models.TextField(null=True)
    Correct_answer = models.CharField(max_length=1, blank=False, null=True)  # For MCQ
    Solution = models.TextField(null=True)  # For constructive
    Solution_FIB = ListTextField(base_field=models.CharField(max_length=100),null=True) # For FIB
    User_answer_MCQ = models.CharField(max_length=1, blank=False, null=True)  # For MCQ
    User_answer_CONS = models.TextField(null=True)  # For constructive
    User_answer_FIB = ListTextField(base_field=models.CharField(max_length=100),null=True)  # For fill in blank
    Mark = models.IntegerField(
        null=True
    )  # 0 hoặc 1 tương ứng với điểm của câu trắc nghiệm
    Mark_FIB = ListTextField(base_field=models.IntegerField(), size=100, null=True)
    test_result = models.ForeignKey(TEST_RESULT, on_delete=models.CASCADE)


# class TEST_API(models.Model):
#     userID = models.IntegerField()
#     id = models.AutoField(primary_key=True, null=False)
#     title = models.CharField(max_length=200, blank=False)
#     body = models.CharField(max_length=200, blank=False)


class SHARED_USERS(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    exam = models.ForeignKey(EXAMS_COLLECTION, on_delete=models.CASCADE)
    User = models.ForeignKey(USER, on_delete=models.CASCADE, related_name="User_id")
    Shared_user = models.ForeignKey(
        USER, on_delete=models.CASCADE, related_name="Shared_user_id"
    )

from django.db import models
from django.core.files.base import ContentFile

# Create your models here.
class USER(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    Username = models.CharField(max_length=200, blank=False)
    Password = models.CharField(max_length=200, blank=False)
    Email = models.CharField(max_length=200, blank=True)
    Created_Date = models.DateField()


class EXAMS_COLLECTION(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    Name = models.CharField(max_length=200, blank=False)
    Created_Date = models.DateField()
    Last_Modified_Date = models.DateField()
    Is_split = models.BooleanField(default=True)
    User = models.ForeignKey(USER, on_delete=models.CASCADE)
    duration = models.FloatField(default=0)
    image = models.TextField()
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
    Split_content = models.BooleanField(default=False)
    Is_MCQ = models.BooleanField(default=True)
    exam = models.ForeignKey(EXAMS_COLLECTION, on_delete=models.CASCADE)


class AUDIO_QUESTIONS_AND_SOLUTIONS(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    Question = models.TextField()
    Solution = models.TextField()
    Ordinal = models.IntegerField()
    Split_content = models.BooleanField(default=True)
    exam = models.ForeignKey(EXAMS_COLLECTION, on_delete=models.CASCADE)


class AUDIO(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    Audio_name = models.CharField(max_length=200, blank=False)
    Audio_link = models.URLField()
    exam = models.ForeignKey(EXAMS_COLLECTION, on_delete=models.CASCADE)


class TEST_RESULT(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    Score = models.IntegerField()
    Date = models.DateField()
    exam = models.ForeignKey(EXAMS_COLLECTION, on_delete=models.CASCADE)
    User = models.ForeignKey(USER, on_delete=models.CASCADE)


class TEST_API(models.Model):
    userID = models.IntegerField()
    id = models.AutoField(primary_key=True, null=False)
    title = models.CharField(max_length=200, blank=False)
    body = models.CharField(max_length=200, blank=False)

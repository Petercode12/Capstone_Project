from django.db import models

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

class MCQ_QUESTIONS_AND_ANSWERS(models.Model):
  id = models.AutoField(primary_key=True, null=False)
  Ordinal = models.IntegerField()
  Question = models.TextField()
  Correct_answer = models.CharField(max_length=1, blank=False)
  Answer_a = models.TextField()
  Answer_b = models.TextField()
  Answer_c = models.TextField()
  Answer_d = models.TextField()
  Split_content = models.BooleanField(default=True)
  exam = models.ForeignKey(EXAMS_COLLECTION, on_delete=models.CASCADE)

class CONSTRUCTIVE_QUESTIONS_AND_SOLUTIONS(models.Model):
  id = models.AutoField(primary_key=True, null=False)
  Question = models.TextField()
  Solution = models.TextField()
  Ordinal = models.IntegerField()
  Split_content = models.BooleanField(default=True)
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
  body =  models.CharField(max_length=200, blank=False)
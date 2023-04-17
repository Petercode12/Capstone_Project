from math import ceil, floor
import json
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from src.models import *
from django.http.response import JsonResponse
from src.serializers import *
from django.http import HttpResponse
from django.core.paginator import Paginator
from django.core import serializers as core_serializers
from datetime import date
import datetime

test_result_pk = 1
# Create your views here.
@csrf_exempt
def query_all_exams_api(request):
    if request.method == "GET":
        exams = EXAMS_COLLECTION.objects.all()
        start = int(request.GET["_start"])
        end = int(request.GET["_end"])
        per_page = end - start
        page = floor(end / per_page)
        exams_paginator = Paginator(exams, per_page)
        exams_serializer = exams_collection_serializer(
            exams_paginator.page(page), many=True
        )
        content_range = len(exams)
        headers = {"X-Total-Count": content_range}
        return JsonResponse(
            status=200, headers=headers, data=exams_serializer.data, safe=False
        )


@csrf_exempt
def query_all_practice_tests(request):
    if request.method == "GET":
        exams = EXAMS_COLLECTION.objects.all()
        start = int(request.GET["_start"])
        end = int(request.GET["_end"])
        per_page = end - start
        total = len(exams)
        page = floor(end / per_page)
        exams_paginator = Paginator(exams, per_page)
        exams_serializer = exams_collection_serializer(
            exams_paginator.page(page), many=True
        )
        content_range = len(exams)
        headers = {"X-Total-Count": content_range}
        # return JsonResponse(status = 200, safe=False, headers = {'Access-Control-Expose-Headers': 'Content-Range','Content-Range': 'posts 0-24/319','Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT', 'Access-Control-Allow-Origin': '*'}, data = exams_serializer.data)
        # headers = {'Access-Control-Expose-Headers': 'Content-Range','Content-Range': 'posts 0-24/319','Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT', 'Access-Control-Allow-Origin': '*'},
        return JsonResponse(
            status=200, headers=headers, data=exams_serializer.data, safe=False
        )


@csrf_exempt
def query_practice_test_by_id(request, event_id):
    if request.method == "GET":
        exam = EXAMS_COLLECTION.objects.get(id=event_id)
        exam_serializer = exams_collection_serializer2(exam)
        return JsonResponse(exam_serializer.data, safe=False)


@csrf_exempt
def query_exams_by_userid(request, user_id):
    if request.method == "GET":
        exams = EXAMS_COLLECTION.objects.filter(User_id=user_id)
        shared_exams = SHARED_USERS.objects.filter(Shared_user_id=user_id).values()
        for e in shared_exams:
            exam = EXAMS_COLLECTION.objects.filter(id=e["exam_id"])
            exams = exams | exam
        exams_serializer = exams_collection_serializer2(exams, many=True)
        return JsonResponse(exams_serializer.data, safe=False)


@csrf_exempt
def query_exam_by_id(request, event_id):
    if request.method == "GET":
        exam = EXAMS_COLLECTION.objects.get(id=event_id)
        exam_serializer = exams_collection_serializer2(exam)
        return JsonResponse(exam_serializer.data, safe=False)
    if request.method == "DELETE":
        if event_id is not None and event_id != "":
            tests = EXAMS_COLLECTION.objects.get(id=event_id)
            test_serializer = exams_collection_serializer2(tests)
            if tests:
                tests.delete()
            else:
                return HttpResponse(status=404)
            return JsonResponse(test_serializer.data, safe=False)
        return HttpResponse(status=400)
    if request.method == "PATCH":
        test_detail = EXAMS_COLLECTION.objects.get(id=event_id)
        data = json.loads(request.body)
        test_detail.Name = data["Name"]
        test_detail.Last_Modified_Date = str(date.today())
        test_detail.duration = data["duration"]
        test_detail.description = data["description"]
        test_detail.save()
        test_result_ser = exams_collection_serializer2(test_detail)
        return JsonResponse(test_result_ser.data, safe=False)

@csrf_exempt
def insert_new_exam(request):
    if request.method == "POST":
        data = json.loads(request.body)
        Name = data["Name"]
        Created_Date = str(date.today())
        Last_Modified_Date = str(date.today())
        User_id = data["User_id"]
        image = data["image"]
        duration = data["duration"]
        description = data["description"]
        exam = EXAMS_COLLECTION(
            Name=Name,
            Created_Date=Created_Date,
            Last_Modified_Date=Last_Modified_Date,
            User_id=User_id,
            image=image,
            duration=duration,
            description=description,
        )
        exam.save()
        exam_serializer = exams_collection_serializer2(exam)
        return JsonResponse(exam_serializer.data, safe=False)
    
     
@csrf_exempt
def insert_questions_and_answers(request, exam_id): 
    if request.method == "POST":
        # ko nên xóa chi tiết câu hỏi của những lần thay đổi trước
        delete_questions_and_answers = QUESTIONS_AND_ANSWERS.objects.filter(
            exam_id=exam_id
        )
        delete_questions_and_answers.delete()
        dataList = json.loads(request.body)
        questions_and_answers = None
        for data in dataList:  # dataList là array of dict
            Ordinal = data["Ordinal"]
            Question = data["Question"]
            Correct_answer = data["Correct_answer"]
            Answer_a = data["Answer_a"]
            Answer_b = data["Answer_b"]
            Answer_c = data["Answer_c"]
            Answer_d = data["Answer_d"]
            Solution = data["Solution"]
            Split_content = False
            Is_MCQ = data["Is_MCQ"]
            exam_id1 = data["exam_id"]
            questions_and_answers = QUESTIONS_AND_ANSWERS(
                Ordinal=Ordinal,
                Question=Question,
                Correct_answer=Correct_answer,
                Answer_a=Answer_a,
                Answer_b=Answer_b,
                Answer_c=Answer_c,
                Answer_d=Answer_d,
                Solution=Solution,
                Split_content=Split_content,
                Is_MCQ=Is_MCQ,
                exam_id=exam_id1,
            )
            questions_and_answers.save()
            q_and_a_serializer = questions_and_answers_serializer(questions_and_answers)
        # sau khi update phải cập nhật lại thời gian thay đổi
        test = EXAMS_COLLECTION.objects.get(id=exam_id)
        test.Last_Modified_Date = datetime.date.today()
        # import datetime
        # datetime.date.today()  # Returns 2018-01-15
        # datetime.datetime.now() # Returns 2018-01-15 09:00
        print(datetime.date.today())
        test.save()
        test_ser = exams_collection_serializer(test)
        return JsonResponse({"test_data": test_ser.data,"q_and_a":q_and_a_serializer.data}, safe=False)
    


@csrf_exempt
def query_questions_and_answers_by_examid(request, exam_id):
    if request.method == "GET":
        exam = EXAMS_COLLECTION.objects.get(id=exam_id)

        questions_and_answers = QUESTIONS_AND_ANSWERS.objects.filter(
            exam_id=exam_id
        ).order_by("Ordinal")
        exam_collections = exams_collection_serializer2(exam)
        q_and_a_serializer = questions_and_answers_serializer(
            questions_and_answers, many=True
        )
        return JsonResponse(
            {
                "q_and_a": q_and_a_serializer.data,
                "duration": exam_collections.data["duration"],
            },
            safe=False,
        )
@csrf_exempt
def test_result(request, exam_id):
    if request.method == "POST":
        dataList = json.loads(request.body)
        for data in dataList:  # dataList là array of dict
            Score = data["Score"]
            Date = datetime.datetime.now()
            Start_time = data["Start_time"]
            End_time = data["End_time"]
            exam_id = data["exam_id"]
            user_id = data["user_id"]
            test_result = TEST_RESULT(
                Score=Score,
                Date=Date,
                Start_time = Start_time,
                End_time = End_time,
                exam_id=exam_id,
                user_id=user_id,
            )
            instance = test_result.save()
            global test_result_pk
            test_result_pk = test_result.pk
        test_result_ser = test_result_serializer(test_result)
        return JsonResponse(
            {"id": test_result_pk, "data": test_result_ser.data}, safe=False
        )
    if request.method == "PATCH":
        test_result = TEST_RESULT.objects.get(id=exam_id)
        data = json.loads(request.body)
        test_result.Score = data["Score"]
        test_result.save()
        test_result_ser = test_result_serializer(test_result)
        return JsonResponse(test_result_ser.data, safe=False)
    if request.method == "GET":
        print("TEST_ID: ", exam_id)
        test = TEST_RESULT.objects.get(id=exam_id)
        test_ser = test_result_serializer(test)
        test_specific = TEST_RESULT_SPECIFIC.objects.filter(
            test_result_id=exam_id
        ).order_by("Ordinal")
        print("exam_id", test_ser.data["exam_id"])
        test_specific_ser = test_result_specific_serializer(
            test_specific, many=True
        )
        test_specific = TEST_RESULT_SPECIFIC.objects.filter(
            test_result_id=exam_id
        ).order_by("Ordinal")
        num_test_skip = test_specific.filter(User_answer_MCQ__exact="", User_answer_CONS__isnull=True).count()
        num_cons_question = test_specific.filter(Is_MCQ=0).count()
        print(test_specific_ser.data)
        return JsonResponse(
            {
                "test_info": test_ser.data,
                "test_specific": test_specific_ser.data,
                "total_question": len(test_specific_ser.data),
                "skip_question": num_test_skip,
                "nums_cons_question": num_cons_question,
            },
            safe=False,
        )
        

@csrf_exempt
def insert_test_result_specific(request, exam_id):
    if request.method == "POST":
        dataList = json.loads(request.body)
        questions_and_answers = None
        for data in dataList:
            Ordinal = data["Ordinal"]
            Question = data["Question"]
            Is_MCQ = data["Is_MCQ"]
            Answer_a = data["Answer_a"]
            Answer_b = data["Answer_b"]
            Answer_c = data["Answer_c"]
            Answer_d = data["Answer_d"]
            Correct_answer = data["Correct_answer"]
            Solution = data["Solution"]
            User_answer_MCQ = data["User_answer_MCQ"]
            User_answer_CONS = data["User_answer_CONS"]
            Mark = data["Mark"]
            test_result_id = data["test_result_id"]
            questions_and_answers = TEST_RESULT_SPECIFIC(
                Ordinal=Ordinal,
                Question=Question,
                Is_MCQ=Is_MCQ,
                Answer_a=Answer_a,
                Answer_b=Answer_b,
                Answer_c=Answer_c,
                Answer_d=Answer_d,
                Correct_answer=Correct_answer,
                Solution=Solution,
                User_answer_MCQ=User_answer_MCQ,
                User_answer_CONS=User_answer_CONS,
                Mark=Mark,
                test_result_id=test_result_id,
            )
            questions_and_answers.save()
        questions_and_answers_seri = test_result_specific_serializer(
            questions_and_answers
        )
        return JsonResponse(questions_and_answers_seri.data, safe=False)


@csrf_exempt
def query_all_users(request):
    if request.method == "GET":
        users = USER.objects.all()
        users_serializer = user_serializer(users, many=True)
        return JsonResponse(users_serializer.data, safe=False)


@csrf_exempt
def query_user_by_userid(request, user_id):  # Still not included in urls.py
    if request.method == "GET":
        user = USER.objects.filter(id=user_id).order_by("id")
        user_serializer = user_serializer(user, many=False)
        return JsonResponse(user_serializer.data, safe=False)


@csrf_exempt
def insert_new_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]
        email = data["email"]
        avatar = data["avatar"]
        created_date = str(date.today())
        user = USER(
            Username=username,
            Password=password,
            Email=email,
            Created_Date=created_date,
            Avatar=avatar,
        )
        user.save()
        us_serializer = user_serializer(user)
        return JsonResponse(us_serializer.data, safe=False)


@csrf_exempt
def insert_shared_info(request, exam_id):
    if request.method == "POST":
        delete_shared_info = SHARED_USERS.objects.filter(exam_id=exam_id)
        delete_shared_info.delete()
        user_id = EXAMS_COLLECTION.objects.filter(id=exam_id).values()[0]["User_id"]
        data = json.loads(request.body)["id"]
        shared_info = None
        for e in data:
            shared_info = SHARED_USERS(
                exam_id=exam_id,
                User_id=user_id,
                Shared_user_id=e,
            )
            shared_info.save()
        shared_info_serializer = shared_users_serializer(shared_info)
        return JsonResponse(shared_info_serializer.data, safe=False)


@csrf_exempt
def query_shared_info_by_examid(request, exam_id):
    if request.method == "GET":
        info = SHARED_USERS.objects.filter(exam_id=exam_id).order_by("id")
        info_serializer = shared_users_serializer(info, many=True)
        return JsonResponse(info_serializer.data, safe=False)


@csrf_exempt
def authentication(request):
    if request.method == "POST":
        data = json.loads(request.body)
        users = USER.objects.filter(
            Username=data["username"], Password=data["password"]
        )
        if users.exists():
            us_serializer = user_serializer(users.values()[0], many=False)
            return JsonResponse(status=200, data=us_serializer.data)
        else:
            return HttpResponse(status=400)


@csrf_exempt
def test_api(request):
    if request.method == "GET":
        tests = TEST_API.objects.all()
        start = int(request.GET["_start"])
        end = int(request.GET["_end"])
        per_page = end - start
        total = len(tests)
        page = floor(end / per_page)
        tests_paginator = Paginator(tests, per_page)
        tests_serializer = test_serializer(tests_paginator.page(page), many=True)  #
        content_range = len(tests)
        headers = {"X-Total-Count": content_range}
        return JsonResponse(
            status=200, headers=headers, data=tests_serializer.data, safe=False
        )


@csrf_exempt
def delete_api(request, event_id):
    if request.method == "DELETE":
        if event_id is not None and event_id != "":
            tests = TEST_API.objects.get(id=event_id)
            if tests:
                tests.delete()
            else:
                return HttpResponse(status=404)
            return HttpResponse(status=200)
    return HttpResponse(status=400)

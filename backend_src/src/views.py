from math import ceil, floor
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from src.models import *
from django.http.response import JsonResponse
from src.serializers import *
from django.http import HttpResponse
from django.core.paginator import Paginator
# Create your views here.
@csrf_exempt
def query_all_exams_api(request):
    if request.method == 'GET':
        exams = EXAMS_COLLECTION.objects.all()
        exams_serializer = exams_collection_serializer(exams, many=True)
        return JsonResponse(status = 200, safe=False, headers = {'Access-Control-Expose-Headers': 'Content-Range','Content-Range': 'posts 0-24/319','Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT', 'Access-Control-Allow-Origin': '*'}, data = exams_serializer.data)
        # headers = {'Access-Control-Expose-Headers': 'Content-Range','Content-Range': 'posts 0-24/319','Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT', 'Access-Control-Allow-Origin': '*'}, 
    
@csrf_exempt
def test_api(request):
    if request.method == 'GET':
        tests = TEST_API.objects.all()
        start = int(request.GET["_start"])
        end = int(request.GET['_end'])
        per_page = end-start
        total = len(tests)
        page = floor(end/per_page)
        print("The wanted page: ", page)
        tests_paginator = Paginator(tests, per_page)
        tests_serializer = test_serializer(tests_paginator.page(page), many=True) #
        content_range = len(tests)
        headers = {"X-Total-Count": content_range}
        return JsonResponse(status = 200, headers = headers, data=tests_serializer.data, safe=False)
@csrf_exempt
def delete_api(request, event_id):  
    if request.method == 'DELETE':
        if event_id is not None and event_id != "":
            print("Try to delete: ", event_id)
            tests = TEST_API.objects.get(id = event_id)
            if tests:
                tests.delete()    
            else: 
                return HttpResponse(status = 404)
            return HttpResponse(status = 200)
    return HttpResponse(status = 400)
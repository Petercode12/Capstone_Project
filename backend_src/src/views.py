from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from src.models import *
from django.http.response import JsonResponse
from src.serializers import *
# Create your views here.
@csrf_exempt
def query_all_exams_api(request):
    if request.method == 'GET':
        exams = EXAMS_COLLECTION.objects.all()
        exams_serializer = exams_collection_serializer(exams, many=True)
        return JsonResponse(exams_serializer.data, safe=False)
from rest_framework import serializers
from src.models import *

class exams_collection_serializer (serializers.ModelSerializer):
    class Meta:
        model = EXAMS_COLLECTION
        fields = ('id',
                  'Name',
                  'Created_Date',
                  'Last_Modified_Date',
                  'Is_split',
                  'User_id')

class test_serializer (serializers.ModelSerializer):
    class Meta:
        model = TEST_API
        fields = ('userID',
                  'id',
                  'title',
                  'body')


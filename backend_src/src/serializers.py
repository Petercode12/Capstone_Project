from rest_framework import serializers
from src.models import *

class exams_collection_serializer (serializers.ModelSerializer):
    class Meta:
        model = EXAMS_COLLECTION
        fields = ('ID',
                  'Name',
                  'Created_Date',
                  'Last_Modified_Date',
                  'Is_split',
                  'User_id')
        

from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = Room
        fields = [
            'id', 
            'title',
            'description',
            'creator', 
            'created_at',
        ]

        read_only_fields = ['creator']
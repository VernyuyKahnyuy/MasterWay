from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    
    creator_username = serializers.CharField(
        source='creator.username',
        read_only=True
    )

    class Meta:
        model = Room

        fields = [
            'id', 
            'title',
            'description',
            'creator', 
            'created_at',
            'creator_username'
        ]

        read_only_fields = ['creator']
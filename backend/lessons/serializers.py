# lessons/serializers.py

from rest_framework import serializers
from .models import Lesson


class LessonSerializer(serializers.ModelSerializer):

    creator_username = serializers.CharField(
        source='creator.username',
        read_only=True
    )

    room_title = serializers.CharField(
        source='room.title',
        read_only=True
    )

    class Meta:
        model = Lesson
        fields = '__all__'
        read_only_fields = ['creator']

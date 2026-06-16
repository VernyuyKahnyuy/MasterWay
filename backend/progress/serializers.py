# progress/serializers.py

from rest_framework import serializers
from .models import Enrollment, LessonProgress
from lessons.models import Lesson

class EnrollmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Enrollment

        fields = [
            'id',
            'learner',
            'room',
            'joined_at',
        ]

        read_only_fields = ['learner']

class LessonProgressSerializer(
    serializers.ModelSerializer
    ):

    lesson_title = serializers.CharField(
        source="lesson.title",
        read_only=True
    )

    room_title = serializers.CharField(
        source="lesson.room.title",
        read_only = True
    )

    class Meta:
        model = LessonProgress
        
        fields = [
            'id', 
            'learner',
            'lesson',
            'lesson_title',
            'room_title',
            'completed',
        ]

        read_only_fields = ['learner']
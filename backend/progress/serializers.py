from rest_framework import serializers
from .models import Enrollment, LessonProgress


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

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        
        fields = [
            'id', 
            'learner',
            'lesson',
            'completed',
        ]

        read_only_fields = ['learner']
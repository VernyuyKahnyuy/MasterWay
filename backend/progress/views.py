# progress/views.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Enrollment, LessonProgress
from .serializers import (EnrollmentSerializer, LessonProgressSerializer)
from lessons.models import Lesson


# LIST ENROLLMENTS
class EnrollmentListView(generics.ListAPIView):

    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(
            learner=self.request.user
        )
    
# CREATE ENROLLMENT
class EnrollmentCreateView(generics.CreateAPIView):

    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        serializer.save(learner=self.request.user)

class LessonProgressCreateView(generics.CreateAPIView):
    queryset = LessonProgress.objects.all()
    serializer_class = LessonProgressSerializer

    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(
            learner = self.request.user,
            completed = True
        )

class LessonProgressListView(generics.ListAPIView):
    
    serializer_class = LessonProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        room_id = self.request.query_params.get('room')

        if room_id:
            return LessonProgress.objects.filter(
                learner=self.request.user,
                lesson__room=room_id
            )
        
        return LessonProgress.objects.filter(learner=self.request.user)

class ContinueLearningView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        enrollments = Enrollment.objects.filter(
            learner=request.user
        )

        for enrollment in enrollments:

            room = enrollment.room

            completed_ids = LessonProgress.objects.filter(
                learner=request.user,
                completed=True,
                lesson__room=room
            ).values_list(
                "lesson_id",
                flat=True
            )

            next_lesson = Lesson.objects.filter(
                room=room
            ).exclude(
                id__in=completed_ids
            ).order_by(
                "order"
            ).first()

            if next_lesson:

                return Response({

                    "room_id": room.id,
                    "room_title": room.title,

                    "lesson_id":
                        next_lesson.id,

                    "lesson_title":
                        next_lesson.title

                })

        return Response(
            {
                "message":
                "No lessons available."
            }
        )
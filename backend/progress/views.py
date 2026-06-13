# progress/views.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Enrollment, LessonProgress
from .serializers import (EnrollmentSerializer, LessonProgressSerializer)

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
#lessons/views.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Lesson
from .serializers import LessonSerializer


# LIST ALL LESSONS
class LessonListView(generics.ListAPIView):

    serializer_class = LessonSerializer

    def get_queryset(self):
        room_id = self.request.query_params.get('room')

        if room_id:
            return Lesson.objects.filter(
                room=room_id 
            ).order_by('order')
        
        return Lesson.objects.all()
    

# CREATE LESSON
class LessonCreateView(generics.CreateAPIView):

    queryset = Lesson.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = LessonSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


# SINGLE LESSON
class LessonDetailView(generics.RetrieveAPIView):

    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class LessonUpdateView(generics.UpdateAPIView):

    queryset = Lesson.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = LessonSerializer

class LessonDeleteView(generics.DestroyAPIView):

    queryset = Lesson.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = LessonSerializer

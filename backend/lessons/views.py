from rest_framework import generics
from .models import Lesson
from .serializers import LessonSerializer


# LIST ALL LESSONS
class LessonListView(generics.ListAPIView):

    serializer_class = LessonSerializer

    def get_queryset(self):
        room_id = self.request.query_params.get('room')

        if room_id:
            return Lesson.objects.filter(room=room_id)
        
        return Lesson.objects.all()

# CREATE LESSON
class LessonCreateView(generics.CreateAPIView):

    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer


# SINGLE LESSON
class LessonDetailView(generics.RetrieveAPIView):

    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
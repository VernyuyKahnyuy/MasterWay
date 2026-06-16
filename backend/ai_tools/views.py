# ai_tools/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from lessons.models import Lesson
from .services import (generate_summary, generate_quiz)

from .services import recommend_rooms
from users.models import UserInterest

from rooms.models import Room

class LessonSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lesson_id = request.data.get('lesson_id')

        if not lesson_id:
            return Response({'error': 'Lesson ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found.'}, status=status.HTTP_404_NOT_FOUND)

        summary = generate_summary(lesson.content)

        return Response({'summary': summary}, status=status.HTTP_200_OK)


class LessonQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lesson_id = request.data.get('lesson_id')

        if not lesson_id:
            return Response({'error': 'Lesson ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lesson = Lesson.objects.get(id=lesson_id)
        except Lesson.DoesNotExist:
            return Response({'error': 'Lesson not found.'}, status=status.HTTP_404_NOT_FOUND)

        quiz = generate_quiz(lesson.content)

        return Response({'quiz': quiz}, status=status.HTTP_200_OK)
    

class RoomRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from progress.models import Enrollment

        interest_values = list(
            UserInterest.objects.filter(user=request.user).values_list('interest', flat=True)
        )

        if not interest_values:
            return Response({'error': 'No interests.'}, status=status.HTTP_404_NOT_FOUND)

        enrolled_room_ids = set(
            Enrollment.objects.filter(learner=request.user).values_list('room_id', flat=True)
        )

        rooms = Room.objects.all()

        recommended_ids = recommend_rooms(
            user=request.user,
            interests=interest_values,
            rooms=rooms,
            enrolled_room_ids=enrolled_room_ids,
        )

        if not recommended_ids:
            return Response({'rooms': []})

        room_map = {room.id: room for room in Room.objects.filter(id__in=recommended_ids)}
        data = [
            {'id': room_map[rid].id, 'title': room_map[rid].title, 'description': room_map[rid].description}
            for rid in recommended_ids
            if rid in room_map
        ]

        return Response({'rooms': data}, status=status.HTTP_200_OK)


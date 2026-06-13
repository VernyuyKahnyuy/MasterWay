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
        
        interests = (
        UserInterest.objects
        .filter(user=request.user)
        .order_by('-created_at')[:5]
        .first())

        if not interests:
            print("You have no interests as of now")
            return Response({'error': 'No interests.'}, status=status.HTTP_404_NOT_FOUND)
        
        rooms = Room.objects.all()

        recommendations = (
            recommend_rooms( 
                interests.interest, 
                rooms
            )
        )

        room_ids = [
            int(id.strip()) 
            for id in recommendations.split(',') 
            if id.strip().isdigit()]
        
        recommended_rooms = Room.objects.filter(id__in=room_ids)

        data = []

        for room in recommended_rooms:
            data.append({
                'id': room.id,
                'title': room.title,
                'description': room.description,
            })

        return Response(
            {'rooms': data}, 
            status=status.HTTP_200_OK
        )


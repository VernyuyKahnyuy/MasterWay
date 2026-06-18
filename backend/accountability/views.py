from datetime import date, timedelta

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model

from progress.models import LessonProgress
from .models import FeedEvent, StudyUpdate
from .serializers import FeedEventSerializer, StudyUpdateSerializer


class StudyUpdateCreateView(
    generics.CreateAPIView
):

    serializer_class = (
        StudyUpdateSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]

    def perform_create(
        self,
        serializer
    ):

        serializer.save(
            user=self.request.user
        )

class RoomStudyUpdateListView(
    generics.ListAPIView
):

    serializer_class = (
        StudyUpdateSerializer
    )

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        room_id = (
            self.request.query_params
            .get("room")
        )

        return StudyUpdate.objects.filter(
            room_id=room_id
        )


class GlobalStudyUpdateListView(
    generics.ListAPIView
):
    serializer_class = StudyUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudyUpdate.objects.select_related("user", "room").all()


class AdminStudyUpdateCreateView(APIView):
    """Admin-only: post a study update as any user."""
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        User = get_user_model()
        user_id = request.data.get("user_id")
        room_id = request.data.get("room")
        content = request.data.get("content", "").strip()
        if not all([user_id, room_id, content]):
            return Response({"detail": "user_id, room, and content are required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            target_user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        update = StudyUpdate.objects.create(user=target_user, room_id=room_id, content=content)
        return Response(StudyUpdateSerializer(update).data, status=status.HTTP_201_CREATED)


class FeedEventListView(generics.ListAPIView):
    serializer_class = FeedEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FeedEvent.objects.select_related('actor', 'actor__profile', 'room').all()


class StreakView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Admin override takes priority
        try:
            override = user.profile.streak_override
            if override is not None:
                return Response({"streak": override, "last_active": None})
        except Exception:
            pass

        progress_dates = set(
            LessonProgress.objects.filter(learner=user)
            .values_list("comleted_at__date", flat=True)
        )
        update_dates = set(
            StudyUpdate.objects.filter(user=user)
            .values_list("created_at__date", flat=True)
        )
        active_dates = progress_dates | update_dates

        today = date.today()
        # if today has activity, count forward from today; otherwise allow 1-day grace
        start = today if today in active_dates else today - timedelta(days=1)

        streak = 0
        cursor = start
        while cursor in active_dates:
            streak += 1
            cursor -= timedelta(days=1)

        last_active = max(active_dates) if active_dates else None

        return Response({"streak": streak, "last_active": str(last_active) if last_active else None})

    
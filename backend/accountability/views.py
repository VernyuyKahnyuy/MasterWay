from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import StudyUpdate
from .serializers import (
    StudyUpdateSerializer
)


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
    
    
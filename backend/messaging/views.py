# messaging/views.py

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Message
from .serializers import MessageSerializer

class MessageCreateView(
    generics.CreateAPIView
):

    serializer_class = MessageSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def perform_create(
        self,
        serializer
    ):

        serializer.save(
            sender=self.request.user
        )


class InboxView(
    generics.ListAPIView
):

    serializer_class = MessageSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        return Message.objects.filter(
            receiver=self.request.user
        ).order_by(
            "-created_at"
        )
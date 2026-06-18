from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model

from .models import Comment
from .serializers import CommentSerializer

User = get_user_model()

class CommentListView(generics.ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        room_id = self.request.query_params.get('room')

        if room_id:
            return Comment.objects.filter(room=room_id)
        
        return Comment.objects.all()

class CommentCreateView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AdminCommentCreateView(APIView):
    """Admin-only: post a comment as any user."""
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        user_id = request.data.get("user_id")
        room_id = request.data.get("room")
        text = request.data.get("text", "").strip()
        if not all([user_id, room_id, text]):
            return Response({"detail": "user_id, room, and text are required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            target_user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        comment = Comment.objects.create(user=target_user, room_id=room_id, text=text)
        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)
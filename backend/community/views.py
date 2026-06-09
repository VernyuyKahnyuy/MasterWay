from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Comment
from .serializers import CommentSerializer

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
# from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Room
from .serializers import RoomSerializer

# 1. View to list all rooms
class RoomListView(ListAPIView):
    serializer_class = RoomSerializer

    def get_queryset(self):
        return Room.objects.all().order_by('-created_at')
    

# 2. View to create a new room
class RoomCreateView(CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
# 3. View to retrieve a single room by ID
class RoomDetailView(RetrieveAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    
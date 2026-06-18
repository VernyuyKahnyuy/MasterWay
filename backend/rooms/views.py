# from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
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
        serializer.save(creator=self.request.user)
    
# 3. View to retrieve a single room by ID
class RoomDetailView(RetrieveAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

#4. View to list rooms created by the authenticated user
class MyRoomsView(ListAPIView):
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Room.objects.filter(
            creator = self.request.user
        )
    
#5. View to update a room (creator or staff admin)
class RoomUpdateView(UpdateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        room = super().get_object()
        if room.creator != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied("You are not the creator of this room.")
        return room
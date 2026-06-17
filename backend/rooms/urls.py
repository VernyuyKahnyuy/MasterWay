from django.urls import path
from .views import RoomListView, RoomCreateView, RoomDetailView, MyRoomsView, RoomUpdateView

urlpatterns = [
    path('', RoomListView.as_view(), name='room-list'),
    path('create/', RoomCreateView.as_view(), name='room-create'),
    path('<int:pk>/', RoomDetailView.as_view(), name='room-detail'),
    path('<int:pk>/update/', RoomUpdateView.as_view(), name='room-update'),
    path('my-rooms/', MyRoomsView.as_view(), name='my-rooms'),
]
from django.urls import path
from .views import RoomListView, RoomCreateView, RoomDetailView
from .views import MyRoomsView

urlpatterns = [
    path('', RoomListView.as_view(), name='room-List'),
    path('create/', RoomCreateView.as_view(), name='room-create'),
    path('<int:pk>/', RoomDetailView.as_view(), name='room-detail'),
    path('my-rooms/', MyRoomsView.as_view(), name="my-rooms")

]
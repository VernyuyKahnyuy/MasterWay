from django.urls import path
from .views import RoomListView, RoomCreateView, RoomDetailView

urlpatterns = [
    path('', RoomListView.as_view(), name='room-List'),
    path('create/', RoomCreateView.as_view(), name='room-create'),
    path('<int:pk>/', RoomDetailView.as_view(), name='room-detail'),
]
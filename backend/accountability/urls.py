from django.urls import path

from .views import (
    StudyUpdateCreateView,
    RoomStudyUpdateListView,
)

urlpatterns = [

    path(
        "create/",
        StudyUpdateCreateView.as_view()
    ),

    path(
        "",
        RoomStudyUpdateListView.as_view()
    ),

]
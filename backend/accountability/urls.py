from django.urls import path

from .views import (
    StudyUpdateCreateView,
    RoomStudyUpdateListView,
    GlobalStudyUpdateListView,
)

urlpatterns = [

    path(
        "create/",
        StudyUpdateCreateView.as_view()
    ),

    path(
        "all/",
        GlobalStudyUpdateListView.as_view()
    ),

    path(
        "",
        RoomStudyUpdateListView.as_view()
    ),

]
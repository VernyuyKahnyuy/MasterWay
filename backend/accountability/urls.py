from django.urls import path

from .views import (
    AdminStudyUpdateCreateView,
    FeedEventListView,
    StudyUpdateCreateView,
    RoomStudyUpdateListView,
    GlobalStudyUpdateListView,
    StreakView,
)

urlpatterns = [
    path("create/", StudyUpdateCreateView.as_view()),
    path("all/", GlobalStudyUpdateListView.as_view()),
    path("events/", FeedEventListView.as_view()),
    path("admin/", AdminStudyUpdateCreateView.as_view(), name="admin-study-update"),
    path("streak/", StreakView.as_view()),
    path("", RoomStudyUpdateListView.as_view()),
]
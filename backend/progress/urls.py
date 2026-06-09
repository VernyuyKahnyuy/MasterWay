from django.urls import path
from .views import (
    EnrollmentListView,
    EnrollmentCreateView,
    LessonProgressListView,
    LessonProgressCreateView,
)

urlpatterns = [

    path('', EnrollmentListView.as_view(),
         name='enrollment-list'),

    path('create/', EnrollmentCreateView.as_view(),
         name='enrollment-create'),

    path('progress/', LessonProgressListView.as_view(), name='progress-list'),

    path('progress/create/', LessonProgressCreateView.as_view(), name='progress-create'),
]
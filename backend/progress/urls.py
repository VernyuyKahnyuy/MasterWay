# progress/urls.py

from django.urls import path
from .views import (
    EnrollmentListView,
    EnrollmentCreateView,
    LessonProgressListView,
    LessonProgressCreateView,
    ContinueLearningView,
)

urlpatterns = [

    path('', EnrollmentListView.as_view(),
         name='enrollment-list'),

    path('create/', EnrollmentCreateView.as_view(),
         name='enrollment-create'),

    path('progress/', LessonProgressListView.as_view(), name='progress-list'),

    path('progress/create/', LessonProgressCreateView.as_view(), name='progress-create'),

    path('continue-learning/', ContinueLearningView.as_view(), name="continue-learning"),
]
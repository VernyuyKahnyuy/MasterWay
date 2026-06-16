#lessons/urls.py

from django.urls import path
from .views import (
    LessonListView,
    LessonCreateView,
    LessonDetailView,
    LessonUpdateView,
    LessonDeleteView
)

urlpatterns = [

    path('', LessonListView.as_view(), name='lesson-list'),

    path('create/', LessonCreateView.as_view(),
         name='lesson-create'),

    path('<int:pk>/', LessonDetailView.as_view(),
         name='lesson-detail'),
    path('<int:pk>/update/', LessonUpdateView.as_view(),
         name='lesson-update'),
    path('<int:pk>/delete/', LessonDeleteView.as_view(),
         name='lesson-delete'),
]
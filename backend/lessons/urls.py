from django.urls import path
from .views import (
    LessonListView,
    LessonCreateView,
    LessonDetailView,
)

urlpatterns = [

    path('', LessonListView.as_view(), name='lesson-list'),

    path('create/', LessonCreateView.as_view(),
         name='lesson-create'),

    path('<int:pk>/', LessonDetailView.as_view(),
         name='lesson-detail'),
]
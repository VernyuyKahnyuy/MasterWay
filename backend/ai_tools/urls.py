from django.urls import path
from .views import LessonSummaryView
from .views import LessonQuizView
from .views import RoomRecommendationView

urlpatterns = [
    path('summarize/', LessonSummaryView.as_view(), name='lesson-summary'),
    path('quiz/', LessonQuizView.as_view(), name='lesson-quiz'),
    path('recommend/', RoomRecommendationView.as_view(), name='room-recommendations'),
]


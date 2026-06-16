from django.urls import path
from .views import RegisterView, UserInterestListView
from .views import (UserInterestCreateView, UserInterestDeleteView)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('interests/', UserInterestCreateView.as_view(), name="user-interest"),
    path('interests/list/', UserInterestListView.as_view(), name="interest-list"),
    path("interests/<int:pk>/delete/", UserInterestDeleteView.as_view(), name="interest-delete"),
]


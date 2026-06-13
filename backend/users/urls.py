from django.urls import path
from .views import RegisterView
from .views import (UserInterestCreateView, )

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('interests/', UserInterestCreateView.as_view(), name="user-interest"),
]


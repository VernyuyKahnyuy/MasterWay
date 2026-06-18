from django.urls import path
from .views import RegisterView, UserInterestListView, MeView
from .views import (UserInterestCreateView, UserInterestDeleteView, ElevateToAdminView, AdminInterestCreateView)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('interests/', UserInterestCreateView.as_view(), name="user-interest"),
    path('interests/list/', UserInterestListView.as_view(), name="interest-list"),
    path("interests/<int:pk>/delete/", UserInterestDeleteView.as_view(), name="interest-delete"),
    path("elevate/", ElevateToAdminView.as_view(), name="elevate-to-admin"),
    path("me/", MeView.as_view(), name="me"),
    path("admin/interests/<int:user_id>/", AdminInterestCreateView.as_view(), name="admin-interest-create"),
]


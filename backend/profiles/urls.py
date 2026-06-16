from .views import MyProfileView, UpdateProfileView, PublicProfileView
from .views import SimilarLearnersView
from django.urls import path

urlpatterns = [
    path( "me/", MyProfileView.as_view()),
    path( "update/", UpdateProfileView.as_view()),
    path("<int:user_id>/", PublicProfileView.as_view(), name="public-profile"),
    path("similar/", SimilarLearnersView.as_view(), name="similar-learners"),
]

from django.urls import path
from .views import CommentCreateView, CommentListView, AdminCommentCreateView

urlpatterns = [
    path('', CommentListView.as_view(), name='comment-list'),
    path('create/', CommentCreateView.as_view(), name='comment-create'),
    path('admin/', AdminCommentCreateView.as_view(), name='admin-comment-create'),
]


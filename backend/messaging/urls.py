#messaging/urls

from django.urls import path

from .views import (
    MessageCreateView,
    InboxView,
)

urlpatterns = [

    path(
        "send/",
        MessageCreateView.as_view()
    ),

    path(
        "inbox/",
        InboxView.as_view()
    ),

]
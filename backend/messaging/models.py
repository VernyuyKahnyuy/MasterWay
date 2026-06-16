# messaging/models
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings  # 1. Import settings


class Message(models.Model):

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # 2. Update this relation string
        on_delete=models.CASCADE,
        related_name="sent_messages"
    )

    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # 2. Update this relation string
        on_delete=models.CASCADE,
        related_name="received_messages",
    )

    content = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return (
            f"{self.sender} -> "
            f"{self.receiver}"
        )
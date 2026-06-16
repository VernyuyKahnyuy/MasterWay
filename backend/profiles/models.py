#profiles/models

from django.db import models
from django.conf import settings  # 1. Import settings
from users.models import UserInterest

class Profile(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,  # 2. Update this relation string
        on_delete=models.CASCADE
    )

    bio = models.TextField(
        blank=True
    )

    interests = models.TextField(
        blank=True
    )

    profile_picture = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.user.username

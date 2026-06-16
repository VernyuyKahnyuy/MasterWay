from email.mime import image

from django.db import models
from django.conf import settings

# Create your models here.

class Room(models.Model):

    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null = True,
        blank = True,
    )

    title = models.CharField(max_length = 255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add = True)
    cover_image = models.ImageField(
        upload_to="room_covers/", blank=True, null=True
    )

    def __str__(self):
        return self.title
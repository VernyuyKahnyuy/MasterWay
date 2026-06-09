from django.db import models
from django.conf import settings
from rooms.models import Room

# Create your models here.
class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE)
    room = models.ForeignKey(Room, on_delete = models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add = True)


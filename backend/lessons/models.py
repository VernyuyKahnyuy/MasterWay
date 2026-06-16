#lessons/models.py

from django.db import models
from django.conf import settings

# Create your models here.

from django.db import models
from rooms.models import Room

class Lesson(models.Model):
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # 2. Update this relation string
        on_delete=models.CASCADE
    )
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    title = models.CharField(max_length = 255)
    content = models.TextField()
    image = models.ImageField(
        upload_to="lesson_image/",
        blank=True,
        null=True,
    )
    pdf = models.FileField(
        upload_to="lesson_pdfs/",
        blank=True, null=True,
    )
    video_url = models.URLField(blank = True )
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.title
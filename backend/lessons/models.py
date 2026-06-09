from django.db import models

# Create your models here.

from django.db import models
from rooms.models import Room

class Lesson(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    title = models.CharField(max_length = 255)
    content = models.TextField()
    order = models.IntegerField(default = 0)

    def __str__(self):
        return self.title
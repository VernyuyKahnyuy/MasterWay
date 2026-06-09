from django.db import models
from django.conf import settings
from rooms.models import Room

# Create your models here.
class Enrollment(models.Model):
    class Meta:
        unique_together = ('learner', 'room')

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete = models.CASCADE
    )

    room = models.ForeignKey (
        Room, on_delete = models.CASCADE
    )

    joined_at = models.DateTimeField(auto_now_add = True)


class LessonProgress(models.Model):

    learner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    lesson = models.ForeignKey(
        'lessons.Lesson',
        on_delete=models.CASCADE,
        null = True,
        blank = True,
    )

    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.learner.username} - {self.lesson.title}"

    class Meta:
        unique_together = ('learner', 'lesson')

    
    
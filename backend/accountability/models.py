from django.db import models
from django.conf import settings

from rooms.models import Room


class FeedEvent(models.Model):
    EVENT_TYPES = [
        ('user_joined', 'User Joined'),
        ('room_created', 'Room Created'),
        ('lesson_created', 'Lesson Created'),
        ('comment_posted', 'Comment Posted'),
    ]
    event_type = models.CharField(max_length=30, choices=EVENT_TYPES)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='feed_events',
    )
    room = models.ForeignKey(
        Room,
        null=True, blank=True,
        on_delete=models.SET_NULL,
    )
    # Denormalised so cards survive room/lesson deletion
    room_title = models.CharField(max_length=255, blank=True)
    lesson_title = models.CharField(max_length=255, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.actor.username} — {self.event_type}"


class StudyUpdate(models.Model):

    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="study_updates"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    content = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        ordering = [
            "-created_at"
        ]

    def __str__(self):

        return (
            f"{self.user.username}"
            f" - "
            f"{self.room.title}"
        )
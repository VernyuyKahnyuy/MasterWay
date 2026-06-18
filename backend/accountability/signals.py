from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from rooms.models import Room
from lessons.models import Lesson
from community.models import Comment
from .models import FeedEvent

User = get_user_model()


@receiver(post_save, sender=User)
def on_user_joined(sender, instance, created, **kwargs):
    if created:
        FeedEvent.objects.create(
            event_type='user_joined',
            actor=instance,
        )


@receiver(post_save, sender=Room)
def on_room_created(sender, instance, created, **kwargs):
    if created and instance.creator_id:
        FeedEvent.objects.create(
            event_type='room_created',
            actor=instance.creator,
            room=instance,
            room_title=instance.title,
        )


@receiver(post_save, sender=Lesson)
def on_lesson_created(sender, instance, created, **kwargs):
    if created:
        FeedEvent.objects.create(
            event_type='lesson_created',
            actor=instance.creator,
            room=instance.room,
            room_title=instance.room.title,
            lesson_title=instance.title,
        )


@receiver(post_save, sender=Comment)
def on_comment_posted(sender, instance, created, **kwargs):
    if created:
        FeedEvent.objects.create(
            event_type='comment_posted',
            actor=instance.user,
            room=instance.room,
            room_title=instance.room.title,
            message=instance.text[:300],
        )

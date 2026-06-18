from django.contrib import admin
from .models import FeedEvent, StudyUpdate


@admin.register(StudyUpdate)
class StudyUpdateAdmin(admin.ModelAdmin):
    list_display = ('user', 'room', 'created_at')
    list_filter = ('room',)
    search_fields = ('user__username', 'room__title', 'content')
    raw_id_fields = ('user', 'room')


@admin.register(FeedEvent)
class FeedEventAdmin(admin.ModelAdmin):
    list_display = ('actor', 'event_type', 'room_title', 'created_at')
    list_filter = ('event_type',)
    search_fields = ('actor__username', 'room_title', 'lesson_title')

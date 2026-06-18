from django.contrib import admin
from .models import Room


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('title', 'creator', 'created_at')
    search_fields = ('title', 'description', 'creator__username')
    raw_id_fields = ('creator',)
    list_select_related = ('creator',)

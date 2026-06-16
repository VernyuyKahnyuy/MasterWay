from django.contrib import admin
from .models import Lesson

# Register your models here.
# admin.site.register(Lesson)

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "room",
        "order"
    )
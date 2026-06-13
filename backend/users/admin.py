from django.contrib import admin

# Register your models here.
from .models import User, UserInterest

admin.site.register(User)
admin.site.register(UserInterest)
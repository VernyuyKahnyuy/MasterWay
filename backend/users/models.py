from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):

    ROLE_CHOICES = (
        ('expert', 'Expert'),
        ('learner', 'Learner'),
    )

    role = models.CharField (max_length=20, choices = ROLE_CHOICES)

class UserInterest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    interest = models.CharField(max_length=100, null = True, blank = True)
    name = models.CharField(max_length=100, null = True, blank = True)
    created_at = models.DateTimeField(auto_now_add=True, null = True, blank = True)

    def __str__(self):
        return f"{self.user.username} - {self.interest[:30]}"
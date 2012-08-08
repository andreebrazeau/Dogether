from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    email = models.EmailField(max_length=75)
    user = models.ForeignKey(User, unique=True)



from django.db import models
from django.contrib.auth.models import User

class Team(models.Model):
    users = models.ManyToManyField(User)
    title = models.CharField(max_length=200)

    def __unicode__(self):
		return self.title
    	


from django.db import models
from django.contrib.auth.models import User
from models_projects import Project

class Team(models.Model):
    user = models.ForeignKey(User)
    title = models.CharField(max_length=200)

class TeamMate(models.Model):
	user = models.ForeignKey(User)
	team = models.ForeignKey(Team)



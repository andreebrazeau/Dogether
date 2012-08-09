from django.contrib import admin
from together_app.models_projects import Project
from together_app.models_jobs import Job
from together_app.models_teams import Team

admin.site.register(Project)
admin.site.register(Job)
admin.site.register(Team)

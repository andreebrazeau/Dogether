from django.contrib import admin
from together_app.models_projects import Project
from together_app.models_jobs import Job
from together_app.models_users import UserProfile

admin.site.register(Project)
admin.site.register(Job)
admin.site.register(UserProfile)

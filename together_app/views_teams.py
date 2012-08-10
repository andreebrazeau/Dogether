from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_protect
from django.core import serializers
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

@csrf_protect
def index(request):
	user = request.user
	teams = user.team_set.all() #nice !!! do it all over the place
	data = serializers.serialize('json', teams)
	return HttpResponse(data, 'application/json')


"""
from together_app.models_projects import Project
from django.contrib.auth.models import User
from together_app.models_teams import Team
user = User.objects.all()[4]
teams = user.team_set.all()
projects = Project.objects.filter(team__in=teams)
"""

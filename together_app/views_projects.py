from django.shortcuts import render_to_response
from models_projects import Project
from models_jobs import Job
from models_teams import Team
from django.views.decorators.csrf import csrf_protect
from django.core import serializers
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required


@login_required
@csrf_protect
def home(request):
	user = request.user
	teams = user.team_set.all()
	projects = Project.objects.filter(team__in=teams)
	return render_to_response('tasks.html', {'teams':teams, 'username':user.username, 'projects':projects})

@csrf_protect
def index(request):
	team_id = request.POST.get('team_id')
	projects = Project.index(team_id)
	data = serializers.serialize('json', projects)
	return HttpResponse(data, 'application/json')

@csrf_protect # should not be exempt
def add(request):
	form_data = request.POST
	project = Project.create(form_data)
	return HttpResponse(project, 'application/json')

@csrf_protect
def update(request):
	form_data = request.POST
	project = Project.update(form_data)
	return HttpResponse(project, 'application/json')

@csrf_protect
def delete(request):
	project_data = request.POST
	project = Project.delete(project_data)
	return HttpResponse(project, 'application/json')
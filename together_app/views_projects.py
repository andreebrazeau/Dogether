from django.shortcuts import render_to_response
from models_projects import Project
from models_jobs import Job
from django.views.decorators.csrf import csrf_protect
from django.core import serializers
from django.http import HttpResponse

@csrf_protect
def home(request):
	return render_to_response('tasks.html')

@csrf_protect
def index(request):
    projects = Project.objects.all()
    data = serializers.serialize('json', Project.objects.all())
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
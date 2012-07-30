from django.shortcuts import render_to_response
from models_projects import Project
from models_jobs import Job
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.core import serializers
from django.http import HttpResponse

@csrf_exempt
def home(request):
	return render_to_response('tasks.html')

@csrf_exempt
def index(request):
    projects = Project.objects.all()
    data = serializers.serialize('json', Project.objects.all())
    print data
    return HttpResponse(data, 'application/json')



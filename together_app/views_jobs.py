from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_protect

from django.core import serializers
from django.http import HttpResponse
from models_projects import Project
from models_jobs import Job
import json

@csrf_protect
def index(request, project_id):
	job_ordered = Job.objects.filter(project_id=int(project_id)).order_by('order')
	data = serializers.serialize('json', job_ordered )
	return HttpResponse(data, 'application/json')

@csrf_protect # should not be exempt
def add_job(request):
	form_data = request.POST
	job = Job.create(form_data)
	return HttpResponse(job, 'application/json')

@csrf_protect
def update(request):
	form_data = request.POST
	job = Job.update(form_data)
	return HttpResponse(job, 'application/json')


@csrf_protect
def get_job_details(request):
	job = request.POST
	job = Job.objects.get(id = int(job['job_id']))
	return HttpResponse(job, 'application/json')

def mark_completed():
	request.POST.get('job_id')
	job = Job.objects.get(id = job_id)
	job.completed = True
	result = {'message' : 'job marked completed'}
	data = json.dumps(result)
	return HttpResponse(data, 'application/json')


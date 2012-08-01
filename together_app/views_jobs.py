from django.shortcuts import render_to_response
from models_projects import Project
from models_jobs import Job
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.core import serializers
# from json_data import *
from django.http import HttpResponse
import json



@csrf_exempt # should not be exempt
def add_job(request):
	form_job = request.POST
	job = Job.create(form_job)
	print job
	# else :
	# 	add_job_to_list = False`
	# 	order = ''
	# 	job_before = Job.objects.get(id = job_id)
	# 	job_before.title = title
	# 	job_before.note = note
	# 	job_before.due_date = due_date
	# 	job_before.assign_to = assign_to
	# 	job_before.save()

	return HttpResponse(job, 'application/json')

@csrf_exempt
def index(request, project_id):
	data = serializers.serialize('json', Job.objects.filter(project_id=int(project_id)))
	return HttpResponse(data, 'application/json')


@csrf_exempt
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


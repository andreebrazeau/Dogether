from django.shortcuts import render_to_response
from models_projects import Project
from models_jobs import Job
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
# from json_data import *
from django.http import HttpResponse
import json

@csrf_exempt # should not be exempt
def add_job(request):
	print 'I AM IN THE add_job VIEW'
	form_job = request.POST
	print form_job
	job = Job.create(form_job)
	# else :
	# 	add_job_to_list = False
	# 	order = ''
	# 	job_before = Job.objects.get(id = job_id)
	# 	job_before.title = title
	# 	job_before.note = note
	# 	job_before.due_date = due_date
	# 	job_before.assign_to = assign_to
	# 	job_before.save()

	result = {'title' : job.title, 'order': job.order}
	data = json.dumps(result)
	return HttpResponse(data,"application/json")

@csrf_exempt
def get_job_details(request):
	job_id = request.POST.get('job_id')
	job = Job.objects.get(id = job_id)
	print job.due_date
	result = {'title' : job.title,
		'note':job.note, 
		'due_date':str(job.due_date),
		'assign_to': job.assign_to}
	data = json.dumps(result)
	return HttpResponse(data, 'application/json')

def mark_completed():
	request.POST.get('job_id')
	job = Job.objects.get(id = job_id)
	job.completed = True
	result = {'message' : 'job marked completed'}
	data = json.dumps(result)
	return HttpResponse(data, 'application/json')











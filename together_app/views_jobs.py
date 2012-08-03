from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_protect
from django.http import HttpResponse
from models_projects import Project
from models_jobs import Job
import json

@csrf_protect
def index(request, project_id):
	jobs_ordered = Job.index(project_id)
	return HttpResponse(jobs_ordered, 'application/json')

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

@csrf_protect
def mark_completed(request):
	job_data = request.POST
	job = Job.mark_completed(job_data)
	return HttpResponse(job, 'application/json')

@csrf_protect
def delete(request):
	job_data = request.POST
	print 'job_data', job_data
	job = Job.delete(job_data)
	return HttpResponse(job, 'application/json')
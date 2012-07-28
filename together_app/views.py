from django.shortcuts import render_to_response
from django.db.models import Max
from models import Project, Job
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
# from json_data import *
from django.http import HttpResponse
import json

def home(request, project_id):
    project = Project.objects.get(id = project_id)
    jobs = Job.objects.filter(project_id = project.id).order_by('order')
    print 'LIST OF JOB', jobs
    return render_to_response('tasks.html', {'jobs' : jobs, 'project' : project})

@csrf_exempt # should not be exempt
def add_job(request):
	print 'I AM IN THE add_job VIEW'
	job_id = request.POST.get('job_id', False)
	title = request.POST.get('title', False)
	note = request.POST.get('note')
	due_date = request.POST.get('due_date')
	print due_date
	if due_date == '':
		due_date = None
		print 'due_date',due_date
	assign_to = request.POST.get('assign_to')

	if job_id == '': # add a new task
		add_job_to_list = True
		project_id = request.POST.get('project_id')
		project = Project.objects.get(id = project_id) #from javascript in the html file
		max_order = Job.objects.filter(project_id = project).aggregate(Max('order'))
		if  max_order['order__max'] == None:
			order = 1
		else:
			order = max_order['order__max']+1
		new_job = Job(
			title = title,
		    note = note,
		    due_date = due_date,
		    assign_to = assign_to,
		    #parent = 
		    project_id = project,
		    order = order 
		)
		new_job.save()	
	
	
	else :
		add_job_to_list = False
		order = ''
		job_before = Job.objects.get(id = job_id)
		job_before.title = title
		job_before.note = note
		job_before.due_date = due_date
		job_before.assign_to = assign_to
		job_before.save()

	result = {'title' : title, 'order':order, 'add_job_to_list':add_job_to_list}
	data = json.dumps(result)
	return HttpResponse(data, "application/json")

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











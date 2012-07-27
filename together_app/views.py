from django.shortcuts import render_to_response
from models import Project, Job
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
# from json_data import *
from django.http import HttpResponse
import json

def home(request, project_id):
    project = Project.objects.get(id = project_id)
    jobs = Job.objects.filter(project_id = project.id).order_by('order')
    print jobs
    return render_to_response('tasks.html', {'jobs' : jobs, 'project' : project})

@csrf_exempt
def add_job(request):
	
	title = request.POST.get('title', False)
	note = request.POST.get('note')
	due_date = request.POST.get('due_date')
	assign_to = request.POST.get('assign_to')
	project_id = request.POST.get('project_id')
	project = Project.objects.get(id = project_id)
	print 'This:', title, note, due_date, assign_to
	new_job = Job(
		title = title,
	    note = note,
	    due_date = due_date,
	    assign_to = assign_to,
	    #parent = 
	    project_id = project
	    #order = 
	)
	new_job.save()
	result = {'title' : title}
	data = json.dumps(result)
	return HttpResponse(data, "application/json")
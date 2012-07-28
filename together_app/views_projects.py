from django.shortcuts import render_to_response
from models_projects import Project
from models_jobs import Job
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt

def home(request, project_id):
    project = Project.objects.get(id = project_id)
    jobs = Job.objects.filter(project_id = project.id).order_by('order')
    print 'LIST OF JOB', jobs
    return render_to_response('tasks.html', {'jobs' : jobs, 'project' : project})

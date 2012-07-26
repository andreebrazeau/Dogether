from django.shortcuts import render_to_response
from models import Project, Job

def home(request):
    project = Project.objects.get(id = 1)
    jobs = Job.objects.filter(project_id = project.id).order_by('order')
    print jobs
    return render_to_response('tasks.html', {'jobs' : jobs, 'project' : project})

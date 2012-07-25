from django.shortcuts import render_to_response
from models import Project, Job

def home(request):
    project = Project.objects.get(id = 1)
    jobs = Job.objects.filter(project_id = project.id) 
    print jobs
    return render_to_response('home.html', {'jobs' : jobs, 'project' : project})

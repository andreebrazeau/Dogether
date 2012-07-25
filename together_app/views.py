from django.shortcuts import render_to_response
from models import Project, Job

def home(request):
    jobs = Job.objects.all()
    project = Project.objects.get(id = jobs[0].project_id)
    print jobs
    return render_to_response('home.html', {'jobs' : jobs})

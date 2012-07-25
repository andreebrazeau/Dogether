from django.shortcuts import render_to_response
from models import Project, Job

def home(request):
    jobs = Job.objects.all()
    print jobs
    return render_to_response('home.html', {'jobs' : jobs})

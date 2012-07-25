from together_app.models import Project, Job
from django.utils import timezone 

def create_project():
    p = Project(user_id ='andree brazeau',
        title = 'Hackbright project',
        details = '5 weeks personal project')

    p.save()

def create_job();
    j = Job(title = 'create db',
        note = 'some notes',
        project_id = Project.objects.get('id'=1))

    j.save()

def main():
    create_project()
    if not Project.objects.all(): 
        print 'no project created'
    else:
        create_job()
    if not Job.objects.all():
        print 'no job created'

if __name__ == '__main__':
    main()

from models_jobs import Job
from models_projects import Project
from django.test import TestCase
from django.utils import unittest


class JobTest(TestCase):
    def test_create_model(self):
    	p = Project()
    	p.user_id = 'andree'
    	p.title = 'my project'
    	p.details = 'details'
    	p.save()
    	p = Project.objects.all()
       	job = Job.create( {
       			'title': 'this is a test', 
       			'project_id': 1, 
       			'note':'this is a note', 
       			'assign_to':'Andree', 
            'due_date': ''
       		})
       	self.assertEquals('this is a test', job.title)
       	self.assertEqual('this is a note', job.note)
       	self.assertEquals('Andree', job.assign_to)
       	self.assertEquals(True, type(job.order)==int)






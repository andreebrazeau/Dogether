from django.utils import unittest
from models_jobs import Job
from models_projects import Project




class JobTest(TestCase):
    def test_create_model(self):
    	print 'test'
       	job = Job.create( {
       			'title': 'this is a test',
       		})
       	self.assertEquals('this is aest', job.title)
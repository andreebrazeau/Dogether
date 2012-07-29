from models_jobs import Job
from models_projects import Project
from django.test import TestCase
from django.utils import unittest


class JobTest(TestCase):
    def test_create_model(self):
       	job = Job.create( {
       			'title': 'this is a test',
       		})
       	self.assertEquals('this is aest', job.title)
from django.shortcuts import render_to_response
from django.views.decorators.csrf import csrf_protect
from django.http import HttpResponse
from models_projects import Project
from models_jobs import Job
from piston.handler import BaseHandler
import json

class JobsHandler(BaseHandler):
	allowed_methods = ('GET','POST','PUT','DELETE')
	model = Job
	fields =('id', 'title', 'note', 'user', 'due_date', 'project_id', 'completed', 'order', 'deleted')

	def read(self, request, project_id, job_id=None):
		if job_id:
			return Job.objects.get(id=job_id)
		else:
			return Job.index(project_id)

	def create(self, request, project_id):
		form_data = request.data
		print form_data
		return Job.create(form_data, project_id)


	def update(self, request, project_id, job_id):
		form_data = request.data
		job = Job.update(form_data, job_id)
		return job

	def delete(self, request, project_id, job_id):
		return Job.delete(job_id)


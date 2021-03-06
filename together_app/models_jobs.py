from django.db import models
from django.db.models import Max
from django.core import serializers
from models_projects import Project
import json

class Job(models.Model):
	title = models.CharField(max_length=200)
	created_at = models.DateTimeField(auto_now_add=True)
	note = models.TextField(blank=True)
	assign_to = models.CharField(max_length=200, blank=True)  #models.ForeignKey(User, null = True) for later
	due_date = models.DateField(null=True,blank=True)
	parent = models.ForeignKey('self', null=True)
	project_id = models.ForeignKey(Project)
	completed = models.BooleanField(default = False)
	order = models.IntegerField(null=True)
	deleted = models.BooleanField(default = False)
	
	def __unicode__(self):
		return self.title

	@staticmethod
	def index(project_id):
		jobs_ordered = Job.objects.filter(project_id=int(project_id), deleted=False).order_by('completed', 'order')
		jobs_ordered = serializers.serialize('json', jobs_ordered) # use serialyze here but do not give the same kind of data of _job_to_json So in javascript need to transfer that back to the same kind of value
		return jobs_ordered

	@staticmethod
	def create(params):
		job = Job()
		job.set_params(params)
		job.set_project_id(params)
		job.set_order(params)
		job.save()
		return job._job_to_json()

	@staticmethod
	def update(params):
		job = Job.objects.get(id = int(params['id']))
		job.set_params(params)
		job.save()
		return job._job_to_json()

	@staticmethod
	def mark_completed(params):
		job = Job.objects.get(id = int(params['id']))
		if job.completed == True:
			job.completed = False
		elif job.completed == False:
			job.completed = True
		job.save()
		return job._job_to_json()

	@staticmethod
	def delete(params):
		job = Job.objects.get(id = int(params['id']))
		job.deleted = True
		job.save()
		return job._job_to_json()

	def set_params(self, params):
		if params.has_key('due_date'): # if the field if empty, nedded to change it to None for db transaction
			if params['due_date'] == '':
				setattr(self, 'due_date', None)
			else:
				setattr(self, 'due_date', params['due_date'])
		for key in ['title', 'note', 'assign_to']: # set all params
			if params.has_key(key):
				setattr(self, key, params[key])

	def set_project_id(self, params):
		project = Project.objects.get(id = params['project_id']) # assign project
		setattr(self, 'project_id', project)

	def set_order(self, params):
		max_order = Job.objects.filter(project_id = self.project_id).aggregate(Max('order')) # assign order
		if  max_order['order__max'] == None:
			order = 1
		else:
			order = max_order['order__max']+1
		setattr(self, 'order', order)

	def _job_to_json(self):
		result = {
			'assign_to': self.assign_to, 
			'completed': self.completed,
			'due_date': str(self.due_date),
			'id' : self.id,
			'note':self.note,
			'order': self.order,
			'parent': self.parent,
			'project_id': self.project_id.id, 
			'title': self.title
			}
		data = json.dumps(result)
		return data






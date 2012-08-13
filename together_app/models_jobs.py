from django.db import models
from django.db.models import Max
from django.core import serializers
from models_projects import Project
from django.contrib.auth.models import User
import json

class Job(models.Model):
	id = models.AutoField(primary_key=True)
	title = models.CharField(max_length=200)
	created_at = models.DateTimeField(auto_now_add=True)
	note = models.TextField(blank=True)
	user = models.ForeignKey(User, null=True, blank=True) #models.ForeignKey(User, null = True) for later
	due_date = models.DateField(null=True, blank=True)
	parent = models.ForeignKey('self', null=True, blank=True)
	project_id = models.ForeignKey(Project)
	completed = models.BooleanField(default = False)
	order = models.IntegerField(null=True)
	deleted = models.BooleanField(default = False)
	
	def __unicode__(self):
		return self.title

	@staticmethod
	def index(project_id):
		if project_id:
			jobs_ordered = Job.objects.filter(project_id=int(project_id), deleted=False).order_by('completed', 'order')
			return jobs_ordered

	@staticmethod
	def create(params, project_id):
		print 'hey'
		job = Job()
		job.set_params(params)
		job.set_project_id(project_id)
		job.set_order(params)
		job.save()
		return job

	@staticmethod
	def update(params, job_id):
		job = Job.objects.get(id = job_id)
		job.set_params(params)
		job.save()
		return job

	@staticmethod
	def delete(job_id):
		job = Job.objects.get(id = job_id)
		job.deleted = True
		job.save()
		return job

	def set_params(self, params):
		print params['due_date']
		if params.has_key('due_date'): # if the field if empty, nedded to change it to None for db transaction
			if params['due_date'] == '':
				setattr(self, 'due_date', None)
			else:
				setattr(self, 'due_date', params['due_date'])
		if params['completed']==True:
			self.completed = True
		else:
			self.completed = False
		for key in ['title', 'note', 'assign_to']: # set all params
			if params.has_key(key):
				setattr(self, key, params[key])
		print self.due_date, self.completed, self.title, self.note, self.assign_to

	def set_project_id(self, project_id):
		project = Project.objects.get(pk = project_id) # assign project
		setattr(self, 'project_id', project)

	def set_order(self, params):
		max_order = Job.objects.filter(project_id = self.project_id).aggregate(Max('order')) # assign order
		if  max_order['order__max'] == None:
			order = 1
		else:
			order = max_order['order__max']+1
		setattr(self, 'order', order)

	# def complete(self):
	# 	print 'we are here'
	# 	if self.completed == True:
	# 		self.completed = False
	# 		print 'now False'
	# 	elif self.completed == False:
	# 		self.completed = True
	# 		print 'now True'

	def _job_to_json(self):
		result = {
			'assign_to': self.user, 
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






from django.db import models
from models_projects import Project
from django.db.models import Max
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
	
	def __unicode__(self):
		return self.title

	@staticmethod
	def create(params):
		print 'in Job.create'
		job = Job()
		job.update(params)
		job.save()
		return job._job_to_json()

	def update(self, params):
		print 'in Job.update'
		print params
		if params.has_key('due_date'): # if the field if empty, nedded to change it to None for db transaction
			if params['due_date'] == '':
				setattr(self, 'due_date', None)
			else:
				setattr(self, 'due_date', params['due_date'])

		for key in ['title', 'note', 'assign_to']: # set all params
			if params.has_key(key):
				# print 'params', getattr(self, key)
				setattr(self, key, params[key])
		
		project = Project.objects.get(id = params['project_id']) # assign project
		setattr(self, 'project_id', project)

		max_order = Job.objects.filter(project_id = project).aggregate(Max('order')) # assign order
		if  max_order['order__max'] == None:
			order = 1
		else:
			order = max_order['order__max']+1
		setattr(self, 'order', order)

	def _job_to_json(self):
		print self.project_id.id
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
		print result
		data = json.dumps(result)
		return data






from django.db import models
from models_projects import Project
from django.db.models import Max

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
		print 'job.__dict__',job.__dict__
		job.save()
		return job

	def update(self, params):
		print 'in Job.update'
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

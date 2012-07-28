from django.db import models
from models_projects import Project

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
	

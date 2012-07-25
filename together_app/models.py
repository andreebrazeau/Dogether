from django.db import models


class Project(models.Model):
	user_id = models.CharField(max_length=200)
	title = models.CharField(max_length=200)
	create_at = models.DateTimeField(auto_now_add=True)
	details = models.TextField()

	def __unicode__(self):
		return self.Title

class Job(models.Model):
	title = models.CharField(max_length=200)
	created_at = models.DateTimeField(auto_now_add=True)
	note = models.TextField()
	assign_to = models.CharField(max_length=200)  #models.ForeignKey(User) for later
	due_date = models.DateField()
	parent = models.ForeignKey('self', null=True)
	project_id = models.ForeignKey(Project)
	completed = models.BooleanField(default = False)
	
	def __unicode__(self):
		return self.title
	

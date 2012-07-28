from django.db import models

class Project(models.Model):
	user_id = models.CharField(max_length=200)
	title = models.CharField(max_length=200)
	create_at = models.DateTimeField(auto_now_add=True)
	details = models.TextField(blank=True)

	def __unicode__(self):
		return self.title
from django.db import models
import json

class Project(models.Model):
	user_id = models.CharField(max_length=200)
	title = models.CharField(max_length=200)
	create_at = models.DateTimeField(auto_now_add=True)
	details = models.TextField(blank=True)

	def __unicode__(self):
		return self.title

	@staticmethod
	def create(params):
		project = Project()
		project.set_params(params)
		project.set_user()
		project.save()
		return project._project_to_json()

	@staticmethod
	def update(params):
		print params
		project = Project.objects.get(id = int(params['id']))
		project.set_params(params)
		project.save()
		return project._project_to_json()

	def set_params(self, params):
		for key in ['title', 'details']: # set all params
			if params.has_key(key):
				setattr(self, key, params[key])

	def set_user(self):
		self.user_id = 'me'

	def _project_to_json(self):
		result = {
			'id' : self.id,
			'details':self.details,
			'user_id': self.user_id, 
			'title': self.title
			}
		data = json.dumps(result)
		return data
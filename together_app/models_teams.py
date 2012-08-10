from django.db import models
from django.contrib.auth.models import User

class Team(models.Model):
	users = models.ManyToManyField(User)
	title = models.CharField(max_length=200)

	def __unicode__(self):
		return self.title

	@staticmethod
	def create(params):
		team = Team()
		team.set_params(params)
		team.save()
		return team._team_to_json()

	@staticmethod
	def update(params):
		team = Team.objects.get(id = int(params['id']))
		team.set_params(params)
		team.save()
		return team._team_to_json()


	def set_params(self, params):
		for key in ['title']: # set all params
			if params.has_key(key):
				setattr(self, key, params[key])

	def _project_to_json(self):
		result = {
			'id' : self.id,
			'title': self.title,
			'users': self.users
			}
		data = json.dumps(result)
		return data
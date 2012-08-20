from django.conf.urls import patterns, include, url
from django.contrib.auth.views import login, logout
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
from piston.resource import Resource
from together_app.views_jobs import JobsHandler

jobs_handler = Resource(JobsHandler)



urlpatterns = patterns('',

    url(r'^$', 'together_app.views_registration.home', name='home'),
    url(r'^project$', 'together_app.views_projects.home', name='project_home'),
    url(r'^project/index$', 'together_app.views_projects.index'),
    url(r'^project/add$', 'together_app.views_projects.add'),
    url(r'^project/update$', 'together_app.views_projects.update'),
    url(r'^project/delete$', 'together_app.views_projects.delete'),
    url(r'^accounts/login', 'together_app.views_registration.login_view'),
    url(r'^users/registration$', 'together_app.views_registration.register'),
    url(r'^users/logout$', 'together_app.views_registration.logout_view'),

    url(r'^projects/(?P<project_id>\d+)/jobs/(?P<job_id>\d*)', jobs_handler),
    url(r'^projects/(?P<project_id>\d+)/jobs', jobs_handler),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

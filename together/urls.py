from django.conf.urls import patterns, include, url
from django.contrib.auth.views import login, logout
 
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'together_app.views_projects.home'),
    url(r'project/index$', 'together_app.views_projects.index'),
    url(r'^project/add$', 'together_app.views_projects.add'),
    url(r'^project/update$', 'together_app.views_projects.update'),
    url(r'^(?P<project_id>\d+)/index$', 'together_app.views_jobs.index'),
    url(r'^project/delete$', 'together_app.views_projects.delete'),
    url(r'^job/add_job$', 'together_app.views_jobs.add_job'),
    url(r'^job/update$', 'together_app.views_jobs.update'),
    url(r'^job/mark_completed$', 'together_app.views_jobs.mark_completed'),
    url(r'^job/delete$', 'together_app.views_jobs.delete'),
    url(r'^account/login/$', login),
    url(r'^account/logout/$', logout),
    # url(r'^together/', include('together.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

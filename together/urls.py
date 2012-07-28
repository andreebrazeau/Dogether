from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'together_app.views_projects.home', name='home'),
    url(r'^project/(?P<project_id>\d+)/$', 'together_app.views_projects.home'),
    url(r'^job/add_job$', 'together_app.views_jobs.add_job'),
    url(r'^job/get_job_details$', 'together_app.views_jobs.get_job_details'),
    url(r'^job/mark_completed$', 'together_app.views_jobs.markcompleted'),
    # url(r'^together/', include('together.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Project'
        db.create_table('together_app_project', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user_id', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('create_at', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('details', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal('together_app', ['Project'])

        # Adding model 'Job'
        db.create_table('together_app_job', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('created_at', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('note', self.gf('django.db.models.fields.TextField')()),
            ('assign_to', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('due_date', self.gf('django.db.models.fields.DateField')()),
            ('parent', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['together_app.Job'], null=True)),
            ('project_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['together_app.Project'])),
            ('completed', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal('together_app', ['Job'])


    def backwards(self, orm):
        # Deleting model 'Project'
        db.delete_table('together_app_project')

        # Deleting model 'Job'
        db.delete_table('together_app_job')


    models = {
        'together_app.job': {
            'Meta': {'object_name': 'Job'},
            'assign_to': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'completed': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'due_date': ('django.db.models.fields.DateField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'note': ('django.db.models.fields.TextField', [], {}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['together_app.Job']", 'null': 'True'}),
            'project_id': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['together_app.Project']"}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        'together_app.project': {
            'Meta': {'object_name': 'Project'},
            'create_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'details': ('django.db.models.fields.TextField', [], {}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'user_id': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['together_app']
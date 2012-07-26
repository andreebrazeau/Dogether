# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Job.order'
        db.add_column('together_app_job', 'order',
                      self.gf('django.db.models.fields.IntegerField')(null=True),
                      keep_default=False)


        # Changing field 'Job.due_date'
        db.alter_column('together_app_job', 'due_date', self.gf('django.db.models.fields.DateField')(null=True))

    def backwards(self, orm):
        # Deleting field 'Job.order'
        db.delete_column('together_app_job', 'order')


        # Changing field 'Job.due_date'
        db.alter_column('together_app_job', 'due_date', self.gf('django.db.models.fields.DateField')(default=datetime.datetime(2012, 7, 26, 0, 0)))

    models = {
        'together_app.job': {
            'Meta': {'object_name': 'Job'},
            'assign_to': ('django.db.models.fields.CharField', [], {'max_length': '200', 'blank': 'True'}),
            'completed': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'due_date': ('django.db.models.fields.DateField', [], {'null': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'note': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'order': ('django.db.models.fields.IntegerField', [], {'null': 'True'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['together_app.Job']", 'null': 'True', 'blank': 'True'}),
            'project_id': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['together_app.Project']"}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        'together_app.project': {
            'Meta': {'object_name': 'Project'},
            'create_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'details': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'user_id': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['together_app']
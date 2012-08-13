var Job = Backbone.Model.extend({
	urlRoot : ''
});


var Jobs = Backbone.Collection.extend({
	initialize: function(options){
		this.project_id = options.project_id;
	},
	model: Job,
	url: function(){
		return '/projects/'+this.project_id+'/jobs/';
	}
});
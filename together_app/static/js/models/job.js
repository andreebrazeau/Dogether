var Job = Backbone.Model.extend({
	urlRoot : ''
});


var Jobs = Backbone.Collection.extend({
	initialize: function(options){
		console.log(options)
		this.project_id = options.project.id;
	},
	model: Job,
	url: function(){
		return '/projects/'+this.project_id+'/jobs/';
	}
});
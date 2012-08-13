var JobFormView = Backbone.View.extend({
    initialize: function (options) {
        source = $('#job_form_template').html()
        this.template = Handlebars.compile(source)
        project_id = this.model.get('project_id').id
        console.log(project_id)
        $('#job_form_template').data('project_id', project_id)
    },
    events: {
        "click #job-form :submit": "handleForm",
    },
    render: function() {
        html = this.template(this.model.toJSON())
        this.$el.html(html);
    },

    handleForm: function() {
        event.preventDefault();
        var form = $('#job-form');

        //get data for the checkbox
        var job_data = {
            title: $(form).find('#title').val(),
            note: $(form).find('#note').val(),
            due_date: $(form).find('#due_date').val(),
            assign_to: $(form).find('#assign_to').val(),
            completed: $(form).find('#completed').val()
        };

        if ($('#job_form').data('Job_id'))
        {
            JobData.id = $('#Job_form').data('job_id');
            this.JobList.updatePassword(jobData, { error: this.displayError });
        }
        else
        {   
            project_id = $('#job_form_template').data('project_id')
            console.log(project_id)
            // add or update the password
            this.job_list = new JobListView({el:$('tbody#job_table'), project_id:project_id})

            this.job_list.addNew(job_data, { error: this.displayError });
        }

        return this
    },

    
    displayError: function(model, response) {
            var that = this;
            if (response.status == 403) {
                alert("You don't have permission to edit that data");
            }
            else {
                alert("Unable to create or edit that data. Please make sure you entered valid data.");
            }
        }
});


var JobRowView = Backbone.View.extend({
    tagName: 'tr',

    events: {
        "click":"showForm"
    },

    initialize: function (options) {
        source = $('#job_table_template').html()
        this.template = Handlebars.compile(source)
    },
    render: function() {
        html = this.template(this.model.toJSON())
        this.$el.html(html);

        if (this.model.attributes.completed) {
            this.$el.addClass('completed');
        }
        return this;
    },

    showForm: function(event){
        event.preventDefault();
        job_form = new JobFormView({el:$('div#job-form-div'), model:this.model});
        job_form.render();
    }


});

var JobListView = Backbone.View.extend({
    tagName: 'tbody',

    initialize: function(options) {
        this.jobs = new Jobs(options);

        this.jobs.bind('all', this.render, this);
        this.jobs.fetch();
    },

    addOne: function(job) {
        // pass a reference to the main application into the password view
        // so it can call methods on it
        this.$el.append(new JobRowView({model: job}).render().el);
        return this;
    },

    addNew: function(job, options) {
        mergedOptions = {wait: true};
        $.extend(mergedOptions, options);
        this.jobs.create(job, mergedOptions);
        return this;
    },

    render: function() {
        this.$el.html('');
        this.jobs.each(this.addOne, this);
        return this;
    }

});

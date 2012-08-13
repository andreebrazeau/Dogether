var JobRowView = Backbone.View.extend({
    tagName: 'tr',

    events: {
        "click":"editJob"
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

    editJob: function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        this.options.app.renderForm();
        this.options.app.editJob(this.model);

        // job_form = new JobFormView({el:$('div#job-form-div'), model:this.model});
        // job_form.render();
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
        this.$el.append(new JobRowView({model: job,app: this.options.app}).render().el);
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

var JobPanelView = Backbone.View.extend({
    el: "#job_pannel",

    events: {
        "click #job-form :submit": "handleForm",
    },

    initialize: function (options) {
        this.job_list = new JobListView({project_id:options.id, app:this});
        // source = $('#job_form_template').html()
        // this.template = Handlebars.compile(source)
    },

    render: function() {
        this.$el.find('tbody').remove();
        this.$el.find('table').append(this.job_list.render().el);
    },

    editJob: function(job) {
        this.prepareForm(job);
        // store the password ID as data on the modal itself
        // $('#job_form').data('job_id', job.get('id'));
        console.log($('#job_form'));
        $('#job_form').show();
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

    prepareForm: function(job_data) {
        job_data = job_data || {};
        
        var data = {
            'project_id':'',
            'completed':'',
            'title': '',
            'note':'',
            'due_date':'',
            'assign_to':''
        };

        $.extend(data, job_data);

        var form = $('#passwordForm');
        $(form).find('#project_id').val(data.project_id);
        if (data.completed === true){
            $(form).find('#completed').attr('checked', 'checked')
        };
        $(form).find('#title').val(data.title);
        $(form).find('#note').val(data.note);
        $(form).find('#due_date').val(data.due_date);
        $(form).find('#assign_to').val(data.assign_to);

        $('#job_form_template').data('job_id', '');
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


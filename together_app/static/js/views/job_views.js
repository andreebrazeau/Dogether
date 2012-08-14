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
        $('#job_form').show()
        $('#project-form').hide()
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
    },

    updateJob: function(job_data, options) {
        mergedOptions = {wait: true};
        $.extend(mergedOptions, options);
        var job = this.jobs.get(job_data.id);
        if (_.isObject(job))
        {
            // iterate through all the data in job_data, setting it
            // to the password model
            for (var key in job_data)
            {
                // ignore the ID attribute
                if (key != 'id')
                {
                    job.set(key, job_data[key]);
                }
            }

            // persist the change
            job.save({}, mergedOptions);
        }
    },

});

var JobPanelView = Backbone.View.extend({
    el: "#app_panel",

    events: {
        // "click #job-form :submit": "handleForm",
        "click #add_job_btn" : "prepareForm",
        "click #submit-job" : "handleForm",
    },

    initialize: function (options) {
        this.job_list = new JobListView({project_id:options.id, app:this});
        $('#app_panel').data('project_id', options.id);
        // source = $('#job_form_template').html()
        // this.template = Handlebars.compile(source)
    },

    render: function() {
        console.log(this.$el.find('#main_job_table'))
        this.$el.find('#main_job_table tbody').remove();
        this.$el.find('#main_job_table').append(this.job_list.render().el);
    },

    editJob: function(job) {
        this.prepareForm(job);
        // store the password ID as data on the modal itself
        $('#job-form').data('job_id', job.get('id'));
        $('#job-form').show();
    },

    prepareForm: function(job_data) {
        job_data = job_data.attributes || {};
        var data = {
            'project_id':'',
            'completed':'',
            'title': '',
            'note':'',
            'due_date':'',
            'user':''
        };

        $.extend(data, job_data);
        console.log(data.title)
        var form = $('#job-form');
        $(form).find('#project_id').val(data.project_id.id);
        if (data.completed === true){
            $(form).find('#completed').attr('checked', 'checked')
        };
        $(form).find('#title').val(data.title);
        $(form).find('#note').val(data.note);
        $(form).find('#due_date').val(data.due_date);
        $(form).find('#user').val(data.user);

        $('#job-form').data('job_id', '');
    },

    handleForm: function() {
        event.preventDefault();
        event.stopImmediatePropagation();
        var form = $('#job-form');

        //get data for the checkbox
        var job_data = {
            project_id: $(form).find('#project_id').val(),
            title: $(form).find('#title').val(),
            note: $(form).find('#note').val(),
            due_date: $(form).find('#due_date').val(),
            user: $(form).find('#user').val(),
            completed: $(form).find('#completed').val()
        };

        console.log($('#job-form').data('job_id'))
        if ($('#job-form').data('job_id'))
        {
            job_data.id = $('#job-form').data('job_id');
            this.job_list.updateJob(job_data, { error: this.displayError });
        }
        else
        {   
            project_id = $('#app_panel').data('project_id')
            console.log(project_id)
            // add or update the password
            this.job_list = new JobListView({el:$('tbody#job_table'), project_id:project_id})

            this.job_list.addNew(job_data, { error: this.displayError });
        }

        return this

    },

});


var JobFormView = Backbone.View.extend({
    el: "job-form",

    events: {
        // "click #job-form :submit": "handleForm",
    },
    render: function() {
        html = this.template(this.model.toJSON())
        this.$el.html(html);
        console.log(this.$el)
        // html = this.template()
        // console.log(html)
        // this.$el.html(this.template);
    },

    

    

    handleForm: function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.options.app.handleForm()
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

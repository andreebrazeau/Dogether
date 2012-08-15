var JobRowView = Backbone.View.extend({
    tagName: 'tr',

    events: {
        "click":"editJob"
    },

    initialize: function (options) {
        source = $('#job_row_template').html()
        this.template = Handlebars.compile(source)
    },
    render: function() {
        html = this.template(this.model.toJSON())
        this.$el.html(html);
        if (this.$el.find('input:checked').length) {
            this.$el.addClass('completed');
        }
        return this;
    },

    editJob: function(event){
        $('#main_job_table tr').removeClass('selected')
        this.$el.addClass('selected')
        event.preventDefault();
        event.stopImmediatePropagation();
        $('#job-form').show()
        $('#project-form').hide()
        this.options.app.editJob(this.model);
    }


});

var JobListView = Backbone.View.extend({

    initialize: function(options) {
        console.log(options)
        source = $('#job_table_template').html()
        this.template = Handlebars.compile(source)
        this.jobs = new Jobs(options);
        this.project = options.project;
        this.jobs.bind('all', this.render, this);
        // this.jobs.bond('remove', this., this);
        // this.jobs.bind('reset', this.render, this);
        this.jobs.fetch();
    },

    addOne: function(job) {
        // pass a reference to the main application into the password view
        // so it can call methods on it
        this.$el.find('#main_job_table').append(new JobRowView({model: job,app: this.options.app}).render().el);
        return this;
    },

    addNew: function(job, options) {
        mergedOptions = {wait: true};
        $.extend(mergedOptions, options);
        this.jobs.create(job, mergedOptions);
        return this;
    },

    render: function() {
        console.log(this.$el)
        this.$el.html(this.template(this.project));
        this.jobs.each(this.addOne, this);
        return this;
    },

    cleanup: function() {
        this.el = null
        this.jobs.unbind();
    },

    updateJob: function(job_data, options) {
        mergedOptions = {wait: true};
        $.extend(mergedOptions, options);
        var job = this.jobs.get(job_data.id);
        if (_.isObject(job))
        {
            // iterate through all the data in job_data, setting it
            // to the password model
            job.set(job_data, {silent: true});

            // persist the change
            job.save(mergedOptions, {silent: true});
        }
    },

    deleteJob: function(job_id) {
        job = this.jobs.get(job_id);
        if (_.isObject(job)){
            job.destroy();
        }

    },

});

var JobPanelView = Backbone.View.extend({
    el: "#app_panel",

    events: {
        // "click #job-form :submit": "handleForm",
        "click #add_job_btn" : "prepareForm",
        "click #submit-job" : "handleForm",
        "click #delete-job" : "deleteJob",
        "change #completed": "handleForm",
    },

    initialize: function (project) {
        this.job_list = new JobListView({project:project, app:this, el: $('#job_panel')});
        this.project = project
        // source = $('#job_form_template').html()
        // this.template = Handlebars.compile(source)
    },

    cleanup: function() {
        this.job_list.cleanup();
        this.el = null;
    },

    render: function() {
        this.$el.find('#main_job_table tbody').remove();
        // this.$el.find('#main_job_table').append(this.job_list.render().el);
    },

    editJob: function(job) {
        this.prepareForm(job);
        // store the password ID as data on the modal itself
        $('#job-form').data('job_id', job.get('id'));
        $('#job-form').show();
    },

    deleteJob: function() {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (confirm("Are you sure you want to delete this entry?")){
            job_id = $('#job-form').data('job_id');
            this.job_list.deleteJob(job_id);
        }
    },

    prepareForm: function(job_data) {
        $('#job-form').show()
        $('#project-form').hide()
        job_data = job_data.attributes || {};
        var data = {
            'id':'',
            'project_id':'',
            'completed':'',
            'title': '',
            'note':'',
            'due_date':'',
            'user':''
        };

        $.extend(data, job_data);
        var form = $('#job-form');
        if (data.id != ''){
            $(form).find('#id').html('# '+data.id)
        }else{
            $(form).find('#id').html('New Job')
        }
        $(form).find('#project_id').val(data.project_id.id);

        if (data.completed === true){
            $(form).find('#completed').attr('checked', 'checked');
        }else{
            $(form).find('#completed').removeAttr('checked');
        };
        $(form).find('#title').val(data.title);
        $(form).find('#note').val(data.note);
        $(form).find('#due_date').val(data.due_date);
        $(form).find('#user').val(data.user);

        $('#job-form').data('job_id', '');
    },

    handleForm: function() {
        event.preventDefault();
        var form = $('#job-form');
        
        //get data for the checkbox
        var job_data = {
            project_id: $(form).find('#project_id').val(),
            title: $(form).find('#title').val(),
            note: $(form).find('#note').val(),
            due_date: $(form).find('#due_date').val(),
            user: $(form).find('#user').val()
        };
        if ($(form).find('#completed').attr('checked')){
            job_data.completed = true;
        }else{
            job_data.completed = false;
        }
        if ($('#job-form').data('job_id'))
        {
            job_data.id = $('#job-form').data('job_id');
            this.job_list.updateJob(job_data);
        }
        else
        {   
            // 
            this.job_list = new JobListView({project:project, app:this, el: $('#job_panel')})

            this.job_list.addNew(job_data);
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


$(document).ready(function() {
    order_number = 1;
    $('div#error_message').hide();
    $('#show-projects').click(Projects.index);
    $('tbody#project_table').on('click','tr.project',Jobs.index);
    $('#submit-job').click(function(event){ //in a event click return 'event'
        event.preventDefault(); // make sure to not do the Default (send a get)
        var job_data = $('#job-form').data('job-data')
        var form_data = Jobs.get_form_data();//get the data from the form
        if (job_data == '') { // if new job
            Jobs.create(form_data); // add job
        }else{
            Jobs.update(form_data,job_data); // update job
        }
    });
    $('tbody#job_table').on('click','tr.job',Jobs.get_job_details); //Jobs.get_job_details
    $('#add_job_btn').click(clear_form);
    $('#completed').click(Jobs.mark_completed);
    $('#delete-job').click(Jobs.delete_job);
    $('tbody#job_table').on('change','tr td input', Jobs.mark_completed);

    //This is to add the CSRF to tha Ajax POST method
    jQuery(document).ajaxSend(function(event, xhr, settings) {
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
        function sameOrigin(url) {
            // url could be relative or scheme relative or absolute
            var host = document.location.host; // host + port
            var protocol = document.location.protocol;
            var sr_origin = '//' + host;
            var origin = protocol + sr_origin;
            // Allow absolute or scheme relative URLs to same origin
            return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                // or any other URL that isn't scheme relative or absolute i.e relative.
                !(/^(\/\/|http:|https:).*/.test(url));
        }
        function safeMethod(method) {
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }

        if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        }
    });
});

alert_test = function() {
    alert('this')
};
Jobs = {}
Projects = {}
Projects.project = function(data) { //create a object job
    var project = {
    project_id: data.pk,
    title: data.fields.title,
    user_id: data.fields.user_id,
    details: data.fields.details
    };
    return project
};

Jobs.job = function(data) { //create a object job
    var job = {
    assign_to: data.fields.assign_to,
    completed: data.fields.completed,
    id: data.pk,
    title: data.fields.title,
    note: data.fields.note,
    due_date: data.fields.due_date,
    parent: data.fields.parent,
    project_id: data.fields.project_id,
    order: data.fields.order
    };
    return job
};

Jobs.index = function(){ //create index
    $('div.center').css('visibility', 'visible')
    var project = $(this).data('project-data');//get project ID from project 
    $('#project_table tr').removeClass('selected')
    $(this).addClass('selected')
    console.log(project);
    $('h1.project-title').html(project.title);
    $('#job-form').data('project_id', project.project_id);
    url = '/'+project.project_id+'/index'
    $.ajax({
        type: "POST",
        url: url,
        data: project
    }).done(Jobs.list_project);// call list project
};

Jobs.list_project = function(data) { //create the list of project
    $('#job_table').empty()
    order_number = 1;
    for (var each in data) { // orderred list here
        Jobs.add_job_to_page(Jobs.job(data[each]))// nest to pass in the Jons.job function to have the same kind os data
    };
};

Jobs.job_html = function(job) {//create the html for a job
    var new_job = '<tr class="job" id='+job.id+'><td>'+
    order_number+
    '</td><td><input value="'+job.id+'" type="checkbox"></td><td class="title">'+
    job.title +
    '</td><td class = "right-row">></td></tr>';
    order_number++;
    return new_job
};

Jobs.get_form_data = function(){ //get the project data from the form and 
    var form_data = $('#job-form').serializeObject();
    form_data.project_id = $('#job-form').data('project_id'); // get the project id from the job form and sent it to the form
    console.log(form_data)
    return form_data;
    //object{assign_to, due_date, note, project_id, title}
};

Jobs.create = function(form_data){ // form_data from function get_form_data //object{assign_to, due_date, note, project_id, title}
    if (Jobs.form_error(form_data) == false) {
        $('div#error-message').hide()
        $('div#error-message').html('')
        $.ajax({
            type: "POST",
            url: "/job/add_job",
            data: form_data 
        }).done(Jobs.add_job_to_page);// add job to page
    }
};

Jobs.update = function (form_data, job_data) {
    var job_id = job_data.id;
    form_data.id= job_id
    $.ajax({
        type: "POST",
        url: "/job/update",
        data: form_data
    }).done(Jobs.update_title);
};

Jobs.add_job_to_page = function(data) { //add the job th the list of job. //{Object {assign_to, completed, due_date, note, order, parent, project_id, title}
    var new_job = Jobs.job_html(data)
    $('#job_table').append(new_job);
    $('#job_table tr').last().data('job-data',data);// add the job to the data of the Tr element
    if (data.completed === true) {
        $('#job_table tr').last().addClass('completed')
    }
    clear_form()
};

Jobs.update_title = function(data) {
    $('#job_table tr#'+data.id+' td.title').html(data.title)

    // var new_row = Jobs.job_html(data)
    // old_row.replaceWith(new_row)
    $('#job_table tr#'+data.id).data('job-data',data)
    clear_form()
};

Jobs.get_job_details = function() { //show detail on the 'form'
    $('#job_table tr').removeClass('selected')
    $(this).addClass('selected')
    $('div.right').css('visibility', 'visible')
    var job = $(this).data('job-data'); 
    $('#job-form').data('job-data',job)
    $('#title').val(job.title)
    $('#note').val(job.note)
    $('#due_date').val(job.due_date)
    $('#assign_to').val(job.assign_to)
};

function clear_form() {
    $('#job_table tr').removeClass('selected')
    $('div.right').css('visibility', 'visible')
    $('#job-form').find(':input').each(function() {
        switch(this.type) {
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
            case 'date':
                $(this).val('')
        }
    });
    $('#job-form').data('job-data','')
};

Jobs.mark_completed = function() {
    var job_data = $('#job-form').data('job-data');
    $.ajax({
        type: "POST",
        url: "/job/mark_completed",
        data: job_data
    }).done(Jobs.reorder);
    $('tr#'+job_data.id).addClass('completed')
    return false;
};

Jobs.reorder = function(data) {
    url = '/'+data.project_id+'/index'    
    $.ajax({
        type: "POST",
        url: url,
        data: data.project_id
    }).done(Jobs.list_project);
}

Jobs.delete_job = function() {
    var job_data = $('#job-form').data('job-data');
    $.ajax({
        type: "POST",
        url: "/job/delete",
        data: job_data
    }).done(Jobs.reorder);
    return false;
}
Jobs.form_error = function(form_data) {
    var message = ''
    if (form_data.title == ''){
        message += 'Title should not be empty.</br>'
    }

    if (message.length > 0 ) {
        $('div#error-message').show()
        $('div#error-message').html('<p class="error-message">'+message+'</p>')
    }else{
        return false
    }
};

Projects.index = function() {
    $('#project_table').empty()
    $.ajax({
        type: "POST",
        url: "project/index",
    }).done(Projects.list_project);  
}

Projects.list_project = function(data) {
    for (var each in data) {
        project = Projects.project(data[each]);
        html = Projects.project_html(data[each]);
        $('#project_table').append(html);
        $('#project_table tr').last().data('project-data',project);
    };
}

Projects.project_html = function(project) {
    console.log(project)
    var html = '<tr class="project" id='+project.pk+'><td class="title">'+
    project.fields.title +
    '</td><td class = "right-row">></td></tr>';
    // var html = '<li class="project">'+project.fields.title+'</li>';
    return html
}

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


//










var edit_mode = false
$(document).ready(function() {
    $('#show-projects').click(Projects.index);
    $("ul#projects").on('click','li.project',Jobs.index);
    $('#submit-job').click(function(event){ //in a event click return 'event'
        event.preventDefault(); // make sure to not do the Default (send a get)
        form_data = Jobs.get_data();//get the data from the form
        if (form_data.job_id == '') { // if new job
            Jobs.add(form_data); // add job
        }else{
            Jobs.update(form_data); // update job
        }
    });
    $('tbody#job_table').on('click','tr.job',Jobs.get_job_details); //Jobs.get_job_details
    $('#add_job_btn').click(clear_form);
    $('#completed').click(Jobs.mark_completed)
});


Jobs = {}
Projects = {}
Projects.project = function(data) { //create a object job
    project = {
    project_id: data.pk,
    title: data.fields.title,
    user_id: data.fields.user_id,
    details: data.fields.details
    };
    return project
}

Jobs.job = function(data) { //create a object job
    job = {
    id: data.pk,
    title: data.fields.title,
    note: data.fields.note,
    assign_to: data.fields.assign_to,
    due_date: data.fields.due_date,
    parent: data.fields.parent,
    project_id: data.fields.project_id,
    completed: data.fields.completed,
    order: data.fields.order
    };
    return job
}

Jobs.index = function(){ //create idex
    $('#job_table').empty()
    var project = $(this).data('project-data');//get project ID from project 
    $('h1.project-title').html(project.title)
    $('#job-form').data('project_id', project.project_id) 
    url = '/'+project.project_id+'/index'
    $.ajax({
        type: "POST",
        url: url,
        data: project
    }).done(Jobs.list_project);// call list project
};

Jobs.list_project = function(data) { //create the list of project
    for (var each in data) {
        var job = Jobs.job(data[each]);
        Jobs.add_job_to_page(job)
        
    };
}

Jobs.job_html = function(job) {//create the html for a job
    new_job = '<tr class="job"><td>'+
    job.order+
    '</td><td><input value="'+job.id+'" type="checkbox"></td><td>'+
    job.title +
    '</td><td class = "right-row">></td></tr>'
    return new_job
};

Jobs.get_data = function(){ //get the project data from the form and 
    var form_data = $('#job-form').serializeObject();
    form_data.project_id = $('#job-form').data('project_id'); // get the project id from the job form and sent it to the form
    console.log(form_data)
    return form_data;
};

Jobs.add = function(form_data){ // add a new job
    // var error_message = "";

    $.ajax({
        type: "POST",
        url: "/job/add_job",
        data: form_data 
    }).done(Jobs.add_job_to_page);// add job to page
};

Jobs.update = function (form_data) {
    $.ajax({
        type: "POST",
        url: "/job/update",
        data: form_data 
    }).done(update_title);
};

Jobs.add_job_to_page = function(data) { //add the job th the list of job. 
    var new_job = Jobs.job_html(data)
    $('#job_table').append(new_job);
    $('#job_table tr').last().data('job-data',data);// add the job to the data of the Tr element
    clear_form()
};

Jobs.update_title = function() {

};

Jobs.get_job_details = function() { //show detail on the 'form'
    job = $(this).data('job-data'); 
    console.log(job)
    $('#title').val(job.title)
    $('#note').val(job.note)
    $('#due_date').val(job.due_date)
    $('#assign_to').val(job.assign_to)
    // $.ajax({
    //     type: "POST",
    //     url: "/job/get_job_details",
    //     data: job
    // }).done(Jobs.show_job_detail);  
};

Jobs.show_job_detail = function(data) {
    var db_data = data
    $('#title').val(data.title)
    $('#note').val(data.note)
    $('#due_date').val(data.due_date)
    $('#assign_to').val(data.assign_to)
};

function clear_form() {
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
}

Jobs.mark_completed = function() {
    $.ajax({
        type: "POST",
        url: "/job/mark_completed",
        data: { job_id: job.id }
    }).done();
    return false;
}

Projects.index = function() {
    $('#projects').empty()
    $.ajax({
        type: "POST",
        url: "project/index",
    }).done(Projects.list_project);  
}

Projects.list_project = function(data) {
    for (var each in data) {
        project = Projects.project(data[each]);
        html = Projects.project_html(data[each]);
        $('#projects').append(html);
        $('#projects li').last().data('project-data',project);
    };
}

Projects.project_html = function(project) {
    html = '<li class="project">'+project.fields.title+'</li>';
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











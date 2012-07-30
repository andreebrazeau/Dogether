var edit_mode = false
$(document).ready(function() {
    $('#show-projects').click(Together.Project.index);
    $("ul#projects").on('click','a.project',Together.Jobs.index);
    $('#submit-job').click(function(event){ //in a event click return 'event'
        event.preventDefault(); // make sure to not do the Default (send a get)
        form_data = Together.Jobs.get_data();
        console.log(form_data.job_id);
        if (form_data.job_id == '') {
            Together.Jobs.add(form_data);
        }else{
            Together.Jobs.update(form_data);
        }
    });
    $('tbody#job_table').on('click','tr.job',Together.Jobs.get_job_details); //Together.Jobs.get_job_details
    $('#add_job_btn').click(clear_form_elements);
    $('#completed').click(mark_completed)
});

var Together = {}
Together.Jobs = {}
Together.Project = {}

Together.Jobs.index = function(){
    project_id = $(this).attr('id');
    console.log($(this).html())
    $('h1.project-title').html($(this).html())    
    url = '/job/index'
    $.ajax({
        type: "POST",
        url: url,
        data: {project_id :project_id}
    }).done(Together.Jobs.list_project);
};

Together.Jobs.list_project = function(data) {
    for (var each in data) {
        job = Together.Jobs.job(data[each])
        html = Together.Jobs.job_html(job);
        $('#job_table').append(html);
        $('#job_table tr').last().data('job-data',job);
    };
}

Together.Jobs.job_html = function(job) {    
    new_job = '<tr class="job"><td>'+
    job.order+
    '</td><td><input value="'+job.job_id+'" type="checkbox"></td><td>'+
    job.title +
    '</td><td class = "right-row">></td></tr>'
    return new_job
};

Together.Jobs.get_data = function(){
    var form_data = $('#job-form').serializeObject();
    return form_data;
};
Together.Jobs.job = function(data) {
    job = {
    job_id: data.pk,
    title: data.fields.title,
    assign_to: data.fields.assign_to,
    due_date: data.fields.due_date,
    parent: data.fields.parent,
    project_id: data.fields.project_id,
    completed: data.fields.completed,
    order: data.fields.order
    };
    return job
}
Together.Jobs.add = function(form_data){
    // var error_message = "";
    $.ajax({
        type: "POST",
        url: "/job/add_job",
        data: form_data 
    }).done(Together.Jobs.add_job_to_page);
};

Together.Jobs.update = function (form_data) {
    $.ajax({
        type: "POST",
        url: "/job/update",
        data: form_data 
    }).done(update_title);
};

Together.Jobs.add_job_to_page = function(data) {
    console.log(data.order)
    var new_job = '<tr><td>'+
    data.order+
    '</td><td><input type="checkbox"></td><td>'+
    data.title +
    '</td><td class = "right-row">></td></tr>';
    $('#job_table').append(new_job);
};

Together.Jobs.update_title = function() {

};



Together.Jobs.get_job_details = function() {
    job_id = $(this).find('input').val();
    $.ajax({
        type: "POST",
        url: "/job/get_job_details",
        data: { job_id : job_id}
    }).done(show_job_detail);  
};

function show_job_detail(data) {
    edit_mode = true
    var db_data = data
    $('#title').val(data.title)
    $('#note').val(data.note)
    $('#due_date').val(data.due_date)
    $('#assign_to').val(data.assign_to)
};

function clear_form_elements() {
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

function mark_completed () {
    $.ajax({
        type: "POST",
        url: "/job/mark_completed",
        data: { job_id: job_id }
    }).done();
    return false;
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

Together.Project.index = function() {
    $('#projects').empty()
    $.ajax({
        type: "POST",
        url: "project/index",
    }).done(Together.Project.list_project);  
}

Together.Project.list_project = function(data) {
    for (var each in data) {
        html = Together.Project.project_html(data[each]);
        $('#projects').append(html);

    };
}

Together.Project.project_html = function(project) {
    html = '<li><a class="project" id='+project.pk+'>'+project.fields.title+'</a></li>';
    return html
}











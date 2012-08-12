
$(document).ready(function() {
    order_number = 1;
    $('#dialog').dialog({ autoOpen: false })
    $('#edit-team, #add-team').click(function() {
        $( "#dialog" ).dialog('open');
    });
    Teams.index();
    $('div#error_message').hide();
    Projects.index();
    $("#teams-selector").change(Projects.index);
    $('tbody#project_table').on('click','tr.project',function(){
        $('div.center').css('visibility', 'visible')
        $('div.right').css('visibility', 'visible')
        Projects.show_form()
        var project = $(this).data('project-data');
        $('#project_table tr').removeClass('selected')
        $(this).addClass('selected')
        Jobs.index(project.id);
        Projects.project_details(project);
    });
    $('#job-form #submit-job').click(function(event){ //in a event click return 'event'
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
    $('#add_job_btn').click(function(event) {
        Jobs.clear_form()
        Jobs.show_form()
    });
    $('#job-form #option-checkbox').change(function(event) {
        event.preventDefault();
        var job_data = $('#job-form').data('job-data')
        var form_data = Jobs.get_form_data();//get the data from the form
        Jobs.update(form_data,job_data);
    });

    $('#job-form #delete-job').click(function(event) {
        event.preventDefault();
        Jobs.delete_job();
    });
    $('tbody#job_table').on('change','tr td input', function(){
        job_data = $(this).closest('tr.job').data('job-data')
        var form_data = Jobs.get_form_data();//get the data from the form
        Jobs.update(form_data,job_data);
    });
    $('#add_project_btn').click(Projects.clear_form);
    $('#project-form #submit-project').click(function(event){ //in a event click return 'event'
        event.preventDefault(); // make sure to not do the Default (send a get)
        var project_data = $('#project-form').data('project-data')
        var form_data = Projects.get_form_data();//get the data from the form
        if (project_data == '') { // if new job
            Projects.create(form_data); // add job
        }else{
            Projects.update(form_data,project_data); // update job
        }
    });
    $('#project-form #delete-project').click(function(event) {
        event.preventDefault(); 
        Projects.delete_project()
    });    
});

alert_test = function() {
    alert('this')
};
Jobs = {}
Projects = {}
Teams = {}


Projects.project = function(data) { //create a object job
    var project = {
    id: data.pk,
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

Jobs.index = function(project){ //create index
    //get project ID from project 
    // $('h1.project-title').html(project.title);
    $('#job-form').data('project_id', project);
    url = '/projects/'+project+'/jobs/'
    Projects.show_form()
    $.ajax({
        type: "GET",
        url: url,
    }).done(Jobs.list_project);// call list project
};

Jobs.list_project = function(data) { //create the list of project

    $('#job_table').empty()
    order_number = 1;
    for (var each in data) { // orderred list here
        Jobs.add_job_to_page(data[each])// nest to pass in the Jons.job function to have the same kind os data
    };
};

Jobs.job_html = function(job) {//create the html for a job
    console.log(job)
    if (job.completed===true){
        var checked = 'checked'
    }else{
        var checked = ''
    }
    var new_job = '<tr class="job" id='+job.id+'><td>'+
    order_number+
    '</td><td><input value="'+job.id+'" type="checkbox"'+checked+'></td><td class="title">'+
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
        console.log(form_data)
        url = '/projects/'+form_data.project_id+'/jobs/'
        $('div#error-message').hide()
        $('div#error-message').html('')
        console.log(form_data)
        $.ajax({
            type: "POST",
            url: url,
            data: form_data
        }).done(function(){Jobs.index(form_data.project_id)});
    }
};

Jobs.update = function (form_data, job_data) {
    var job_id = job_data.id;
    form_data.id= job_id
    console.log(form_data)
    url = '/projects/'+form_data.project_id+'/jobs/'+job_id+'/'
    $.ajax({
        type: "PUT",
        url: url,
        data: form_data
    }).done(function(){Jobs.index(form_data.project_id)});
    
};

Jobs.add_job_to_page = function(data) { //add the job th the list of job. //{Object {assign_to, completed, due_date, note, order, parent, project_id, title}
    console.log(data)
    var new_job = Jobs.job_html(data)
    $('#job_table').append(new_job);
    $('#job_table tr').last().data('job-data',data);// add the job to the data of the Tr element
    if (data.completed === true) {
        $('#job-form #option-checkbox').attr('checked','checked');
        $('#job_table tr').last().addClass('completed');
    }
    Jobs.clear_form()
};

Jobs.update_title = function(data) {
    $('#job_table tr#'+data.id+' td.title').html(data.title)

    // var new_row = Jobs.job_html(data)
    // old_row.replaceWith(new_row)
    $('#job_table tr#'+data.id).data('job-data',data)
    Jobs.clear_form()
};

Jobs.get_job_details = function() { //show detail on the 'form'
    $('#job_table tr').removeClass('selected')
    $(this).addClass('selected')
    $('div.right').css('visibility', 'visible')
    Jobs.show_form()
    var job = $(this).data('job-data'); 
    $('#job-form').data('job-data',job)
    $('#job-form #title').val(job.title)
    $('#job-form #note').val(job.note)
    $('#job-form #due_date').val(job.due_date)
    $('#job-form #assign_to').val(job.assign_to)
};

Jobs.clear_form = function() {
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

Jobs.mark_completed = function(job_data) {
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
    console.log(job_data)
    url = '/projects/'+job_data.project_id.id+'/jobs/'+job_data.id+'/'
    $.ajax({
        type: "DELETE",
        url: url,
    }).done(function(){Jobs.index(job_data.project_id.id)});
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

Jobs.show_form = function() {
    $('#job-form').show();
    $('#project-form').hide();
}

Projects.index = function() {
    team_id = $('#teams-selector option:selected').data('team_id')
    $('#project_table').empty()
    // data = $('#team-form').serializeObject()
    $.ajax({
        type: "POST",
        url: "project/index",
        data: {'team_id':team_id},
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
    var html = '<tr class="project" id='+project.pk+'><td class="title">'+
    project.fields.title +
    '</td><td class = "right-row">></td></tr>';
    // var html = '<li class="project">'+project.fields.title+'</li>';
    return html
}

Projects.project_details = function(project) {
    $('#project-form #title').val(project.title)
    $('#project-form #details').val(project.details)
    $('#project-form').data('project-data',project)
}

Projects.show_form = function() {
    $('#project-form').show();
    $('#job-form').hide();
}

Projects.clear_form = function() {
    $('#job_table tr').removeClass('selected')
    $('#project_table tr').removeClass('selected')
    $('div.right').css('visibility', 'visible')
    $('div.center').css('visibility', 'hidden')
    Projects.show_form()
    $('#project-form').find(':input').each(function() {
        switch(this.type) {
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
        }
    });
    $('#project-form').data('project-data','')
};

Projects.get_form_data = function() {
    var form_data = $('#project-form').serializeObject();
    return form_data;
}

Projects.create = function(form_data) {
    var team_id = $('#teams-selector option:selected').data('team_id')
    form_data['team_id']=team_id
    if (Projects.form_error(form_data) == false) {
        $('div#error-message').hide()
        $('div#error-message').html('')
        $.ajax({
            type: "POST",
            url: "/project/add",
            data: form_data 
        }).done(Projects.index);// add job to page
    }
}

Projects.form_error = function(form_data) {
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

Projects.update = function (form_data, project_data) {
    var project_id = project_data.id;
    form_data.id= project_id
    $.ajax({
        type: "POST",
        url: "/project/update",
        data: form_data
    }).done(Projects.index);
};

Projects.update_title = function (data) {
    $('#project_table tr#'+data.id+' td.title').html(data.title)
    $('#project_table tr#'+data.id).data('project-data',data)
    Projects.clear_form()
};

Projects.delete_project = function() {
    var project_data = $('#project-form').data('project-data');
    $.ajax({
        type: "POST",
        url: "/project/delete",
        data: project_data
    }).done(Projects.index);
    return false;
};

Teams.index = function() {
}
//










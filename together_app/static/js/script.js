var edit_mode = false
$(document).ready(function() {

    $('#submit-job').click(add_job);
    $('tr').click(get_job_details);
    $('#add_job_btn').click(clear_form_elements);
    $('#completed').click(mark_completed)
});


function add_job(){
    var error_message = "";
    var job_id = $('#job_id').val();
    var title = $('#title').val();
    var note = $('#note').val();
    var due_date = $('#due_date').val();
    var assign_to = $('#assign_to').val();
    $.ajax({
        type: "POST",
        url: "/add_job",
        data: { job_id: job_id, title: title, note: note, due_date:due_date, assign_to:assign_to, project_id:project_id}
    }).done(add_job_to_page);
    return false;
};

function add_job_to_page(data) {
    console.log(data.order)
    if (data.add_job_to_list == true) {
        var new_job = '<tr><td>'+
    data.order+
    '</td><td><input type="checkbox"></td><td>'+
    data.title +
    '</td><td class = "right-row">></td></tr>';
    $('#job_table').append(new_job)
    } 
};

function get_job_details () {
    job_id = $(this).find('input').val();
    $.ajax({
        type: "POST",
        url: "/get_job_details",
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
        url: "/mark_completed",
        data: { job_id: job_id }
    }).done();
    return false;
}






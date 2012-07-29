var edit_mode = false
$(document).ready(function() {

    $('#submit-job').click(Together.Jobs.add);
    $('tr').click(get_job_details);
    $('#add_job_btn').click(clear_form_elements);
    $('#completed').click(mark_completed)
});

var Together = {}
Together.Jobs = {}
Together.Jobs.add = function(){
    var form_data = $('#job-form').serializeObject();
    // var error_message = "";
    // var job_id = $('#job_id').val();
    // var title = $('#title').val();
    // var note = $('#note').val();
    // var due_date = $('#due_date').val();
    // var assign_to = $('#assign_to').val();
    $.ajax({
        type: "POST",
        url: "/job/add_job",
        data: form_data 
        // { job_id: job_id, title: title, note: note, due_date:due_date, assign_to:assign_to, project_id:project_id}
    }).done(add_job_to_page);
    return false;
};

function add_job_to_page(data) {
    console.log(data.order)
    var new_job = '<tr><td>'+
    data.order+
    '</td><td><input type="checkbox"></td><td>'+
    data.title +
    '</td><td class = "right-row">></td></tr>';
    $('#job_table').append(new_job)
     
};

function get_job_details () {
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




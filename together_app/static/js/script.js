$(document).ready(function() {
    $('#submit-job').click(add_job);
});


function add_job(){
    var error_message = "";
    var title = $('#title').val();
    var note = $('#note').val();
    var due_date = $('#due_date').val();
    var assign_to = $('#assign_to').val();

    $.ajax({
        type: "POST",
        url: "/add_job",
        data: { title: title, note: note, due_date:due_date, assign_to:assign_to, project_id:project_id}
    }).done(add_job_to_page);
    return false;
};

function add_job_to_page(data) {
    console.log(data.title)
    var new_job = '<tr><td>?</td><td><input type="checkbox"></td><td>'+ data.title +'</td><td class = "right-row">></td></tr>';
    $('#job_table').append(new_job)
};
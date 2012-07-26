$(document).ready(function() {
    $('#submit-job').click(add_job);
});


function add_job(){
    var error_message = "";
    var title = $('#title').val();
    var note = $('#note').val();
    var due_date = $('#due_date').val();
    var assign_to = $('#assign_to').val();
    console.log(title);
    $.ajax({
        type: "POST",
        url: "/add_job",
        data: { title: title, note: note, due_date:due_date, assign_to:assign_to}
    }).done(function( msg ) {
        alert( title);
    });


};

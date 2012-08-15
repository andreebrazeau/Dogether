$(function() {
    var app;
    $('tbody#project_table').on('click','tr.project',function(){
        $(this).addClass('selected')
        $('div.center').css('visibility', 'visible')
        $('div.right').css('visibility', 'visible')
        $('#project-form').show()
        $('#job-form').hide()
        var project = $(this).data('project-data');
        console.log(project)
        $('#project_table tr').removeClass('selected')
        $(this).addClass('selected')

        if (app) app.cleanup();
        app = new JobPanelView(project);
        app.render();
        // TogetherJobs.index(project.id);
        Projects.project_details(project);
    });
    
});
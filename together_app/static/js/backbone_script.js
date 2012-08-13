$(function() {
    $('tbody#project_table').on('click','tr.project',function(){
        $('div.center').css('visibility', 'visible')
        $('div.right').css('visibility', 'visible')
        // Projects.show_form()
        var project = $(this).data('project-data');
        $('#project_table tr').removeClass('selected')
        $(this).addClass('selected')
        var app = new JobPanelView(project);
        app.render();
        // TogetherJobs.index(project.id);
        Projects.project_details(project);
    });
    
});
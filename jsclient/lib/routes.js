// Router - Controls the history
// A tutorial about routers in backbone.js can be found on http://backbonetutorials.com/what-is-a-router/
//
 var AppRouter = Backbone.Router.extend({
        routes: {

            "user/:id/collection/:collection" : "getCollection",
            "user/:id/subscribing" : "getUserSubscribing",
            "user/:id/subscribers" : "getUserSubscribers", // if page3 exists and path=/user/userid then load in #page3
            "user/:id" : "getUser",
            "stream" : "getStream",

            //":id/*actions" : "getPage",
            ":id" : "getPage",

            "*path": "defaultRoute" // Backbone will try match the route above first
        }
    });
    // Instantiate the router
    var app_router = new AppRouter;
 

    app_router.on('route:getPage', function (id) {
        var pa = new view_page({template: id, navMatch: id});
        container_main.openPage(pa);
     
    });

    app_router.on('route:getStream', function () {

        var pa = new view_stream({template: "stream", useSidebar: true, navMatch: 'stream'});
        container_main.openPage(pa);
    
    });

    app_router.on('route:getUser', function (id) {

        var userId = decodeURIComponent(id);

        // make user view
        var userView  = null;
        // make info subview

        // attach subview to view

        container_main.openPage(userView);

        //currentView

    });
    app_router.on('route:getUserSubscribing', function (id) {

        var userId = decodeURIComponent(id);

        var pa = new userView({template: "stream", useSidebar: true, navMatch: 'stream'});

        if (container_main.currentView != null && container_main.currentView.viewId != "userView")
        container_main.openPage(userView);

        //do that: container_main.currentView.loadSubPage();


       

        //currentView

    });

    app_router.on('route:defaultRoute', function (actions) {
     

     

    });
    // Start Backbone history a necessary step for bookmarkable URL's


var container_guest = new page_login()
var container_main ;

$(document).ready(function() {



    if (container_main == null)
     container_main= new page_authenticated({el:'#layout'});


    if (isLoggedIn())
        container_main.render();
    else
        container_guest.render();


    Backbone.history.start();

    // Mouse Down effect for icons above main navigation
    $(".actionBar a").mousedown(function(){
    
        var x = $(this).data("bgpos");

        if (!$(this).hasClass("active"))
        $(this).css("background-position",x+"px -31px");
    }).mouseout(function(){
        var x = $(this).data("bgpos");
        if (!$(this).hasClass("active"))
        $(this).css("background-position",x+"px -0px");
        
    });




});


function login()
{


    var u = $('#login_user').val();
    var p = $('#login_password').val();
    
    $('#login_error').hide();
    //$.post("ui/actions/login.php", {username:u, password:p}, function(d){
        
    var d = 2;

        if (d == 1)
        {$('#login_error').show();
        $('#login_user').focus().select();}
        if (d==2)
        $("#welcome_main").fadeOut(0, function(){

         container_main.render();
            location.href="#stream";

        });
    

        
    //  });
    
    

}
function LoadSimplePage(pageName)
{

}

function logout()
{
    container_guest.render();
    main_container = null;


}

function isLoggedIn()
{
    return true;
}


    
// Router - Controls the history
// A tutorial about routers in backbone.js can be found on http://backbonetutorials.com/what-is-a-router/
//
 var AppRouter = Backbone.Router.extend({
        routes: {
            "posts/:id": "getPost",
            "account/:id" : "getAccountPage",
            "page/:id" : "getPage",
            "*actions": "defaultRoute" // Backbone will try match the route above first
        }
    });
    // Instantiate the router
    var app_router = new AppRouter;
    app_router.on('route:getPost', function (id) {
        alert( "Get post number " + id );   
    });


    app_router.on('route:getAccountPage', function (id) {
        console.log("Account...");
     $("#layout").html("account"); 
    });


     app_router.on('route:getPage', function (id) {
      

       
    container_main.openPage(id);


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
            location.href="#page/stream";

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


    
// Router - Controls the history
// A tutorial about routers in backbone.js can be found on http://backbonetutorials.com/what-is-a-router/
//
 var AppRouter = Backbone.Router.extend({
        routes: {

            "user/:id/collection/:collection" : "getCollection",
           



            "user/:id/:id2" : "getUser", // if page3 exists and path=/user/userid then load in #page3
            "user/:id" : "getUser",

            "stream" : "getStream",
            "stream/:id" : "getStream",
            //":id/*actions" : "getPage",
            ":id" : "getPage",

            "*path": "defaultRoute" // Backbone will try match the route above first
        }
    });
    // Instantiate the router
    var app_router = new AppRouter;
 

    app_router.on('route:getPage', function (id) {


        var pa = new view_page({template: id, navMatch: id});
        container_main.currentView = pa;
        container_main.currentView.render();

         console.log("navMatch1:"+pa.options.navMatch);
     
    });

    app_router.on('route:getStream', function (id) {
        if (id == undefined)
            id = "0";


        // only if not yet exists...:

        if (container_main.currentViewId != "stream")
        {
        console.log("Instantiate ParentView");
        container_main.currentView = new view_stream({template: "stream", useSidebar: true, navMatch: 'stream'});
        }

   
        var vsd =  new view_stream_display({streamId: id, template: "stream_", navMatch: '#nav_'+id});
        container_main.currentView.setSub(vsd);
        container_main.currentView.render();

    
    });

    app_router.on('route:getUser', function (id, id2) {

        console.log("getuser");
        var userId = decodeURIComponent(id);


        if (container_main.currentViewId != "user")
        {
            console.log("CREATE NEW PARENT VIEW");
        console.log("Instantiate ParentView : User");
        container_main.currentView = new view_profilepage({userIdRaw: id,userId: userId, template: "user", navMatch: 'profile'});
        }

        if (id2 == null)
        {
            console.log("router: id2 is null");

            var vsd =  new view_profilepage_info({ template: "user_", navMatch: '#nav_profile_info'});
            container_main.currentView.setSub(vsd);
           
        }
        if (id2 == "subscribing")
        {
            var vsd =  new view_subpage({ template: "user_subscribing", navMatch: '#nav_profile_sub2', el: '#page3'});
            container_main.currentView.setSub(vsd);
            
        }
        if (id2 == "subscribers")
        {
            var vsd =  new view_subpage({template: "user_subscribers", navMatch: '#nav_profile_sub', el: '#page3'});
            container_main.currentView.setSub(vsd);
            
        }
        container_main.currentView.render();

    });
    app_router.on('route:getUserSubscribing', function (id) {

     //   var userId = decodeURIComponent(id);



       // var pa = new userView({template: "stream", useSidebar: true, navMatch: 'stream'});

      //  if (container_main.currentView != null && container_main.currentView.viewId != "userView")
    //    container_main.openPage(userView);

        //do that: container_main.currentView.loadSubPage();


       

        //currentView

    });

    app_router.on('route:defaultRoute', function (actions) {
     
    // Go to stream if no route specified
   location.replace('#stream');

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


    
// Router - Controls the history
// A tutorial about routers in backbone.js can be found on http://backbonetutorials.com/what-is-a-router/


    // Start Backbone history a necessary step for bookmarkable URL's


var container_guest = new page_login();
var container_main ;

$(function(){
   
    // FIRST STEP: CHEKC FOR USER SESSION!!!
    if ((localStorage.getItem("user") !==  null))
    charmeUser = new apl_user(localStorage.getItem("user"));



console.log("USEROBJ");
 console.log(charmeUser);

    if (container_main == null)
     container_main= new page_authenticated({el:'#layout'});


    //container_main.userIdURL = charmeUser.userIdURL;



    if (isLoggedIn())
    console.log("is logged in!");

    if (isLoggedIn())
        container_main.render();
    else
        container_guest.render();




 var AppRouter = Backbone.Router.extend({
        routes: {

            "user/:id/collection/:collection" : "getCollection",

            "user/:id/:id2" : "getUser",
            "user/:id" : "getUser",
            
            "signup" : "getRegister",

            "stream" : "getStream",
            "stream/:id" : "getStream",


            "settings/:id" : "getSettings",
            "settings" : "getSettings",

            "talks/:id" : "getTalks",
            "talks" : "getTalks",

            "lists" : "getLists",
            "lists/:id" : "getLists",
            
            "welcome" : "getWelcome",

            ":id" : "getPage",





          

            "*path": "defaultRoute" 
        }
    });
    // Instantiate the router
    var app_router = new AppRouter;
 
  app_router.on('route:getLists', function (id) {

        if (id == undefined)
            id = "";
       

        if (container_main.currentViewId != "lists")
        {
            var pa = new view_lists({template: "lists", navMatch: "lists", useSidebar: true});
            container_main.setCurrent(pa);
            container_main.currentView.render();
        }
        

        var vsd =  new view_lists_subpage({ template: "lists_",  listId: id, navMatch: '#nav_'+id, el: '#page'});
        container_main.currentView.setSub(vsd);
        container_main.currentView.render();

     
    });



   app_router.on('route:getTalks', function (id) {

        if (id == undefined)
            id = "";
       

        if (container_main.currentViewId != "talks")
        {
            var pa = new view_talks({template: "talks", navMatch: "talks"});
            container_main.setCurrent(pa);
            container_main.currentView.render();
        }
        

        //var vsd =  new view_settings_sub({ template: "talks_", navMatch: '#nav_'+id, el: '#page3'});
       // container_main.currentView.setSub(vsd);
       // container_main.currentView.render();

     
    });




  app_router.on('route:getSettings', function (id) {

        if (id == undefined)
            id = "";
       

        if (container_main.currentViewId != "settings")
        {
            var pa = new view_page({template: "settings", navMatch: "settings", useSidebar: true});
           container_main.setCurrent(pa);
            container_main.currentView.render();
        }
        
        var vsd =  new view_settings_sub({ template: "settings_"+id, navMatch: '#nav_'+id});
        container_main.currentView.setSub(vsd);
        container_main.currentView.render();

     
    });

    app_router.on('route:getRegister', function (id) {


    
        var pa = new view_register({needLogin: false});
        container_main.setCurrent(pa);
        pa.render();
        //console.log("navMatch1:"+pa.options.navMatch);
     
    });



    app_router.on('route:getPage', function (id) {


    
        var pa = new view_page({template: id, navMatch: id, needLogin: false});
        
        if (charmeUser != null)
        {
            container_main.setCurrent(pa);
            container_main.currentView.render();
        }
        else
            pa.render();
        //console.log("navMatch1:"+pa.options.navMatch);
     
    });

app_router.on('route:getWelcome', function (id) {



        var pa = new view_welcome({template: "welcome",  needLogin: false});
        

        container_main.setCurrent(pa);
        pa.render();



    });


    app_router.on('route:getStream', function (id) {
        if (id == undefined)
            id = "";


        // only if not yet exists...:

        if (container_main.currentViewId != "stream")
        {
        console.log("Instantiate ParentView");
        container_main.setCurrent(new view_stream({template: "stream", useSidebar: true, navMatch: 'stream'}));
        }

   
        var vsd =  new view_stream_display({streamId: id, template: "stream_", navMatch: '#nav_'+id});
        container_main.currentView.setSub (vsd);
        container_main.currentView.render();

    
    });

    app_router.on('route:getUser', function (id, id2) {

        console.log("getuser");
        var userId = decodeURIComponent(id);


        if (container_main.currentViewId != "user")
        {
            console.log("CREATE NEW PARENT VIEW");
        console.log("Instantiate ParentView : User");
        container_main.setCurrent(new view_profilepage({userIdRaw: id,userId: userId, template: "user", navMatch: 'profile'}));
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
    if (charmeUser == null)
        location.replace('#welcome');
    else
        location.replace('#stream');

    });

    if (!Backbone.History.started) {
            Backbone.history.start();
        }








});

var charme_private_rsakey = null;


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
        
  

     
       


        
/*
        var passphrase = "";
        if (localStorage.getItem("!user_"+u) == null)
        {

               // also ask for certificate
               passphrase =prompt("Please enter your passphrase","");
               // localStorage.setItem("!user_"+u);

        }
*/
      var serverurl = u.split("@")[1];

        // TODO: Change server.local to user id val
       // var url = 'http://'+serverurl+'/charme/req.php?u='+encodeURI(u)+'&p='+encodeURI(p)+'&action=user.login&callback=?';



        // always load certificate...
      
      /*   $.ajax({
          dataType: "jsonp",
          url: url,
          data: "",
          success: function(data) {*/



    apl_request(
            {"requests" : [
            {"id" : "user_login", "u" : u, "p" : p}

            ]
        }, function(data){


console.log(data);
            console.log("logged in and received:"+data.user_login.status+" on url ");
          //  console.log(data);

            if (data.user_login.status == "PASS")
            {
                

                var passphrase = "";
                if (localStorage.getItem("!user_"+u) == null)
                {

                   // also ask for certificate
                   passphrase =prompt("Please enter your passphrase","4KuOzJknRDIW3lU2d5ED");
                   // localStorage.setItem("!user_"+u);

                   //charme_private_rsakey

                }
                else
                {
                    // Decrpyt stored item with password.

                }
                console.log("TO DECRYPT:");
                console.log(data.user_login.rsa);
                try {
                    
                    var tt  = sjcl.decrypt(passphrase, (data.user_login.rsa));
                    //v.plaintext = sjcl.decrypt(passphrase, ciphertext, {}, rp);
                    console.log("decrpyted rsa key is:");
                    charme_private_rsakey = tt;

                    // Success! -> Login!

                    // Save PHP Session Key
                    localStorage.setItem("user", u);
                    charmeUser = new apl_user(u); 
                    // Save server
                    container_main.userIdURL = charmeUser.userIdURL;

                     $("#welcome_main").fadeOut(0, function(){
                     container_main.render();
                        location.href="#stream";
                            });


                } catch(e) {
                  alert("Can't decrypt RSA Key (Wrong passphrase?)");
                  return;
                 }


                
              

                console.log(tt);

            }

/*
*  ON SUCCESS
*

*/


            // decrpyt certificate with passphrase
          }, "", serverurl);


}
function LoadSimplePage(pageName)
{

}

function logout()
{

    container_guest.render();
    main_container = null;
    charmeUser = null;
    location.replace("#welcome");
    localStorage.removeItem("user");


}

function isLoggedIn()
{


    if (charmeUser != null)
    return true;
    return false;
}


    
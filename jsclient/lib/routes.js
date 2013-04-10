// Router - Controls the history
// A tutorial about routers in backbone.js can be found on http://backbonetutorials.com/what-is-a-router/


    // Start Backbone history a necessary step for bookmarkable URL's


/***
	Name:
	routes.js

	Info:
	Provides routing and contains document complete handler.

	Location:
	lib/routes.js

*/




var container_guest = new page_login();
var container_main ;

$(function(){
   
    if (isLoggedIn())
         charmeUser = new apl_user(localStorage.getItem("user"));

    if (container_main == null)
     container_main= new page_authenticated({el:'#layout'});


    // get apl data, like lists, friends etc. from server
    apl_setup(function(){

    apl_setup2();




    if (isLoggedIn())
    {
        container_main.render();}
    else
    {

        container_guest.render();

    }

 var AppRouter = Backbone.Router.extend({
        routes: {

            "user/:id/collection/:collection" : "getCollection",


            "user/:id/:id2/:id3" : "getUser",

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
            
        }
        // if (id != "")
         {
         
            var vsd =  new view_talks_subpage({superId: id});
            container_main.currentView.setSub(vsd);        
         }

        
         container_main.currentView.render();


        

      
       

     
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

    app_router.on('route:getUser', function (id, id2, id3) {

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
       else if (id2 == "collections")
        {
            if (typeof id3 === 'undefined')
            {

                 var vsd =  new view_profilepage_collection({ template: "user_collections", navMatch: '#nav_profile_collections'});
                 container_main.currentView.setSub(vsd);
            }
            else
            {
                var vsd =  new view_profilepage_collection_show({collectionId: id3});
                container_main.currentView.setSub(vsd);
               
            }


        }
        else if (id2 == "subscribing")
        {
            var vsd =  new view_subpage({ template: "user_subscribing", navMatch: '#nav_profile_sub2', el: '#page3'});
            container_main.currentView.setSub(vsd);
            
        }
        else if (id2 == "subscribers")
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
    if (!isLoggedIn())
        location.replace('#welcome');
    else
        location.replace('#stream');

    });

    if (!Backbone.History.started) {
            Backbone.history.start();
        }






    });










});

var charme_private_rsakey = null;

/*


    Name:
    login()

    Info:

    Login function - After server login status is OK:

    * Get sessionId
    * Looking up for password encrypted passphrase in localStorage (`localStorage.getItem("PassPassphrase");`):
    * If===null: Show input field, and store encrypted with password

    Decrypt with password and 
    Enrypt with session id

    Location:
    apl/routes.js

  
 
*/
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
console.log("u"+u +"p"+p);
            if (data.user_login.status == "PASS")
            {


                try {


                    localStorage.setItem("user", u);

                    charmeUser = new apl_user(u); 
                    // Save server
                    container_main.userIdURL = charmeUser.userIdURL;

					apl_setup(function()
					{
                        var passphrase;
                        if (localStorage.getItem("passPassphrase") !== null)
                             passphrase =  sjcl.decrypt(p, localStorage.getItem("passPassphrase")); 
                        else
                        {
                            passphrase =prompt("Please enter your passphrase","XD3dPqgxYdfrZCbBUWCP");
                            localStorage.setItem("passPassphrase", sjcl.encrypt(p, passphrase))
                        }

                        // Store passphrase encoded with session Id.
                        localStorage.setItem("sessionPassphrase", (sjcl.encrypt(charmeUser.sessionId, passphrase)));

                        // Store encoded certificate
                        localStorage.setItem("certificate", (data.user_login.rsa));

                        apl_setup2();
						// When completed, open main view
						$("#welcome_main").fadeOut(0, function()
						{
							container_main.render();
							location.href="#stream";
						});
					});


                      


                } catch(e) {
                  alert("Can't decrypt RSA Key (Wrong passphrase?)");
                  return;
                 }


                
             

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
    localStorage.removeItem("passphrase");

}
/***
    Name:
    isLoggedIn

    Info:
    Checks if the user id logged in.
    Returns true or false.
    
    No certificate => Logout
    No passphrase => Logout

    Location:
    page_modules.js

*/
function isLoggedIn()
{

    if (localStorage.getItem("user") !== null)
    return true;
    return false;
}



    
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

var AppRouter = Backbone.Router.extend({
    routes: {

        "user/:id/collection/:collection": "getCollection",
        "user/:id/:id2/:id3": "getUser",
        "user/:id/:id2": "getUser",
        "user/:id": "getUser",
        "signup": "getRegister",
        "stream": "getStream",
        "stream/:id": "getStream",
        "find/:id": "getFind",
        "find": "getFind",
        "notifications": "getNotifications",
        "settings/:id": "getSettings",
        "settings": "getSettings",
        "talks/:id": "getTalks",
        "talks": "getTalks",
      //  "rooms/:id": "getRooms",
       // "rooms": "getRooms",

        "lists": "getLists",
        "lists/:id": "getLists",
        "welcome": "getWelcome",
        ":id": "getPage",
        "*path": "defaultRoute"
    }
});
// Instantiate the router
var app_router = new AppRouter;


var container_guest = new page_login();
var container_main;

$(function() {


   /* try{
    Object.defineProperty(console, '_commandLineAPI',
   { get : function() { throw '!!!WARNING!!! The developer console is for developers ONLY. If someone gave you some code to insert here DO NOT DO IT. The encryption of you Charme account may be seriously affected otherwise!' } })
}catch(e){}
*/


    if (isLoggedIn())
        charmeUser = new apl_user(localStorage.getItem("user"));

    if (container_main == null)
        container_main = new page_authenticated({
            el: '#layout'
        });




    // get apl data, like lists, friends etc. from server
    apl_setup(function() {

        apl_setup2();

        if (isLoggedIn()) {
            container_main.render();


        } else {

            container_guest.render();

        }



        app_router.on('route:getLists', function(id) {


            if (id == undefined)
                id = "";


            if (container_main.currentViewId != "lists") {
                var pa = new view_lists({
                    template: "lists",
                    navMatch: "lists",
                    useSidebar: true
                });
                container_main.setCurrent(pa);

            }

            apl_request({
                "requests": [{
                        "id": "list_getItems",
                        "listId": id
                    },
                ]
            }, function(d2) {

                console.log("HERE");
                console.log(d2);
                var vsd = new view_lists_subpage({
                    data: d2,
                    template: "lists_",
                    listId: id,
                    navMatch: '#nav_' + id,
                    el: '#page'
                });
                container_main.currentView.setSub(vsd);
                container_main.currentView.render();

            });



        });



        app_router.on('route:getTalks', function(id) {

            if (typeof id == 'undefined')
           {

             id = "";



   }


            if (container_main.currentViewId != "talks") {
                var pa = new view_talks({
                    template: "talks",
                    navMatch: "talks"
                });
                container_main.setCurrent(pa);

            }
          //  if (id != "")
            {

                var vsd = new view_talks_subpage({
                    conversationId: id
                });
                container_main.currentView.setSub(vsd);
            }


            container_main.currentView.render();



        });



        app_router.on('route:getSettings', function(id) {

            if (id == undefined)
                id = "";


            if (container_main.currentViewId != "settings") {
                var pa = new view_page({
                    template: "settings",
                    navMatch: "settings",
                    useSidebar: true
                });
                container_main.setCurrent(pa);

            }
            var data = {};

            if (id == "keymanager") {
                apl_request({
                    "requests": [{
                            "id": "key_getAll"
                        },

                        /* Unused, we get the keyring already at login
                        {
                            "id" : "key_getPrivateKeyring"
                        }*/


                    ]
                }, function(d2) {


                    var vsd = new view_settings_keymanager({
                        template: "settings_keymanager",
                        navMatch: '#nav_' + id,
                        data: d2
                    });
                    container_main.currentView.setSub(vsd);
                    container_main.currentView.render();



                });
            }
            else   if (id == "locations") {

                  apl_request({
                      "requests": [{
                          "id": "simpleStore",
                          "action": "get",
                          "class": "location"
                          },
                      ]
                  }, function(d2) {


                      var vsd = new view_settings_locationmanager({
                          template: "view_settings_locations",
                          navMatch: '#nav_' + id,
                          data: d2
                      });
                      container_main.currentView.setSub(vsd);
                      container_main.currentView.render();
                  });
              }
            else  if (id == "password") {
                apl_request({
                    "requests": [{
                          //  "id": "key_getAll"
                        },

                        /* Unused, we get the keyring already at login
                        {
                            "id" : "key_getPrivateKeyring"
                        }*/


                    ]
                }, function(d2) {


                    var vsd = new view_settings_pwchange({
                        template: "settings_password",
                        navMatch: '#nav_' + id,
                        data: d2
                    });
                    container_main.currentView.setSub(vsd);
                    container_main.currentView.render();



                });
            }

             else if (id == "privateinfo_requests") {

                   apl_request({
                    "requests": [{
                            "id": "piece_request_list"
                        },


                    ]
                }, function(d2) {

                      var vsd = new view_settings_privateinfo_requests({
                        template: "settings_privateinfo_requests",
                        navMatch: '#nav_' + id,
                        data: d2
                    });


                    container_main.currentView.setSub(vsd);
                    container_main.currentView.render();



                });



             }

            else if (id == "privateinfo") {
                apl_request({
                    "requests": [{
                            "id": "piece_store_get"
                        },


                    ]
                }, function(d2) {

                    d2.prvInfo = {};

                    // Default values
                    d2.prvInfo.phone = "";
                    d2.prvInfo.currentcity = "";
                    d2.prvInfo.mail = "";

                    // Do decrypt
                    $.each(d2.piece_store_get.items, function() {

                        try{

                        var original = decryptField(this.value);
                        }catch(err){
                            console.warn(this.value);
                            console.warn(err);
                        }
                        d2.prvInfo[this.key] = original;

                    });

                    var vsd = new view_settings_privateinfo({
                        template: "settings_privateinfo",
                        navMatch: '#nav_' + id,
                        data: d2
                    });


                    container_main.currentView.setSub(vsd);
                    container_main.currentView.render();

                });
            } else if (id == "") {

                apl_request({
                    "requests": [{
                            "id": "profile_get",
                            "profileId": charmeUser.userId
                        },


                    ]
                }, function(d2) {


                    var vsd = new view_settings_sub({
                        template: "settings_" + id,
                        navMatch: '#nav_' + id,
                        data: d2
                    });
                    container_main.currentView.setSub(vsd);
                    container_main.currentView.render();

                });
            } else {
                var vsd = new view_settings_sub({
                    template: "settings_" + id,
                    navMatch: '#nav_' + id
                });
                container_main.currentView.setSub(vsd);
                container_main.currentView.render();
            }

        });

           app_router.on('route:getNotifications', function(id) {
            var pa = new view_notifications({
                forceNewRender: true,
                navMatch:"notifications",
                data: {

                }
            });
            container_main.setCurrent(pa);
            pa.render();
           });

        app_router.on('route:getFind', function(id) {

            var query = decodeURIComponent(id);
            NProgress.start();
            apl_request({
                "requests": [{
                        "id": "search_start",
                        "q": query
                    },
                ]
            }, function(d2) {

              var pa = new view_find({
                  q: decodeURIComponent(id),
                  forceNewRender: true,
                  navMatch:"find",
                  data: {
                    //  info: d2.profile_get_name.info
                    results: d2.search_start.results
                  }
              });

              container_main.setCurrent(pa);
              pa.render();
              NProgress.done();

            });
        });

        app_router.on('route:getRegister', function(id) {

            var pa = new view_register({
                noLogin: true
            });
            container_main.setCurrent(pa);
            pa.render();
            //console.log("navMatch1:"+pa.options.navMatch);

        });

        app_router.on('route:getPage', function(id) {



            var pa = new view_page({
                template: id,
                navMatch: id,
                noLogin: true
            });
            pa.getData = function() {
                _.templateSettings.variable = "rc";
                return {"imprinturl": "http://"+charmeUser.server+"/charme/config/imprint.html"}
             };

            if (charmeUser != null) {
                container_main.setCurrent(pa);
                container_main.currentView.render();
            } else
                pa.render();
            //console.log("navMatch1:"+pa.options.navMatch);

        });


        app_router.on('route:getWelcome', function(id) {

            if (isLoggedIn()) {
                location.replace("#stream");
                return;
            }
            var pa = new view_welcome({
                template: "welcome",
                noLogin: true
            });


            pa.getData = function() {
                _.templateSettings.variable = "rc";

                var code = localStorage.getItem("loginStatusCode");
                  localStorage.removeItem("loginStatusCode");
                return {
                    username: localStorage.getItem("userAutoComplete"),
                    loginStatusCode: code
                };
            }


            container_main.setCurrent(pa);
            pa.render();

        });


        app_router.on('route:getStream', function(id) {
            if (id == undefined)
                id = "";

            if (container_main.currentViewId != "stream") {
                console.log("Instantiate ParentView");
                container_main.setCurrent(new view_stream({
                    template: "stream",
                    useSidebar: true,
                    navMatch: 'stream'
                }));
            }

            var options = {
                streamId: id,
                template: "stream_",
                navMatch: '#nav_' + id
            };

            if (strStartsWith(id, "filter_")) { // Add filter is exists (e.g. only posts from friends in radius 3km)
                var filterIndex = id.substr(7);
                options.filter = apl_postloader_filters.filterReferences[filterIndex];


            }
            if (strStartsWith(id, "archive")) {
              options.filter = {"archived": true};
            }

            var vsd = new view_stream_display(options);
            container_main.currentView.setSub(vsd);
            container_main.currentView.render();
        });

        app_router.on('route:getUser', function(id, id2, id3) {

            // Close popup windows
            ui_closeBox();

            console.log("getuser");
            var userId = decodeURIComponent(id);

            if (container_main.currentViewId != "profile_" + id) {


                container_main.setCurrent(new view_profilepage({
                    expViewId: "profile_" + id,
                    userIdRaw: id,
                    userId: userId,
                    template: "user",
                    navMatch: 'profile',
                    useResponsiveSidebar: true
                }));

            }

            if (id2 == null) {


                var vsd = new view_profilepage_info({
                    template: "user_",
                    navMatch: '.nav_profile_info'
                });
                container_main.currentView.setSub(vsd);
                container_main.currentView.render();

            } else if (id2 == "collections") {
                if (typeof id3 === 'undefined') {

                    var vsd = new view_profilepage_collection({
                        template: "user_collections",
                        navMatch: '.nav_profile_collections'
                    });
                    container_main.currentView.setSub(vsd);

                } else {

                    var vsd = new view_profilepage_collection_show({
                        collectionId: id3
                    });
                    container_main.currentView.setSub(vsd);

                }
                container_main.currentView.render();

            } else if (id2 == "post") {



                var vsd = new view_profilepage_posts({
                    postId: id3,
                    template: "user_postview",
                    el: '#page3',
                    navMatch: '#none'
                });
                container_main.currentView.setSub(vsd);
                container_main.currentView.render();

            } else if (id2 == "lists") {

                apl_request({
                    "requests": [{
                            "id": "lists_getProfile",
                            "userId": userId
                        },


                    ]
                }, function(d2) {


                    var vsd = new view_profilepage_listitems({
                        data: d2,
                        template: "user_lists",
                        navMatch: '.nav_profile_lists',
                        el: '#page3'
                    });

                    container_main.currentView.setSub(vsd);
                    container_main.currentView.render();


                });

            }



        });


        app_router.on('route:defaultRoute', function(actions) {

            if (!isLoggedIn())
                location.href = "#welcome";
            else
                location.href = "#stream";


        });

        if (!Backbone.History.started) {
            Backbone.history.start();
        }



    });



});

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

function login() {


    var u = $('#login_user').val();
    var p = $('#login_password').val();

    $('#login_error').hide();
    //$.post("ui/actions/login.php", {username:u, password:p}, function(d){

    var d = 2;

    if (d == 1) {
        $('#login_error').show();
        $('#login_user').focus().select();
    }
    if (d == 2)
        var serverurl = u.split("@")[1];




      apl_request({
        "requests": [{
                "id": "reg_salt_get",
                "userid": u,

            }

        ]
    }, function (data1)
    {
    var hashpass = CryptoJS.SHA256(p+data1.reg_salt_get.salt).toString(CryptoJS.enc.Base64);


    apl_request({
        "requests": [{
                "id": "user_login",
                "u": u,
                "p": hashpass
            }

        ]
    }, function(data) {

        console.log(data);
        if (data.user_login.CHARME_VERSION < CHARME_VERSION_REQUIRED)
        {
            alert("Your server version is outdated. Please notify your servers administrator.");
        }
        else if (data.user_login.status == "PASS") {

            var oldUserId = localStorage.getItem("userAutoComplete");


            localStorage.setItem("user", u);
            localStorage.setItem("signedData", JSON.stringify(data.user_login.ret.signedData.obj));
            charmeUser = new apl_user(u); // crypto_hmac_check is called below, as we need fastkey1.
            // Save server
            container_main.userIdURL = charmeUser.userIdURL;

            apl_setup(function() {



                try {
                    var passphrase;
                    if (localStorage.getItem("passPassphrase") !== null &&
                    oldUserId == u
                  ) {

                        passphrase = aes_decrypt(p, localStorage.getItem("passPassphrase"));

                    }
                    else {
                        passphrase = prompt("Please enter your passphrase", "");
                        localStorage.setItem("passPassphrase", aes_encrypt(p, passphrase))

                    }

                    // Store passphrase encoded with session Id.
                    localStorage.setItem("sessionPassphrase", (aes_encrypt(charmeUser.sessionId, passphrase)));

                    // The keyring contains a list of
                    // Keypairs, where the last item is the newest key
                    var keyringAES = data.user_login.ret.keyring;
                    // each item has format {revision, rsa}
                    var keyring = aes_decrypt(passphrase, keyringAES);

                    // Store encoded certificate
                    localStorage.setItem("keyring", keyring);
                    localStorage.setItem("userAutoComplete", u);

                    apl_setup2();

                    if (!crypto_hmac_check(data.user_login.ret.signedData)) // MUST be called after apl_setup2 as we need the keyring to check the hmac with fastkey1
                    alert("CRITICAL SECURITY ERROR: Could not verify integrity of signed data. ");


                    if (!global_socket_connection_isactive) {
                      apl_updater_connect_socket();
                    }


                    // When completed, open main view
                    $("#welcome_main").fadeOut(300, function() {
                        container_main.render();
                        location.href = "#stream";
                    });

                } catch (e) {
                    console.log(e);
                    alert("Can not decrypt RSA Key (Wrong passphrase?) Error Message: "+String(e));
                    localStorage.removeItem("sessionPassphrase");
                    localStorage.removeItem("keyring");
                    localStorage.removeItem("passPassphrase");
                    localStorage.removeItem("user");
                    localStorage.removeItem("user");

                    return;
                }


            }, true);



        } else
            alert("Wrong Charme UserId or password.");

        /*
         *  ON SUCCESS
         *

         */


        // decrpyt certificate with passphrase
    }, "", serverurl);
    }, "", serverurl);

}

function silentLogout(deleteAll) {
  main_container = null;
  charmeUser = null;
  if (deleteAll == true) { // Also delete passphrase and userId
      localStorage.removeItem("passPassphrase");
      localStorage.removeItem("userAutoComplete");
      localStorage.removeItem("signedData");
  }
  localStorage.removeItem("keyring");
  localStorage.removeItem("user");
  localStorage.removeItem("passphrase");
  localStorage.removeItem("sessionPassphrase"); // important!

  if (typeof global_socket_connection !== "undefined")
    global_socket_connection.close();

}

function logout(loginStatusCode, deleteAll) {

    if (deleteAll) {
      if(!confirm("Are you sure to perform a safe logout?"))
        return;
    }

    ui_closeBox();
    silentLogout(deleteAll);
    container_guest.render();
    localStorage.setItem("loginStatusCode", loginStatusCode);
    location.href = "./";

  //  app_router.navigate("welcome", {trigger: true, replace: false});
}

function delTemp() {
    localStorage.removeItem("keyring");
    localStorage.removeItem("signedData");
    localStorage.removeItem("userAutoComplete");
    localStorage.removeItem("sessionPassphrase");
    localStorage.removeItem("certificate");
    localStorage.removeItem("passPassphrase");
    localStorage.removeItem("user");
    alert("Deleted temporary data.");
}

function resendPassword() {
    alert("not working in beta yet. please contact your server admin.");
    var m = $("#inp_pw_mail").val();
    var uid = $("#inp_pw_uid").val();
    alert(m);


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

function isLoggedIn() {

    if (localStorage.getItem("user") !== null && localStorage.getItem("passPassphrase") !== null


    )
        return true;
    return false;
}

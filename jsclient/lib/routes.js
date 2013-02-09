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


    app_router.on('route:getPost', function (id) {
        alert( "Get post number " + id );   
    });


     app_router.on('route:getPage', function (id) {
      


    });


    app_router.on('route:defaultRoute', function (actions) {
        alert( actions ); 
    });
    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();


    // A good tutorial can be found on http://backbonetutorials.com/what-is-a-router/
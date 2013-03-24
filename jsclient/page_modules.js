/*
	Layout definitions of pages like Profile, Stream etc.
*/

// Derive following pages of this template:



// Extend close function to remove events!
Backbone.View.prototype.close = function(){


   /* if (this.onClose) {
        this.onClose();
    }
    this.remove();
    this.undelegateEvents();*/
}


view_page = Backbone.View.extend({   



	subPage: null,
	el : '#page',
	

	options: {
		template:'none',
		useSidebar:false,
		navMatch: '',
		needLogin: true
	},

	events: {
	
	//	"click  a" : "testClick"
	},
	
	

	initialize: function() {
	 

		 
	},


	// Warning: do not add initlize function, because passing arguments does not work then!

    getData: function()
    {

	},
	 setSub: function(s)
    {
   
    	// Close old subView first
    	if (this.sub != null)
    	{
    		//Problem: #page is removed
    	
    		this.sub.undelegateEvents();
    	}
    	this.sub = s;

	},
	testClick: function()
    {alert();
    	
	},

    finishRender: function(d, d2)
    {
		console.log("finishRender()");

//alert("find"+this.options.useSidebar);

    	if (this.options.navMatch != '')
    	{
    	
    		$(".sbAlpha ul li").removeClass("active");
    		$(".sbAlpha ul li a[data-topic='"+this.options.navMatch+"']").parent().addClass("active");
    	}

    	if (this.options.useSidebar)
		{
			

			$('.page_content').css("width", "700px");
			$('.page_content').css("margin-left", "150px");
			$('.sbBeta').show();


			$('.subCont').html($('div[title=submenu_items]').html());

			// Do this after sidebar items were initialised:
			$(".subCont").append('<div id="colorbg"></div>');
			// call init sidebar function

			// init action bar (TODO!)
			/*
			$('.sbBeta .actionBar').html(""); // Remove existing buttons
			$('.subCont').html($('div[title=submenu_items]').html());
			$('.sbBeta .actionBar').html($('div[title=action_bar]').html());*/


		}
		else
		{
			$('.page_content').css("width", "850px");
			$('.page_content').css("margin-left", "0");
			$('.sbBeta').hide();
		}	

			if (this.postRender != null)
			{
				this.postRender();
			}

		

    },

	render: function(){

		/*
			Warning: Do not render subViews here if not yet rendered!
			http://stackoverflow.com/questions/9604750/backbone-js-firing-event-from-a-view-inside-a-view
		*/  
	

		if (this.options.needLogin && charmeUser == null)
		{	
  		
			logout();
			return;
			
		}
		//alert("render");


	 	if (container_main.currentViewId == this.options.template)
        {
   
            // Just update SubView, we are allowed to render it here as parent view is already rendered
            this.sub.render();

        }
        else
        {

	        container_main.currentViewId =  this.options.template;

			var that = this;


			$.get("templates/"+this.options.template+".html", function (d)
			{
			
				var templateData = that.getData();

				_.templateSettings.variable = "rc";
				var template = _.template(d, templateData); 
				
				$(that.$el).html(template);


				that.finishRender(d);

				if (that.sub != null)
				{
					if (!that.sub.asyncRenderMode)
					that.sub.render();
				}
				//else
				{
					
					that.delegateEvents();
				}
				//console.log("delegateEvents() in view");
				
		


			});
		}

	},

});

//view_subpage

view_test = Backbone.View.extend({ 

options: {useSidebar : true, la2: 15},
initialize: function() {
	//  this.options = _.extend(this.defaults, this.options);
	},
});

/*
alert("start");

var tt = new view_test({la:17, useSidebar:false});
alert(tt.options.useSidebar+","+tt.options.la2);

var tt = new view_test({la:17});
alert(tt.options.useSidebar+","+tt.options.la2);
*/



view_subpage = Backbone.View.extend({   
	el: '#page',
	options: {},

	initialize: function() {
	
	},

	render: function(){
		// Done in parent page!

		var that = this;

		


		$.get("templates/"+this.options.template+".html", function (d)
		{

				var templateData = {};

				if (that.getData != null)
				{
				
					templateData = that.getData();
			
					_.templateSettings.variable = "rc";
					
				}
				//console.log(templateData);

				var template = _.template(d, templateData); 

	

				console.log(that.$el);

				// Problem: Selector may be okay, but element may have changed -> choose $el.selector in stead of el??
				$(that.$el.selector).html(template);//that.$el.selector
				
			
				if (this.postRender != null)
					this.postRender();

				// important:!!
				//	that.undelegateEvents();
				that.delegateEvents();
				



		});
		// Set sb beta
		//alert(that.options.navMatch);

		$(".sbBeta ul li, .profileTabs ul li, .navMatch ul li").removeClass("active");
		$(that.options.navMatch).addClass("active");

		// call prototype.finishredner();


		// if this.getData != null render...
	}
});


function setSCHeight()
{
$(".msgScrollContainer").css("height", ($(window).height()-82)+"px");
$('.nano').nanoScroller();
}

$(window).resize(function() {
setSCHeight();
});




/*

	The List Page views

*/

var view_lists = view_page.extend({


	options: {template:'profile'},
	viewId : 'profileView', // important f


	getData: function()
	{
		var templateData = {globaldata : []};
		templateData["listitems"] = apl_postloader_getLists();
		return templateData;
	}

});


var view_lists_subpage = view_subpage.extend({
	options: {template:'lists_'},
	getData: function()
	{
		var templateData = {globaldata : []	};
	    return templateData;
	}

});

/*
	The registration view

*/


var view_register = view_page.extend({
	options: {template:'signup'},
	events: {

		"click  #but_makecert" : "makecert",
		"click  #but_signupok" : "signup"
	},
	initialize: function()
	{
;
},


	postRender: function(){
		setSCHeight();
		console.log("set talks height");
$("#box_errors div").hide();
$("#box_errors").hide();
	}
,
	signup: function()
	{

		var s = $("#form_signup").serialize();
	
		var u = 'http://'+$('#inp_server').val()+'/charme/req.php?action=newUser.register&'+s+'&callback=?';
		console.log("Loading JSON: "+u);
		$.ajax({
		  dataType: "jsonp",
		  url: u,
		  data: "",
		  success: function(data) {
		  	console.log(data);
		  	if (data.error != null)
		  	{	
		  		$("#box_errors").hide();
		  		$("#box_errors").show();
		  		$("#error"+data.error).show();
		  		// TODO: Scroll to bottom to make show errors are shown
		  		$(window).scrollTop(999999);
		  	}
		  	else if (data.success == 1)
		  	{

	



		  		 location.replace('#signup_success');

		  }
		  }
		});



		



	

	},
	makecert: function()
	{




  var worker = new Worker("lib/crypto/thread_makeSignature.js");
  $("#but_makecert").text("Please Wait...");
worker.onmessage = function(e) {
    
	console.log(e.data)

	var certificate={version:1,rsa:e.data};



 	$('#template_certok').show();
	$('#template_certhint').hide();


    var passphrase = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        passphrase += possible.charAt(Math.floor(Math.random() * possible.length));


    // Encrypt certificate with passpharse
	var tt  = sjcl.encrypt(passphrase, JSON.stringify(certificate));

	var pub = {"n": e.data.n, "e" : e.data.e};
	console.log(JSON.stringify(pub));
  	$("#pubkey").val(JSON.stringify(pub));





    $("#template_certkey").text(passphrase);
   $("#rsa").val(tt);






};


   worker.postMessage("");





		/*  */


	}

});


/*

	The Profile Page views

*/


var view_profilepage = view_page.extend({


	options: {template:'profile'},
	viewId : 'profileView', // important f


	getData: function()
	{

		  return {uid: this.options.userIdRaw};

	}

});

var view_profilepage_info = view_subpage.extend({

	el: '#page3',
	reqData: {},
	asyncRenderMode: true, 
	canRender: false,

	initialize: function()
	{

		var that = this;
		apl_request(
		    {"requests" : [
		    {"id" : "profile_get", "profileId" : "ms@server.local"}

		    ]
		}, function(d){

		 that.reqData = d;
         that.render();
        

		});



  		/*var url = 'http://server.local/charme/req.php?u='+(container_main.currentView.options.userIdRaw)+'&action=profile.get&callback=?';//encodeURI

  		var that = this;

         $.ajax({
          dataType: "jsonp",
          url: url,
          data: "",
          success: function(data) {
          	that.reqData = data;
          	that.render();

          }});*/


	},
	getData: function()
	{

		return this.reqData;

	}

});


/*

	The Settings Page views

*/

var view_settings_sub = view_subpage.extend({


	getData: function()
	{
		var templateData = {globaldata : []	};
	    return templateData;
	}

});



var view_stream_display = view_subpage.extend({


	getData: function()
	{

		var templateData = {globaldata : []	};
		

		if (this.options.streamId == 0)
			templateData["streamitems"] = {};
		else
			templateData["streamitems"] = apl_postloader_getAll();
	


	    return templateData;

	}

});

var view_welcome = view_page.extend({

    events: {
    'keyup #login_password': 'keypass'
    ,'keypress #login_user': 'keyuser'
  }
  ,keyuser: function(e) {
      code= (e.keyCode ? e.keyCode : e.which);
		    if (code == 13)
		    $('#login_password').focus().select();
  }
  ,keypass: function(e) {
      

		code= (e.keyCode ? e.keyCode : e.which);
		    if (code == 13)
		    login();
  },



	postRender: function(){
		$('#login_user').focus();

	}

});




var view_talks = view_page.extend({

	events: {

		"click  #but_newMessage" : "newMsg"
	},
	newMsg: function(ev)
	{
	    // Load homepage and append to [sharecontainer]
alert("New message");
	},
	getData: function () {
		var templateData = {globaldata : [], test:"test"	};
		templateData["listitems"] = apl_postloader_getLists();
	    return templateData;

	},

	postRender: function(){
		setSCHeight();
		console.log("set talks height");

	}

});



var view_stream = view_page.extend({

	userId : '',
	options: {},
	getData: function () {
		var templateData = {globaldata : [], test:"test"	};
		//templateData["streamitems"] = apl_postloader_getAll();

		

		templateData["listitems"] = apl_postloader_getLists();
  	
	
	    return templateData;

	},

	events: {

		"click  .shareIt" : "shareClick"
	},
	shareClick: function(ev)
	{
	    // Load homepage and append to [sharecontainer]
console.log("share");
	},

	

});
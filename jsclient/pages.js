page_authenticated = Backbone.View.extend({   

	 el: '',

	events: {
	  "click  .sbAlpha ul a" : "openPageHandler"
	},


    initialize: function(){


    },
  	openPage: function(id)
  	{
  		// TODO: if not logged in -> show login field!
  	
  		$(".sbAlpha ul li").removeClass("active");
    	$(".sbAlpha ul li a[data-topic='"+id+"']").parent().addClass("active");


		// Template loader using underscore.js, TODO: preload templates!
		$.post("templates/"+id+".html", function (d)
		{
			var templateData = {
            listTitle: "List title test"

        	}

        	// ...Add posts from cache...

			_.templateSettings.variable = "rc";
			var template = _.template(d, templateData); 
			


			$("#page").html(template);

			// Check for page specific sidebar items

		}, "text");



    	// Adapt layout depending on sidebar existence
	    if (1==1) // Use left sidebar
		{
			$('.page_content').css("width", "700px");
			$('.page_content').css("margin-left", "150px");
			$('.sbBeta').show();
			
			//if (level == 0)
			{
				$('.sbBeta .actionBar').html(""); // Remove existing buttons
				$('.subCont').html($('div[title=submenu_items]').html());
				$('.sbBeta .actionBar').html($('div[title=action_bar]').html());
			}
		}
		else // Do not use left sidebar
		{
			$('.page_content').css("width", "850px");
			$('.page_content').css("margin-left", "0");
			$('.sbBeta').hide();
		}




  	},

    openPageHandler: function(ev)
    {
    	//alert($(ev.target).data("topic"));
    	//this.openPage($(ev.target).data("topic"));
    	location.href="#/page/"+$(ev.target).data("topic");
    
    //alert("ev");
	}
    ,
     render: function(){


		var str = '<div id="cnt_loggedIn"><div class="actionCont"></div><div class="containerAll"><div id="whitebg"></div><div class="sidebar sbAlpha"><div class="actionBar"> \
		<a data-bgpos="0" id="button_notifications" ref="notifications"  class="actionButton">0</a><a data-bgpos="-30"  href="javascript:logout()" style="background-position:-30px 0; " class="actionButton"></a></div> \
		<div style="height:62px; background-color:#000;"><a data-page="profile"><img></a></div><ul></ul> \
		<a href="#/about">About</a> - <a href="#/help">Help</a></div> \
		    <div class="sbBetaCont"> \
		        <div class="sidebar sbBeta"> \
		           <div class="actionBar"> \
		        </div> \
		     <ul class="subCont"> \
		     </ul> \
		        </div> \
		        <div class="page_content"> \
		        <div class="page" style="padding:0px; " id="page"> \
		        </div> \
		        </div> \
		    </div> \
		</div></div>  \
		';

		if ($("#cnt_loggedIn").length < 1)
		{
			

			console.log(this.el);
			$(this.el).html(str);

		
			$(".sbAlpha ul").append("<li><a data-topic='stream'>Stream</a></li>");
			$(".sbAlpha ul").append("<li><a data-topic='profile'>Profile</a></li>");
			$(".sbAlpha ul").append("<li><a data-topic='talks'>Talks</a></li>");
			$(".sbAlpha ul").append("<li><a data-topic='lists'>Lists</a></li>");
			$(".sbAlpha ul").append("<li><a data-topic='groups'>Groups</a></li>");
			$(".sbAlpha ul").append("<li><a data-topic='settings'>Settings</a></li>");
		}
	

	// Set a color scheme (See lib/colors.js for function)
	setColor("#1A3C87","#000614");

     }
     });




page_login = Backbone.View.extend({   

 
    initialize: function(){

    },
     render: function(){


	$("#layout").html('<div style="width:600px; margin:200px auto;" id="welcome_main" >  <img src="media/welcome.png" />  <div style="float:right; width:264px;">  <div style="background-color:#fff;  padding:32px; border-radius:8px; margin-bottom:16px;">  <div id="login_error" style="background-color:#F7D2D2; padding:16px; display:none;  border-radius:8px; margin-bottom:16px;color:#C30; text-align:center;">Login failed. Please check your login data.</div>  Username:  <input placeholder="you@yourserver.com"  id="login_user" class="box" style="margin:8px 0; width:190px;" />  Password:  <input placeholder="●●●●●●●●●" id="login_password" type="password" class="box" style="margin:8px 0; width:190px;" />  <div style="position:relative;">  <a href="javascript:login();" class="button" style="float:left">Login</a><span style="float:left; top:6px; left:5px; position:relative;"> or <a href="#/account/signup">Sign up</a></span>  <br class="cb" />  </div>  </div>  <div style="text-align:right" class="lightLink">  <a href="#/account/password">Forgot Password?</a> - <a href="#/page/about">About</a> </div>  </div>  </div>');
		
		var u = $('#login_user').focus();
		$('#login_password').keypress(function(e) {

		   code= (e.keyCode ? e.keyCode : e.which);
		    if (code == 13)
		    login();

		});
		$('#login_user').keypress(function(e) {

		   code= (e.keyCode ? e.keyCode : e.which);
		    if (code == 13)
		    $('#login_password').focus().select();

		});


     }

    });




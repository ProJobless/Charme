



page_authenticated = Backbone.View.extend({   

el: '',
sidebarLoad : false,
currentView: null,
events: {
	"click  #button_notifications" : "showNotifications",
},
setCurrent : function(obj)
{
	if (this.currentView  != null)
	{
		console.log(this.currentView);
	
	this.currentView.undelegateEvents();
	//	this.currentView.remove();
	//	this.currentView.unbind();
		//this.delegateEvents();
	//this.undelegateEvents();
	
		console.log("Cleared current view");
	}
	this.currentView = obj;
	console.log("Set current view");
},
showNotifications : function(obj)
{
	var obj = $('#button_notifications');

	var x = $(obj).data("bgpos");

	
	obj.css("background-position",x+"px -62px");


	//$('.actionCont').append("");
	$('#notificationMain').html("<div class='item'>Someone has commented your status.</div>");





	$('.actionCont').css("left", $('#button_notifications').offset().left);




	if ($('.actionCont').is(":visible"))
	{
		$('.actionBar a').removeClass("active");
		$('.actionCont').hide();
		obj.css("background-position",x+"px -0px");
  	
	}
	else
	{
		obj.addClass("active");
		$('.actionCont').show().css("top", 31);;
	}
	
	


/*
	if ($('.actionCont:visible').position().top > 0)
	{
		$('.actionBar a').removeClass("active");
		obj.css("background-position",x+"px -0px");
		
		$('.actionCont').animate({
	    top: '-205'}, 0, function() {
	 	 });
  	
	}
	else
	{
		$('.actionCont').animate({
	    opacity: 1.0,
	    top: '31'}, 0, function() {
	   
	  	});
	}*/
	
	
	
	},

	/*shareClick: function(ev)
    {
    	// Load homepage and append to [sharecontainer]
alert("share");
		
	}
    ,
	/*getPathItem: function(path, number)
	{
		var x =  path.split("/");

		return x[number];
	}
    ,
    getPathLength: function(path)
	{
		var x =  path.split("/");

		return x.length;
	}
    ,*/

/*	sidebarClickHandler: function(ev)
    {
    
		var d = $(ev.target).data("destination");


    	var newpath  ="#/"+d;
location.href= newpath;

		if (this.getPathItem(location.href, 4) == this.getPathItem(newpath, 1))
		{
console.log("sidebar load=true");

		this.sidebarLoad = true;
}
		location.href= newpath;

	}
    ,*/

    initialize: function(){

console.log("el"+ this.el);
    },


  	openPage: function(view, subview)
  	{

//this.$el.html("lalala");
	
  		// TODO: if not logged in -> show login field!
  	
  		//$(".sbAlpha ul li").removeClass("active");
    //	$(".sbAlpha ul li a[data-topic='"+id+"']").parent().addClass("active");



    	//var par = this;

		// Template loader using underscore.js, TODO: preload templates!
	
			//$.post("templates/"+id+".html", function (d)
			
				/*{
					Template.html contains:
					- information about sub templates (default template, useSubTemplates)
					  in meta div title=subTmpl=true/false and defaultSubTmpl
					- information about required json data sets div[title=json]




				var templateData = {globaldata : []	};
		
				if (id == "user")
				{


				//	templateData["userId"] = encodeURIComponent(item);

					//templateData["item"] = item;
					//templateData["item2"] = item2;


				}
	        	if (id == "stream")
				{
					templateData["streamitems"] = apl_postloader_getAll();
					templateData["listitems"] = apl_postloader_getLists();

					console.log(templateData);


				}

				_.templateSettings.variable = "rc";
				var template = _.template(d, templateData); 

				// if click form profile tabs
				if ($("#page3").length > 0 && (par.sidebarLoad == true))
				{
					console.log("sidebar load");
					par.sidebarLoad = false;
					//TODO: remove sidebar from template
					$("#page3").html(template);
			
				}
				else
					$("#page").html(template);

				// Make textareas autosizing
				$('textarea:not(.noAutoHeight)').autosize();

				// Check for page specific sidebar items
				

				// Adapt layout depending on sidebar existence
			    if ($('div[title=layout]').text() == "sidebar") // Use left sidebar
				{
					$('.page_content').css("width", "700px");
					$('.page_content').css("margin-left", "150px");
					$('.sbBeta').show();
				
					//if (level == 0) TODO!
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

				// Do this after sidebar items were initialised:
				$(".subCont").append('<div id="colorbg"></div>');

				$(".sbBeta ul li").removeClass("active");

				var t = par.getPathLength(location.href); //6: /user/userid 7: /user/userid/subribrs
				

			/*	if ($(".profileTabs").length > 0)
				{

					if (item2==null)
						$("ul li a[data-defaultDestination='true']").parent().addClass("active");
					else
						$("ul li a[data-destination='user/"+encodeURIComponent(item)+"/"+item2+"']").parent().addClass("active");

				}

				if (item == null)
				{

					$("ul li a[data-defaultDestination='true']").parent().addClass("active");
				}
				//else
	    		//$("ul li a[data-destination='page/"+id+"/"+item+"']").parent().addClass("active");


			}, "text");}
				*/
		
  	},

   

     render: function(){


		var str = '<div id="cnt_loggedIn"><div class="actionCont"><div class="whitespace"></div><div id="notificationMain"></div></div><div class="containerAll"><div id="whitebg"></div><div class="sidebar sbAlpha"><div class="actionBar"> \
		<a data-bgpos="0" id="button_notifications" ref="notifications"  class="actionButton">0</a><a data-bgpos="-30"  href="javascript:logout()" style="background-position:-30px 0; " class="actionButton"></a></div> \
		<div style="height:67px; background-color:#000;"><a data-page="profile"><img></a> \
		</div> \
		 <div style="padding:1px;background-color:#c2c2c2; padding-top:0; margin-bottom: 0px;"> \
		     <input style="width:132px;padding:9px 8px; padding-bottom:9px; border:0px; margin:0;" placeholder="Find..." type="text"></div> \
		<ul></ul> \
		<a href="#about">About</a> - <a href="#help">Help</a></div> \
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
			



			$(this.el).html(str);

		console.log("render main container");
			$(".sbAlpha ul").append("<li><a data-topic='stream' href='#stream'>Stream</a></li>");
			$(".sbAlpha ul").append("<li><a data-topic='profile' href='#user/"+(charmeUser.userIdURL)+"'>Profile</a></li>");
			$(".sbAlpha ul").append("<li><a data-topic='talks' href='#talks'>Talks</a></li>");
			$(".sbAlpha ul").append("<li><a data-topic='lists' href='#lists' >Lists</a></li>");
			//$(".sbAlpha ul").append("<li><a data-topic='groups' href='#groups'>Groups</a></li>");
			$(".sbAlpha ul").append("<li><a data-topic='settings' href='#settings'>Settings</a></li>");
		}
	

	// Set a color scheme (See lib/colors.js for function)
	setColor("#1A3C87","#000614");

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

     }
     });




page_login = Backbone.View.extend({   


    initialize: function(){
    console.log("guest container render");
    },


     render: function(){



	$("#layout").html('<div style="width:600px; margin:0px auto;"><div id="page"></div></div>');
		
	
	


     }

    });




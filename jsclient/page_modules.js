/*
	Layout definitions of pages like Profile, Stream etc.
*/

// Derive following pages of this template:

view_page = Backbone.View.extend({   

	aTemplate: '',
	useSidebar: false,
	subPage: null,
	el : '#page',
	options: {template:'none', useSidebar:false, navMatch: ''},

	events: {
		"click  .sbBeta ul a" : "sidebarClickHandler",		// load sub pages!
		"click  .profileTabs ul a" : "sidebarClickHandler",
		"click  a" : "testClick"
	},

	// Warning: do not add initlize function, because passing arguments does not work then!

	initialize: function (attrs) {
	    this.options = attrs;
	},
    getData: function()
    {

	},
	testClick: function()
    {alert();
    	
	},
	sidebarClickHandler: function(ev)
	{
		var d = $(ev.target).data("destination");
		alert();
		var newpath  ="#/"+d;
		location.href= newpath;
	},
    finishRender: function(d, d2)
    {
    

//alert("find"+this.options.useSidebar);

    	if (this.options.navMatch != "")
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


    	console.log("finished parent view rendering");


		

    },

	render: function(){

		/*
			Warning: Do not render subViews here if not yet rendered!
			http://stackoverflow.com/questions/9604750/backbone-js-firing-event-from-a-view-inside-a-view
		*/


	 	if (container_main.currentViewId == this.options.template)
        {
        	console.log("do not render parent. view id:");
        	console.log(this.template);
            // Just update SubView, we are allowed to render it here as parent view is already rendered
            this.sub.render();

        }
        else
        {
        	console.log("alternate part");
	        container_main.currentViewId =  this.template;
	        console.log("set view id");
			var that = this;


			$.post("templates/"+this.options.template+".html", function (d)
			{
				
					var templateData = that.getData();

					_.templateSettings.variable = "rc";
					var template = _.template(d, templateData); 
					
					$(that.$el).html(template);


					that.finishRender(d);

					if (that.sub != null)
					{console.log("render sub...");
					that.sub.render();
				}

			});
		}
	},

});

//view_subpage



view_subpage = Backbone.View.extend({   
	el: '#page',
	aTemplate: '',
	options: {},
	events: {

	},


	initialize: function (attrs) {
	    this.options = attrs;
	},
	render: function(){
		// Done in parent page!

		var that = this;

	

		$.post("templates/"+this.options.template+".html", function (d)
		{
				var templateData = that.getData();

				_.templateSettings.variable = "rc";
				var template = _.template(d, templateData); 
				
				$(that.$el).html(template);

				if (this.postRender != null)
					this.postRender();



		});
		// Set sb beta
		//alert(that.options.navMatch);

		$(".sbBeta ul li").removeClass("active");
		$(that.options.navMatch).addClass("active");

		// call prototype.finishredner();


		// if this.getData != null render...
	}
});








/*

	The Profile Page views

*/


var view_profilepage = view_page.extend({

	userId : '',
	options: {template:'none'},
	viewId : 'userView', // important f


	getData: function()
	{
		console.log("getdata of user view");

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
	    console.log("getdata of stream");
	    return templateData;

	}

});

var view_stream = view_page.extend({

	userId : '',
	options: {template:'none'},
	getData: function () {
		var templateData = {globaldata : []	};
		//templateData["streamitems"] = apl_postloader_getAll();

		

		templateData["listitems"] = apl_postloader_getLists();

	    console.log("getdata of stream");
	    return templateData;

	},

	events: {

		"click  .shareIt" : "shareClick"
	},
	shareClick: function(ev)
	{
	    // Load homepage and append to [sharecontainer]
		alert("share");	
	},

	

});
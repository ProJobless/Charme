/*
	Layout definitions of pages like Profile, Stream etc.
*/

// Derive following pages of this template:

view_page = Backbone.View.extend({   
	el: '',
	aTemplate: '',
	useSidebar: false,
	subPage: null,

	options: {template:'none', useSidebar:false, navMatch: ''},

	events: {
		"click  .sbBeta ul a" : "sidebarClickHandler",		// load sub pages!
		"click  .profileTabs ul a" : "sidebarClickHandler"

	},

	// Warning: do not add initlize function, because passing arguments does not work then!

	initialize: function (attrs) {
	    this.options = attrs;
	},
    getData: function()
    {
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


    	console.log("FINISHED RENDER");

    

		if (d2 != null)
		{
			// do that later:
			//var templateData = this.subPage.getData();
			//var template2 = _.template(d2, templateData); 

		}

    },

	render: function(){

	
	
		var that = this;

	

		$.post("templates/"+this.options.template+".html", function (d)
		{
			if (that.subPage != null)
			{	
				
				$.post("templates/"+that.subPage.template+".html", function (d2)
				{
					
				
					that.finishRender(d, d2);

					

				});

			}
			else
			{
				var templateData = that.getData();

				_.templateSettings.variable = "rc";
				var template = _.template(d, templateData); 
				
				$('#page').html(template);


				that.finishRender(d);
			
			}
		});

	},

});

//view_subpage



view_subpage = Backbone.View.extend({   
	el: '',
	aTemplate: '',
	events: {

	},


	
	render: function(){
		// Done in parent page!
	}
});

/*

	The Profile Page views

*/


var view_profilepage = view_page.extend({

	userId : '',
	options: {template:'none'},
	viewId : 'userView', // important f

	initialize: function (attrs) {
	    this.options = attrs;
	},
	getData: function()
	{
		console.log("getdata of user view");

	}

});



var view_stream = view_page.extend({

	userId : '',
	options: {template:'none'},
	getData: function () {
		var templateData = {globaldata : []	};
		templateData["streamitems"] = apl_postloader_getAll();
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
	initialize: function (attrs) {
	    this.options = attrs;
	},
	

});
/*
	Layout definitions of pages like Profile, Stream etc.
*/

// Derive following pages of this template:



// Extend close function to remove events!
Backbone.View.prototype.close = function(){




  if (this.onClose){
    this.onClose();

  }
}


view_page = Backbone.View.extend({   


	aTemplate: '',
	useSidebar: false,
	subPage: null,
	el : '#page',

	options: {template:'none', useSidebar:false, navMatch: ''},

	events: {
	
	//	"click  a" : "testClick"
	},

	// Warning: do not add initlize function, because passing arguments does not work then!

	initialize: function (attrs) {
	    this.options = attrs;
	},
    getData: function()
    {

	},
	 setSub: function(s)
    {
   
    	// Close old subView first
    	if (this.sub != null)
    	{
    		//Problem: #page is removed
    	
    		this.sub.close();
    	}
    	this.sub = s;

	},
	testClick: function()
    {alert();
    	
	},

    finishRender: function(d, d2)
    {
    

//alert("find"+this.options.useSidebar);

    	if (this.options.navMatch != '')
    	{
    	
    		$(".sbAlpha ul li").removeClass("active");
    		$(".sbAlpha ul li a[data-topic='"+this.options.navMatch+"']").parent().addClass("active");
    	}
console.log(this.options);
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


	 	if (container_main.currentViewId == this.options.template)
        {
     
            // Just update SubView, we are allowed to render it here as parent view is already rendered
            this.sub.render();

        }
        else
        {

	        container_main.currentViewId =  this.options.template;

			var that = this;


			$.post("templates/"+this.options.template+".html", function (d)
			{
				
				var templateData = that.getData();

				_.templateSettings.variable = "rc";
				var template = _.template(d, templateData); 
				
				$(that.$el).html(template);


				that.finishRender(d);

				if (that.sub != null)
				{
				
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

				var templateData = {};

				if (that.getData != null)
				{
				
					templateData = that.getData();
			
					_.templateSettings.variable = "rc";
					
				}
		

				var template = _.template(d, templateData); 

	

				console.log(that.$el);
				// Problem: Selector may be okay, but element may have changed
				$(that.$el.selector).html(template);
				
			
				if (this.postRender != null)
					this.postRender();

				// important:!!
				that.delegateEvents();



		});
		// Set sb beta
		//alert(that.options.navMatch);

		$(".sbBeta ul li, .profileTabs ul li").removeClass("active");
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
	getData: function()
	{
		var templateData = {globaldata : []	};
	    return templateData;
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
/*
	Layout of the different "pages" like Profile, Stream etc.
*/



// All pages derived of the following model
charme_page = Backbone.View.extend({   

 
	el: '', //should always be #page, needed for working events 
	pageId: '',
	sidebarItems: {} , 
    initialize: function(){
 	
    	this.render();
    },
     render: function()
     {

     }

});


//See more at: http://backbonetutorials.com/what-is-a-view/#sthash.zO0UAtZu.dpuf

//var template = _.template( $("#search_template").html(), {} ); 


// This is the template
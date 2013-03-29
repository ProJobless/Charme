

/***
	Name:
	apl_postloader_setup

	Info:
	Loads friends and Lists as `JSON Object` from Server

	Params:
	callback:function:Callback function

	Location:
	apl

	Code:JS:
	apl_postloader_setup(function(){alert("callback");});
*/

function apl_postloader_setup(callback)
{
	//TODO: Add a callback funciton here
	apl_request(
    {"requests" : [
    {"id" : "lists_get"}

    ]
	}, function(data){
		console.log(data);
		apl_postloader_lists.items = data.lists_get;
		

		// Call Callback...
		if(callback != undefined && typeof callback == 'function') 
		{
			callback();
		}

	});
}

function apl_postloader_check()
{
	// get the encrypted json from server, decrypt this json and store into html5 web storage
	

	// Give date of last post as argument and server returns missing posts...

	
}
function apl_postloader_getAll()
{
	// Return last 30 posts...
	var ret = {"items": [
	        {"time": 213123133, "postId": "123dlk2", "name": "Manuel", "userId": encodeURIComponent("manu@localhost"), "content": "Lorem ipsum lorem ipsum"},
	    	{"time": 213123133, "postId": "123dlk2", "name": "Test 2", "userId": encodeURIComponent("manu@localhost"), "content": "hahahahahaha"},
	    	{"time": 213123133, "postId": "123dlk2", "name": "Test", "userId": encodeURIComponent("manu@localhost"), "content": "hahahahahaha"}
	    ]
	};

	return ret;
}

var apl_postloader_lists =
 {"items": [
	       
	    ]
	};

function apl_postloader_getLists()
{
	// Choose an unique identifier here "listitems"
	return apl_postloader_lists;


}
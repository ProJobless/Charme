/*
Possible Errors:


Unexpeccted identifier by misplaced  comma:

var obj = {
   id: 23,
   name: "test",  <--
}



*/


function apl_postloader_check()
{
	// get the encrypted json from server, decrypt this json and store into html5 web storage
	

	// Give date of last post as argument and server returns missing posts...

	
}
function apl_postloader_getAll()
{
	// Return last 30 posts...
	var ret = {"items": [
	        {"time": 213123133, "postId": "123dlk2", "name": "Manuel", "userId": "manu@localhost", "content": "Lorem ipsum lorem ipsum"},
	    	{"time": 213123133, "postId": "123dlk2", "name": "Test 2", "userId": "manu@localhost", "content": "hahahahahaha"},
	    	{"time": 213123133, "postId": "123dlk2", "name": "Test", "userId": "manu@localhost", "content": "hahahahahaha"}
	    ]
	};

	return ret;
}
function apl_postloader_getLists()
{
	// Choose an unique identifier here "listitems"
	return {"items": [
	        {"id": 213123133, "name": "listname"},
	    	{"id": 213123133, "name": "listname"},
	    	{"id": 213123133, "name": "listname"}
	    ]
	};

}
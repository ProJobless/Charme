// Returns certificate
function getCert()
{
	 if (charmeUser != null && charmeUser.sessionId != null)
	 {
	var passphrase = aes_decrypt(charmeUser.sessionId, localStorage.getItem("sessionPassphrase"));

	var certEnc = localStorage.getItem("certificate");
	return (aes_decrypt(passphrase,certEnc));
	}
	return null;

}

// need: sessionID
function apl_setup2()
{
/*
Apl_setup:

Look for passphrase encrypted with sessionID
(charmeUser.sessionPassphrase, decrypt Passphrase, decrypt certificate, and store certificate in
CharmeUser.certificate.
*/


	 // , sjcl.encrypt(charmeUser.sessionId, passphrase)
	 if (charmeUser != null && charmeUser.sessionId != null)
	 {

	 	try
	 	{

		var keyring = localStorage.getItem("keyring");
		charmeUser.keyring = jQuery.parseJSON(keyring);

		}
		
		catch(e)
		{
			console.log(e);
			//throw(e);
			alert("Certificate decrpytion error. Logout.");
			logout();
		}


		

	}

	//charmeUser.certificate
}
/***
	Name:
	apl_setup

	Info:
	Loads friends and Lists as `JSON Object` from Server

	Params:
	callback:function:Callback function

	Location:
	apl

	Code:JS:
	apl_postloader_setup(function(){alert("callback");});
*/

function apl_setup(callback, onLogin)
{
	

	//TODO: Add a callback funciton here
	if (!isLoggedIn() && onLogin != true)
	{
	
		callback();

	}
	else
	{
		

		var cert1 = getCert();

		charme_private_rsakey = $.parseJSON(cert1);



		apl_request(
	    {"requests" : [
	    {"id" : "lists_get"},
	    {"id" : "sessionId_get"}, 
	    {"id" : "updates_get"} 

	    ]
		}, function(data){

	
		


			console.log(data);
			apl_postloader_lists.items = data.lists_get;
			
			if (charmeUser != null)
			charmeUser.sessionId = data.sessionId_get.sessionId
			container_main.tempCountData = data.updates_get;

			// Call Callback...
			if(callback != undefined && typeof callback == 'function') 
			{
					


				if (data.sessionId_get != undefined)
					callback(data.sessionId_get.sessionId);
				else
						callback();
			}
			else
			{
				
				callback();
			}

		});
	}
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


function apl_postloader_deleteList(id)
{
		jQuery.each(apl_postloader_lists.items, function(index, result) {
			if (this._id.$id == id)
				apl_postloader_lists.items.splice(index, 1);
		});

}

function apl_postloader_editList(id, name)
{
		jQuery.each(apl_postloader_lists.items, function() {
			if (this._id.$id == id)
				this.name = name;
		});

}

function apl_postloader_getLists()
{
	// Choose an unique identifier here "listitems"
	return apl_postloader_lists;


}
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
function apl_postloader_getListsExtended()
{
	var returnLists = [];
		returnLists.push({
				'_id': {
					"$id": 'myevents'
				},
				"name": "Events",
				"icon" : "clock-o"
			});
			returnLists.push({
				'_id': {
					"$id": 'mymoves'
				},
				"name": "Moves",
				"icon": "taxi"
			});
			returnLists.push({
				'_id': {
					"$id": 'myoffers'
				},
				"name": "Offers",
				"icon": "dollar"
			});
			returnLists.push({
				'_id': {
					"$id": 'myreviews'
				},
				"name": "Reviews",
				"icon": "star"
			});

				returnLists.push({
				'_id': {
					"$id": 'archive'
				},
				"name": "Archive",
				"icon": "archive"
			});

	return returnLists;

}
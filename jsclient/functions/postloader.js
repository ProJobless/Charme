CharmeModels = {} // CoffeScript Namespace

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

/*
	Apl_setup:

	Look for passphrase encrypted with sessionID
	(charmeUser.sessionPassphrase, decrypt Passphrase, decrypt certificate, and store certificate in
	CharmeUser.certificate.
*/

function apl_setup2()
{
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

		apl_request(
	    {"requests" : [
	    {"id" : "lists_get"},
	    {"id" : "sessionId_get"},
	    {"id" : "updates_get"}

	    ]
		}, function(data){

				apl_postloader_filters =  {"items": [ ]	};
				apl_postloader_lists =  {"items": [ ]	};

				CharmeModels.SimpleStorage.getItems("filter", false, function(loadedFilters){
				apl_postloader_lists.items = data.lists_get;

				apl_postloader_filters.filterReferences = {};

				$.each(loadedFilters, function(index, item) {

					apl_postloader_filters.filterReferences[index] = item.data;
					apl_postloader_filters.items.push({
						"_id" : { "$id" : "filter_"+index},
						"name" : item.data.name,
						"canDelete" : true,
						"itemId" : item._id.$id
					});
				});

				//
				// Add Archive button to stream sidebar
				//

				apl_postloader_filters.items.push({
					"_id" : { "$id" : "archive"},
					"name" : "Archiv",
					"icon" : "bookmark-o"
				});

				//
				// remember session id
				//

				if (charmeUser != null)
					charmeUser.sessionId = data.sessionId_get.sessionId

				container_main.tempCountData = data.updates_get;

				// Call Callback...
				if(callback != undefined && typeof callback == 'function') {
					if (data.sessionId_get != undefined)
						callback(data.sessionId_get.sessionId);
					else
						callback();
				} else
				{
					callback();
				}
			});
		});
	}
}

var apl_postloader_lists =
 {"items": [ ]
	};

var apl_postloader_filters = {"items": [ ]
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
function apl_postloader_getFilters()
{
	// Choose an unique identifier here "listitems"
	return apl_postloader_filters;
}

/*
	User Object
	Contains super critical information like Login Key etc.
*/
var charmeUser;


/***
	Name:
	getKeyByRevision

	Info:
	Returns a key from the keyring. If revision=0 then return newest key.

	Params:
	revision: the revision

	Location:
	apl/user.js

	Code:JS:
	var key = getKeyByRevision(4);
*/


function getKeyByRevision(revision)
{

	// Newest key
	if (revision == 0)
	{
		return charmeUser.keyring[charmeUser.keyring.length-1];
	}

	var itemtemp = null;
	// Key by revision
	$.each(charmeUser.keyring, function(index, item) {

		if (item.revision == revision)
			{
				itemtemp = item;
			}


	});

	return itemtemp;

}


/***
	Name:
	apl_user

	Info:
	Returns a User Object.

	Params:
	uid:String:The user id, "me@myserver.com" for example.
	signedData:object: Signed data, must be integrity checked before passing it!
	Properties:
	sessionId:String:Server Session Id, do not set!
	sessionPassphrase:String:Passphrase encoded with sessionId
	keyring: key pairs, initilaized with apl_setup2();

	Location:
	apl

	Code:JS:
	var user = apl_user("me@myserver.com");
	console.log(user.server); // myserver.com
	console.log(user.username); // me
	console.log(user.userIdURL); // me@myserver.com encoded with encodeURIComponent for URL requests.
*/

function apl_user(uid)
{
	this.userId = uid;
	this.userIdURL = encodeURIComponent(uid);
	this.server = uid.split("@")[1];
	this.username = uid.split("@")[0];

	this.getSignedData = function()
	{
		var retrievedObject = localStorage.getItem('signedData');
		return JSON.parse(retrievedObject);
	}

	this.getServer = function()
	{
		return this.server;
	}
	this.getImageURL = function(size)
	{
		return "http://"+this.server+"/charme/fs.php?u="+this.userIdURL+"&s="+size+"&"+charme_global_pictureAppendix;
	}
}

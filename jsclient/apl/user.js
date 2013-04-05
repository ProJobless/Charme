/*
	User Object
	Contains super critical information like Login Key etc.
*/
var charmeUser;

/***
	Name:
	apl_user

	Info:
	Returns a User Object.

	Params:
	uid:String:The user id, "me@myserver.com" for example.
	
	Properties:
	sessionId:String:Server Session Id, do not set!
	sessionPassphrase:String:Passphrase encoded with sessionId
	certificate: RSA Certificate, initilaized with apl_setup2();

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


	console.log(this);
	
	this.getServer = function()
	{
		return this.server;
	}
}






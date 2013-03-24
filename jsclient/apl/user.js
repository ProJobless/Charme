/*
	User Object
	Contains super critical information like Login Key etc.
*/
var charmeUser;


function apl_user(uid)
{
	this.userId = uid;
	this.userIdURL = encodeURIComponent(uid);
	this.server = uid.split("@")[1];
	this.username = uid.split("@")[0];
	this.sessionID = "lalala";

	console.log(this);
	
	this.getServer = function()
	{
		return this.server;
	}
}






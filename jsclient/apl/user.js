/*
	User Object
	Contains super critical information like Login Key etc.
*/
var charmeUser;


function apl_user(uid)
{
	this.userId = uid;
	this.server = uid.split("@")[1];
	this.usernmae = uid.split("@")[0];

	console.log(this);
	
	this.getServer = function()
	{
		return this.server;
	}
}






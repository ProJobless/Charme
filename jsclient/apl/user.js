/*
	User Object
	Contains super critical information like Login Key etc.
*/
var charmeUser;


function apl_user(uid)
{
   this.userId = uid;
   this.server = uid;

   this.getServer = function()
   {
       return this.server;
   }
}






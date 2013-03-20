<?
/*
	Charme Configuration File
*/

$CHARME_SETTINGS = array();

//Users can upload files. WARNING: This requires a lot of diskspace
$CHARME_SETTINGS["allowFileAttachments"] =true;
$CHARME_SETTINGS["maxFileSizeInByte"] =1024*500;//500KB

//Do not change this after users have registred
$CHARME_SETTINGS["passwordSalt"] ="q3fsknjdakfbk1";
$CHARME_SETTINGS["serverURL"] ="localhost";

//To interact with other Charme Servers, type CHARME here.
//To join the CHARME network you have to agree our terms and conditions.
//See license_charme.txt for more information
//If you want to create a private network leave this empty
$CHARME_SETTINGS["NETWORK_ID"] ="";


//Will be updated automatically to block evil servers or users
//you should leave this empty if your not part of the CHARME network
$CHARME_SETTINGS["blacklist"] ="http://www.charmeproject.com/blacklist.php";

?>
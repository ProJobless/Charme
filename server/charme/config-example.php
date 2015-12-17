<?php
/*
	Charme Configuration File
	Rename this sample file to config.php after you have edited the settings.
*/

$CHARME_SETTINGS = array();

//Do not change this after users have registred
$CHARME_SETTINGS["passwordSalt"] ="q3fsknjdakfbk1";
$CHARME_SETTINGS["serverURL"] ="localhost";

//To interact with other Charme Servers, type CHARME here.
//To join the CHARME network you have to agree our terms and conditions.
//See license_charme.txt for more information
//If you want to create a private network leave this empty
$CHARME_SETTINGS["NETWORK_ID"] ="";

$CHARME_SETTINGS["ACCEPTED_CLIENT_URL"] ="";
// http://client.local
$CHARME_SETTINGS["DEBUG"] =false;

// Google Cload MEssaging ID. Used to notify Android devices about new messages.
// Get one on https://cloud.google.com/console

// Tutorial on: http://developer.android.com/google/gcm/gs.html
$CHARME_SETTINGS["GCM_PROJECTID"] ="";
$CHARME_SETTINGS["GCM_APIKEY"] ="";

$CHARME_SETTINGS["BLOCK_NEW_USERS"] = false;
// You can set this to true to prevent new users to sign up.
// You should also be able to set it dependent on a SESSION variable. e.g. if ($_SESSION["signupallowed"] = true) $CHARME_SETTINGS["BLOCK_NEW_USERS"] = false;





//Will be updated automatically to block evil servers or users
//you should leave this empty if your not using  a  network id starting with CHARME
$CHARME_SETTINGS["blacklist"] ="https://www.mschultheiss.com/blacklist_charme.php";

?>

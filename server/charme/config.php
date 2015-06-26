<?php
/*
	Charme Configuration File
*/

// Note: Edit lib/App/DB/Get to change Collection
// Todo: Specify Collection here in Charme Settings.


$CHARME_SETTINGS = array();

//Do not change this after users have registred
$CHARME_SETTINGS["passwordSalt"] ="q3fsknjdakfbk1";
$CHARME_SETTINGS["serverURL"] ="localhost";

//To interact with other Charme Servers, type CHARME here.
//To join the CHARME network you have to agree our terms and conditions.
//See license_charme.txt for more information
//If you want to create a private network leave this empty
$CHARME_SETTINGS["NETWORK_ID"] ="CHARME_BETA_1";
$CHARME_SETTINGS["ACCEPTED_CLIENT_URL"] = array("http://mschultheiss.com","http://wwww.mschultheiss.com", "http://client.local", "http://s17839906.onlinehome-server.info", "localhost");
// http://client.local
$CHARME_SETTINGS["DEBUG"] =true;

// Google Cload MEssaging ID. Used to notify Android devices about new messages.
// Get one on https://cloud.google.com/console

// Tutorial on: http://developer.android.com/google/gcm/gs.html
$CHARME_SETTINGS["GCM_PROJECTID"] ="987346853523";



$CHARME_SETTINGS["GCM_APIKEY"] ="AIzaSyCZDo3HMOUE4z-Ns3l4LPm3hICcF1v6XjE";


//Will be updated automatically to block evil servers or users
//you should leave this empty if your not using  a  network id starting with CHARME
$CHARME_SETTINGS["blacklist"] ="http://www.charmeproject.com/blacklist.txt";

?>

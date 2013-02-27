<?php

function __autoload($className) {
	$fileName = str_replace("\\", "/", $className).".php";
 
	if (file_exists($fileName)) {
		require_once $fileName;
	}
}

spl_autoload_extensions(".php");
spl_autoload_register();


use \core\com as com;
use \core\action as action;

/* Parse incoming request */

$req = new action\request();

/*
	TODO:
	- Validate User idenity
	- Check Privacy (Example: Is this user allowed to send me messages)

*/


switch ($action) 
{
	case "newUser.getCaptcha":
	// Save captcha result temporary



	break;

	case "newUser.register":
	// Return error if: Captcha is false, no name, invalid name/password/email

	break;

	case "profile.get":
	// Lookup visibility for this user.

	// Always send public profile information

	// Send private information if encrypted text found for this user.
	break;

	case "profile.followCollection":

	break;

	case "message.send":

	break;

	case "info.about":

		$ar = array("owner" => "Undefined", "charmeVersion" => "0.0.1");
	break;

	case "info.trace":
		// return 50 of most connected friend servers and amount of registred users on THIS server

		$ar = array("amount" => 1231, "servers" => array());
	break;


}


// This file accepts requests from clients or other servers.


//scheme: category.action, like: account.passwordchange

// account: signup, login, passwordchange, passwordnew


// stream: getPosts(Timestamp, max count), post



?>
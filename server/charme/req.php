<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');


/**
 * req.php
 * Parses incoming client requests
 *
 * @author mschultheiss
 */


/*
	We are using Symphonys class loader here, see
	http://symfony.com/doc/2.0/components/class_loader.html
	for more information

	Resources:
	http://stackoverflow.com/questions/10371073/symfony-class-loader-usage-no-examples-of-actual-usage

	Performance:
	http://www.zalas.eu/autoloading-classes-in-any-php-project-with-symfony2-classloader-component
*/

require_once 'lib/App/ClassLoader/UniversalClassLoader.php';
use Symfony\Component\ClassLoader\UniversalClassLoader;

$loader = new UniversalClassLoader();
$loader->registerNamespaces(array('App' => __DIR__ . '/lib'));
$loader->register();


if (isset($_GET["d"]))
	$data = json_decode($_GET["d"]);
else
	$data = "";

include_once("config.php");
/*
	TODO:
	- Validate User idenity
	- Check Privacy (Example: Is this user allowed to send me messages)

*/



// JSON Callback, see http://stackoverflow.com/questions/2822609/invalid-label-firebug-error-with-jquery-getjson
echo $_GET['callback'].'(';

// Iterate through each request:



$action = "newUser.register";

switch ($action) 
{
	case "newUser.getCaptcha":
	// Save captcha result temporary



	break;

	case "newUser.register":
		// Return error if: Captcha is false, no name, invalid name/password/email
		$user = new \App\Users\UserRegistration();
		echo $user->execute();
	


	
	break;

	case "post.spread": 
	// Notify post owner when sharing a posting

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


// jQuery Callback end
echo ')';

?>
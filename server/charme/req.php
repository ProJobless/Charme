<?php

/*
spl_autoload_extensions('.php');
spl_autoload_register(function ($class) {

	$class = str_replace("\\", "/", $class);
    include $_SERVER["DOCUMENT_ROOT"].'/charme/' . $class . '.class.php';
});*/



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
// Component namespace will be found in Componet directory


$loader->registerNamespaces(array('App' => __DIR__ . '/lib'));
//$loader->registerNamespace("App" , "Component"); 
$loader->register();


$helloWorld = new App\TestComponent\Testbench();


/*
	Interface Definitions
*/






/*
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
*/



/* Parse incoming request */

/*
By registering your namespace as follows:

$loader->registerNamespace('App\Location\Location', 'Location/Location');
autoloader will look for the App\Location\Location class in the Location/Location/App/Location/Location.php file. Note that file/directory names are case sensitive.

First parameter of registerNamespace() is either a namespace or part of the namespace. Second parameter is a path to a PSR-0 compliant library. That means that directory structure inside that path should follow PSR-0 standard. This path is not used when calculating path for given namespace.

App\Location\Location()
*/

$data = array();
/*
	TODO:
	- Validate User idenity
	- Check Privacy (Example: Is this user allowed to send me messages)

*/

$action = "newUser.register";

switch ($action) 
{
	case "newUser.getCaptcha":
	// Save captcha result temporary



	break;

	case "newUser.register":
		// Return error if: Captcha is false, no name, invalid name/password/email
		//$user = new Core\Users\Register($data);
	
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



?>
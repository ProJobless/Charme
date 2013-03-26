<?php
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');


// Disabled, because of jquery post
//header('Content-type: application/json');


// Enable CORS? May be useful in the future; See http://enable-cors.org/server_php.html
// header("Access-Control-Allow-Origin: *");
// See also:

/*

Developers, read this about CORS first:

http://stackoverflow.com/questions/298745/how-do-i-send-a-cross-domain-post-request-via-javascript
http://stackoverflow.com/questions/5584923/a-cors-post-request-works-from-plain-javascript-but-why-not-with-jquery

*/

/*
if (isset($_SERVER['REMOTE_HOST']))
$host = $_SERVER['REMOTE_HOST'];
else
$host = gethostbyaddr($_SERVER['REMOTE_ADDR']);


	switch ($host) {
	   case 'client.local' :
	    case 'server.local': 
	    case 'http://charmeproject.com': case 'http://client.charmeproject.com':  // Only allow trusted clients
	   // header('Access-Control-Allow-Origin: '.$host);


	    break;
	}
*/

// https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS#Access-Control-Allow-Origin
header('Access-Control-Allow-Origin: http://client.local');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // if POST, GET, OPTIONS then $_POST will be empty.
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');




session_start();
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


if (isset($_POST["d"]))
	$data = (json_decode($_POST["d"], true));
else
	$data = array();




include_once("config.php");
/*
	TODO:
	- Validate User idenity
	- Check Privacy (Example: Is this user allowed to send me messages)

*/




// JSON (we use now) does not need callback, JSONP needs Callback, see http://stackoverflow.com/questions/2822609/invalid-label-firebug-error-with-jquery-getjson

$returnArray = array();

foreach ($data["requests"] as $item)
{

	$action = $item["id"];


	switch ($action) 
	{
		case "profile_pubKey":
			$col = \App\DB\Get::Collection();
			$cursor = $col->users->findOne(array("userid"=> ($item["profileId"])), array('pubKey'));
			$returnArray[$action] = $cursor["pubKey"];
		break;

		case "message_register":
			//
			$col = \App\DB\Get::Collection();
			$col->messages->insert(
				array("receivers"=> ($item["receiver"]),
					"sender"=> ($item["sender"]),
					"encMessage"=> ($item["message"])

					));

		break;

		case "message_distribute":
			$col = \App\DB\Get::Collection();
			
			// Send replica to all receiver servers.
			

			// TODO : Clustering servers!

			// $item["receivers"] {charmeId, aesEnc}


			/*$cursor = $col->messages->insert(
				array("receivers"=> ($item["receivers"]),
					"sender"=> ($item["sender"]),
					"encMessage"=> ($item["encMessage"])

					));*/



			$returnArray[$action] = array("STATUS" => "OK");
		break;


		case "user_login":

			// Get certificate


			$col = \App\DB\Get::Collection();

			$p1 = $item["p"];
			
			if (!isset($CHARME_SETTINGS["passwordSalt"]))
				die("CHARME_SETTINGS NOT INCLUDED");

			$p2 =md5($CHARME_SETTINGS["passwordSalt"].$p1);

			$cursor = $col->users->findOne(array("userid"=> ($item["u"]), "password"=>$p2), array('userid', "rsa"));

			if ($cursor["userid"]==($item["u"]) && $cursor["userid"] != "")
			{
				
				$_SESSION["charme_userid"] = $cursor["userid"];
				$stat = "PASS";
			}
			else
				$stat = "FAIL";


			$returnArray[$action] =   (array("status" => $stat, "rsa" => $cursor["rsa"], "ret"=>$cursor));

		break;



		case "newUser.getCaptcha":
		// Save captcha result temporary



		break;

		case "newUser.register":
			// Return error if: Captcha is false, no name, invalid name/password/email
			$user = new \App\Users\UserRegistration();
			echo $user->execute();
		


		
		break;

		case "profile_imagechange": 
			//$_SESSION["charme_userid"], $item["data"]

			include_once("/3rdparty/wideimage/WideImage.php");

			
			$col = \App\DB\Get::Collection();
			$image = WideImage::load($item["data"]);

			$grid = $col->getGridFS();
			$grid->remove(array("fname" => $_SESSION["charme_userid"], "type" => "profileimage"));
			$grid->storeBytes($image->resize(150, null, 'fill')->crop(0, 0, 150, 67)->output('jpg'), array('type'=>"profileimage",'owner' => $_SESSION["charme_userid"]));

			$returnArray[$action] = array("SUCCESS" => true);


		break;


		case "post.spread": 
		// Notify post owner when sharing a posting

		break;

		case "profile_get":
		
			// Lookup visibility for this user.

			// Always send public profile information

			// Send private information if encrypted text found for this user.
			$col = \App\DB\Get::Collection();
			$cursor = $col->users->findOne(array("userid"=> urldecode($item["profileId"])), array("userid", "hometown", "about", "gender", "literature", "music", "movies", "hobbies", "firstname", "lastname"));
			$returnArray[$action] =   (array("info"=>$cursor));

		break;

		case "profile_save":
			$cols = \App\DB\Get::Collection();

			if (!isset($_SESSION["charme_userid"])){
				$returnArray = array("ERROR" => 1);
				break; // echo error
			}
			//$item["data"]

			// Change Password!...
			if (isset($item["password"]) && $item["password"] != "")
			{
				if ($item["password"] == $item["password2"])
				{
					// $item["oldpassword"] == ...
				}

			}
			// Filter out possible SPAM fields
			$item["data"] = (array_intersect_key($item["data"] , array_flip(array("hometown", "about", "gender", "literature", "music", "movies", "hobbies"))));

			// Perform update
			$cols->users->update(array("userid" => $_SESSION["charme_userid"]),	array('$set' => $item["data"]));

			$returnArray[$action] = array("STATUS" => "OK");
			// TODO: Validation!!
		break;

		case "profile_passwordchange":
			$col = \App\DB\Get::Collection();
			// TODO: Validation!!
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
}

// This file accepts requests from clients or other servers.


//scheme: category.action, like: account.passwordchange

// account: signup, login, passwordchange, passwordnew


// stream: getPosts(Timestamp, max count), post
echo json_encode($returnArray);


?>
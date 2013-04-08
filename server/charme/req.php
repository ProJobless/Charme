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
header('Access-Control-Allow-Credentials: true'); // Needed for CORS Cookie sending


session_start();

// logging Function

@unlink("log.txt");

function clog($str)
{
	$fd = fopen("log.txt", "a");
	fwrite($fd, $str . "\n");
	fclose($fd);
}
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
	if ( !isset($_SESSION["charme_userid"]) && !in_array($action, array("user_login", "user_register", "profile_get", "message_receive"))){
				$returnArray = array("ERROR" => 1);
				break; // echo error
	}


	switch ($action) 
	{
		case "profile_pubKey":
			$col = \App\DB\Get::Collection();
			$cursor = $col->users->findOne(array("userid"=> ($item["profileId"])), array('pubKey'));
			$returnArray[$action] = $cursor["pubKey"];
		break;

		case "sessionId_get":
			$returnArray[$action] = array("sessionId" => session_id());
		break;




		case "messages_get_sub":
			
			if (isset($item["start"]))
				$start = $item["start"];
			else
				$start = 0;


			//echo $item["superId"];

			$col = \App\DB\Get::Collection();
			 $res = $col->conversations->findOne(array("_id" => new MongoId($item["superId"])), array("aesEnc", "people", "conversationId"));;
			// Get 10 conversations 
			$returnArray[$action] = array("messages" => 
			iterator_to_array(
				$col->messages->find(array("conversationId" =>  new MongoId($res["conversationId"])))
				->sort(array("time" => 1))
				->limit(10)
				->skip(10*$start)
			, false), "aesEnc" =>  $res["aesEnc"], "people" => $res["people"], "conversationId" => new MongoId($res["conversationId"]));
			

		break;

		case "messages_get":

			if (isset($item["start"]))
				$start = $item["start"];
			else
				$start = 0;


			$col = \App\DB\Get::Collection();

			// Get 10 conversations 
			$returnArray[$action] =
			iterator_to_array(
				$col->conversations->find(array("receiver" => $_SESSION["charme_userid"]))
				->sort(array("time" => 1))
				->limit(10)
				->skip(10*$start)
			, false);
			

		break;

		// Get message from server
		case "message_receive" :

			//echo "!!!".$item["conversationId"];
			// If receiver-sender relation is already there -> append message!

			//$item["localreceivers"][] = $item["sender"];
			asort($item["localreceivers"]);

		


			foreach ($item["localreceivers"]as $receiver)
			{
				// Find conversation $item["aesEnc"] = aesEnc
				// if not exists => create conversation
				$col = \App\DB\Get::Collection();

				//$db_charme->messageReceivers->update(array("uniqueId" => $uniqueID, "receiver" => $item), $content2, array("upsert" => true));
				clog(print_r($item, true));

				if (isset($item["aesEnc"]))
				{
					$content = array(
					"people" => $item["localreceivers"],
					//
					"aesEnc" => $item["aesEnc"],
					"conversationId" => new MongoId($item["conversationId"]),
					"receiver" => $receiver,
					"messagePreview" => $item["messagePreview"],
					"time" => new MongoDate(time())
					);

					// because time changes
					$col->conversations->update(array("aesEnc" => $item["aesEnc"]), $content ,  array("upsert" => true));
				}

				$col->messages->insert(array("conversationId" =>   new MongoId($item["conversationId"]), "encMessage" => $item["encMessage"], "sender" => $item["sender"]));
			}

		break;


		// Get message from client
		case "message_distribute_answer":

			$col = \App\DB\Get::Collection();
			$sendername = "Name of id ".$_SESSION["charme_userid"];
			$convId = new MongoId($item["conversationId"]);

			// Find receivers of this message by $item["conversationId"]
			$res = $col->conversations->findOne(array("conversationId"=> ($convId)), array('people'));

			foreach ($res["people"] as $receiver)
			{
					$data = array("requests" => array(

						"id" => "message_receive",
						"localreceivers" => array($receiver),
						"allreceivers" => $res["people"],
						"encMessage" => $item["encMessage"],
						"messagePreview" => $item["messagePreview"],

						"sender" => $_SESSION["charme_userid"],
						"conversationId" => $convId->__toString(),
						//"aesEnc" => $receiver["aesEnc"], known already by receiver


						));

					$req21 = new \App\Requests\JSON(
					$receiver,
					$_SESSION["charme_userid"],
					$data
					
					);


				$req21->send();
			}


		break;


		case "message_distribute":
			$col = \App\DB\Get::Collection();
			
			$sendername = "Name of id ".$_SESSION["charme_userid"];
			
			// As this is a new message we generate a unique converation Id
			
			clog(print_r($item, true));



			foreach ($item["receivers"] as $receiver)
			{
				// Remove AES keys for other people, TODO: Not for answers!
				$item["receivers2"][]  = $receiver["charmeId"];
			}

			$convId = new MongoId();

			foreach ($item["receivers"] as $receiver)
			{
				// Send MEssage to receiver.

				// if its a new message
				$data = array("requests" => array(

						"id" => "message_receive",
						"localreceivers" => array($receiver["charmeId"]),
						"allreceivers" => $item["receivers2"],
						"encMessage" => $item["encMessage"],
						"aesEnc" => $receiver["aesEnc"],
						"messagePreview" => $item["messagePreview"],
						"sender" => $_SESSION["charme_userid"],
						"sendername" => $sendername,
						"conversationId" => $convId->__toString(),
				

						));

				$req21 = new \App\Requests\JSON(
					$receiver["charmeId"],
					$_SESSION["charme_userid"],
					$data
					
					);

			
				$req21->send();

			}

				/*
			$col->testmsg->insert(array(
				"receivers" => $item["receivers"],
				"encMessage" => $item["encMessage"],
				"sender" => $_SESSION["charme_userid"]
				));*/

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

			$p2 =hash('sha256', $CHARME_SETTINGS["passwordSalt"].$p1);
			

			
			$cursor = $col->users->findOne(array("userid"=> ($item["u"]), "password"=>$p2), array('userid', "rsa"));

			if ($cursor["userid"]==($item["u"]) && $cursor["userid"] != "")
			{
				
				$_SESSION["charme_userid"] = $cursor["userid"];


				//echo $_SESSION["charme_userid"] ;

				$stat = "PASS";
			}
			else
				$stat = "FAIL";


			$returnArray[$action] =   (array("status" => $stat, "rsa" => $cursor["rsa"], "ret"=>$cursor));

		break;



		case "newUser.getCaptcha":
		// Save captcha result temporary



		break;



		case "user_register":


			// Return error if: Captcha is false, no name, invalid name/password/email
			$user = new \App\Users\UserRegistration($item["data"]);
			$returnArray[$action] = $user->execute();
		


		
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
		case "lists_getActive" :


		break;

		case "collection_getAll" :
			$col = \App\DB\Get::Collection();
			$returnArray[$action] = iterator_to_array($col->collections->find(array("owner" => $item["userId"])), false);

		break;

		case "collection_add" :
			$col = \App\DB\Get::Collection();
			$content = array(
			  			"owner" => $_SESSION["charme_userid"],
			  			"name" => $item["name"],
			  			"description" => $item["description"]
			  			);

			$col->collections->insert($content);
			$returnArray[$action] = array("SUCCESS" => true, "id" => $content["_id"]);

		break;

		case "lists_update":

			$col = \App\DB\Get::Collection();

			$newLists=  $item["listIds"];
			$oldLists = array();


			$oldListsTmp=  $col->listitems->find(array("owner" => $_SESSION["charme_userid"], "userId" => $item["userId"]));
			$allLists=  $col->lists->find(array("owner" => $_SESSION["charme_userid"]));


			foreach ($oldListsTmp as $item){
			$oldLists[] = $item["list"];
			}


			foreach ($allLists as $listitem)
			{	
				// First option. Item is not in old list, but in new list -> Add item
				if (in_array($listitem["_id"], $newLists ) && !in_array($listitem["_id"], $oldLists))
			  	{
			  		$col->listitems->insert(array(
			  			"owner" => $_SESSION["charme_userid"],
			  			"userId" => $item["userId"],
			  			"list" => new MongoId($listitem["_id"]),
			  			));

			  	
			  	}
				// Second option. Item is  in old list, but not in new list -> Remove item
			  	else if (!in_array($listitem["_id"], $newLists ) && in_array($listitem["_id"], $oldLists))//item has been removed
				{
					$col->listitems->remove(array(
			  			"owner" => $_SESSION["charme_userid"],
			  			"userId" => $item["userId"],
			  			"list" => new MongoId($listitem["_id"]),
			  			));

				}
			}
			$returnArray[$action] = array("SUCCESS" => true);
		

		break;

		// Request future posts from this server.
		case "register_follow":

		break;

		// Do not receive future posts from this server.
		case "register_unfollow":

		break;


		case "list_add_item":

		break;

		case "lists_add" :
			$col = \App\DB\Get::Collection();
			$content = array("name" => $item["name"], "owner" => $_SESSION["charme_userid"]);

			if ($item["name"] != "")
				$ins = $col->lists->insert($content);

			$returnArray[$action] = array("SUCCESS" => true, "id" => $content["_id"]);

		break;

		case "lists_delete" :
			$col = \App\DB\Get::Collection();
			

		
			$col->lists->remove(array("owner" => $_SESSION["charme_userid"], "_id" => new MongoId($item["listId"])));

			$returnArray[$action] = array("SUCCESS" => true);

		break;

		case "lists_rename" :
			
			$col = \App\DB\Get::Collection();
			$col->lists->update(
			array("owner" => $_SESSION["charme_userid"], "_id" => new MongoId($item["listId"])),
			array('$set' => array("name" => $item["newName"])));

			$returnArray[$action] = array("SUCCESS" => true);

		break;

		case "lists_get" :
			$col = \App\DB\Get::Collection();
			$returnArray[$action] = iterator_to_array($col->lists->find(array("owner" => $_SESSION["charme_userid"])), false);
			
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

			/*
			if (!isset($_SESSION["charme_userid"])){
				$returnArray = array("ERROR" => 1);
				break; // echo error
			}
			*/
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



/*
	You just found a train:
   _______                _______      <>_<>      
   (_______) |_|_|_|_|_|_|| [] [] | .---|'"`|---.  
  `-oo---oo-'`-oo-----oo-'`-o---o-'`o"O-OO-OO-O"o' 
*/

?>
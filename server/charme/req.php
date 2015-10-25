<?php
/**
 * req.php
 * Parses incoming client requests.
 * Accepts and returns JSON data consiting of an id attribute which is further processed via switch case.
 *
 * @author mschultheiss
 */

$CHARME_VERSION = 1;

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 12 Mar 1992 05:12:00 GMT');

include_once("config.php");
include_once("log.php");
error_reporting(E_ALL);

// Do not display erros in PHP File, check /var/log/apache2/error.log for errors
ini_set('display_errors', 'Off');


// Allow Origin is not set to allow all as otherwise every website on the world wide web could
// query private session information for tracking by sending a request to your server.
// Later on it could be changed in a way, so that the user can provide trusted client urls in his profile settings.
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $CHARME_SETTINGS["ACCEPTED_CLIENT_URL"]))
header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);

//header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // if POST, GET, OPTIONS then $_POST will be empty.
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true'); // Needed for CORS Cookie sending

session_start(); // Start PHP session

require_once 'lib/App/ClassLoader/UniversalClassLoader.php'; // We are using Symphonys class loader here
use Symfony\Component\ClassLoader\UniversalClassLoader;
$loader = new UniversalClassLoader();
$loader->registerNamespaces(array('App' => __DIR__ . '/lib'));
$loader->register();

if (isset($_POST["d"]))
	$data = (json_decode($_POST["d"], true)); // Parse JSON to array
else
	$data = array();

$returnArray = array(); // This array will contain the returned data


//session_destroy();

// Iterate through requests
foreach ($data["requests"] as $item)
{


	$action = $item["id"];
	// This array contains a list of requests Ids, that can be executed without a session Id
	if ( !isset($_SESSION["charme_userid"]) && !in_array($action, array("post_like_receive", "comment_delete_receive",
	 "key_update_notification", "search_respond", "stream_respond", "post_delete_receive", "ping", "piece_get4profile", "key_getMultipleFromDir", "reg_salt_get", "reg_salt_set", "piece_getkeys",  "list_receive_notify","profile_get_name","post_comment_distribute", "collection_3newest", "post_comment_receive_distribute", "piece_request_receive", "post_like_receive_distribute", "user_login", "register_collection_post", "key_get", "collection_getinfo", "edgekey_request",  "register_collection_follow", "user_register", "comments_get", "collection_getAll", "profile_get", "message_receive", "register_isfollow", "post_getLikes", "collection_posts_get" ))){
				$returnArray = array("ERROR" => 1);

			clog("THIS WAS ERROR 1 WITH SESSIOn ".session_id()." and user".$_SESSION["charme_userid"]);
				break; // echo error
	}

	switch ($action)  // Here the different operations are processed
	{
		case "simpleStore" :
			$col = \App\DB\Get::Collection();
			if ($item["action"]=="add")
			{
				$col = \App\DB\Get::Collection();
				$data = array("owner" => $_SESSION["charme_userid"], "data" => $item["data"], "createdAt" => new MongoDate(), "class" => $item["class"]);
				$ret = $col->simpleStorage->insert($data);
				if ($item["return"] == "complete")
					$returnArray[$action] = array("itemId" => $data["_id"], "data" => 	$data["data"]);
				else {
					$returnArray[$action] = array("itemId" => $data["_id"]);
				}
			}
			if ($item["action"]=="update")
			{

			}
			if ($item["action"]=="get")
			{
				$returnArray[$action] = iterator_to_array(
				$col->simpleStorage->find(array("owner" =>   ($_SESSION["charme_userid"]), "class" => $item["class"])), false);
			}
			if ($item["action"]=="delete")
			{

				$col->simpleStorage->remove(array("_id" => new MongoId($item["itemId"])));
			}
		break;
		case "profile_pubKey":
			$col = \App\DB\Get::Collection();
			$cursor = $col->users->findOne(array("userid"=> ($item["profileId"])), array('publickey'));
			$returnArray[$action] = $cursor["publickey"];
		break;

		case "sessionId_get":
			$returnArray[$action] = array("sessionId" => session_id());
		break;

		case "reg_salt_set":
			$col = \App\DB\Get::Collection();
		//	$salt = $CHARME_SETTINGS["passwordSalt"];
		//	$p2 =hash('sha256', $CHARME_SETTINGS["passwordSalt"].$p1);
			// Only allow if user not exists!
			$numUsers = $col->users->count(array("userid" => $item["userid"]));

			// Only allow to set reg salt if user does not exist!
			if ($numUsers == 0)
			{
				 $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
			    $randomString = '';
			    for ($i = 0; $i < 32; $i++) {
			        $randomString .= $characters[rand(0, strlen($characters) - 1)];
			    }
				$cont = array("userid" => $item["userid"], "salt" => $randomString);
				$col->saltvalues->update($cont, $cont, array("upsert" => true));
				$returnArray[$action] = array("salt" => $randomString);
			}
			// Save

		break;

		case "ping":
				$returnArray[$action] = array("pong" => true); // Used in sign up to check if the server is a valid Charme server.
		break;

		case "reg_salt_get":


			clog("request salt for userid ".$item["userid"]);
			$col = \App\DB\Get::Collection();
		//	$salt = $CHARME_SETTINGS["passwordSalt"];
		//	$p2 =hash('sha256', $CHARME_SETTINGS["passwordSalt"].$p1);
			// Only allow if user not exists!
			$res = $col->saltvalues->findOne(array("userid" => $item["userid"]));

			clog2($res);
			$returnArray[$action] = array("salt" => $res["salt"]);


		break;

		// Parameters: oldPasswordHash, newPasswordHash
		case "reg_changepassword":

			$col = \App\DB\Get::Collection();

			// 1. Check if oldPasswordHash matches
			$cursor = $col->users->findOne(array("userid"=> $_SESSION["charme_userid"], "password"=>$item["oldPasswordHash"]), array("password"));

			if ($cursor["password"] == $item["oldPasswordHash"])
			{

				$col->users->update(array("userid"=> $_SESSION["charme_userid"]), array('$set' => array("password" => $item["newPasswordHash"])));
				$returnArray[$action] = array("STATUS" => "OK");
			}
			else
			{
				$returnArray[$action] = array("STATUS" => "WRONG_PASSWORD");
			}

		break;



		case "lists_getRegistred" :
		//
			$col = \App\DB\Get::Collection();
			$returnArray[$action] = iterator_to_array(
					$col->listitems->find(array("owner" =>   ($_SESSION["charme_userid"]), "userId" =>  ($item["userId"])), array("list")));

		break;




		case "messages_leave":


		break;

		case "messages_appendPeople":


		break;

		case "message_get_sub_updates" :

			$col = \App\DB\Get::Collection();




				$sel = array("message.object.conversationId" =>  ($item["conversationId"]),  "_id" => array('$gt' => new MongoId($item["lastId"])));

				{
					$res = $col->messages->find($sel);

					$returnArray[$action] = array("messages" =>
					iterator_to_array(

						$res->sort(array("message.object.time" => 1))


					, false));


				}



		break;

		case "messages_get_sub":

			// Important: apply changes also to message_get_sub_updates
			$startSet = false;
			if (isset($item["start"]) && $item["start"] != "-1")
				$startSet = true;

			$col = \App\DB\Get::Collection();

			if (isset($item["conversationId"]) && $item["conversationId"] != "") 	// Only need conversationId at the beginning
				$selector = array("messageData.conversationId" =>  $item["conversationId"], "owner" => $_SESSION["charme_userid"]);
			else // TODO:load newest conversation here...
			{
				$mdbQuery = $col->messageGroups->find(array("owner" => $_SESSION["charme_userid"]))->limit(1)->sort(array("lastAction" => -1));
				foreach ($mdbQuery as $res2)
				{
						$selector =  array("messageData.conversationId" =>  $res2["messageData"]["conversationId"], "owner" => $_SESSION["charme_userid"]);
				}
				$item["conversationId"] = $res2["messageData"]["conversationId"];
			}

			$col->messageGroups->update($selector, array('$set' => array("read" => true, "counter" => 0)));
			$res = $col->messageGroups->findOne($selector);

			// Total message count, -1 if no result provided
			$count = -1; // (= undefined!)
			// How many messages do we turn back?
			$msgCount = 10;

			if (isset($item["beforeMessageId"]))
			{
				if ($item["beforeMessageId"] == "NO_MESSAGES_LOCALLY")
				{
					$sel = array("message.object.conversationId" =>  ($item["conversationId"]));
				}
				else
					$sel = array("message.object.conversationId" =>  ($item["conversationId"]),  "_id" => array('$lt' => new MongoId($item["beforeMessageId"])));
			}
			else if (isset($item["onlyFiles"]) &&	$item["onlyFiles"] == true)
			{
				$sel = array("message.object.conversationId" =>  ($item["conversationId"]), "fileId" => array('$exists' => true));
				$msgCount = 30; // Return 30 Images only
			}
			else
				$sel = array("message.object.conversationId" =>  ($res["messageData"]["conversationId"]));

			$messageKeys23  = $col->messageKeys->find(array("conversationId" => new MongoId($item["conversationId"]), "owner" => $_SESSION["charme_userid"]));

			if ($item["limit"] > 0)
				$limit = $item["limit"];
			else
				$limit = $msgCount;

			if (isset($item["beforeMessageId"])) // Get all messages before a message given a messageId of this message
			{
				if ($item["beforeMessageId"] == "NO_MESSAGES_LOCALLY")
				{
				$count = $col->messages->count($sel);
				$query = array_reverse(iterator_to_array(
				$col->messages->find($sel)->sort(array("message.object.time" => -1))->limit($limit), false));   //->skip($count-$limit)
				}
				else
				{
					$query = array_reverse(iterator_to_array(
					$col->messages->find($sel)
					->sort(array("message.object.time" => -1))
					->limit($limit),false));
				}

				$returnArray[$action] = array(
					"messageKeys" => iterator_to_array($messageKeys23, false),
					"messages" =>	$query,
				  "count" => $count,
					"revision" =>  $res["revision"],
					"usernames" =>  $res["messageData"]["obj"]["usernames"],
					"conversationId" => $item["conversationId"]
					);
			}
			else  // Get messages by index
			{
				if ($startSet )
					$start = $item["start"];
				else
				{
					// Also return total message Count!
					$count = $col->messages->count($sel);
					$start =$count -$msgCount;
				}

				if ($start <0)
					$start = 0;


				$returnArray[$action] = array("messageKeys" => iterator_to_array($messageKeys23, false), "messages" =>
				iterator_to_array(
					$col->messages->find($sel)
					->sort(array("message.object.time" => 1))
					->skip($start)->limit($limit)

				, false), "count" => $count, "revision" =>  $res["revision"], "usernames" =>  $res["messageData"]["obj"]["usernames"], "conversationId" => $item["conversationId"]);
		}

		break;

		case "messages_get_keys" :
			clog("Session owner is:". $item["conversationId"]);
			$col = \App\DB\Get::Collection();
			$messageKeys  = $col->messageKeys->find(array("conversationId" => new MongoId($item["conversationId"]), "owner" => $_SESSION["charme_userid"]));
			$returnArray[$action] = array("messageKeys" => iterator_to_array($messageKeys, false));
		break;

		case "messages_get":

				$col = \App\DB\Get::Collection();

					\App\Counter\CounterUpdate::set( $_SESSION["charme_userid"], "messages", 0);



			if (isset($item["start"]))
				$start = $item["start"];
			else
				$start = 0;

			$count = -1;
			if ($item["countReturn"])
			{
			$count = $col->messageGroups->count(array("owner" => $_SESSION["charme_userid"]));


			}

			\App\Counter\CounterUpdate::set( $_SESSION["charme_userid"], "talks", 0);
			$messages = $col->messageGroups->find(array("owner" => $_SESSION["charme_userid"]))
				->sort(array("lastAction" => -1))
				->limit(7)
				->skip(7*$start);

			$messageIds = array();
			foreach ($messages as $message) {
				$messageIds[] = new MongoId($message["messageData"]["conversationId"]);

			}

			$messageKeys = $col->messageKeys->find(array("conversationId" => array('$in' => $messageIds)));

			// Get 10 conversations
 			$returnArray[$action] = array("count" => $count,  "messages" =>
			iterator_to_array(
				$messages
			, false), "messageKeys" =>
			iterator_to_array(
				$messageKeys
			, false));


		break;


		case "post_comment_receive_distribute":

			$col = \App\DB\Get::Collection();


			$item["commentId"] = $item['_id']['$id'];


			unset($item["id"]); // Must stay!
			unset($item["_id"]); // Must stay we can not set MongoId when update

			// TODO: Performance! 1st $item can be reduced!
			$col->streamcomments->update($item,$item, array("upsert" => true));


		break;

		case "post_comment_distribute" :

		/*
			1. Get collectionId
			2. Get collection followers
			3. Send post to these followers
		*/
		// problem:
		$col = \App\DB\Get::Collection();
		$cursor2 = $col->posts->findOne(array("_id"=> new MongoId($item["commentData"]["object"]["postId"])), array("collectionId", "owner"));
		$cursor3 = $col->followers->find(array("collectionId" => new MongoId($cursor2["collectionId"]) ));


		// insert in owners collection
		$itemdata= array(
				"commentData" => $item["commentData"],
				"userId" => $item["userId"],
				"sendername" => $item["sendername"],
				"postowner" => $item["userId"],
				"itemTime"  => new MongoDate()
				);

		 try {

		$notifyItem =
		array("type" => \App\Counter\Notify::notifyComment,
			"name" => $item["sendername"], "userId" => $item["userId"],"postowner" =>$item["commentData"]["object"]["postOwner"],
			"postId" => $item["commentData"]["object"]["postId"]

			);


		//\App\Counter\Notify::addNotification(array());
		if ($item["commentData"]["object"]["userId"] != $item["commentData"]["object"]["postOwner"] )// Do not notify oursefl if we wrote the comment
		\App\Counter\Notify::addNotification($item["commentData"]["object"]["postOwner"], $notifyItem);


		  }
		  catch (MyException $e) {
             // clog($e->getMessage());
            }

		// Insert local comment WARNING: This must happen before comments are sent to other servers, as the _id field is set afterwards
		$col->comments->insert($itemdata);


		$itemdata["id"] = "post_comment_receive_distribute";
		$data = array("requests" =>
				array($itemdata)
		); // $data must be defined after comments have been inserted and $itemdata contains the id


		$cursor4 = $col->streamSubscribers->find(array("postId" => $item["commentData"]["object"]["postId"]) );

		// Send comment to other servers which have registred for it in search_respond
		// These servers will get comment updates for 3? days
		foreach ($cursor4 as $receiver) {
			$req21 = new \App\Requests\JSON(
			"noreply@".$receiver["server"],
			"",
			$data);


			$req21->send();
		}

		// Send comment to other servers
		foreach ($cursor3 as $receiver)
		{
			$req21 = new \App\Requests\JSON(
			$receiver["follower"],
			$cursor2["owner"],
			$data);
			$req21->send();
		}

		$returnArray[$action] = array("commentId" => $itemdata["_id"]->__toString());
		break;

		// Starts  a new search
		// WARNING: SESSION CLOSES AFTER THIS REQUEST!!!!!
		case "search_start" :
			// This is a lazy search right now
			// We query the 5 servers most friends are onto.
			// Also we query our own server
			// Furthermore we query 5 Servers, most people on this server are onto
			// In the future this is going to be replaced by a more robust search base64_decode
			// on a distributed hash table like chord

			// STEP 1: Get most often used servers
			$col = \App\DB\Get::Collection();

			$serverArray = array();
			$res2 = $col->keydirectory->find(array("owner" => $_SESSION["charme_userid"] ));
			foreach ($res2 as $resItem)
			{
				$splitArray = explode ('@', $resItem["userId"]);
				$server = $splitArray[1];
				$serverArray[] = $server;
			}

			$mostServers = array_count_values($serverArray);

			//
			// Build payload
			//
			$data = array("requests" => array(array(
					"id" => "search_respond",
					"q" =>  $item["q"],
			)));

			$fields = (array(
					"d" => urlencode(json_encode(	$data))))
			;

			$fields_string ="";
			foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
			rtrim($fields_string, '&');

			// Close sesion to avoid curl deadlock when queriing own server!
			// DO NOT PERFORM ANY REQUEST THAT NEED SESSION AFTER a search request!!!
			session_write_close();

			//
			// Only contact 5 servers at maximum for search queries
			//
			$maxServer = Count($serverArray);
			if ($maxServer > 5) // Contact 5 servers for seach query as maximum
				$maxServer = 5;

			//
			// Build curl requests
			//
			$mh = curl_multi_init(); // Init the curl module for HTTP Requests
			$ch = array();
			for ($i = 0; $i<$maxServer; $i++) {
				$server = $serverArray[$i];
				$ch[$i] = curl_init();
				curl_setopt(	$ch[$i] , CURLOPT_URL, "http://".$server."/charme/req.php");
				curl_setopt($ch[$i], CURLOPT_POST, count($fields));
				curl_setopt($ch[$i], CURLOPT_POSTFIELDS, $fields_string);
				curl_setopt($ch[$i], CURLOPT_RETURNTRANSFER , TRUE );
				curl_multi_add_handle($mh,$ch[$i]);
			}

			$active = null;
			do {
			   curl_multi_exec($mh, $active);

			} while ($active > 0);
			$results = array();
			 foreach ($ch as $key => $val) {
			         $json = json_decode(curl_multi_getcontent($val), true);
							foreach ($json["search_respond"] as $item3)
							$results[$item3["id"]] = $item3;
			        curl_multi_remove_handle($mh, $val);
			}

			curl_multi_close($mh);
			$returnArray[$action] = array("STATUS" => "OK", "results" => $results);

			break;

		case "search_respond" :
		// This function is called by search_start and sends back results to the
		// server asking for them

		//sleep(1); //Wait a little bit...
		$query = $item["q"];


		$col = \App\DB\Get::Collection();

		clog("query for ".$item["q"]);

		// 1. Search profiles if requested
		$regex = new MongoRegex("".$query."/i");
		$result = array();
		$searchCollection = $col->users->find(array('name' => $regex), array("name", "userid", "hometown"))->limit(5);
		foreach ($searchCollection as $sitem) {
			$result[$sitem["userid"]] = array(
				"name" => $sitem["name"],
				"id" => $sitem["userid"],
				"description" => $sitem["hometown"],
				"url" => "#user/".$sitem["userid"],
				"type" => "user"
			);
		}

		// Same search but by userid
		$searchCollection = $col->users->find(array('userid' => $regex), array("name", "userid", "hometown"))->limit(5);
		foreach ($searchCollection as $sitem) {
			$result[$sitem["userid"]] = array(
				"name" => $sitem["name"],
				"id" => $sitem["userid"],
				"description" => $sitem["hometown"],
				"url" => "#user/".$sitem["userid"],
				"type" => "user"
			);
		}


		// 2. Search posts if requested

		$searchCollection = $col->posts->find(array('postData.object.content' => $regex,
		'postData.object.isEncrypted' => array('$ne' => 1)
		),
		array("postData", "username"))->limit(5);

		foreach ($searchCollection as $sitem) {
			$result[$sitem["_id"]->__toString()] = array(
				"name" => $sitem["username"],
				"id" =>$sitem["_id"]->__toString(),
				"description" =>  $sitem["postData"]["object"]["content"],
				"url" => "#user/".$sitem["postData"]["object"]["author"]."/post/".$sitem["_id"]->__toString(),
				"type" => "post"
			);
		}



		// 3. Search collections if requested


		$returnArray[$action] = $result;
		break;

		case "post_comment" :


			// TODO: validate signature!

		//clog2($item2, "postcomment");

			// Send to server owner
			$col = \App\DB\Get::Collection();
			$receiver = $item["commentData"]["object"]["postOwner"];

			// Get sender name
			$cursor2 = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"])), array("firstname", "lastname"));
			$sendername = $cursor2["firstname"]." ".$cursor2["lastname"];


			//clog("postcomment ....: postId: ".$item["postId"]);


			// Send request to post owner server. Comment is distributed by this server
			$data = array("requests" => array(array(

					"id" => "post_comment_distribute",
					"commentData" => $item["commentData"],
					"userId" => $receiver,
					"sendername" => $sendername
					)));


			$req21 = new \App\Requests\JSON(
			$receiver,
			$_SESSION["charme_userid"],
			$data);

			$arr = $req21->send();

			$returnArray[$action] = array("STATUS" => "OK", "username" => $sendername, "commentId" =>  $arr["post_comment_distribute"]["commentId"] );

		break;


		case "post_like_receive_distribute" :
		// Notify other people about the like...
		$col = \App\DB\Get::Collection();
		//clog($item["postId"]);
		// "owner" => $item["owner"],
		$col->streamitems->update(array( "postId" => $item["postId"]) ,	array('$set' => array("likecount" => $item["count"])), array("multiple" => true));


		break;
		case  "post_getLikes" :
			// Get all likes...
			$col = \App\DB\Get::Collection();
			$returnArray[$action]= array("items" => iterator_to_array($col->likes->find(array("postId" => $item["postId"]), array("liker",
				"username", "postId")), false));

		break;


		case "post_like_receive" :



			// Save like on post owners server...
			// ! Has to work without sessionID
			$col = \App\DB\Get::Collection();
			// Verify sender ID!, userId must be in database!


			//"_id" => new MongoId($item["postId"])
			$content = array("owner" => $item["userId"], "liker" =>  $item["liker"], "postId" => $item["postId"], "username" => $item["username"]);



			if ($item["status"] != true)
			{
				$col->likes->remove(array("liker" => $item["liker"], "postId" => $item["postId"]));



			}
			else
			{

				$res = $col->likes->update(array("liker" => $item["liker"], "postId" => $item["postId"]), $content ,  array("upsert" => true));

				// Insert notification
					// Insert notification
				$notifyItem =
				array("type" => \App\Counter\Notify::notifyLike,
					"name" => $item["username"], "liker" => $item["liker"],
					"postId" => $item["postId"]

					);
				$item["userId"];
				//\App\Counter\Notify::addNotification(array());
				if ($item["liker"] != $item["userId"]) // Do not notify ourselfs
				\App\Counter\Notify::addNotification($item["userId"], $notifyItem);

			//	$col->likes->insert($content);


				//clog("IS IS".$res["_id"]);
			}
			// Get total likes
			$count = $col->likes->count(array("postId" => $item["postId"], "owner" => $item["userId"]));




			// Multiple??
			$query = array('_id' => new MongoId($item["postId"]), "owner" => $item["userId"]);

			$col->posts->update($query, array('$set' => array("likecount" => $count)));



			// Get collection followers and distribute like count!


			// TODO: Get collection id, then distribute
			//$item["postId"]
			$result = $col->posts->findOne(array("_id" => new MongoId($item["postId"])),
				array("collectionId", "owner")
				);



			$res2 = $col->followers->find(array("collectionId" => new MongoId($result["collectionId"]) ));

			foreach ($res2 as $resItem)
			{


			$data = array("requests" => array(array(

				"id" => "post_like_receive_distribute",
				"owner" => $result["owner"],

				"postId" => $item["postId"],
				"count" => $count

			)));



				$req21 = new \App\Requests\JSON(
				$resItem["follower"],
				$result["owner"],
				$data

				);


				$req21->send($resItem["priority"]);

			}





		break;
		case "post_archive":
			$col = \App\DB\Get::Collection();
			$query = array('postId' =>$item["postId"], "owner" => $_SESSION["charme_userid"]);
			// TODO: If not in stream then add to!!

			// Set archive status in my stream
			if ($item["status"] == true)
			$col->streamitems->update($query ,	array('$set' => array("archived" => true)));
			else
			$col->streamitems->update($query ,	array('$set' => array("archived" => false)));//array("upsert" => true)

		break;

		case "post_like" :
			// Save like on my own server at stream items
			$col = \App\DB\Get::Collection();


			// "post.owner" => $item["userId"],
			$query = array('postId' => $item["postId"], "owner" => $_SESSION["charme_userid"]);


			// Get username for distribution
			$cursor2 = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"])), array("firstname", "lastname"));
			$sendername = $cursor2["firstname"]." ".$cursor2["lastname"];


			// Set like status in my stream
			if ($item["status"] == false)
			$col->streamitems->update($query ,	array('$set' => array("like" => false)));//array("upsert" => true)
			else
			$col->streamitems->update($query ,	array('$set' => array("like" => true)));


			$receiver = $item["userId"];

			$data = array("requests" => array(array(

					"id" => "post_like_receive",
					"liker" => $_SESSION["charme_userid"],
					"userId" => $receiver,
					"postId" => $item["postId"],
					"status" => $item["status"],
					"username" => $sendername

					)));




			$req21 = new \App\Requests\JSON(
			$receiver,
			$_SESSION["charme_userid"],
			$data			);
			$req21->send();

			$returnArray[$action] = array("STATUS" => "OK");


		break;


		// Get message from server
		case "message_receiveOLD" :

			global $CHARME_SETTINGS;


			//echo "!!!".$item["conversationId"];
			// If receiver-sender relation is already there -> append message!

			//$item["localreceivers"][] = $item["sender"];


			/*
			// Warning! One message per server only!


			$blockWrite = false;
		//	clog(print_r($item["localreceivers"], true));

			foreach ($item["localreceivers"]as $receiver)
			{

				// Find conversation $item["aesEnc"] = aesEnc
				// if not exists => create conversation


				// Database Connection
				$col = \App\DB\Get::Collection();

				//$db_charme->messageReceivers->update(array("uniqueId" => $uniqueID, "receiver" => $item), $content2, array("upsert" => true));

				// Check if CONVERATION (not message) already exists for THIS receiver (may exist on this server for another user!)
				$numConvUser = $col->conversations->count(array("conversationId" =>  new MongoId($item["conversationId"]), "receiver" => $receiver));




				if ($numConvUser < 1) // Conversation does not Exist for THIS User
				{
					// Add new people




					$content = array(
					"people" => $item["people"], // is this important?
					//
					"aesEnc" => $item["aesEnc"],
					"conversationId" => new MongoId($item["conversationId"]),
					"receiver" => $receiver,
					"peoplenames" => $item["peoplenames"],
					"revision" => $item["revision"],
					"sendername" => $item["sendername"],
					"messagePreview" => $item["messagePreview"],
					"time" => new MongoDate(time()),
					"pplCount" =>  Count($item["people"])
					);



					$c = $col->conversations->count(array("conversationId" =>  new MongoId($item["conversationId"])));
					if ($c > 0)
					{
						/*
						Set blockwrite to True,
						It is true if the conversation already exists for some other user,
						So we do not need to insert new messages!


						$blockWrite = true;
					}

					$col->conversations->update(array("aesEnc" => $item["aesEnc"],  "read" => false, '$inc' => array('counter' => 1),  "sendername" => $item["sendername"] , "time" => new MongoDate()), $content ,  array('upsert' => true)); //
					\App\Counter\CounterUpdate::inc( $receiver, "talks"); // Increment notification counter (Showed right of talks in the navigation)


				}
				else
				{


					$ppl = $col->conversations->findOne(array("conversationId" =>  new MongoId($item["conversationId"])), array("people", "peoplenames"));
					$setarray = array("messagePreview" => $item["messagePreview"],"read" => false,   "time" => new MongoDate()
						);

					if ($item["status"] == "addPeople")
					{

						$i = 0;

						$newpeople = array();
						$newpeoplenames = array();

						// Add existing receivers
						foreach ($ppl["people"] as $item2)
						{

							if (!in_array($item2, $newpeople))
							{

								$newpeople[] = $item2;
								$newpeoplenames[] = $ppl["peoplenames"][$i];
							}
							$i++;

						}

						$i = 0; // Reset index counter

						// Add new receivers
						foreach ($item["people"] as $item2)
						{

							if (!in_array($item2, $newpeople))
							{

								$newpeople[] = $item2;
								$newpeoplenames[] = $item["peoplenames"][$i];
							}
							$i++;

						}

						$setarray["people"] = $newpeople;
						$setarray["peoplenames"] = $newpeoplenames;

					}

					if (isset($item["messagePreview"])) // Please not $inc is not supported in $set array
						$col->conversations->update(array("conversationId" =>  new MongoId($item["conversationId"])), array('$set' => $setarray, '$inc' => array('counter' => 1)),array('multiple' => true));


					$ppl = $col->conversations->findOne(array("conversationId" =>  new MongoId($item["conversationId"])), array("people"));




					// Increment receivers Counters
					foreach ($ppl["people"] as $val) {

						if ( $item["sender"] !=  $val)
						\App\Counter\CounterUpdate::inc($val, "talks");
					}


				}




				// Insert the actual message here
				if (!$blockWrite) // Messages are only inserted once per server.
				{

				$ins = array("sendername" => $item["sendername"],

				 "time" => new MongoDate(), "fileId"=> $item["fileId"], "conversationId" =>   new MongoId($item["conversationId"]),
				 "encMessage" => $item["encMessage"], "sender" => $item["sender"], "status" => $item["status"]);

				if ($ins["fileId"] == 0)
				unset($ins["fileId"]);
				if (isset($item["status"] ) && $item["status"] == "addPeople")
				{
					// TODO: also append the people who were added to message
				}




				$col->messages->insert($ins);

				// Notify Android Devices via Google Cloud Messaging (GCM)




			} // End foreach of receivers

			*/


		break;



		// Get message from client
		case "message_distribute_answer":


			$col = \App\DB\Get::Collection();
			$convId = new MongoId($item["message"]["object"]["conversationId"]);

			$cursor2 = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"])), array("firstname", "lastname"));
			$sendername = $cursor2["firstname"]." ".$cursor2["lastname"];

			// Find receivers of this message by $item["conversationId"]
			$res = $col->messageGroups->findOne(array("messageData.conversationId"=> ($convId->__toString())), array('messageData'));



			$clustered = \App\Requests\Cluster::ClusterPeople($res["messageData"]["obj"]["usernames"]); // Cluster people to save bandwith

			$fileId = 0;

			// Store files on server
			if (isset($item["encFile"]))
			{
				$col = \App\DB\Get::Collection();
				$grid = $col->getGridFS();
				$fileId = (string)$grid->storeBytes($item["encFile"], array('type'=>"encMsg",'owner' => $_SESSION["charme_userid"]));
				$ret2 = $grid->storeBytes($item["encFileThumb"], array('type'=>"encMsgThumb",'owner' => $_SESSION["charme_userid"], "orgId" => $fileId));


			}

			foreach ($clustered as $receiverObj)
			{
				$receiver = $receiverObj["userId"];

					$reqdata = array(

						"id" => "message_receive",
						"localreceivers" => array($receiver),
						"allreceivers" => $res["messageData"]["obj"]["usernames"],
						//"encMessage" => $item["encMessage"],
						//"messagePreview" => $item["messagePreview"],
						"message" => $item["message"],
						"sender" => $_SESSION["charme_userid"],

						"sendername" => $sendername
						//"conversationId" => $convId->__toString(),
						//"aesEnc" => $receiver["aesEnc"], known already by receiver
						);



					if (isset($fileId))
						$reqdata["fileId"] = $fileId;


					$data = array("requests" => array($reqdata));

					$req21 = new \App\Requests\JSON(
					$receiver,
					$_SESSION["charme_userid"],
					$data

					);



					$req21->givePostman(1);
			}

			\App\Hydra\Distribute::start(); // Start message distribution
			$returnArray[$action] = array("sendername" => $sendername);


		break;

		case "message_receive" :


			$col = \App\DB\Get::Collection();

			$messageData = $item["messageData"]["obj"]; // TODO: Check HMAC!
			$conversationId = $item["messageData"]["conversationId"];
			// Problem: How to verify new message keys?

			// Initiate a new conversation:
			if (	$messageData["action"] == "initConversation")
			{
				if (isset(	$messageData["messageKeysRevision"]))
					$revision = 	$messageData["messageKeysRevision"];
				else
					$revision = 0;
				// Add key to messageKeys collection

				$col->messageKeys->insert(array("key" => $item["key"], "conversationId" => new MongoId($conversationId), "owner" => $item["key"]["userId"], "revision" => $revision));

				$alreadyExists = false;

				if (isset(	$item["messageData"]["conversationId"]))
				{
					clog("look for ".	$conversationId. "with uid". $item["key"]["userId"]);
					if ($col->messageGroups->count(array("messageData.obj.conversationId" => (	$conversationId), "owner" => $item["key"]["userId"]))> 0)
					{
						$alreadyExists = true;



					}
					//else
					//	clog("does not  EXIST");
				}

				if ($alreadyExists)
				{


					// set new people here....
					$col->messageGroups->update(array("messageData.conversationId" => (	$conversationId),
						"owner" => $item["key"]["userId"]),
						array('$set' => array(
							//"messageData.obj.receivers" =>  	$messageData["receivers"],
							"messageData.obj.usernames" => 	$messageData["usernames"],
							)));

					$messageInsertion = array("message" =>	$messageData["message"], "owner" => $item["key"]["userId"], "sendername" => 	$messageData["sendername"]);

					if ($item["fileId"] != 0)
						$messageInsertion["fileId"] = $item["fileId"];

					$col->messages->insert($messageInsertion);


					//$col->messages->insert(array("message" => $item["message"], "owner" => $receiver, "sendername" => $item["sendername"]));


					// insert update notification

				}
				else
				$col->messageGroups->insert(array("messageData" => $item["messageData"], "owner" =>  $item["key"]["userId"], "lastAction" => new MongoDate(), "sendername" =>	$messageData["sendername"]));



			}
			else
			{
				// Remove signature, can be queried at host server
				unset($item["message"]["signature"]);

				// Insert Message in db for every user
				$messageInsertion  = array();
				// This is currently only calledo once per server, localreceivers is incomplete!
				foreach ($item["localreceivers"] as $receiver) {





						$messageInsertion =array("message" => $item["message"], "owner" => $receiver, "sendername" => $item["sendername"]);

							if ($item["fileId"] != 0)
						$messageInsertion["fileId"] = $item["fileId"];


						$col->messages->insert($messageInsertion);

				}


					//clog2($item["localreceivers"], "locals:");


				   // TODO: Ensure the $gcmpeople array contains (in this operation) only people from my server!
                $gcmpeople =array();
								foreach ( $item["allreceivers"] as $receiver) { // TODO: remove allreceivers and look them up in database instead!
									$gcmpeople[] = $receiver["userId"];
								}

                $bucketCol = $col->gcmclients->find(array( 'owner' => array('$in' => $gcmpeople)));
                $deviceIds = array();
                foreach ($bucketCol as $citem)
                {
                    $deviceIds[] = $citem["regId"];
                }

								clog2($deviceIds, "deviceids:");


								clog2("arra people is",$item);

                $gcmcontent = array("messageEnc" =>  $item["message"]["object"]["content"], "conversationId" => $item["message"]["object"]["conversationId"], "sendername" => $item["sendername"]);

               // if (!$CHARME_SETTINGS["DEBUG"]) // Only send messagese if not debugging, for debugging this function append clog before function.

              	//	if (!$CHARME_SETTINGS["DEBUG"])


						//	$deviceIds = 		array_filter($deviceIds);


									// Returns 0 if no registration ids have been found
                	$messageFromServerIfDebugIsOn = \App\GCM\Send::NotifyNew($deviceIds, json_encode($gcmcontent));
									clog("send notify".$messageFromServerIfDebugIsOn);
									clog2($deviceIds);






				// Get Conversation User
				$groups = $col->messageGroups->find(array("messageData.obj.conversationId" => $item["message"]["object"]["conversationId"]), array("owner"));

				foreach ($groups as $group)
				{
					if ($item["message"]["object"]["sender"] != $group["owner"]) // No notification for myself
					{
						$context = new ZMQContext(); // Notifiy events.php which send the notification via web sockets to the client.
						$socket = $context->getSocket(ZMQ::SOCKET_PUSH, 'my pusher');
						$socket->connect("tcp://localhost:5555");
						$socket->send(json_encode(array("message" => $item["message"], "owner" => $group["owner"], "sendername" => $item["sendername"], "_id" => $messageInsertion["_id"], "fileId" => $item["fileId"])));

					}
				}
				$res = $col->messageGroups->update(array("messageData.obj.conversationId" => $item["message"]["object"]["conversationId"]), array('$set' => array("lastAction" => new MongoDate(), "sendername" => $item["sendername"], "preview" => $item["message"]["object"]["preview"])), array("multiple" => true));

			}

		break;

		case "message_distribute":
			$col = \App\DB\Get::Collection();

			$cursor2 = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"])), array("firstname", "lastname"));
			$sendername = $cursor2["firstname"]." ".$cursor2["lastname"];

			$messageData = $item["messageData"]["obj"];
			$conversationId = $item["messageData"]["conversationId"];
		$messageData["sendername"] = $sendername;


			if ($messageData["action"] == "initConversation")
			{
				// Create a unique Id for each conversation

				if (!isset($item["messageData"]["conversationId"]) )
				{
					$mid =  new MongoId();
					$item["messageData"]["conversationId"]= $mid->__toString();
						$conversationId =  $mid->__toString();
				}


				 for ($i = 0; $i<Count($messageData["usernames"]); $i++)
				 {
				 	if ($messageData["usernames"][$i]["userId"] == $_SESSION["charme_userid"])
				 			$messageData["usernames"][$i]["name"] = $sendername;
				 }


				foreach ($messageData["usernames"] as  $userTuple) {
						$receiverId = $userTuple["userId"];
						$keyobj = array();
						// Get the message key
						foreach ($item["messageKeys"] as  $value)
						{
							 if ($value["userId"] == $receiverId)
							 {
							 	$keyobj = $value;
							 }
						}

						$content = array(array(
										"id" => "message_receive",
										"messageData" => $item["messageData"], // WARNING: Do not use $messageData here as we need the whole object with Signature!!!!
										"key" => $keyobj,

								));



						$data = array("requests" => $content);


						$serverRequest = new \App\Requests\JSON(
							$receiverId,
							$_SESSION["charme_userid"],
							$data

							);

						$serverRequest->send();
				}
			}
			$returnArray[$action] = array("STATUS" => "OK", "messageId" => 	$conversationId);




		break;

		case "message_notify_newpeople":

		break;

		case "user_login":
			// Get certificate

			$sessionIdOfUser = "";
			global $CHARME_SETTINGS;
			global $CHARME_VERSION;

			$col = \App\DB\Get::Collection();

			$p1 = $item["p"];

			if (!isset($CHARME_SETTINGS["passwordSalt"]))
				die("CHARME_SETTINGS NOT INCLUDED");


			$cursor = $col->users->findOne(array("userid"=> ($item["u"]), "password"=>$p1), array('userid', "rsa", "keyring"));
			clog($cursor["userid"]."///");
			if ($cursor["userid"]==($item["u"]) && $cursor["userid"] != "")
			{

				$_SESSION["charme_userid"] = $cursor["userid"];
				clog("SET SESSION USER ID COMPLETE: ".$cursor["userid"]);
				$sessionIdOfUser = session_id();
				//echo $_SESSION["charme_userid"] ;

				$stat = "PASS";
			}
			else
			{
				$stat = "FAIL";

		}
			$returnArray[$action] =   (array("status" => $stat, "sessionId" => $sessionIdOfUser, "CHARME_VERSION" => $CHARME_VERSION, "ret"=>$cursor, "gcmprojectid" => $CHARME_SETTINGS["GCM_PROJECTID"]));

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

			include_once("3rdparty/wideimage/WideImage.php");


			$col = \App\DB\Get::Collection();
			$image = WideImage::load($item["data"]);

			$grid = $col->getGridFS();
			$grid->remove(array("owner" => $_SESSION["charme_userid"], "type" => "profileimage"));

			$grid->storeBytes($image->resize(150, null, 'fill')->crop(0, 0, 150, 67)->output('jpg'), array('type'=>"profileimage",'owner' => $_SESSION["charme_userid"], 'size' => 150));

			// 200 width
			$grid->storeBytes($image->resize(200, null, 'fill')->output('jpg'), array('type'=>"profileimage",'owner' => $_SESSION["charme_userid"], 'size' => 200));

			// 64 width square

			$grid->storeBytes($image->resize(64 , 63 , 'outside')->crop('center', 'center', 64, 64)->output('jpg'), array('type'=>"profileimage",'owner' => $_SESSION["charme_userid"], 'size' => 64));

			// 24 width square
			$grid->storeBytes($image->resize(24 , 23 , 'outside')->crop('center', 'center', 24, 24)->output('jpg'), array('type'=>"profileimage",'owner' => $_SESSION["charme_userid"], 'size' => 24));



			$returnArray[$action] = array("SUCCESS" => true, "random" => mt_rand(0,1000));


		break;


		case "post.spread":

			// Notify post owner when sharing a posting

		break;
		case "lists_getActive" :


		break;




		case "collection_posts_get" :
			$col = \App\DB\Get::Collection();


			// 1st option: get a lot of posts
			$array2 = array();

			if (!isset($item["postId"]))
			{
				if ($item["collectionId"] == "context")
					$array2["items"] = iterator_to_array($col->posts->find(array("owner" => $item["userId"],"postData.object.metaData" => array('$exists' => true)))->sort(array('_id' => -1)), false);
				else
					$array2["items"] = iterator_to_array($col->posts->find(array("owner" => $item["userId"],"collectionId" => $item["collectionId"]))->sort(array('_id' => -1)), false);
			}
			else
			{
				$array2["items"] = iterator_to_array($col->posts->find(array("_id" => new MongoId($item["postId"]))), false);
			}
			// or just get a single post


			$postIds = array();
			// Add comments
			foreach ($array2["items"] as $key => $value) {

				$postId = $value["_id"]->__toString();
				$postIds[] =  ($postId);

				$array2["items"][$key]["comments"] = \App\Collections\Comments::Get($postId, $col);


				if ($col->likes->count(array("liker" => $item["claimedUserId"], "postId" => $postId)) > 0)
				$array2["items"][$key]["like"] = true;
					else
				$array2["items"][$key]["like"] = false;

			$array2["items"][$key]["commentCount"] =  $col->comments->count(array("commentData.object.postId" => $postId));
			}
			// Add encrypted postKeys for the user requesting

			$array2["postkeys"] =  iterator_to_array($col->postkeys->find(array('userId' => $item["claimedUserId"],  'postId' => array('$in' => $postIds))), false);

  		$returnArray[$action] = $array2;

		break;

		case "collection_getinfo":

			$col = \App\DB\Get::Collection();
			if ($item["collectionId"] == "context")
			$cursor =array("name" => "Context");
			else {
				$cursor = $col->collections->findOne(array("_id"=> new MongoId($item["collectionId"])), array("name", "currentlist"));
			}

			$returnArray[$action] =   (array("info"=>$cursor));

		break;



		case "notifications_get":
			\App\Counter\Notify::set($_SESSION["charme_userid"],0);
			$returnArray[$action] =  (\App\Counter\Notify::getNotifications($_SESSION["charme_userid"]));
		break;

		// store encrypted pieces in database
		case "piece_store":
			$col = \App\DB\Get::Collection();
			$allowedFields = array("phone", "mail", "currentcity");
			$content = $item["fields"];

			foreach ($content as $key => $value)
			{

				if (in_array($key, $allowedFields))
				{
					// Insert into mongodb
					$col->pieces->update(
						array("owner" => $_SESSION["charme_userid"], "key" => $key),


						array("owner" => $_SESSION["charme_userid"],
							"key" => $key,
							"value" => $value)



						,
						array("upsert" => true));
				}

					$returnArray[$action] = array("OK" =>$item, "test" => 1);


				// Update buckets
				if (isset($item["fielddata"][$key]))
				{




				$col->pieceBuckets->update(array("key" => $key, "owner" => $_SESSION["charme_userid"]),


					array('$set' => array("piecedata" => $item["fielddata"][$key]), '$inc' => array('version' => 1)
						)

					,
					array("multiple" => false, "upsert" => true)
					);
			}


				//multiple=true!, upsert = true

			}



			// Also update PieceBucket

		break;

		// returns encrypted piece storage data
		case "piece_store_get":

			$col = \App\DB\Get::Collection();
			$cursor = iterator_to_array($col->pieces->find(array("owner"=> $_SESSION["charme_userid"]), array('value', 'key')), false);
			$returnArray[$action] = array("items" => $cursor);



		break;



		case "piece_request_receive":

			// Insert data into collection
			$col = \App\DB\Get::Collection();

			$col->pieceRequests->update
			(
				array("userId" => $item["userId"],
					"invader" =>  $item["invader"],
					"key" =>  $item["key"]
					),

				array("userId" => $item["userId"],
					"invader" =>  $item["invader"],
					"key" =>  $item["key"]
					),
				array("upsert" => true)
			);


		break;

		case "piece_request_list":



			$col = \App\DB\Get::Collection();
			$cursor = iterator_to_array($col->pieceRequests->find(array("userId"=> $_SESSION["charme_userid"]), array('invader', 'key')), false);
			$returnArray[$action] = array("items" => $cursor);




		break;


		case "piece_request_deny":

			$col = \App\DB\Get::Collection();
			$col->pieceRequests->remove(array("userId" => $_SESSION["charme_userid"], "invader" => $item["userid"], "key" =>  $item["key"]));
			$returnArray[$action] = array("OK" => 1);

		break;

		case "piece_request_accept":

		// insert public key encrypted data into
		// pieceBucketItems
		$col = \App\DB\Get::Collection();
		$col->pieceBucketItems->insert(array(
		 "key" => $item["key"], // Information Key, like "phone" or "hometown"
		 "bucket" => $item["bucket"],
		 "bucketkey" => $item["bucketkey"], // RSA encrypted key to decrypt private information
		 "owner" => $_SESSION["charme_userid"], // The real information owner
		 "userid" =>  $item["userid"] // The user the key is for
		 ));


		// Delete request
		$col->pieceRequests->remove(array("userId" => $_SESSION["charme_userid"], "invader" => $item["userid"], "key" =>  $item["key"]));
		// Count keys in this buckets and update counter and pieceData


		$count1 = $col->pieceBucketItems->count(array("bucket" => $item["bucket"]));

				$cursor = $col->pieceBuckets->update(

			array("owner" => $_SESSION["charme_userid"],
					"_id" => new MongoId($item["bucket"]))

				, array(

					'$set' => array(
					"piecedata" => $item["piecedata"],
					"itemcount" => $count1
					)

					), array("upsert" => true));

		//	$count1 =  $col->pieceBucketItems->count(array(""));


		//...TODO

		break;

		case "piece_getbuckets":

			$col = \App\DB\Get::Collection();
			 $all = $col->pieceBuckets->find(array("owner" => $_SESSION["charme_userid"]), array("piecedata", "bucketaes", "key"));

			 $cursor = iterator_to_array($all, false);

			$returnArray[$action] = array("items" => $cursor);

		break;

		case "piece_request_single" :

			$col = \App\DB\Get::Collection();
			 $cursor =  $col->pieces->findOne(array(
				"owner" => $_SESSION["charme_userid"],
				"key" => $item["key"]),array("value"));
			$returnArray[$action] = array("value" => $cursor["value"]);

		break;
		case "piece_request_findbucket":

			// TODO: Add bucketcontent here!

			$col = \App\DB\Get::Collection();


			$content = array();

			//
			$content = $col->pieceBuckets->findOne(array("key" =>  $item["key"],  "itemcount" => array('$lt' => 10), "owner" => $_SESSION["charme_userid"]), array("_id", "bucketaes"));

			if ($content == null) // New bucket
			{
				clog("NEW BUCKET BECAUSE CONTENT IS NULL");
				$content = array("owner" => $_SESSION["charme_userid"],
					"key" => $item["key"],
					"itemcount" => 0,
					"version" => 0,
					"bucketaes" => $item["bucketaes"]);
			// Create bucket
				$col->pieceBuckets->insert($content);
			}


		clog("BUCKET ID IS ".$content["_id"]->__toString()." aes is".$content["bucketaes"] );

			// RETURN BUCKET ID and bucket AES

			$returnArray[$action] =
			array("bucketid" => $content["_id"]->__toString(),
				"bucketaes" => $content["bucketaes"]

				);



		break;

		case "piece_request":

			// Save request on own server

			// Send request to external server

			$data = array("requests" => array(array(

			"id" => "piece_request_receive",
			"userId" => $item["userId"],
			"invader" => $_SESSION["charme_userid"],
			"key" => $item["key"],


			)));

			$req21 = new \App\Requests\JSON(
			$item["userId"],
			$_SESSION["charme_userid"],
			$data);

			$arr = $req21->send();

		break;



		// returns encrypted piece storage data
		// This is triggered if you request some one elses
		// profile information
		case "piece_get4profile":

			// When decryption error apepars: was chace deleted?
			$col = \App\DB\Get::Collection();

			/*
				1. Look into pieceBucket to get enrypted piece
				2. Look into pieceBucketItems to get public key encrypted AES Key to decrypt piece
			*/
			//



			// 1. get bucketitems for this user

			$bucketIDlist = array();
			$rsaList = array();

			$bucketids = $col->pieceBucketItems->find(array("owner" => $item["userId"], "userid" => $item["invader"]));

			foreach ($bucketids as $citem)
			{
				$bucketIDlist[] = new MongoId($citem["bucket"]);
				$rsaList[$citem["bucket"]] = $citem["bucketkey"];
			}

			$finallist = array();
			$keylist = array();

			// find the right buckets
			$bucketCol = $col->pieceBuckets->find(array( '_id' => array('$in' => $bucketIDlist)));

			foreach ($bucketCol as $citem)
			{
				$keylist[] = $citem["key"];

				$finallist[] =
				array(
					"bucketrsa" => $rsaList[$citem["_id"]->__toString()],
					"bucketaes" => $citem["bucketaes"] ,
					"piecedata" => $citem["piecedata"] ,
					"version"=> $citem["version"] ,
					"key" => $citem["key"]
					);
			}



			// Find requests
			$cursor = ($col->pieceRequests->find(array("userId"=> $item["userId"],
				"invader" => $item["invader"]

				), array('key')));

			foreach ($cursor as $citem)
			{

				if (!in_array($citem["key"], $keylist))
				{
					// Remeber key
				$keylist[] = $citem["key"];


					$finallist[] = array("key" => $citem["key"], "requested" => 1);
				}
			}




			// Find all pieces
			$cursor = ($col->pieces->find(array("owner"=> $item["userId"]), array('key', 'value')));

			foreach ($cursor as $citem)
			{
				if (!in_array($citem["key"], $keylist))
				{

					// Return with empty=true if no value specified
					if ($citem["value"] == "")
						$finallist[] = array("key" => $citem["key"], "empty" => true);
					else
					$finallist[] = array("key" => $citem["key"]);
				}
			}

			// Add if not in final list

			$returnArray[$action] = array("items" => $finallist);



		break;



		case "privateinfo_getall":
			$returnArray[$action] = array();
			break;




		case "key_getAllFromDir":

	$col = \App\DB\Get::Collection();



			$cursor = $col->keydirectory->find(array("owner"=> $_SESSION["charme_userid"]), array('_id','key','value', 'fkrevision'));



			$returnArray[$action] = array("value" => iterator_to_array($cursor, false));
		break;

		case "key_getMultipleFromDir":
			// This query returns multiple keys from a keydirectory

			// keydirectory contains fastkey1 encrypted public keys in form key [ n, e], userId, revision
			$col = \App\DB\Get::Collection();



			$cursor = $col->keydirectory->find(array("owner"=> $_SESSION["charme_userid"], "key.obj.publicKeyUserId" => array('$in' => $item["users"])));



			$returnArray[$action] = array("value" => iterator_to_array($cursor, false));




		break;

		case "key_getFromDir":

			// keydirectory contains fastkey1 encrypted public keys in form key [ n, e], userId, revision
			$col = \App\DB\Get::Collection();
			$cursor = $col->keydirectory->findOne(array("owner"=> $_SESSION["charme_userid"], "key.obj.publicKeyUserId" => $item["userId"]));
			$returnArray[$action] = array("key" => $cursor["key"]);

		break;

		// Returns edgekeys by userId
		case "edgekeys_byUserIds" :
			$item["userIdList"] = array_unique($item["userIdList"]);
			$col = \App\DB\Get::Collection();
			$returnArray = iterator_to_array($col->keydirectory->find(array("owner" => $_SESSION["charme_userid"], 'newest' => true, 'key.obj.publicKeyUserId' => array('$in' => $item["userIdList"]))), false);
			if (Count($item["userIdList"]) != Count($returnArray)) // Some keys were not found, array_uniqu removes duplicates in array
			{
				$diffarray = []; // Contains the userIds where a key was found
				foreach ($returnArray as $key) {
				$diffarray[] = $key["key"]["obj"]["publicKeyUserId"];

				}
				$returnArray[$action] = array("status" => "KEYS_NOT_FOUND", "users" => array_diff($item["userIdList"], $diffarray));
			}
			else // Everything is right
			{
				$returnArray[$action] = array("value" => $returnArray);
			}
		break;

		case "edgekeys_bylist" :


			$col = \App\DB\Get::Collection();



			$ar = iterator_to_array($col->listitems->find(array("list" => new MongoId($item["listId"]), "owner" => $_SESSION["charme_userid"])), false);
			$finalList = array();

		  	foreach ($ar  as $ritem)
		  	{
		  	 	if ($ritem["userId"] != "" &&
		  	 		isset($ritem["userId"]))
		  	 	$finalList[] = $ritem["userId"];
		  	}

		  	if (isset($item["addSessionUser"]) && $item["addSessionUser"] = true)
				$finalList[] =  $_SESSION["charme_userid"];



		  	$retList = $col->keydirectory->find(array("owner" => $_SESSION["charme_userid"],  'key.obj.publicKeyUserId' => array('$in' => $finalList), "newest" => true));



				$returnArray[$action] = array("test" => 1, "value" => iterator_to_array($retList  , false));



			// Make list of userIds, which are later requested from the key directory

		break;

		case "key_storeInDir":

			$col = \App\DB\Get::Collection();

			// Store key hash value in signature keydirectory which is used to verify signatures and contains all revisions
		/*	$cursor = $col->keydirectory_signatures->update(
				array("owner" => $_SESSION["charme_userid"],
					"key" => $item["key"]),

				// fkrevision: revision of my fastkey1, keyrevision: revision of public key stored in directory
				array("fkrevision" => $item["fkrevision"], "keyhash" => $item["keyhash"], "keyhash_revision" =>  $item["pubKeyRevision"])

				, array("upsert" => true));
*/
			// Store key in owner Directory which is used to get thew public key when writing a message
			if ($col->keydirectory->count(array("owner" => $_SESSION["charme_userid"],
			 "key.obj.publicKeyUserId" => $item["key"]["obj"]["publicKeyUserId"],"key.obj.revisionSum" => $item["key"]["obj"]["revisionSum"] )) == 0) {


			$col->keydirectory->update(array("owner" => $_SESSION["charme_userid"],
			 "key.obj.publicKeyUserId" => $item["key"]["obj"]["publicKeyUserId"]),
			 array('$set' => array("newest" => false)), array("multiple" => true));

			$cursor = $col->keydirectory->update(

			array("owner" => $_SESSION["charme_userid"],
					"key.obj.revisionSum" => $item["key"]["obj"]["revisionSum"],
 "key.obj.publicKeyUserId" => $item["key"]["obj"]["publicKeyUserId"])
				, array(
					"owner" => $_SESSION["charme_userid"],
					"key" => $item["key"],
					"newest" => true
					), array("upsert" => true));

			$returnArray[$action] = array("status" => "OK");
		}
		else {
				$returnArray[$action] = array("status" => "OK", "noUpdate"=> true);
		}


		break;


			case "key_getAll":



					$col = \App\DB\Get::Collection();
			$cursor = iterator_to_array($col->keydirectory->find(array("owner"=> $_SESSION["charme_userid"]), array('key')), false);



			$returnArray[$action] = array("items" => $cursor);




			break;



			// CORS is enabled here
			case "key_get":

				// Return public key and revision
				$col = \App\DB\Get::Collection();

				if (isset($item["pem"]) && $item["pem"] == true)
				{
					$cursor = $col->localkeydirectory->findOne(array("userid"=> ($item["profileId"]), "revision" => $item["revision"]) ,
					 array('pemkey', "revision"));

					$returnArray[$action] = $cursor;
				}
				else
				{
					$cursor = $col->users->findOne(array("userid"=> ($item["profileId"])), array('publickey'));
					$returnArray[$action] = $cursor["publickey"];
				}


			break;

			// Unused at the moment:
			case "key_getPrivateKeyring":

				$col = \App\DB\Get::Collection();
			$cursor = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"])), array('userid', "keyring"));

				$returnArray[$action] =   (array("keyring"=>$cursor["keyring"]));




			break;
		// Returns encrypted private key for correct password
		case "key_update_phase1":

			$p2 =$item["password"];


			$col = \App\DB\Get::Collection();
			$cursor = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"]), "password"=>$p2), array('userid', "keyring"));

			if (isset($cursor["userid"]))
			{
				if (isset($cursor["keyring"]))
				$returnArray[$action] =   (array("keyring"=>$cursor["keyring"]));
				else
				$returnArray[$action] =  array("keyring" => "");
			}
			else
					$returnArray[$action] =  array("error" => true);

		break;

		case "key_update_recrypt_setData" :
			$col = \App\DB\Get::Collection();

			foreach ($item["recryptedData"] as $key => $value) {

				if ($key == "messageKeys")
				{
					foreach ($value as $key2 => $value2) {


						// got from JSON: id, aesEnc, revision
						$col->messageKeys->update(
						array("owner" => $_SESSION["charme_userid"], "_id" => new MongoId($value2["id"])),	array('$set' => array("key.rsaEncEdgekey" =>  $value2["rsaEncEdgekey"]	, "key.revisionB" => $value2["revisionB"]))

						);

					}
				}
				else if ($key == "keydirectory")
				{
					foreach ($value as $key2 => $value2) {

						// id,revision,value

						$col->keydirectory->update(array("owner" => $_SESSION["charme_userid"], "_id" => new MongoId($value2["id"])),	array('$set' => array("key" => $value2["key"])));

					}
				}
				else if ($key == "pieces")
				{
					foreach ($value as $key2 => $value2) {

						// Update here....
						$col->pieces->update(array("owner" => $_SESSION["charme_userid"], "_id" => new MongoId($value2["id"])),	array('$set' => array("value" => $value2["value"])));


					}
				}
				else if ($key == "pieceBuckets")
				{
					foreach ($value as $key2 => $value2) {

						// got from json: bucketkeyData,id,revision
						$col->pieceBuckets->update(array("owner" => $_SESSION["charme_userid"], "_id" => new MongoId($value2["id"])),	array('$set' => array("bucketaes" => $value2["bucketaes"])));

					}
				}


				else if ($key == "pieceBucketItems")
				{
					foreach ($value as $key2 => $value2) {

						// got from json: bucketkeyData,id,revision
						$col->pieceBucketItems->update(array("owner" => $_SESSION["charme_userid"], "_id" => new MongoId($value2["id"])),	array('$set' => array("bucketkey" => array("data" => $value2["bucketkeyData"], "revision" => $value2["revision"]))));

					}
				}

			}
			$returnArray[$action] =  array("SUCCESS" => true);

		break;


		case "key_update_recrypt_getData" :

		$col = \App\DB\Get::Collection();
			$data = array();

			// Return collection,  id, data for each encrypted information item

			// See concepts/NewKeypair.md for details!

			// recrypt piecebuckets.bucketaes, piecebuckets.version -> Collection contains OTHER PEOPLES DATA ENCRYPTED FOR ME
			$all = $col->pieceBucketItems->find(array("owner" => $_SESSION["charme_userid"]), array("bucketkey", "_id"));
			$cursor = iterator_to_array($all, false);
			$data["pieceBucketItems"] = $cursor;

			$all = $col->pieceBuckets->find(array("owner" => $_SESSION["charme_userid"]), array("bucketaes", "_id"));
			$cursor = iterator_to_array($all, false);
			$data["pieceBuckets"] = $cursor;


			$cursor = iterator_to_array($col->pieces->find(array("owner"=> $_SESSION["charme_userid"]), array('value', 'key', "_id")), false);
			$data["pieces"] = $cursor;

			$cursor = iterator_to_array($col->messageKeys->find(array("owner"=> $_SESSION["charme_userid"]), array('key', "_id", "revision", "owner")), false);
			$data["messageKeys"] = $cursor; // recrypt rsaEncEdgekey with new private rsa key!!!


			$cursor = iterator_to_array($col->keydirectory->find(array("owner"=> $_SESSION["charme_userid"]), array("key", "_id")), false);
			$data["keydirectory"] = $cursor;



			$returnArray[$action] =  array("SUCCESS" => true, "data" => $data);

		break;


		case "key_update_phase2":
			$p2 = $item["password"];

			$col = \App\DB\Get::Collection();
			$cursor = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"]), "password"=>$p2), array('userid', "keyring"));

			// Store key in local key directory for users hosted on this server
			$col->localkeydirectory->insert(array("userid" => $_SESSION["charme_userid"], "publicKey" => $item["publickey"], "revision" => $item["publickey"]["revision"], "pemkey" => $item["pemkey"]));

			//TODO Notify other people (collection followers / subscribers) about key update here.


			// 1. Get my collections...
			$collectionList = $col->collections->find(array("owner" =>$_SESSION["charme_userid"]));
			 foreach ($collectionList  as $collection)
			 {

			 	// 2. Get my followers:
			 	$followerList = $col->followers->find(array("collectionId" =>$collection["_id"]));
				 foreach ($followerList  as $follower)
				 {
				 	// 2. Get my followers:
				 	// notify owner........
					$data=  array("requests" =>

							array(
								array("id" => "key_update_notification",
							"keyOwner" => $_SESSION["charme_userid"],
							"username" => "USERNAME",
							"notifiedUser" =>$follower["follower"]))

						);

					$req21 = new \App\Requests\JSON(
					$follower["follower"],  // receiver
					$_SESSION["charme_userid"], // sender

					$data);

					$req21->send();

				 }
			 }


			if (isset($cursor["userid"]))
			{
				$col->users->update(array("userid" => $_SESSION["charme_userid"]),	array('$set' => array("keyring" => $item["newkeyring"], "publickey" => $item["publickey"])));
			}

		break;

		case "key_update_notification":

					// Add following notificaiton
			$notifyItem = array("type" => \App\Counter\Notify::notifyNewKey,
				"name" => $item["username"], "keyOwner" => $item["keyOwner"]);
			//\App\Counter\Notify::addNotification(array());
			\App\Counter\Notify::addNotification($item["notifiedUser"], $notifyItem);



		break;

		case "updates_get":
			$returnArray[$action] = \App\Counter\CounterUpdate::get( $_SESSION["charme_userid"], array("talks", "stream", "notify"));
		break;


		case "comments_get" :



			$col = \App\DB\Get::Collection();

		/*	if ($item["start"] == "-1" || !isset($item["start"]) )
			{
				// Get count of items < timestamp.
				$count = $col->comments->count(array('itemTime' => array('$lt' =>  new MongoDate($item["itemStartTime"] )), "commentData.object.postId" => (string)$item["postId"], "postowner" => $item["postowner"]) );

				$returnArray[$action]["start"] = $count-6; // Return start position
				$item["start"] = $count-3;
			}*/


			if ($item["start"] < 0)
				$item["start"] = 0;


			if ($item["limit"] > 0)
				$limit = $item["limit"];
			else
				$limit = 3;

			$returnArray[$action]["comments"] = array_reverse (iterator_to_array(
			$col->comments->find(
				array("commentData.object.postId" => $item["postId"], "commentData.object.postOwner" => $item["postowner"]) )->sort(array('itemTime' => 1))
			->skip($item["start"])
			->limit($limit), false));
		break;

		case "stream_get":
			\App\Counter\CounterUpdate::set( $_SESSION["charme_userid"], "stream", 0);

			if (!isset($item["filter"]))
				$item["filter"] = array();
			$streamItems = array();
			$col = \App\DB\Get::Collection();
			$serverArray = array();
			$useList = false;

			//
			// 2. local queries for encrypted posts
			//

			if (isset($item["filter"]))
				$additionalConstraints = \App\Filter\Generator::getConstraints($item["filter"], $col);
			else {
				$additionalConstraints = array();

			}
			$postIds = []; // Contains all the postIds to avoid duplicates later returned from other servers



			//
			// 3. remote queries for unencrypted posts
			//
			$serverList = \App\Filter\Generator::getServerList($item["filter"], $col);

			//
			// Build payload for multiserver request
			//
			$item2 = $item;
			$item2["id"] = "stream_respond";
			$item2["searcher"] = $_SESSION["charme_userid"];
			$item2["requestServer"] = $_SERVER['SERVER_NAME'];

			$showCollectionPostsOnly = false;
			if (Count($additionalConstraints) == 0)
				$showCollectionPostsOnly = true;

			if (isset($item["filter"])  && isset($item["filter"]["lists"])) {
				  $people = array();

					foreach ($item["filter"]["lists"] as $list) {
						$selector = 	$col->listitems->find(array("list" => new MongoId($list), "owner" => $_SESSION["charme_userid"])); // TODO: use $in instead for better performance
						foreach ($selector as $person) {
							$people[] = $person["userId"];
						}
					}
					// Get people in list
			}

			// Assume we do not use a collection filter (aka Return only results of subscribed collections)
			// TODO: We do not use a collection filter when filtering for context items (Move, Sell, Review etc.)
			// as these are not belonging to a collections

			$useCollectionFilter = false;
			$item2["collectionFilter"] = 	$useCollectionFilter; // Pass this also to server


			if (isset($item["filter"])  && isset($item["filter"]["lists"])) {
				$item2["people"] = $people; // TODO: filter out so that only people on the server are requested
				clog("People filter is on");
			}

			$data = array("requests" => array($item2));

			$fields = (array(
					"d" => urlencode(json_encode(	$data))))
			;

			$fields_string ="";
			foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
			rtrim($fields_string, '&');


			// Close sesion to avoid curl deadlock when queriing own server!
			// DO NOT PERFORM ANY REQUEST THAT NEED SESSION AFTER a search request!!!
			session_write_close();

			//
			// Build curl requests
			//
			$mh = curl_multi_init(); // Init the curl module for HTTP Requests
			$ch = array();
		//	clog2($serverList);
		//	for ($i = 0; $i<Count($serverList); $i++) {
			foreach ($serverList as $i => $server) {

				$ch[$i] = curl_init();
				if ($server != "") {
					curl_setopt($ch[$i] , CURLOPT_URL, "http://".$server."/charme/req.php");
					curl_setopt($ch[$i], CURLOPT_POST, count($fields));
					curl_setopt($ch[$i], CURLOPT_POSTFIELDS, $fields_string);
					curl_setopt($ch[$i], CURLOPT_RETURNTRANSFER , TRUE );
					curl_setopt($ch[$i], CURLOPT_TIMEOUT, 12); // 2 seconds timeout, servers have to respond fast!


				//	can be used for debugging:
/*
					$result = curl_exec($ch[$i]);

					if(curl_errno($ch[$i]))
					{
						clog("ERROR".curl_error($ch[$i]));
					}
					else {

						clog("RESULT".$result);
					}*/


					curl_multi_add_handle($mh,$ch[$i]);

				}
			}



		//	$streamItems = array(); // TODO: REMOVE!! THIS IS TO DEBUG WITHOUT LOCAL ENTRIES!
		//	$postIds = array(); // TODO: REMOVE!! THIS IS TO DEBUG WITHOUT LOCAL ENTRIES!

		if (!$showCollectionPostsOnly) {
				$active = null;
				do {
				   curl_multi_exec($mh, $active);

				} while ($active > 0);
				$results = array();

				 foreach ($ch as $key => $val) {
					$content = curl_multi_getcontent($val);

					//clog(curl_errno($ch[3]));
				//	clog(	curl_eror($key, CURLINFO_EFFECTIVE_URL));

					//clog("content".$content);
					if ($content != "") {
				        $json = json_decode($content, true);
								foreach ($json["stream_respond"] as $item3) {

									clog("got respond|".$_SESSION["charme_userid"]);

									if (!in_array($item3["postId"], $postIds)) {

										$streamItems[] = $item3;
										$item3["owner"] = $_SESSION["charme_userid"];
										unset( $item3["_id"]); // Post Id must be mongoID! TODO: what does this comment mean???

										if ($col->streamitems->count(array("postId" => $item3["postId"],
													"post.author" =>  $item3["post"]["author"],
														"owner" => $_SESSION["charme_userid"]
												)) <= 0) // Needed as sometimes upsert is not wokrign and deletes archived=true is newly inserted
												{

												foreach ($item3["comments"] as $commentItem) {

													$col->streamcomments->update(
												array	("commentId" => $commentItem["commentId"])
												, $commentItem, array("upsert" => true));
												}
												unset($item3["comments"]); // Dont save comments as sub collection!

												$resultCode = $col->streamitems->update(
													array("postId" => $item3["postId"],
																"post.author" =>  $item3["post"]["author"],
																"owner" => $_SESSION["charme_userid"]
																)
												, $item3, array("upsert" => true)); // TODO: Check PEM Key


												$postIds[] = $item3["postId"];
												}
									}
								}
				        curl_multi_remove_handle($mh, $val);
							}
				}
		}


		if (isset($item["filter"])  && isset($item["filter"]["lists"])) {
			$additionalConstraints["post.author"] = array('$in' => $people);
		}

		//clog2($additionalConstraints, "add contraints");
			$iter = $col->streamitems->find(array_merge(array("owner" => $_SESSION["charme_userid"]), $additionalConstraints))->sort(array('meta.time.sec' => -1))->skip($item["streamOffset"])->limit(10); // ->slice(-15)
			$streamItems=  iterator_to_array($iter , false);

			// Append last 3 comments for each item.
			foreach ($streamItems  as $key => $item2)
			{
				clog("iterate 1");
				// Save postIds to avoid duplicates provides from other servers later on...
				$postIds[] = $item2["postId"];

				// Get comments herer...
				$count = $col->streamcomments->count(
				array(
					"commentData.object.postId" =>	$item2["postId"],
					"commentData.object.postOwner" => $item2["post"]["author"])
				);

				$streamItems[$key ]["commentCount"] = $count ;
				$numberOfComments = 3;


				if (!isset($item["start"]))
					$startIndex = $count - $numberOfComments;
				else
					$startIndex = $item["start"];

				if ($startIndex<0)
					$startIndex = 0;

				if (!isset($streamItems[$key ]["likecount"]))
					$streamItems[$key ]["likecount"] = 0;



				$streamItems[$key ]["comments"] =
				iterator_to_array($col->streamcomments->find(
				array(
					"commentData.object.postId" =>	$item2["postId"],
					 "commentData.object.postOwner" =>  $item2["post"]["author"])

					 )->skip($startIndex)->limit($numberOfComments), false);


		}
			curl_multi_close($mh);

			$returnArray[$action] = $streamItems;

		break;

		// Needs parameters streamOffset,
		case "stream_respond" :

			$col = \App\DB\Get::Collection();

			//
			// 1. Get search parameters
			//
			$additionalConstraints = \App\Filter\Generator::getConstraints($item["filter"], $col, true);

			$showCollectionPostsOnly = false;
			if (Count($additionalConstraints) == 0)
				$showCollectionPostsOnly = true;


			//
			// TODO:
			// 2. Limit owners (with people passed from list in stream_get)
			// if a list filter was active in stream_get
			//


			if (isset($item["people"])) {
				$additionalConstraints["postData.object.author"] = array('$in' => $item["people"]);
			}

			//
			// $item["searcher"] refers to the person starting the search request.
			// If the post is a context enabled post, then only return it
			// if searcher is in audience list.
			// TODO: Here we need better approaches to avoid data mining, as searcher can
			// also be modified by the server to obtain all the lmited audience posts
			//
			if (isset($item["people"])) {
				$additionalConstraints["audience"] = $item["searcher"];
			}

			//
			// 3. Find
			//
			// TODO: Skip must work better on multiserver requests. For example if one server does not repsond, we miss items etc.
			$iter = $col->posts->find(
				array_merge
				(
						array(
							'postData.object.isEncrypted' => array('$ne' => 1),
							"postData.object.metaData" => array('$exists' => true) // Only return posts with context
						),
						$additionalConstraints
				)
			)
			->sort(array('time.sec' => -1))->skip($item["streamOffset"])->limit(10); // ->slice(-15)
			$streamItems= [];

			$postIds = array();

			foreach ($iter as $postItem) {
				$postIds [] =   $postItem["_id"]->__toString();
			}


			$iterLikes = $col->likes->find(array('postId' => array('$in' => $postIds), "liker"=> $item["searcher"]));
			$likes = array();
			foreach ($iterLikes as $like)
			{
				$likes[$like["postId"]] = true;
			}

			foreach ($iter as $postItem) {

				 $col->streamSubscribers->update(
					array("postId" => $postItem["_id"]->__toString(),
								"server" =>  $item["requestServer"]
								)
				, 	array("postId" => $postItem["_id"]->__toString(),
								"server" =>  $item["requestServer"],
								"date" => new MongoDate() // TODO: Should expire after 3 days!!!!! Also returned stream comments must expire on host server!
								), array("upsert" => true));


				// Convert postItem to streamItem!
				$postItem  = \App\Collections\Comments::Makestream(
				$postItem, // ID
				$col, // Collection
				isset($likes[$postItem["_id"]->__toString()]) ? true : false, // Like yes or No
				\App\Collections\Comments::Get($postItem["_id"]->__toString(), $col, $showCollectionPostsOnly)); // Comment

				$streamItems[] = $postItem;

			}

			// Set likes





			// TODO: Append post comments!!

			/*
			foreach ($streamItems  as $key => $item2)
			{
				$count = $col->streamcomments->count(array("commentData.object.postId" => (string)$item2["postId"], "postowner" => $item2["post"]["author"]) );
				$streamItems[$key ]["commentCount"] = $count ;
				$numberOfComments = 3;

				if (!isset($item["start"]))
					$startIndex = $count - $numberOfComments;
				else
					$startIndex = $item["start"];

				if ($startIndex<0)
					$startIndex = 0;

				if (!isset($streamItems[$key ]["likecount"]))
					$streamItems[$key ]["likecount"] = 0;

				$streamItems[$key ]["comments"] =
				iterator_to_array($col->streamcomments->find(array("commentData.object.postId" => (string)$item2["postId"], "postowner" => $item2["post"]["author"]) )->skip($startIndex)->limit($numberOfComments), false);
			}
			*/

			$returnArray[$action] = $streamItems;


		break;

		case "edgekey_request" :

			// TODO: check access here.

			$col = \App\DB\Get::Collection();
			$query = array("owner" => $item["publicKeyOwner"], "key.obj.publicKeyUserId" => $item["privateKeyOwner"]);

			if ($item["revision"] != 0)
				$query["key.obj.revisionSum"] = $item["revision"];

			$result = $col->keydirectory->find($query)->sort(array("key.obj.revisionSum" => -1))->limit(1);
			foreach ($result as $resItem)
			{
				$returnArray[$action] = array("data" => $resItem);
			}


		break;

		case "edgekey_recrypt_setData" :
			// We need postId and userId to set a new postkey here.

			$col = \App\DB\Get::Collection();
			foreach ($item["newPostKeys"] as $item)
			{

				$col->postkeys->update(array("postOwner" => $_SESSION["charme_userid"], "postId" => $item["postId"]),	array('$set' => array("postKey" => $item["postKeyEnc"])));

			}
			$returnArray[$action] =  array("SUCCESS" => true);

		break;
		case "edgekey_recrypt_getData" :
			// Return postkeys and messages for recryption here
			$data = array();
			$postIds = array();
			// recrypt piecebuckets.bucketaes, piecebuckets.version -> Collection contains OTHER PEOPLES DATA ENCRYPTED FOR ME


			$col = \App\DB\Get::Collection();

			$all = $col->postkeys->find(array("postOwner" => $_SESSION["charme_userid"], "userId" => $item["userId"]), array("edgekeyRevision", "_id", "postId"));
			foreach ($all as $key => $value) {
				$postIds[] = $value["postId"];

			}

			$query = $col->posts->find(array("_id" =>  array('$in' => $postIds)), array("_id", "fkEncPostKey", "postData.signature.keyRevision"));
			//$bucketCol = $col->gcmclients->find(array( 'owner' => array('$in' => $gcmpeople)));

			$cursor = iterator_to_array($query, false);

			$data["postKeys"] = $cursor;
			// Get the postkeys encrypted for the postowner

			$returnArray[$action] =  array("SUCCESS" => true, "data" => $data);

		break;
		/*
			Register a
		*/
		case "register_collection_post":

			//clog("COLLECTION ITEM!");
			//clog2($item);
			// TODO: check if user is subscribed to collection! (NEEDED FOR SPAM PROTECTION!)
			$col = \App\DB\Get::Collection();
			/*
				Requst JSON Structure:

				follower
				collectionId
				postData
						object
							content: The post text
							collectionId: The collectionId in which the post was posted in
							repost: The repost text
							imgdata: image Data in Base64 if image exists
					signature
				postId
				postKey
				edgekeyRevision
			*/

			// Check Signature Here!!

			// IMPORTANT: $content must match with collection follow sub requests (3newest etc.)

			// Get the public key of the post author to check signature
			$pemkey = \App\Security\PublicKeys::tryToGet($item["postData"]["object"]["author"],$item["postData"]["signature"]["keyRevision"]);

			$receiverPublicKeyRevision = $col->users->findOne(array("userid"=> ($item["follower"])), array('publickey.revision'));


			if ($item["revisionB"] < $receiverPublicKeyRevision["publickey"]["revision"] && $item["postData"]["object"]["isEncrypted"] == 1)
			{
				clog("IS ENCRYPTED");
				// Key is not valid anymore :(
				$data=  array("requests" =>

							array(
								array("id" => "key_update_notification",
							"keyOwner" => $_SESSION["charme_userid"],
							"username" => "USERNAME",
							"notifiedUser" =>$item["follower"]))

						);

				$req21 = new \App\Requests\JSON(
				$item["follower"],  // receiver
				$item["postData"]["object"]['author'], // sender

				$data);

				$req21->send();

			}
			else if ($pemkey != false)
			{
				$ok = \App\Security\PublicKeys::checkX509($item["postData"], $pemkey);

				if ($ok)
				{
					clog("INSERT STREAMITEM");
					$content = array("post" => $item["postData"]["object"], "postId" => $item["postId"], "owner"  => $item["follower"], "meta"  => $item["meta"], "like" => false, "likecount" => 0 );
					if (isset($item["postKey"]))
					{
						$content["postKey"] = $item["postKey"];
						$content["edgeKeyRevision"] = $item["edgeKeyRevision"];
					}
					$col->streamitems->insert($content);

					\App\Counter\CounterUpdate::inc($item["follower"], "stream");
				}
				else
				{
					clog("[ERROR] Signature fail for post id: : ".$item["postId"]);
				}

			}
			else
			{
				clog("[ERROR] Pem Key not found for user ".$item["postData"]["object"]["author"]. " with revision ".$item["postData"]["signature"]["keyRevision"]);

			}





			//collection_post
		break;


		case "collection_post" :

				// Convert keys to indexed array
				$keys = array();
				$revisions = array();
				$edgeKeyRevisions = array();

				foreach ($item["keys"] as $key)
				{
					$keys[$key["userId"]] = $key["key"];
					$revisions[$key["userId"]] = $key["revisionB"];
					$edgeKeyRevisions[$key["userId"]] = $key["edgeKeyRevision"];
				}

				$hasImage = false;
				// if repost -> append repost
				if (isset($item["imgdata"]) && $item["imgdata"] != null)
					$hasImage = true;

				$col = \App\DB\Get::Collection();
				$cursor2 = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"])), array("firstname", "lastname"));
				$username = $cursor2["firstname"]." ".$cursor2["lastname"];

				$content = array("username"=> $username, "fkEncPostKey" => $item["fkEncPostKey"], "time"=> new MongoDate(), "likecount" => 0, "collectionId" => $item["postData"]["object"]["collectionId"], "postData"  => $item["postData"], "owner"  => $_SESSION["charme_userid"], "hasImage" => $hasImage);

				// For context items we can limit the audience
				if (isset($item["postData"]["object"]["metaData"]) &&
				isset($item["postData"]["object"]["metaData"]["audienceListId"])) {
					$mongoIdlistItems = array();
					foreach ($item["postData"]["object"]["metaData"]["audienceListId"] as $listitem) {
						$mongoIdlistItems[] = new MongoId( $listitem);
						clog("list id" . $listitem);
					}


				$peopleIterator = $col->listitems->find(array("owner" => $_SESSION["charme_userid"], "list" => array('$in' => $mongoIdlistItems)));
				$peopleArray = array();
				foreach ($peopleIterator as $itItem)
			  	$peopleArray[] = $itItem["userId"];
			  	$content["audience"] = $peopleArray;
				}
				$res = $col->posts->insert($content);

				if ($hasImage)
				{
					// Insert post image
					include_once("3rdparty/wideimage/WideImage.php");

					$col = \App\DB\Get::Collection();
					$grid = $col->getGridFS();
					$grid->storeBytes($item["imgthumbdata"], array('type'=>"postimage",'owner' => $_SESSION["charme_userid"], 'size' => 250, "post" => new MongoId($content["_id"])));
					$grid->storeBytes($item["imgdata"], array('type'=>"postimage",'owner' => $_SESSION["charme_userid"], 'size' => 800, "post" => new MongoId($content["_id"])));
				}

				if (isset($item["postData"]["object"]["collectionId"])) {

					$res2 = $col->followers->find(array("collectionId" => new MongoId($item["postData"]["object"]["collectionId"]) ));

	 				clog("33333 colid:".$item["postData"]["object"]["collectionId"]);

					foreach ($item["keys"] as $userkey)
					{



						// Insert Keys into db.
						$col->postkeys->insert(array(
							"postId" => $content["_id"]->__toString(),
							"postKey" => $keys[$userkey["userId"]],
							"userId" => $userkey["userId"],
							"postOwner" => $_SESSION["charme_userid"],
							"revisionB" => $revisions[$userkey["userId"]],
							"edgeKeyRevision" => $edgeKeyRevisions[$userkey["userId"]]
						));
					}

			}
			else {
				$res2 = array(
					array(
						"follower" => $_SESSION["charme_userid"] // When using context post, send to my stream!!
					)
				);

				// Add to my own servers stream...
				$col->streamSubscribers->update(
				array("postId" => $content["_id"]->__toString(),
							"server" => $_SERVER['SERVER_NAME']
							)
			, 	array("postId" => $content["_id"]->__toString(),
							"server" => $_SERVER['SERVER_NAME'],
							"date" => new MongoDate() // TODO: Should expire after 3 days!!!!! Also returned stream comments must expire on host server!
							), array("upsert" => true));

			}


					foreach ($res2 as $resItem)
					{

						/*clog("REVISION ARE");
		clog("FOLLOWER IS ".$revisions[$resItem["follower"]]);*/
						//if (isset($revisions[$resItem["follower"]]))
						{
								$dataArray = array(
								"id" => "register_collection_post",
								"follower" => $resItem["follower"],
								"postData" => $item["postData"],
								"meta" => array("hasImage" => $hasImage,
								"time" => new MongoDate(), "username" => $username),
								"postId" => $content["_id"]->__toString(), // Must not be a MongoID type!
								"revisionB" => $revisions[$resItem["follower"]],
								"edgeKeyRevision" => $edgeKeyRevisions[$resItem["follower"]]
								);

								// Send decryption key if post is encrypted
								if ($item["postData"]["object"]["isEncrypted"])
								{
									$dataArray["postKey"] = $keys[$resItem["follower"]];
								}
								$data = array("requests" => array($dataArray));
								$req21 = new \App\Requests\JSON(
								$resItem["follower"],
								$_SESSION["charme_userid"],
								$data

								);
								$req21->send();
						}

			}
			$returnArray[$action] = array("SUCCESS" => true, "id" => $content["_id"]->__toString(), "hasImage" => $hasImage);

		break;





		case "collection_getAll" :
			$col = \App\DB\Get::Collection();
			$returnArray[$action] = iterator_to_array($col->collections->find(array("owner" => $item["userId"])), false);

		break;

		case "collection_editPrepare":
			$col = \App\DB\Get::Collection();
			if ($item["collectionId"] == 0)
			{
				$returnArray[$action] =array( "lists" =>
				iterator_to_array($col->lists->find(array("owner" => $_SESSION["charme_userid"])), false))
			;
			}
			else
			{
				$result2 = $col->collections->findOne(array("_id" => new MongoId($item["collectionId"])), array("name", "description", "currentlist"));

				$returnArray[$action] =array("name" => $result2["name"],
				"description" => $result2["description"], "currentlist" => $result2["currentlist"], "lists" =>
				iterator_to_array($col->lists->find(array("owner" => $_SESSION["charme_userid"])), false))
			;
			}
		break;
		case "collection_edit" :
			$col = \App\DB\Get::Collection();
			$content = array(
			  			"owner" => $_SESSION["charme_userid"],
			  			"name" => $item["name"],
			  			"currentlist" => $item["currentlist"],
			  			"description" => $item["description"]
			  			);

			$col->collections->update(array("_id" => new MongoId($item["collectionId"]), "owner" => $_SESSION["charme_userid"]), array('$set' => $content));

			$returnArray[$action] = array("SUCCESS" => true);

		break;


		case "collection_add" :
			$col = \App\DB\Get::Collection();
			$content = array(
			  			"owner" => $_SESSION["charme_userid"],
			  			"name" => $item["name"],
			  			"description" => $item["description"],
			  			"currentlist" => $item["currentlist"]
			  			);

			$col->collections->insert($content);

			// Auto Subscribe to my own collections
			$content3 = array("owner" => $_SESSION["charme_userid"], "collectionOwner" => $_SESSION["charme_userid"], "collectionId" => new MongoId($content["_id"]));
			$col->following->insert($content3);
			$content2 = array("follower" => $_SESSION["charme_userid"],
			 "collectionId" => new MongoId($content["_id"]));
			$col->followers->insert($content2);

			$returnArray[$action] = array("SUCCESS" => true, "id" => $content["_id"]);

		break;

		case "list_getItems":

			$col = \App\DB\Get::Collection();
			$sel = array("owner" => $_SESSION["charme_userid"]);

			if ($item["listId"] != "")
				$sel["list"] = new MongoId($item["listId"]);




			$ar = iterator_to_array($col->listitems->find($sel), true);
			$keys = array();
			$ar2 = array();

			// Filter out duplicates
			foreach ($ar as $key => $value) {

				if (!in_array($value["userId"], $keys))
				{
					$keys[] = $value["userId"];
					$ar2 [] = $value;
				}
			}

			//$col->listitems->ensureIndex('userId', array("unique" => 1, "dropDups" => 1));
			$returnArray[$action] =  array("items" => $ar2, "number" => Count($keys));
			//


		break;

		case "lists_update":

			$col = \App\DB\Get::Collection();

			$newLists=  $item["listIds"];
			$oldLists = array();


			$oldListsTmp=  $col->listitems->find(array("owner" => $_SESSION["charme_userid"], "userId" => $item["userId"]));
			$allLists=  $col->lists->find(array("owner" => $_SESSION["charme_userid"]));




			// Get sender name
			$cursor2 = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"])), array("firstname", "lastname"));
			$sendername = $cursor2["firstname"]." ".$cursor2["lastname"];




			foreach ($oldListsTmp as $item){
			$oldLists[] = $item["list"];
			}

			$notify = false;
			foreach ($allLists as $listitem)
			{
				// First option. Item is not in old list, but in new list -> Add item
				if (in_array($listitem["_id"], $newLists ) && !in_array($listitem["_id"], $oldLists))
			  	{
			  		$col->listitems->insert(array(
			  			"owner" => $_SESSION["charme_userid"],
			  			"userId" => $item["userId"],
			  			"username" => $item["username"],
			  			"list" => new MongoId($listitem["_id"]),
			  			));
			  		$notify = true;





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

			if ($notify)
			{

				// notify owner........
				$data=  array("requests" =>

					array("id" => "list_receive_notify",
					"adder" => $_SESSION["charme_userid"],
					"username" => $sendername,
					"added" => $item["userId"]));

				$req21 = new \App\Requests\JSON(
				$item["userId"],  // receiver
				$_SESSION["charme_userid"], // sender
				$data);

				$req21->send();
			}
			$returnArray[$action] = array("SUCCESS" => true);


		break;


		// Request future posts from this server.
		case "list_receive_notify":

			$notifyItem =
			array("type" => \App\Counter\Notify::notifyListAdded,
				"name" => $item["username"], "owner" => $item["added"],
				"adder" => $item["adder"]


				);
			//\App\Counter\Notify::addNotification(array());
			\App\Counter\Notify::addNotification($item["added"], $notifyItem);



		break;

		// Do not receive future posts from this server.
		case "register_unfollow":

		break;

		// Register follow on server of the person who user follows
		case "register_collection_follow" :
			$col = \App\DB\Get::Collection();

			// TODO Verify server who sent the request

			// Get collection owner
			$res1 = $col->collections->findOne(
				array(
				 "_id" => new MongoId($item["collectionId"])
				), array("owner", "name")
			);

			if ($item["action"] == "follow")
			{

			// Get collection name
			$res1 = $col->collections->findOne(
				array(
				 "_id" => new MongoId($item["collectionId"])
				), array("owner", "name")
			);



				// Add following notificaiton
			$notifyItem =
			array("type" => \App\Counter\Notify::notifyNewCollection,
				"name" => $item["username"], "follower" => $item["follower"],
				"collectionName" => $res1["name"],
				"collectionId" => $item["collectionId"]

				);
			//\App\Counter\Notify::addNotification(array());
			\App\Counter\Notify::addNotification($res1["owner"], $notifyItem);
			}



			$content = array("follower" => $item["follower"],
			 //"collectionOwner" =>  $item["collectionOwner"],
			 "collectionId" => new MongoId($item["collectionId"]));

			if ($item["action"] == "follow")
			{
				// Add follower
				$col->followers->update($content, $content ,  array("upsert" => true));
			}
			else
			{
				$col->followers->remove($content);
				// Delete follower

			}
		break;

		// return the 3 newest collection items. Useful when subscribing to a collection and adding the items to the newsstream.
		case "collection_3newest":



			$col = \App\DB\Get::Collection();

			$items = iterator_to_array($col->posts->find(array("collectionId" => $item["collectionId"]))->sort(array('_id' => -1))->limit(3), false);

			foreach ($items as $key => $value) {

				$postkey =  $col->postkeys->findOne(array('userId' => $item["follower"],  'postId' => $value["_id"]->__toString()));

				$postkey = $postkey["postKey"];



				$count = $col->likes->count(array("commentData.object.postId" => $value["_id"]->__toString(), "liker" => $item["follower"]));


				$items[$key]["postKey"] = $postkey;

				if ($count == 0)
				$items[$key]["liketemp"] = false;
					else
				$items[$key]["liketemp"] = true;

				// also return 3 newest comments:

				$iter = $col->comments->find(array("commentData.object.postId" => $value["_id"]->__toString()))->sort(array('_id' => -1))->limit(3);

				$items[$key]["comments"] =
				array_reverse(
					iterator_to_array($iter, false))
				;

				// IMPORANT TO KEEP ID:
				$items[$key]["_id"] = $value["_id"]->__toString();

			}

			if (Count($items) > 0)
			{
				$cursor = $col->users->findOne(array("userid"=> $items[0]["owner"]), array("firstname", "lastname"));
			}

			$returnArray[$action] = array("items" => $items, "username"=> $cursor["firstname"]." ".$cursor["lastname"]);






		break;

		case "collection_follow" :



			$col = \App\DB\Get::Collection();

			$action = $item["action"];
			$content = array("owner" => $_SESSION["charme_userid"], "collectionOwner" =>  $item["collectionOwner"], "collectionId" => new MongoId($item["collectionId"]));



			if ($action == "follow")
			{


				$col->following->update($content, $content ,  array("upsert" => true));



				$data = array("requests" => array(array(

				"id" => "collection_3newest",
				"collectionId" => ($item["collectionId"]),
				"follower" => $_SESSION["charme_userid"], // used in 3newest

				)));


				$req21 = new \App\Requests\JSON(
				$item["collectionOwner"],
				$_SESSION["charme_userid"],
				$data

				);

				$dataReq = $req21->send();



				$col->streamitems->remove(array("owner" => $_SESSION["charme_userid"], "post.collectionId" => new MongoId($item["collectionId"] ), "post.author" => $item["collectionOwner"]));




				foreach ($dataReq["collection_3newest"]["items"] as $post)
				{
					//clog("ITEM ID".print_r($post, true));


					$like = $post["liketemp"];
					$comments = $post["comments"];

					unset($post["liketemp"]);
					unset($post["comments"]);

					/*
						$content = array("post" => $item["postData"]["object"], "postId" => new MongoId($item["postId"]), "owner"  => $item["follower"], "meta"  => $item["meta"], "like" => false, "likecount" => 0);
					*/

					$ins = array(
						"owner" => $_SESSION["charme_userid"],

						"like" => $like,
						"likecount" => $item["likecount"],
						 "postKey" => $post["postKey"],
						"postId" => $post["_id"], // String no mongoid!
					 	"post" => $post["postData"]["object"],
					 	"meta" => array("hasImage" => $post["hasImage"],"time" => $post["time"], "username" => $post["username"])


						);

					//clog(print_r($comments, true));
					foreach ($comments as $comment)
					{
						unset($comment["id"]);
					$col->streamcomments->update($comment,$comment, array("upsert" => true));
					}

					if (Count( $post) > 0)
					$col->streamitems->insert($ins);


				}




				// Update Stream, add newest items to stream!

			}
			else if ($action == "unfollow")
			{

				$col->following->remove($content);



				$col->streamitems->remove(array("owner" => $_SESSION["charme_userid"], "post.collectionId" => ($item["collectionId"] ), "post.author" => $item["collectionOwner"]));

				// Remove stream items
			}


			// Get sender name
			$cursor2 = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"])), array("firstname", "lastname"));
			$sendername = $cursor2["firstname"]." ".$cursor2["lastname"];



			$data = array("requests" => array(array(

				"id" => "register_collection_follow",
				"collectionId" => ($item["collectionId"]),
				"follower" => $_SESSION["charme_userid"],
				"action" => $action,
				"username" => $sendername
			/*	"localreceivers" => array($receiver),
				"allreceivers" => $res["people"],
				"encMessage" => $item["encMessage"],
				"messagePreview" => $item["messagePreview"],

				"sender" => $_SESSION["charme_userid"],
				"conversationId" => $convId->__toString(),
				//"aesEnc" => $receiver["aesEnc"], known already by receiver
*/

			)));


			$req21 = new \App\Requests\JSON(
				$item["collectionOwner"],
				$_SESSION["charme_userid"],
				$data

				);


				$req21->send();

				$returnArray[$action] = array("STATUS" => "OK");


		break;

		// Get following state from followers server
		case "register_isfollow":
			$col = \App\DB\Get::Collection();
			if ($item["collectionId"] == "context")
			$returnArray[$action] = array("follows" => false);
			else {
			$content = array(
				"owner" => $item["userId"],
				"collectionOwner" =>  $item["collectionOwner"],
				"collectionId" => new MongoId($item["collectionId"]));


			$res = $col->following->findOne($content);
			//$col->findOne();
			if (isset($res) && isset($res["owner"]))
				$returnArray[$action] = array("follows" => true);
			else
				$returnArray[$action] = array("follows" => false);

			// Now also notify the server I follow

			// TODO:return status messages
		}
		break;


		// register a follower by the content provider
		case "register_follow":

		// Write to followers

		break;


		case "list_add_item":

		break;


		// Register an Android device for Google Cloud Messaging (PUSH NOTIFICATIONS)
		case "gcm_register" :
			$col = \App\DB\Get::Collection();
			$content = array("regId" => $item["regId"], "owner" => $_SESSION["charme_userid"], "timestamp" =>  new MongoDate(time()));

			// 1st argument in Update is date to be selected (=SELECT), second argeumnt is new data (=SET), upsert says to replace old data.
			$col->gcmclients->update(array("regId" => $item["regId"], "owner" => $_SESSION["charme_userid"]),$content, array("upsert" => true));
			$returnArray[$action] = array("SUCCESS" => true);
		break;


		case "lists_add" :
			$col = \App\DB\Get::Collection();
			$content = array("name" => $item["name"], "owner" => $_SESSION["charme_userid"]);

			if ($item["name"] != "")
				$ins = $col->lists->insert($content);

			$returnArray[$action] = array("SUCCESS" => true, "id" => $content["_id"]);

		break;

		case "post_delete_receive":

			// TODO: Verify sender / Check Signature
			clog("receiv ok");
			$realPostId = $item["signature"]["object"]["postId"];
			$pemkey = \App\Security\PublicKeys::tryToGet($item["userId"],$item["signature"]["signature"]["keyRevision"]);

			if ($pemkey != false)
			{
				$ok = \App\Security\PublicKeys::checkX509($item["signature"], $pemkey);
				if ($ok)
				{
					$col->streamitems->remove(array("postId" => $item["postId"]));
					$col = \App\DB\Get::Collection();

				}
			}

		break;

		case "post_delete":
			$col = \App\DB\Get::Collection();
			// Find out the collection id to which the post belongs
			$dbReturn = ($col->posts->findOne(array("_id" => new MongoId($item["postId"]), "owner" => $_SESSION["charme_userid"]), array("postData.object.collectionId", "_id")));
			$colId = $dbReturn["postData"]["object"]["collectionId"];

			// TODO: Make this more efficient. Only one request per server
			$dbReturn2 = $col->followers->find(array("collectionId"=> new MongoId($dbReturn["collectionId"])));

			foreach ($dbReturn2 as $m_item)
			{
				//clog($m_item["follower"]."aa");
				// This must possbily also addrese stream filters
				$data = array("requests" => array(array(
				"id" => "post_delete_receive",
				"signature" => $item["signature"],
				"collectionId" => $dbReturn["collectionId"],
				"postId" => $dbReturn["_id"]->__toString(),
				"userId" => $_SESSION["charme_userid"]
				)));
				$req21 = new \App\Requests\JSON(
				$m_item["follower"],
				$_SESSION["charme_userid"],
				$data);
				$arr = $req21->givePostman(2);
			}
			$col->posts->remove(array("_id" => new MongoId($dbReturn["_id"]), "owner" => $_SESSION["charme_userid"])); // Delete post local first
			\App\Hydra\Distribute::start(); // Start server distribution
			$col->streamitems->remove(array("postId" => $item["postId"]));

		break;

		// Comments can either be deleted by post owner or by comment owner
		case "comment_delete":

			$col = \App\DB\Get::Collection();

			// Find out the post and collection id respectivly to which the post belongs
			$dbReturn1 = $col->comments->findOne(array("_id" => new MongoId($item["commentId"])), array("postId", "_id")); // has field owner
			$dbReturn2 = $col->posts->findOne(array("_id" => new MongoId($dbReturn1["postId"])),array("collectionId", "_id"));  // has field owner
			$dbReturn3 = $col->followers->find(array("collectionId"=> new MongoId($dbReturn2["collectionId"])));

			$data = array("requests" => array(array(
			"id" => "comment_delete_receive",
			"commentId" => $dbReturn1["_id"]->__toString(),
			"postId" => $dbReturn1["postId"],
			"deleter" => $_SESSION["charme_userid"]

			)));

			// Notifiy followers!
			foreach ($dbReturn3 as $item2)
			{
				$req21 = new \App\Requests\JSON(
				$item2["follower"],
				$_SESSION["charme_userid"],
				$data);
				$arr = $req21->givePostman(2);
			}

			// Notify people seeing the post in their filtered stream
			$cursor4 = $col->streamSubscribers->find(array("postId" => $dbReturn1["postId"]) );
			// Send comment to other servers which have registred for it in search_respond
			// These servers will get comment updates for 3? days
			foreach ($cursor4 as $receiver) {
				$req21 = new \App\Requests\JSON(
				"noreply@".$receiver["server"],
				$_SESSION["charme_userid"],
				$data);
				$arr = $req21->givePostman(2);
			}


			// TODO: later
			$col->streamcomments->remove(array("commentId" => $item["commentId"], "postowner" => $_SESSION["charme_userid"])); // Delete post local first

			$col->comments->remove(array("_id" => new MongoId($dbReturn2["_id"]), "owner" => $_SESSION["charme_userid"])); // Delete post local first
			\App\Hydra\Distribute::start(); // Start server distribution

		break;

		// Comments can either be deleted by post owner or by comment owner, so check if the sender is either one of them
		case "comment_delete_receive":
		// TODO: Check if sender signature is commentId and also add sender signature to commentId
				$col = \App\DB\Get::Collection();

			$col->streamcomments->remove(array("commentId" => $item["commentId"]));
			$col->streamcomments->remove(array("commentData.object.userId" => $item["commentId"]));

		break;



		case "entity_delete" :

		break;

		case "entity_delete_receive" :

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

		case "lists_getProfile" :
			$col = \App\DB\Get::Collection();

			$col = \App\DB\Get::Collection();
			$sel = array("owner" => $item["userId"]);

			$ar = iterator_to_array($col->listitems->find($sel), true);
			$keys = array();
			$ar2 = array();

			// Filter out duplicates
			foreach ($ar as $key => $value) {

				if (!in_array($value["userId"], $keys))
				{
					$keys[] = $value["userId"];
					$ar2 [] = $value;
				}
			}

			//$col->listitems->ensureIndex('userId', array("unique" => 1, "dropDups" => 1));
			$returnArray[$action] =  array("items" => $ar2, "number" => Count($keys));

		break;



		case "profile_get":

			// Lookup visibility for this user.

			// Always send public profile information

			// Send private information if encrypted text found for this user.
			$col = \App\DB\Get::Collection();
			$cursor = $col->users->findOne(array("userid"=> urldecode($item["profileId"])), array("userid", "hometown", "about", "gender", "literature", "music", "movies", "hobbies", "firstname", "lastname"));
			$returnArray[$action] =   (array("info"=>$cursor));

		break;


		case "profile_get_name":

			$col = \App\DB\Get::Collection();
			$cursor = $col->users->findOne(array("userid"=> urldecode($item["userId"])), array("firstname", "lastname"));
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

echo json_encode($returnArray);

/*
	You just found a train:
    _______                _______     <>_<>
   (_______) |_|_|______| |[] [ ]| .---|'"`|---.
  `-oo---oo-'`-o---ooo-'`-o---o-'` \o++oo+++o=/
*/

?>

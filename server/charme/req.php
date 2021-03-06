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
header('Access-Control-Allow-Origin: http://client.local');//www.charmeproject.com
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // if POST, GET, OPTIONS then $_POST will be empty.
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true'); // Needed for CORS Cookie sending


session_start();

// logging Function

//@unlink("log.txt");

function clog($str)
{
	$fd = fopen("log.txt", "a");
	fwrite($fd, $str . "\r\n");
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
	if ( !isset($_SESSION["charme_userid"]) && !in_array($action, array("post_like_receive","post_comment_distribute", "collection_3newest", "post_comment_receive_distribute", "post_like_receive_distribute", "user_login", "register_collection_post", "register_collection_follow", "user_register", "profile_get", "message_receive", "post_getLikes"))){
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

		case "lists_getRegistred" : 
		// 
			$col = \App\DB\Get::Collection();
			$returnArray[$action] = iterator_to_array(
					$col->listitems->find(array("owner" =>   ($_SESSION["charme_userid"]), "userId" =>  ($item["userId"])), array("list")));

		break;



		case "messages_get_sub":
			
			$col = \App\DB\Get::Collection();
			 $res = $col->conversations->findOne(array("_id" => new MongoId($item["superId"])), array("aesEnc", "people", "conversationId"));;

			// Total message count, -1 if no result provided
			$count = -1; // (= undefined!)
			
			// How many messages do we turn back?
			$msgCount = 10;
			$sel = array("conversationId" =>  new MongoId($res["conversationId"]));

			if (isset($item["start"]) && $item["start"] != "-1")
				$start = $item["start"];
			else
			{

				// Also return total message Count!
				$count = $col->messages->count($sel);
				$start =$count -$msgCount;

			}

		

			//echo $item["superId"];
			if ($start <0)
				$start = 0;

		
			if ($item["limit"] > 0)
				$limit = $item["limit"];
			else
				$limit = $msgCount;


			
			// Get 10 conversations 
			$returnArray[$action] = array("messages" => 
			iterator_to_array(
				$col->messages->find($sel)
				->sort(array("time" => -1))
				->skip($start)->limit($limit)
				
			, false), "count" => $count, "aesEnc" =>  $res["aesEnc"], "people" => $res["people"], "conversationId" => new MongoId($res["conversationId"]));
			

		break;

		case "messages_get":

				$col = \App\DB\Get::Collection();


			if (isset($item["start"]))
				$start = $item["start"];
			else
				$start = 0;

			$count = -1;
			if ($item["countReturn"])
			$count = $col->conversations->count(array("receiver" => $_SESSION["charme_userid"]));


		
			\App\Counter\CounterUpdate::set( $_SESSION["charme_userid"], "talks", 0);

			// Get 10 conversations 
			$returnArray[$action] = array("count" => $count,  "messages" =>
			iterator_to_array(
				$col->conversations->find(array("receiver" => $_SESSION["charme_userid"]))
				->sort(array("time" => -1))
				->limit(7)
				->skip(7*$start)
			, false));
			

		break;

	
		case "post_comment_receive_distribute":
	
			$col = \App\DB\Get::Collection();

		


			unset($item["id"]);
			unset($item["_id"]);
		
			// TODO: Performance! 1st $item can be reduced!
			$col->streamcomments->update($item,$item, array("upsert" => true)); // TODO: Remove id in item


		break;

		case "post_comment_distribute" :

		/*
			1. Get collectionId
			2. Get collection followers
			3. Send post to these followers
		*/

		$col = \App\DB\Get::Collection();

		$cursor2 = $col->posts->findOne(array("_id"=> new MongoId($item["postId"])), array("collectionId", "owner"));
		$cursor3 = $col->followers->find(array("collectionId" => new MongoId($cursor2["collectionId"]) ));

		
	

		// insert in owners collection

		$itemdata= array("id" => "post_comment_receive_distribute",
				"content" => $item["content"],
				"userId" => $item["sender"], // NO!
				"postId" => $item["postId"],
				"sendername" => $item["sendername"],
				"postowner" => $item["userId"],
				"itemTime"  => new MongoDate());

		$data = array("requests" => 

				$itemdata

		);

		// Insert local comment
		$col->comments->insert($itemdata);

		// Send comment to other servers
		foreach ($cursor3 as $receiver)
		{


			$req21 = new \App\Requests\JSON(
			$receiver["follower"],
			$cursor2["owner"],
			$data);

			$req21->send();
		}


		break;
		case "post_comment" :

			// Send to server owner
			$col = \App\DB\Get::Collection();
			$receiver = $item["userId"];
			
			// Get sender name
			$cursor2 = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"])), array("firstname", "lastname"));
			$sendername = $cursor2["firstname"]." ".$cursor2["lastname"];


			$data = array("requests" => array(

					"id" => "post_comment_distribute",
					"content" => $item["content"],
					"userId" => $receiver,
					"postId" => $item["postId"],
					"sender" => $_SESSION["charme_userid"],
					"sendername" => $sendername
			

					));

	


			$req21 = new \App\Requests\JSON(
			$receiver,
			$_SESSION["charme_userid"],
			$data);

			$req21->send();

			$returnArray[$action] = array("STATUS" => "OK", "username" => $sendername );

		break;
		

		case "post_like_receive_distribute" : 
		// Notify other people about the like...
		$col = \App\DB\Get::Collection();
		
		$col->streamitems->update(array("owner" => $item["owner"], "postId" => new MongoId($item["postId"])) ,	array('$set' => array("likecount" => $item["count"])));

	
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
			$content = array("_id" => new MongoId($item["postId"]),"owner" => $item["userId"], "liker" =>  $item["liker"], "postId" => $item["postId"], "username" => $item["username"]);
			
			if ($item["status"] == false)
			{
				$col->likes->remove(array("liker" => $item["liker"], "postId" => $item["postId"]));
			}
			else
			{
				$col->likes->update($content, $content ,  array("upsert" => true));
			}
			// Get total likes
			$count = $col->likes->count(array("postId" => $item["postId"], "owner" => $item["userId"]));

		

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
			
			$data = array("requests" => array(

				"id" => "post_like_receive_distribute",
				"owner" => $result["owner"],
				"postId" => $item["postId"],
				"count" => $count

			));

				$req21 = new \App\Requests\JSON(
				$resItem["follower"],
				$result["owner"],
				$data
				
				);
				$req21->send();

			}




	
		break;

		case "post_like" : 
			// Save like on my own server at stream items
			$col = \App\DB\Get::Collection();

			// "post.owner" => $item["userId"], 
			$query = array('postId' => new MongoId($item["postId"]), "owner" => $_SESSION["charme_userid"]);


			// Get username for distribution
			$cursor2 = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"])), array("firstname", "lastname"));
			$sendername = $cursor2["firstname"]." ".$cursor2["lastname"];


			// Set like status in my stream
			if ($item["status"] == false)
			$col->streamitems->update($query ,	array('$set' => array("like" => false)));//array("upsert" => true)
			else
			$col->streamitems->update($query ,	array('$set' => array("like" => true)));


			$receiver = $item["userId"];

			$data = array("requests" => array(

					"id" => "post_like_receive",
					"liker" => $_SESSION["charme_userid"],
					"userId" => $receiver,
					"postId" => $item["postId"],
					"status" => $item["status"],
					"username" => $sendername

					));

			


			$req21 = new \App\Requests\JSON(
			$receiver,
			$_SESSION["charme_userid"],
			$data			);
			$req21->send();

			$returnArray[$action] = array("STATUS" => "OK");


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
				

				if (isset($item["aesEnc"]))
				{
					$content = array(
					"people" => $item["localreceivers"],
					//
					"aesEnc" => $item["aesEnc"],
					"conversationId" => new MongoId($item["conversationId"]),
					"receiver" => $receiver,
					"sendername" => $item["sendername"],
					"messagePreview" => $item["messagePreview"],
					"time" => new MongoDate(time())
					);

					// because time changes
					$col->conversations->update(array("aesEnc" => $item["aesEnc"]), $content ,  array("upsert" => true));
				}
				\App\Counter\CounterUpdate::inc( $receiver, "talks");

				$col->messages->insert(array("sendername" => $item["sendername"], "conversationId" =>   new MongoId($item["conversationId"]), "encMessage" => $item["encMessage"], "sender" => $item["sender"]));
			}

		break;


		// Get message from client
		case "message_distribute_answer":

			$col = \App\DB\Get::Collection();
		
			$convId = new MongoId($item["conversationId"]);

			$cursor2 = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"])), array("firstname", "lastname"));
			$sendername = $cursor2["firstname"]." ".$cursor2["lastname"];


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
						"sendername" => $sendername, 

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

			$returnArray[$action] = array("sendername" => $sendername);


		break;


		case "message_distribute":
			$col = \App\DB\Get::Collection();
			
			$cursor2 = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"])), array("firstname", "lastname"));
			$sendername = $cursor2["firstname"]." ".$cursor2["lastname"];

			
			// As this is a new message we generate a unique converation Id
			
		




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
			$grid->remove(array("owner" => $_SESSION["charme_userid"], "type" => "profileimage"));

			$grid->storeBytes($image->resize(150, null, 'fill')->crop(0, 0, 150, 67)->output('jpg'), array('type'=>"profileimage",'owner' => $_SESSION["charme_userid"], 'size' => 150));
			
			// 200 width
			$grid->storeBytes($image->resize(200, null, 'fill')->output('jpg'), array('type'=>"profileimage",'owner' => $_SESSION["charme_userid"], 'size' => 200));

			// 64 width square

			$grid->storeBytes($image->resize(64 , 63 , 'outside')->crop('center', 'center', 64, 64)->output('jpg'), array('type'=>"profileimage",'owner' => $_SESSION["charme_userid"], 'size' => 64));

			// 24 width square
			$grid->storeBytes($image->resize(24 , 23 , 'outside')->crop('center', 'center', 24, 24)->output('jpg'), array('type'=>"profileimage",'owner' => $_SESSION["charme_userid"], 'size' => 24));



			$returnArray[$action] = array("SUCCESS" => true);


		break;


		case "post.spread": 

			// Notify post owner when sharing a posting

		break;
		case "lists_getActive" :


		break;

	


		case "collection_posts_get" : 
			$col = \App\DB\Get::Collection();

			$array2 = iterator_to_array($col->posts->find(array("owner" => $item["userId"],"collectionId" => $item["collectionId"]))->sort(array('_id' => -1)), false);

			// Add comments
			foreach ($array2 as $key => $value) {
				
				$postId = $value["_id"]->__toString();

				// TODO: If visibility feature implmented,
				// check for access
				
				$iter = $col->comments->find(array("postId" => $postId))->sort(array('_id' => -1))->limit(3);

	



				$array2[$key]["comments"] = 
				array_reverse(
					iterator_to_array($iter, false))
				;

				if ($col->likes->count(array("liker" => $item["claimedUserId"], "postId" => $postId)) > 0)
				$array2[$key]["likeit"] = true; 
					else
				$array2[$key]["likeit"] = false; 


			$array2[$key]["commentCount"] =  $col->comments->count(array("postId" => $postId));


			}
			

			// Check if user likes post
			//...Add like true/false

			$returnArray[$action] = $array2;

		break;

		case "collection_getname":
		
			$col = \App\DB\Get::Collection();
			$cursor = $col->collections->findOne(array("_id"=> new MongoId($item["collectionId"])), array("name"));
			$returnArray[$action] =   (array("info"=>$cursor));

		break;

	




		case "updates_get":
			$returnArray[$action] = \App\Counter\CounterUpdate::get( $_SESSION["charme_userid"], array("talks", "stream"));
		break;

		case "comments_get" : 
			
			$col = \App\DB\Get::Collection();

		
			//echo "START:".$item["start"];


			if ($item["start"] == "-1" || !isset($item["start"]) )
			{
				// Get count of items < timestamp.
				$count = $col->comments->count(array('itemTime' => array('$lt' =>  new MongoDate($item["itemStartTime"] )), "postId" => (string)$item["postId"], "postowner" => $item["postowner"]) );
				
				$returnArray[$action]["start"] = $count-6; // Return start position
				$item["start"] = $count-3;
			}

		//echo "Count:".$count."!!!STARTTIME".$item["postId"]."!!!";

			if ($item["start"] < 0) $item["start"] = 0;
			

			if ($item["limit"] > 0)
				$limit = $item["limit"];
			else
				$limit = 3;

			$returnArray[$action]["comments"] = array_reverse (iterator_to_array(
			$col->comments->find(
				array("postId" => (string)$item["postId"], "postowner" => $item["postowner"]) )->sort(array('itemTime' => 1))
			->skip($item["start"])
			->limit($limit), false));





		break;

		case "stream_get":

			\App\Counter\CounterUpdate::set( $_SESSION["charme_userid"], "stream", 0);

			$stra = array();
			$col = \App\DB\Get::Collection();

			if (!isset($item["list"]) ||$item["list"] == "")
			{
				// Get all stream items
				
				$stra=  iterator_to_array($col->streamitems->find(array("owner" => $_SESSION["charme_userid"])), false);

			}
			else
			{
				$list = new MongoId($item["list"]);

				// Get people in list...


			}
			// Append last 3 comments for each item.
			foreach ($stra  as $key => $item2)
			{
				// start $item[start]

				clog(print_r($item2["post"], true));
			

				// Total comments
				$count = $col->streamcomments->count(array("postId" => (string)$item2["postId"], "postowner" => $item2["post"]["owner"]) );
				$stra[$key ]["commentCount"] = $count ;
			
				$groupCount = 3;

				if (!isset($item["start"]))
					$start = $count -$groupCount;
				else
					$start = $item["start"];

				if ($start<0) $start = 0;
				

				if (!isset($stra[$key ]["likecount"]))
					$stra[$key ]["likecount"] = 0;


				$stra[$key ]["comments"] = 
				iterator_to_array($col->streamcomments->find(array("postId" => (string)$item2["postId"], "postowner" => $item2["post"]["owner"]) )->skip($start)->limit($groupCount), false);

				//print_r($item["comments"]);
			}
	

			$returnArray[$action] = $stra;

			// if !
		break;

		case "register_collection_post":


				
			$col = \App\DB\Get::Collection();
			$content = array("post" => $item["post"], "postId" => new MongoId($item["postId"]), "owner"  => $item["follower"],"collectionId"  => new MongoId($item["collectionId"]), "username"  => $item["username"]);
			
			$col->streamitems->insert($content);

			\App\Counter\CounterUpdate::inc($item["follower"], "stream");

			

			//collection_post
		break;


		case "collection_post" : 

			// 

			// if repost -> append repost


			$col = \App\DB\Get::Collection();
			$cursor2 = $col->users->findOne(array("userid"=> ($_SESSION["charme_userid"])), array("firstname", "lastname"));
			$username = $cursor2["firstname"]." ".$cursor2["lastname"];

			$content = array("username"=> $username,  "collectionId" => $item["collectionId"], "content"  => $item["content"], "owner"  => $_SESSION["charme_userid"]);
			
			if (isset( $item["repost"]))
				$content["repost"]  = $item["repost"];

			$col->posts->insert($content);



	
			

			$res2 = $col->followers->find(array("collectionId" => new MongoId($item["collectionId"]) ));

			foreach ($res2 as $resItem)
			{
			
			$data = array("requests" => array(

				"id" => "register_collection_post",
				"follower" => $resItem["follower"],
"collectionId" => $item["collectionId"],
				"username" => $username,
				"post" => $content,
				"postId" => $content["_id"]->__toString()
			));


		

			
				$req21 = new \App\Requests\JSON(
				$resItem["follower"],
				$_SESSION["charme_userid"],
				$data
				
				);
				$req21->send();

			}
			$returnArray[$action] = array("SUCCESS" => true, "id" => $content["_id"]->__toString());	






		break;


		


		case "collection_getAll" :
			$col = \App\DB\Get::Collection();
			$returnArray[$action] = iterator_to_array($col->collections->find(array("owner" => $item["userId"])), false);

		break;

		case "collection_editPrepare":

		$col = \App\DB\Get::Collection();
		$result2 = $col->collections->findOne(array("_id" => new MongoId($item["collectionId"])), array("name", "description"));

		$returnArray[$action] =array("name" => $result2["name"], 
			"description" => $result2["description"]);

		break;
		case "collection_edit" :
			$col = \App\DB\Get::Collection();
			$content = array(
			  			"owner" => $_SESSION["charme_userid"],
			  			"name" => $item["name"],
			  			"description" => $item["description"]
			  			);

			$col->collections->update(array("_id" => new MongoId($item["collectionId"])), $content);
			
			$returnArray[$action] = array("SUCCESS" => true);

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

		case "list_getItems":

			$col = \App\DB\Get::Collection();
			$sel = array("owner" => $_SESSION["charme_userid"]);

			if ($item["listId"] != "")
				$sel["list"] = new MongoId($item["listId"] );


			


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
			  			"username" => $item["username"],
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

		// Register follow on server of the person who user follows 
		case "register_collection_follow" :
			$col = \App\DB\Get::Collection();

			// TODO Verify server who sent the request

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

		// Register collection follow on followers server

		// return the 3 newest collection items.
		case "collection_3newest":

		

			$col = \App\DB\Get::Collection();

			$items = iterator_to_array($col->posts->find(array("collectionId" => $item["collectionId"]))->sort(array('_id' => -1))->limit(3), false);

			foreach ($items as $key => $value) {

				$count = $col->likes->count(array("postId" => $value["_id"]->__toString(), "liker" => $item["follower"]));


				if ($count == 0)
				$items[$key]["liketemp"] = false;
					else
				$items[$key]["liketemp"] = true;
			}

			if (Count($items) > 0)
			{
				$cursor = $col->users->findOne(array("userid"=> $items[0]["owner"]), array("firstname", "lastname"));
			}

			$returnArray[$action] = array("items" => $items, "username"=> $cursor["firstname"]." ".$cursor["lastname"]);






		break;

		case "collection_follow" :
			
			echo $item["collectionId"];

			$col = \App\DB\Get::Collection();

			$action = $item["action"];
			$content = array("owner" => $_SESSION["charme_userid"], "collectionOwner" =>  $item["collectionOwner"], "collectionId" => new MongoId($item["collectionId"]));
			


			if ($action == "follow")
			{
				

				$col->following->update($content, $content ,  array("upsert" => true));

				$data = array("requests" => array(

				"id" => "collection_3newest",
				"collectionId" => ($item["collectionId"]),
				"follower" => $_SESSION["charme_userid"], // used in 3newest
	
				));

				
				$req21 = new \App\Requests\JSON(
				$item["collectionOwner"],
				$_SESSION["charme_userid"],
				$data
				
				);

				$dataReq = $req21->send();

			//clog(print_r($dataReq["collection_3newest"],true));

				foreach ($dataReq["collection_3newest"]["items"] as $post)
				{
					clog(print_r($post,true));
					
					$like = $post["liketemp"];
					
					unset($post["liketemp"]);

					$ins = array(
						"owner" => $_SESSION["charme_userid"],
						"username" => $dataReq["collection_3newest"]["username"],
						"like" => $like,
						"postId" => new MongoId($post["_id"]),
					 	"post" => $post,
					 	"collectionId" => new MongoId($item["collectionId"]) ,
					 	"test" => array("test1" => 1)

						);

		
					if (Count( $post) > 0)
					$col->streamitems->insert($ins);


				}
	



				// Update Stream, add newest items to stream!

			}
			else if ($action == "unfollow")
			{

				$col->following->remove($content);

				clog(print_r(array("owner" => $_SESSION["charme_userid"], "collectionId" => $item["collectionId"] , "post.owner" => $item["collectionOwner"]), true));

				$col->streamitems->remove(array("owner" => $_SESSION["charme_userid"], "collectionId" => new MongoId($item["collectionId"] ), "post.owner" => $item["collectionOwner"]));

				// Remove stream items
			}

			$data = array("requests" => array(

				"id" => "register_collection_follow",
				"collectionId" => ($item["collectionId"]),
				"follower" => $_SESSION["charme_userid"],
				"action" => $action
			/*	"localreceivers" => array($receiver),
				"allreceivers" => $res["people"],
				"encMessage" => $item["encMessage"],
				"messagePreview" => $item["messagePreview"],

				"sender" => $_SESSION["charme_userid"],
				"conversationId" => $convId->__toString(),
				//"aesEnc" => $receiver["aesEnc"], known already by receiver
*/

			));


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
		
			$content = array(
				"owner" => $_SESSION["charme_userid"],
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

		break;


		// register a follower by the content provider
		case "register_follow":

		// Write to followers

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
<?
//urldecode unnecessary!


// username is receiver
function parseRequest($action , $username, $data, $sender)
{
	$userId = $username."@localhost";

	if ($username{0} == '#')
		$groupId= substr($username, 1);

	

	switch ($action) 
	 {
		case "profile_get":
			

			/*include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/getStream.php");
			echo json_encode(StreamAsArray($_GET["userId"]));
			break;*/

			// No need to make $db_charme global here...
			global $db_charme;
			
			if (!isset($db_charme))
				include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");

			$username.= "@localhost"; //!REMOVE, has to be my server name!

			$col = $db_charme->users;
			$cursor = ($col->findOne(array("userid"=>$username), array("st_about", "st_hometown", "st_books", "userid", "st_games", "st_movies","firstname", "lastname", "st_gender", "st_music")));

			// User Collections
			$cursor2 = iterator_to_array($db_charme->usercollections->find(array("userid"=> ($username)),array("name", "_id")));

			$back =  (array($cursor, $cursor2));

			return $back;
			break;

	    case "list_added":
	        include_once($_SERVER['DOCUMENT_ROOT']."/apl/notify.php");
			//notify_new();
			echo "LISTADDED!!!";
			print_r($_POST);
	        break;

		case "post_new":
			include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
			include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/post.php");
			echo registerPost($data, $username); //OK, AUTHERROR
			break;
		
		case "followers_get":
			global $db_charme;
			
			if (!isset($db_charme))
				include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");

			$qu = array("owner" => $userId);
			return iterator_to_array($db_charme->followers->find($qu));
		break;

		case "following_get":

			global $db_charme;
			
			if (!isset($db_charme))
				include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");

			$qu = array("owner" => $userId);
			return iterator_to_array($db_charme->followerslocal->find($qu));

		break;

		case "picture_get":

		break;	


		case "collection_get":
			global $db_charme;
			
			$username.= "@localhost";

			if (!isset($db_charme))
				include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");

			$collection = $db_charme->usercollections;

			// TODO: Selctor with userId
			if ($data["filter"] == 0)
				$cursor = iterator_to_array($collection->find(array("parent"=>NULL)));
			else
				$cursor = iterator_to_array($collection->find(array("parent"=>new MongoId($data["filter"]))));


			
			$infos = array();
			$infos["name"] = "Collection Name TODO";
	

			return (array("items" => $cursor, "info"=>$infos));

	    	break;

	    case "comment_read":
	    	// 1) Try to get comment count, if not possible -> post has been deleted -> notify
	    	// 2) Return array(info[commentcount], comments)
	


			global $db_charme;

			if (!isset($db_charme))
				include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");


			$ret =  iterator_to_array(

				$db_charme->postcomments->find
				(array("postid" => new MongoId( $data["postid"])))->sort(array("posttime" => 1))->limit($data["range"])->skip($data["start"]));

		
			return $ret;

	    break;

	    // get group members...
		case "group_post":
	      	// TODO: Check if group member...,
	      	// return status => nomember if not
 			global $db_charme;

			if (!isset($db_charme))
				include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");

	      	echo "POST TO GROUP".$groupId.$data["content"];

	      	$name = "testname";

			$cont = array("userid" => $sender,
			"username" => $name,
			"content" => $data["content"],
			"groupid"=> new MongoId($groupId),
			//"attachments" => $attachments2,
			"posttime" =>  new MongoDate(time())
		
			);
			$db_charme->posts->insert($cont);

	      	// return value has to contain post id
	    	break;

	    /*
			Returns group data, like stream items, group members and group information

	    */
		case "group_getinfos":
			// TODO: Check if group member...
	      	global $db_charme;

			$cur_infos =array();
	      	$cur_stream = array();
	      	$cur_members =array();


			if (!isset($db_charme))
				include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");


			if (isset($data["stream"]) && $data["stream"] == true)
			{
				$qu = array("groupid" => new MongoId($groupId));
				$cur_stream = iterator_to_array($db_charme->posts->find($qu));
			}
			if (isset($data["info"]) && $data["info"] == true)
			{
	
				$cur_infos = $db_charme->groups->findOne(array("_id"=> new MongoId($groupId)),array( "name", "type"));
		
			}
			if (isset($data["members"]) && $data["members"] == true)
			{
				// TODO: is group id form ok?
				$cur_members = iterator_to_array(
					$db_charme->groupmembersinternal->find(array("groupid"=>  ($groupId)),array( "name", "memberid"))

					);
		
			}

			



			return ( 	array("stream" => ($cur_stream),
				"info" => ($cur_infos), "members" => ($cur_members)));

	    	break;


		case "group_postnotification":
	    

	    // If not in group -> return notification  
	    	break;


		case "comment_get":
		
			global $db_charme;

			if (!isset($db_charme))
				include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");


		    include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
			include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/comments.php");
			$comment = array("postid" => new MongoId($data["postid"]), "userid" => $data["userid"], "content" => $data["content"], "posttime"=> new MongoDate(time()));//"postid" => $data["postid"]

			print_r($comment);


	 		$db_charme->postcomments->insert($comment);

	    break;


		case "group_postnotify":

	    break;

	    case "name_update":

	    break;
	}



	if($action == "collection_follow")
	{
		//..insert post into userstream collection, 
		include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
		include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/follow.php");
		echo registerCollectionFollow($data, $username); //OK, AUTHERROR
		
	}
	else if($action == "collection_deleted")
	{
		// Notify all users if a collection does not exist anymore

		
	}

	else if($action == "dyn_infoupdate")
	{
		/*
		Will be requested by all people having me in their list once a week,
		Contains: Account Status(ACTIVE, CLOSED), Full Name,  

		*/

		
	}
	else if($action == "talk_postMessage")
	{
		include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
		include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/messages.php");

		registerMessage($data);

	}
	else if($action == "talk_leave")
	{
		
	}
	else if($action == "collection_subscribe")
	{

	}


}




?>
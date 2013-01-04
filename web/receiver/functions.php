<?
//urldecode unnötig!


// username is receiver
function parseRequest($action , $username, $data)
{

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

		case "group_post":
	      
	    	break;

		case "group_postnotify":

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


	else if($action == "comment_read")
	{
		include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
		include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/comments.php");
		readComments($data);
	}


	else if($action == "comment_get")
	{
		include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
		include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/comments.php");
		receiveComment($data);
	}
}



?>
<?
//If remote Request Package -> Do Loop


$action  =urldecode($_POST["action"]);
$username = urldecode($_POST["receiver"]);
$data = json_decode(urldecode($_POST["json"]), true); //Second parameter ensures return value is array
 
/*
RETURN: STATUS CODE!
- UserDeleted
- NotInList
- ServerPaused
- 

*/

//TODO: Remote Request Package (Bundle multiple messages to one server!)


//Is info request


//TODO: VERIFY SERVER!


//is action request
if($action == "list_added")
{
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/notify.php");
	//notify_new();
	echo "LISTADDED!!!";
	print_r($_POST);
	
}
else if($action == "post_new")
{
	//..insert post into userstream collection, 

		//..insert post into userstream collection, 
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/post.php");

	echo registerPost($data, $username); //OK, AUTHERROR


}
else if($action == "collection_follow")
{
	//..insert post into userstream collection, 
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/follow.php");
	echo registerCollectionFollow($data, $username); //OK, AUTHERROR
	
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
if($action == "profile_get")
{
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/getStream.php");
	echo json_encode(StreamAsArray($_GET["userId"]));
}


if($action == "comment_get")
{
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/comments.php");
	receiveComment($data);
}


?>
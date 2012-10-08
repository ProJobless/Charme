<?

$action  =$_GET["action"];

/*
RETURN: STATUS CODE!
*/


//Is info request




//is action request
if($action == "list_added")
{
	
}
if($action == "talk_postMessage")
{
	
}
else if($action == "talk_createNew")
{
	
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
	
}


?>
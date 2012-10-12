<?

$action  =urldecode($_POST["action"]);
$username = urldecode($_POST["receiver"]);
$data = urldecode($_POST["json"]);

/*
RETURN: STATUS CODE!
*/
var_dump($_POST);

//Is info request




//is action request
if($action == "list_added")
{
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/notify.php");
	//notify_new();
	echo "LISTADDED!!!";
	print_r($_POST);
	
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
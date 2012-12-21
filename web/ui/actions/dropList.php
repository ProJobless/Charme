<?
/*
	File is loaded if a user drop an people item onto a list.
*/
sleep(1);

include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/lists.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
needSession(); // Check if user is logged in
fw_load("post");


$itemId= $_POST["itemId"];
$listId= $_POST["listId"];

echo 
$listId.
$itemId.$_SESSION["charme_user"];

// Add list item without sending notification to the item id, as the user is already in the session users list
addListItem($_SESSION["charme_user"], $listId, $itemId, true);

?>
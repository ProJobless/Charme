<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/post.php");

needSession();

/*

File description:

	Receives AJAX with collection post or group post data and
	calls function to write post into database.

Input variables:

	$_POST["g"] - if not empty the post is posted to this group id
	$_GET["id"] - Collection id if no group id exists

*/
	
if ($_POST["content"] != "") //We do not need empty posts.
{
	if ($_POST["g"] == "")
	{
			postToCollection($_GET["id"], $_POST["content"], $_SESSION["charme_user"]);
	}

	if ($_POST["g"] != "")
	{
			postToCollection($_POST["g"], $_POST["content"], $_SESSION["charme_user"], array() ,true);
	}
}

?>
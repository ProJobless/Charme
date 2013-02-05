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
//	print_r($_POST["files"]);

fw_load("post"); // Used for post_format

if ($_POST["content"] != "") //We do not need empty posts.
{
	if ($_POST["g"] == "")
	{
		if (!isset($_POST["files"]))
			$_POST["files"] = array();
		
			postToCollection($_GET["id"], $_POST["content"], $_SESSION["charme_user"], $_POST["files"]);
	}

	if ($_POST["g"] != "")
	{

			$item = postToGroup(urldecode($_POST["g"]),  $_SESSION["charme_user"], $_POST["content"]);
			echo post_format($item, true, $groupId)[0];

	}
}

?>
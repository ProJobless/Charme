<?
if (isset($_GET["prompt"]))
{

	echo "Do you really want to delete this comment?";
}
else
{
if (isset($_POST["postId"]))
{
	include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/comments.php");
	needSession();
	deleteComment($_SESSION["charme_user"], $_POST["comId"]);
	echo "deleted".$_POST["comId2"];

}
}


?>
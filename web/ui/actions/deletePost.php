<?
if (isset($_GET["prompt"]))
{

	echo "Do you really want to delete thi post?";
}
else
{
if (isset($_POST["postId"]))
{
	include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/post.php");
	needSession();
	deletePost($_SESSION["charme_user"], $_POST["postId"]);
	echo "deleted".$_POST["postId"];
	$postid= $_POST["postId"];
}
}


?>
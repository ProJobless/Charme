<?
if (isset($_GET["prompt"]))
{
	echo "Do you really want to delete this collection? You will loose all subscribers.";
}
else
{
if (isset($_POST["colId"]))
{
	include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/collections.php");
	needSession();

	deleteCollection($_SESSION["charme_user"], $_POST["colId"]);
	echo "deleted".$_POST["colId"];

}
}


?>
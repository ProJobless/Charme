<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/post.php");

needSession();
if ($_POST["content"] != "")
postToCollection($_GET["id"], $_POST["content"], $_SESSION["charme_user"]);

?>
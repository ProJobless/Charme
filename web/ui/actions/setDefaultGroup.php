<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/groups/groups.php");
needSession();


setDefaultGroup($_SESSION["charme_user"], $_POST["groupId"]);

?>
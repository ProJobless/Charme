<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/remote.php");

needSession();
$receiver = $_POST["receiver"];

remoteRequest rr = new remoteRequest($receiver, $_SESSION["charme_user"], "list_added");
rr->


?>
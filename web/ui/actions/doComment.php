<?
/*
	File gets request and inserts comments into mongoDB
*/

include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/comments.php");

needSession();
fw_load("post");

// addComment($postowner, $postid, $userId, $content)
addComment(urldecode($_POST["uid"]), $_POST["pid"],$_SESSION["charme_user"],  $_POST["txt"] );

// Generat formated comment for the user who wrote the commet. 
echo comment_format($_SESSION["charme_user"], $_SESSION["charme_user"], "USERNAME" ,$_POST["txt"], time());
?>
<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
needSession();
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/fs/post.php");



//TODO: CHECK IF IT IS MY COLLECTION!!
   storePostImage($_FILES['pic'], $_SESSION["charme_user"], $_GET["collection"]);


?>
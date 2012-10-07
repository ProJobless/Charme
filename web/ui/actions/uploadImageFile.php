<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
needSession();
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/fs/post.php");

fw_load("post");

//TODO: CHECK IF IT IS MY COLLECTION!!
 $gridid=   storePostImage($_FILES['pic'], $_SESSION["charme_user"], $_GET["collection"]);

echo post_format(array("typ" => 2, "reference"=>$gridid))[0];


?>
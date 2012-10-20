<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/follow.php");
needSession();


echo followCollection(urldecode($_SESSION["charme_user"]), urldecode($_POST["uid"]), $_POST["collection"],$_POST["follow"] );//userid, collectionowner, collection
//function above returns: 1 if followed, 2 if not followed, else if error
?>
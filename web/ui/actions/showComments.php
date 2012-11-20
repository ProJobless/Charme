<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/comments.php");
needSession();


$start = "";



fw_load("post");
echo "<a class='more' onclick='loadComments(\"".$_POST["postid"]."\", \"".$_POST["userid"]."\", this,1)'>More...</a>";



//getComments(postid, owner, start,range)
$cList = getComments($_POST["postid"], $_POST["userid"], 0,3);


foreach ($cList as $item)
{
echo comment_format($item["userid"], "USERNAME" ,$item["content"], time());

}


?>

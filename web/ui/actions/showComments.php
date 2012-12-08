<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/comments.php");
needSession();

$commentsPerPage = 3;

$commentStartIndex = isset($_GET["s"]) ? $_GET["s"] : -$commentsPerPage;

fw_load("post");

//getComments(postid, owner, start,range)
$cList = getComments($_POST["postid"], $_POST["userid"], $commentStartIndex,$commentsPerPage); 

$showload = false;
foreach ($cList as $item)
{
	if (!$showload)
	{
		echo "<a class='more' onclick='loadComments(\"".$_POST["postid"]."\", \"".$_POST["userid"]."\", this,".($commentStartIndex-$commentsPerPage).")'>More...</a>";
		$showload = true;
	}
	echo comment_format($item["userid"], "USERNAME" ,$item["content"], time());
}


?>

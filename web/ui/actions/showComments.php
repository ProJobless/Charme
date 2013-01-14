<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/comments.php");
needSession();

$commentsPerPage = 3;

// $_POST["userid"] can also be group id, group ids start with #, for example: #123123@myserver.com
$_POST["userid"] = urldecode($_POST["userid"]);



if (!isset($_GET["s"]))
$commentStartIndex = getCommentCount($_POST["postid"])-$commentsPerPage;


else
$commentStartIndex = $_GET["s"];

if ($commentStartIndex < 0)
{
	$commentsPerPage = $commentsPerPage+$commentStartIndex;
	$commentStartIndex = 0;
}

fw_load("post");








//getComments(postid, owner, start,range)
$cList = getComments($_POST["postid"], $_POST["userid"], $_SESSION["charme_user"],  $commentStartIndex,$commentsPerPage); 


$showload = false;


if (($commentStartIndex) > 0)
$showload = true;

print_r($cList);

foreach ($cList as $item)
{
	if ($showload)
	{
		echo "<a class='morecomments' onclick='loadComments(\"".$_POST["postid"]."\", \"".$_POST["userid"]."\", this,".($commentStartIndex-$commentsPerPage).")'>More...</a>";
		$showload = false;
	}
	echo comment_format($item["_id"], $item["userid"], "USERNAME" ,$item["content"], time());
}


?>

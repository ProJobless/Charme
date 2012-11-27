<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/comments.php");
needSession();
fw_load("post");

$userId = $_POST["uid"]; //Id of photo owner, i.e. "owner@someserver.com"
$pictureId =  $_POST["pid"];
?>
<div class='photoboxComments'><a onclick='closePhoto()'>Close</a>

<div class='p32'>
<?
echo commentBox($pictureId , $userId,true );

//Get Photo comments

$cList = getComments($pictureId, $userId, 0,3);

foreach ($cList as $item)
{
	echo comment_format($item["userid"], "USERNAME" ,$item["content"], time());
}

?>


</div></div>



<div class='photoContainer'>
<img class='photo' data-width='1234' data-height='1400' src='apl/fs/?i=<?=$pictureId?>'>
</div>
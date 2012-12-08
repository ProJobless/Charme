<?
/*
GUI for popup photobox used when clicking on a collection photo
*/

include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/comments.php");
needSession();
fw_load("post");

$userId = $_POST["uid"]; // Id of photo owner, i.e. "owner@someserver.com"
$pictureId =  $_POST["pid"];
?>
<div class='photoboxComments'><a onclick='closePhoto()'>Close</a>
	<div class='p32'>
		<div class='postcomments'>
		<?

		
		$commentsPerPage = 3;
		$commentStartIndex=-$commentsPerPage;

		// The last two indices define start and range
		$cList = getComments($pictureId, $userId, $commentStartIndex,$commentsPerPage); 
		$showload = false;

		foreach ($cList as $item)
		{
			// Button for loading next "page"
			if (!$showload)
			{
				echo "<a class='more' onclick='loadComments(\"".$pictureId."\", \"".$userId."\", this,".($commentStartIndex-$commentsPerPage).")'>More...</a>";
				$showload = true;
			}
			echo comment_format($item["userid"], "USERNAME" ,$item["content"], time());
		}

		?>
		</div>
		<?
			// Textbox and Button for writing new comments
			echo commentBox($pictureId , $userId,true );
		?>

	</div>
</div>

<div class='photoContainer'>
	<img class='photo' data-width='1234' data-height='1400' src='apl/fs/?i=<?=$pictureId?>'>
</div>
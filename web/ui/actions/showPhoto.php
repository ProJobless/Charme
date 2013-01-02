<?
/*
GUI for popup photobox used when clicking on a collection photo
*/

include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/comments.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/post.php");
needSession();
fw_load("post");

$userId = $_POST["uid"]; // Id of photo owner, i.e. "owner@someserver.com"


$fields =  getPostInfo($_POST["pid"], array("reference", "description"));

$pictureId = $fields["reference"];


?>

	
<div class='photoboxComments'>
<div style='overflow:auto; padding:32px 32px 0 32px ;'>
<?
	// Button for next and previous photo
	echo '<a title="Close"  onclick=\'nextPhoto()\'  background-position: 0px 0px;" data-bgpos="0" class="actionIcon" > </a>';
	echo '<a title="Close"  onclick=\'prevPhoto()\'  background-position: 0px 0px;" data-bgpos="0" class="actionIcon" > </a>';

	// Button for close
	echo '<a title="Close"  onclick=\'closePhoto()\' style="float: right; background-position: 0px 0px;" data-bgpos="0" class="actionIcon" > </a>';
	// Delete Photo Button
	echo '<a title="Delete Photo" onclick=\'deletePost("'.$_POST["pid"].'")\' style="float: right; background-position: -144px 0px;" data-bgpos="-144" class="actionIcon"> </a>';
	
//<a onclick='closePhoto()'>Close</a>
?>

<div id='photoDescription' class='cb' style='padding-top:32px;'>

<div id='photoDescriptionBox'>
<a onclick='editPhotoDescription()' id="photoDescriptionView">
<?
if (isset($fields["description"]))
echo $fields["description"];
else
echo "<span class='hint'>Click to add description...</span>";
?>
</a>

</div>

<div id='photoDescriptionEdit'>
<textarea class='box' style='margin-bottom: 8px;'>
<?
if (isset($fields["description"]))
echo $fields["description"];
?>
</textarea>
<br/>
<a onclick='savePhotoDescription()' class='button'>Save</a> or <a onclick='stopEditPhotoDescription()' >cancel</a>

</div>




</div>



</div>

	<div class='p32' style='padding-top:24px'>
		<div class='postcomments'>
		<?

		
			$commentsPerPage = 3;


			if (!isset($_GET["s"]))
			$commentStartIndex = getCommentCount($pictureId)-$commentsPerPage;


			else
			$commentStartIndex = $_GET["s"];

			if ($commentStartIndex < 0)
			{
				$commentsPerPage = $commentsPerPage+$commentStartIndex;
				$commentStartIndex = 0;
			}

			fw_load("post");


			//getComments(postid, owner, start,range)
			$cList = getComments($pictureId, $userId, $commentStartIndex,$commentsPerPage); 


			$showload = false;


			if (($commentStartIndex) > 0)
			$showload = true;

			foreach ($cList as $item)
			{
				if ($showload)
				{
					echo "<a class='morecomments' onclick='loadComments(\"".$pictureId."\", \"".$userId."\", this,".($commentStartIndex-$commentsPerPage).")'>More...</a>";
					$showload = false;
				}
				echo comment_format($item["userid"], "userid@userid", "USERNAME" ,$item["content"], time());
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
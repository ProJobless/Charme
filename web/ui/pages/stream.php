<?
//This is a page template
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
needSession();
include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/getStream.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
fw_load("page");
fw_load("forms");
fw_load("config");




$lists = array(subMenuActionAdd("All", 0));

include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/lists.php");
$cur = getLists($_SESSION["charme_user"]);
foreach ($cur as $item)
{

	$lists[] = subMenuActionAdd($item["name"], $item["_id"]);
}


subMenuAdd(
$lists

);




page_init("Stream", 1);

fw_load("post");

echo "<div class='p32' style='border-bottom:1px silver solid;'>";
	
	forms_doPostField();
	echo "</div>";
	echo "<div class='stream'>";
	$arr = StreamAsArray($_SESSION["charme_user"]);


	if (Count($arr) == 0){ //There are not any posts in the feed
		echo "<div class='infobox'>You dont have any friends with post yet.
	<br/>Only posts that were written after you followed people will show up here.</div>";
	}

	foreach ($arr as $item)
	{

		echo post_format($item["post"], true)[0];
		/*
		echo "<div class='post'>";
		echo "<img src='ui/media/phantom.jpg' class='profilePic'>";
		echo "<div class='subDiv'><div class='top'>".$streamitem["username"]."</div><div class='postContent'>".$streamitem["content"]."</div>";
		
		if ($streamitem["attachments"])
		{
			echo "<div class='attach'>Attachments: ";
			foreach ($streamitem["attachments"] as $att)
			{
				if ($att["typ"] != 0)
			echo "<a href='#'> ".$att['name']."</a>";
			}
			echo "<br/>";
			//Do image Attachments!!
			foreach ($streamitem["attachments"] as $att)
			{
			if ($att["typ"] == 0)
			echo "<img src='http://www.google.de/images/srpr/logo3w.png'>";
			}
			
			
			echo "</div>";
		}*/
		
	//	echo "<a data-page=\"post\" data-pagearg='".$streamitem["postId"]."' >Comment</a> - <a href='#'>Love</a> - <a href='#'>Share</a> - <a href='#'>Follow</a><br class='cb'>";
	//	echo "</div></div>";	
	}
	
echo "</div>";
?>

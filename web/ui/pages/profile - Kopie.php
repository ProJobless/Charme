<?
//This is a page template
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
needSession();

include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/getStream.php");
fw_load("page");
page_init("Stream", 0);

?>
<div style="overflow:auto;">

<div style="background-color:#F3F3F3; border-left:1px solid silver; width:264px; float:right; position:fixed; margin-left:585px;height:100%;">
<img src="apl/fs/?f=p_200_<?=$_SESSION["charme_user"] ?>" style="width:200px;padding:32px;" />
<div class="tabBar">
<ul>

<?
$items = array(

array("Stream", "stream"),
array("About", "about"),
array("Collections", "collections"),
array("Subscribing", "subscribing"),
array("Subscribers", "subscribers")

 );
 
 foreach ($items as $item)
 {
	 if ($_GET[q] == $item[1] ||(!$_GET[q] && $item[1] == "stream"))
	 echo '<li class="active"><a ref="'.$item[1].'">'.$item[0].'</a></li>';
else
 echo '<li><a ref="'.$item[1].'">'.$item[0].'</a></li>';
	 
}
?>

</ul>
</div>
</div>
<?

?>
<div style="margin-right:264px;  overflow:auto">
<div class="stream" class="tabPageContent">
<?
$arr = StreamAsArray(123);
foreach ($arr as $streamitem)
{
	echo "<div class='post'>";
	echo "<img src='ui/media/phantom.jpg' class='profilePic'>";
	
	echo "<div class='subDiv'><div class='top'>".$streamitem["Username"]."</div><div class='postContent'>".$streamitem["Content"]."</div>";
	echo "<br class='cb'>";
echo "</div></div>";	
}
echo "</div>";
?>
</div></div>

<br style="clear:both;" /></div>
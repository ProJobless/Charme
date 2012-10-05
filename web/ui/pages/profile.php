<?
//This is a page template
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
needSession();

include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/getStream.php");
fw_load("page");
page_init("Stream", 0);



if (isset($_GET["userId"]))
$userId = $_GET["userId"];

$username = "Manuel";
//START: IF NOT DYNAMICALY LOADED
if (!isset($_POST["level"]) || $_POST["level"] !=3 )
{
?>
<div style="overflow:auto;">

<div style="background-color:#F3F3F3; border-left:1px solid silver; border-right:1px silver solid; width:264px; float:right; position:fixed; margin-left:585px;height:100%;">
<img src="apl/fs/?f=p_200_<?=$_SESSION["charme_user"] ?>" style="width:200px;padding:32px;" />
<div class="tabBar">
<ul>

<?
$items = array(

//array("Stream", "stream"),
array("About", "about"),
array("Collections", "collections"),
array("Subscribing", "subscribing"),
array("Subscribers", "subscribers")

 );
 
 foreach ($items as $item)
 {
	 if ((isset($_GET["q"]) && $_GET["q"] == $item[1]) ||(!isset($_GET["q"]) && $item[1] == "collections"))
	 echo '<li data-name="'.$item[1].'" class="active"><a ref="'.$item[1].'">'.$item[0].'</a></li>';
else
 echo '<li data-name="'.$item[1].'"><a ref="'.$item[1].'">'.$item[0].'</a></li>';
	 
}
?>

</ul>
</div>
</div>
<div id="page3" style='margin-right:264px;'>
<?
} //END: IF NOT DYNAMICALY LOADED



 if (isset($_GET["q"]) && $_GET["q"] =="about"){
echo "about";
	
}
else
{


{

	echo "<div>";
	//Build header


	echo "<div class='profile_header'>";


	//GET parents, if > 4 -> dont display this, also do not display when its not my profile
echo "<a style='float:right; background-position:-48px 0;' data-bgpos='-48'  class='functionButton actionIcon' id='but_addCollection'> </a>";
echo "<a style='float:right;' data-bgpos='0' class='functionButton actionIcon' id='but_addCollection'> </a>";


	echo "<div>$username"."</div>";


	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/collections.php");
	if (isset($_GET["id"]) && $_GET["id"])
	{
 		echo "<a  data-page2='profile' data-pagearg='&q=collections'>Collections</a>";
		$list = getParentList($_GET["id"]);


		foreach ($list as $value) {


		if ($_GET["id"] != $value["id"])
			echo " -> <a  data-page2='profile' data-pagearg='&q=collections&id=".$value["id"]. "'>".$value["name"]. "</a>";
		else
			echo " -> ".$value["name"]. "";
		}
		//echo " -> Collections";

		//2do: output as long as predesessor, but not longer then 4 times
	//	echo "-> Collection Name";
	
	}
	else
	 echo "Collections ";


	echo "</div>";



	
	
	fw_load("forms");
	


	if (isset($_GET["id"]) && $_GET["id"])
	{


		echo "<br class='cb'><div class='p32' style='padding-bottom:0; padding-top:16px;'>";
		echo "<a class='switcher' data-pos='1'>Post</a> - <a class='switcher' data-pos='2'>Photo</a>";

echo "<div class='switch switch1'>";
		forms_doPostField();
		echo "</div>";

			echo "<div class='photodrop switch switch2'>";

			echo '<form id="upload" action="upload.php" method="POST" enctype="multipart/form-data"> ';
			echo '<input type="file" id="files" name="files[]" multiple />';
			echo "<div class='list'>list</div>";
			echo '</form>
			</div>';


	echo "</div>";


	}
	
	

		echo "<div class='p16'>";

	$items = getCollection($_SESSION["charme_user"], getget("id"));

	echo "<h1>Collections</h1>";
	foreach ($items as $item)
	{
		//if: is collection



		echo "<a class='collection' data-page2='profile' data-pagearg='&q=collections&id=".$item["_id"]."'>".$item["name"]."</a>";	
	
		//if is post
		
		//if isphoto
		
		
	}
echo "<br class='cb'><h1>Posts</h1>";
	fw_load("post");
	echo "<div class='p16'>";
		$items = getCollectionPosts($_SESSION["charme_user"], getget("id"));
		
		foreach ($items as $item)
		{
		
			post_format($item);
			//if is post
			
			//if isphoto
			
			
		}
	echo "</div>";


	echo "</div>";
	echo "</div>";
	

	

}


}

echo "</div></div>";

echo "</div>";//ADDED
?>



<?

?>

<br style="clear:both;" /></div></div>
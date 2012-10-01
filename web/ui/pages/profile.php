<?
//This is a page template
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
needSession();

include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/getStream.php");
fw_load("page");
page_init("Stream", 0);



if (isset($_GET["userId"]))
$userId = $_GET["userId"];

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
<div id="page3">
<?
} //END: IF NOT DYNAMICALY LOADED



 if (isset($_GET["q"]) && $_GET["q"] =="about"){
echo "about";
	
}
else
{
if (isset($_GET["id"]) && $_GET["id"])
	echo "discplay collection - follow - new entry";
else
{
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/collections.php");
	$items = getCollection($_SESSION["charme_user"], "");
	fw_load("forms");
	echo "<div style='margin-right:264px;'><div class='p32'>";
	forms_doPostField();
	
		echo "<br class='cb'><a class='functionButton' id='but_addCollection'>Add Collection</a> - ";
	echo "<a data-page='profile' data-pagearg='&q=collections&id=1'>Collection 1</a>";	
	echo "</div>";
		echo "</div><div class='p16'>";
	foreach ($items as $item)
	{
		//if: is collection
		echo "<a class='collection' data-page='profile' data-pagearg='&q=collections&id=".$item["_id"]."'>".$item["name"]."</a>";	
	
		//if is post
		
		//if isphoto
		
		
	}
	echo "</div>";
	
	

	

}


}

echo "</div>";
?>



<?

?>

<br style="clear:both;" /></div></div>
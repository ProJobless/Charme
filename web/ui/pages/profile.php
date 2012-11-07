<?
//This is a page template
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
needSession();

include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/getStream.php");
fw_load("page");
page_init("Stream", 0);

if (isset($_GET["userId"]))
	$userId = urldecode($_GET["userId"]);
else
	$userId = $_SESSION["charme_user"];


$username = "Manuel";
//START: IF NOT DYNAMICALY LOADED
if (!isset($_POST["level"]) || $_POST["level"] !=3 )
{
?>

<div id='greybg'></div>
<div style="overflow:auto; background-color:#EFEFEF">

<div style="  width:200px; float:right; position:fixed; margin-left:585px;height:100%;padding:32px;">
<img src="apl/fs/?f=p_200_<?=urlencode($userId) ?>" style="width:200px;" />
<div class="tabBar profileTabs">
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


 	$url = $item[1]."&userId=".urlencode($userId);

	 if ((isset($_GET["q"]) && $_GET["q"] == $item[1]) ||(!isset($_GET["q"]) && $item[1] == "about"))
	 echo '<li data-name="'.$url.'" class="active"><a ref="'.$url.'">'.$item[0].'</a></li>';
else
 echo '<li data-name="'.$url.'"><a ref="'.$url.'">'.$item[0].'</a></li>';
	 
}
?>

</ul>
</div>
</div>

<div id="page3" style='margin-right:232px;'>
<?
} //END: IF NOT DYNAMICALY LOADED



 if ((isset($_GET["q"]) && $_GET["q"] =="about") ||!isset($_GET["q"])) {

	
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/getProfile.php");
	$arr = getProfile(array("st_about", "st_hometown", "st_books", "userid", "st_games", "st_movies","firstname", "lastname", "st_gender", "st_music"), $userId);

	echo "<div class='profile_header'>";

	//DEBUG:test%40charme.local



	echo "<div>$username"."</div>";
	echo "About me</div>";

	echo "<div class='p32'>";

	//TODO: htmlspecialchars 
	function doLists($ui)
	{
		include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/lists.php");
		$arrList = getLists($_SESSION["charme_user"]);


		$selectedOld2 = getListitemsWithName($_SESSION["charme_user"], $ui);
		$selected = array();

		foreach ($selectedOld2 as $item){
		$selected[] =  ($item["list"]);
		}

		echo "<div id='select_lists'>";
		echo "<div class='title'>Lists</div><div style='padding:6px;'>";

		//$(this)

		foreach ($arrList as $item)
		{
		//echo "<label><input type='checkbox'>".$listitem["name"]."</label><br/>";
		//if (in_array($listitem, haystack))


			if (in_array($item["_id"], $selected))
				echo "<a class='hotCheckbox active' data-listid='".$item["_id"]."'>".$item["name"]."</a><br/>";
			else
				echo "<a class='hotCheckbox' data-listid='".$item["_id"]."'>".$item["name"]."</a><br/>";
		}
		echo "</div></div>";

		/*echo "<div style='padding:6px;border-top:1px silver solid;' id='select_collections'>";
		echo "Featured Collections<br/>";
	
		echo "</div>";*/
	}
	function printAbout($content, $name, $htmlspecialchars=true)
	{
		if ($content != "")
		{
			echo "<tr><td class='info'>$name</td><td>";
			echo $content; 
			echo "</td></tr>";
		}
	}
	function getArr($arr, $v)
	{
	if (isset($arr[$v]))
		return $arr[$v];
	return "";

	}

	$gend = array("", "Male", "Female", "" => "");
	echo "<div class='aboutContainer' style='margin-right:32px'>";
		echo "<div class='aboutBox'><div class='title'>Account</div><table>";
			printAbout($arr["firstname"]." ".$arr["lastname"], "Name");
			printAbout(getArr($arr,"st_hometown"), "Hometown");
			printAbout($gend[getArr($arr,"st_gender")], "Gender");
	printAbout($arr["userid"], "Charme ID");

		echo "</table></div>";
		echo "<div class='aboutBox' style='margin-top:32px'><table>";
			printAbout(doLists($userId), "Lists", false);
		echo "</table></div>";

			echo "<div class='aboutBox' style='margin-top:32px'><div class='title'>Featured Collections</div>asdasd</div>";


	echo "</div>";

	echo "<div class='aboutContainer'>";
		echo "<div class='aboutBox'><div class='title'>Personal Information</div><table>";
			printAbout(getArr($arr, "st_aboutme"), "About me");
			printAbout(getArr($arr, "st_music"), "Music");
			printAbout(getArr($arr, "st_movies"), "Movies");
			printAbout(getArr($arr, "st_books"), "Books");
			printAbout(getArr($arr, "st_games"), "Games");
			printAbout(getArr($arr, "st_series"), "Series");
			echo "</table>";
		echo "</div>";



	echo "</div>";


	echo "</div>";

}
else if (isset($_GET["q"]) &&  $_GET["q"] =="subscribing")
{
	echo "<div class='p16'>";
	fw_load("lists");
	//People in my lists, or subscribers? => just subscribers!
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/follow.php");
	$list = getFollowing($userId);

	echo lists_start();
	foreach ($list as $item)
	{
		echo lists_doItem($item["follower"], $item["follower"]);

		echo lists_doItem($item["follower"], "Manuel SChultheiß Blablabla");
		echo lists_doItem($item["follower"], $item["follower"]);
	}
	echo lists_end();

	echo "</div>";
}
else if (isset($_GET["q"]) &&  $_GET["q"] =="subscribers")
{
	echo "<div class='p16'>";
	fw_load("lists");
	//People in my lists, or subscribers? => just subscribers!
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/follow.php");
	$list = getFollower($userId);


	echo lists_start();
	foreach ($list as $item)
	{
		echo lists_doItem($item["follower"], $item["follower"]);


	}
	echo lists_end();



	echo "Note: Subscribers may be manipluated. To verify the subscribers, look on the profile page and click on Subscribing.";
	echo "</div>";
}
else if (isset($_GET["q"]) &&  $_GET["q"] =="collections")
{



	echo "<div>";
	//Build header


	echo "<div class='profile_header'>";
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/collections.php");
	$uccol = getCollection($_SESSION["charme_user"],$userId, getget("id"));
	$items = $uccol[0];
	$subscribed =  $uccol[1];

	//GET parents, if > 4 -> dont display this, also do not display when its not my profile

	if (getget("id") != 0)
	{
		$colid= getget("id");
		if ($subscribed)
		{
		echo "<a  onclick='followCol(this, 1, \"$colid\")' style='display: none; float:right; background-position:-48px 0;' data-bgpos='-48'  class='butSubOn functionButton actionIcon'> </a>";
		echo "<a  onclick='followCol(this, 0, \"$colid\")' style='float:right; background-position:-96px 0;' data-bgpos='-96'  class='butSubOff functionButton actionIcon' > </a>";

		}
		else
		{

		echo "<a  onclick='followCol(this, 1, \"$colid\")' style='float:right; background-position:-48px 0;' data-bgpos='-48'  class='butSubOn functionButton actionIcon' > </a>";
		echo "<a  onclick='followCol(this, 0, \"$colid\")' style='display: none; float:right; background-position:-96px 0;' data-bgpos='-96'  class='butSubOff functionButton actionIcon' > </a>";

		}

	}
	else
	echo "<a style='float:right;' data-bgpos='0' class='functionButton actionIcon' id='but_addCollection'> </a>";


		echo "<div>$username"."</div>";



		if (isset($_GET["id"]) && $_GET["id"])
		{
	 		echo "<a  data-page2='profile' data-pagearg='&q=collections'>Collections</a>";
			$list = getParentList($_GET["id"]);


			foreach ($list as $value) {


			if ($_GET["id"] != $value["id"])
				echo " -> <a  data-page2='profile' data-pagearg='&userId=".urlencode($userId)."&q=collections&id=".$value["id"]. "'>".$value["name"]. "</a>";
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
	

	$has = false;

	foreach ($items as $item)
	{
		//if: is collection
if (!$has ){$has =true;echo "<div class='p24' id='collection_container'>"; }


		echo "<a class='collection' data-page2='profile' data-pagearg='&userId=".urlencode($userId)."&q=collections&id=".$item["_id"]."'>".$item["name"]."</a>";	
	
		//if is post
		
		//if isphoto
		
		
	}

	if (!$has)
echo "<div class='p24' id='collection_container' style='display:none;padding-bottom:16px;'>";

		echo "<br class='cb'></div>";


	echo "<div style='height:32px;'></div>";


	if (isset($_GET["id"]) && $_GET["id"])
	{


		echo "<div class='p32' style='padding-bottom:16px; padding-top:8px;'>";
		echo "<a class='switcher active' data-pos='1'><div>Post</div></a>
		<a class='switcher' data-pos='2'><div>Photo</div></a>";

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

	fw_load("post");
	echo "<div class='collectionBg'>";
		$items = getCollectionPosts($userId, getget("id"));
		

		//for ($i = 0; $i<10; $i++){

$lasttype = -1;
		foreach ($items as $item)
		{
			$result  = post_format($item);
			if ($result[1] != $lasttype)
			{	echo "</div>";

			if ($result[1] == 1)
				echo "<div class='collectionImgbox'>";
			if ($result[1] == 2)
				echo "<div class='collectionPostbox'>";
			}

			echo $result[0];

			$lasttype = $result[1];
		}

if ($lasttype != -1)echo "</div>";
		//}
	echo "</div>";



	echo "</div>";



}


echo "</div></div>";

echo "</div>";//ADDED
?>
</div></div>
<?
//I am glad you read this comment.
?>
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


$is_owner = ($userId == $_SESSION["charme_user"]) ? true  : false;

$username = "Manuel";
//START: IF NOT DYNAMICALY LOADED
if (!isset($_POST["level"]) || $_POST["level"] !=3 )
{
?>

<div id='greybg'></div>
<div style="overflow:auto; background-color:#EFEFEF; position:relative">

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
<div class="profile_name"><?=$username?></div>
<div id="page3" style='margin-right:232px; '>


<?
} //END: IF NOT DYNAMICALY LOADED



 if ((isset($_GET["q"]) && $_GET["q"] =="about") ||!isset($_GET["q"])) {

	
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/getProfile.php");

	//TODO: 1st Argument must be profile owner, not logged in user
	$arr2 = getProfile($userId, $_SESSION["charme_user"]);




	$arr = $arr2[0];

	$collections = $arr2[1];


	echo "<div class='profile_header'>";

	//DEBUG:test%40charme.local




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

		if (!$is_owner)
		{
			echo "<div class='aboutBox' style='margin-top:32px'><table>";
				printAbout(doLists($userId), "Lists", false);
			echo "</table></div>";
		}

		// Format collections
		$format = "";
		function getColor($itemid)
		{

			$rr = (hexdec (substr((string)$itemid, -8)));
			


			$arr = array("#DBA901", "#088A08", "#B40404", "#084B8A", "#A901DB", "#0080FF", "#01DFD7", "#B45F04","#86B404");
			return $arr[bcmod(hexdec ($rr), 9)];
		}

		foreach ($arr2[1] as $item)
		{

			$format .= "<li><a  data-page2='profile' data-pagearg='&userId="
			.urlencode($userId)
			."&q=collections&id=".$item["_id"]['$id']. "'><div class='recbox' style='background-color: ".getColor($item["_id"]['$id'])."'></div>".$item["name"]. "<br class='cb'></a></li>";

			//$format .= "<li><a href='".$item["name"]."'>".$item["name"]."</a></li>"
		}
			echo "<div class='aboutBox' style='margin-top:32px'><div class='title'>Featured Collections</div><ul class='featuredCollections'>".$format."</ul></div>";


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





	echo "<div class='profile_header'>Subscribers</div>";


	echo "<div class='p16'>";
	fw_load("lists");
	//People in my lists, or subscribers? => just subscribers!
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/follow.php");
	$list = getFollowingOfUser($userId, $_SESSION["charme_user"]);

	echo lists_start();
	foreach ($list as $item)
	{
		echo lists_doItem($item["follower"], $item["follower"]);

		echo lists_doItem($item["follower"], "Manuel Schultheiß Blablabla");
		echo lists_doItem($item["follower"], $item["follower"]);
	}
	echo lists_end();

	echo "</div>";
}
else if (isset($_GET["q"]) &&  $_GET["q"] =="subscribers")
{
	echo "<div class='profile_header'>Subscribing</div>";
	echo "<div class='p16'>";
	fw_load("lists");
	//People in my lists, or subscribers? => just subscribers!
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/follow.php");
	$list = getFollowersOfUser($userId, $_SESSION["charme_user"]);


	echo lists_start();
	foreach ($list as $item)
	{
		echo lists_doItem($item["follower"], $item["follower"]);

	}
	echo lists_end();



	echo "</div>";

		echo "<div class='p32'><b>Note:</b> This list can be manipluated by the profile owner. To verify a subscriber, look on the profile page and click on Subscribing.</div>";

}
else if (isset($_GET["q"]) &&  $_GET["q"] =="collections")
{




	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/collections.php");
	$uccol = getCollection($_SESSION["charme_user"],$userId, getget("id"));



	//echo str_replace('$', '\$', print_r($uccol, true));


	$items = $uccol[0]["items"];
	$infos = $uccol[0]["info"];

	$subscribed =  $uccol[1];

	//GET parents, if > 4 -> dont display this, also do not display when its not my profile

	echo "<div class='actionMargin'>";
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

		if ($is_owner)
		echo '<a title="Settings" onclick=\'showCollectionSettings("'.$colid.'")\' style="float: right; background-position: -144px 0px;" data-bgpos="-144" class="actionIcon"> </a>';

	}
	else
	{
	if ($is_owner)
	echo "<a style='float:right;' data-bgpos='0' class='functionButton actionIcon' id='but_addCollection'> </a>";
	}
	echo "</div>";


	echo "<div>";
	//Build header


	echo "<div class='profile_header'>";

		



		if (isset($_GET["id"]) && $_GET["id"])
		{
	 		echo "<a  data-page2='profile' data-pagearg='&q=collections&userId=".urlencode($userId)."'>Collections</a>";
		//	$list = getParentList($_GET["id"]);
			echo " -> ".$infos["name"]. "";


		/*	foreach ($list as $value) {


			if ($_GET["id"] != $value["id"])
				echo " -> <a  data-page2='profile' data-pagearg='&userId=".urlencode($userId)."&q=collections&id=".$value["id"]. "'>".$value["name"]. "</a>";
			else
				echo " -> ".$value["name"]. "";
			}
			//echo " -> Collections";
*/
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


		echo "<a class='collection' data-page2='profile' data-pagearg='&userId=".urlencode($userId).
		"&q=collections&id=".$item["_id"]['$id']."'>".$item["name"]."</a>";	
	
		//if is post
		
		//if isphoto
		
		
	}

	if (!$has)
echo "<div class='p24' id='collection_container' style='display:none;padding-bottom:16px;'>";

		echo "<br class='cb'></div>";


	


	// Make sure we are inside a collection and we are the collection owner, then we show the post field.
	if (isset($_GET["id"]) && $_GET["id"] && ($_SESSION["charme_user"] == $userId))
	{

	echo "<div style='height:32px;'></div>";
		echo "<div class='p32' style='padding-bottom:0px; overflow: visible;  padding-top:0px;'>";
		echo "<a class='switcher active' data-pos='1'><div>Post</div></a>
		<a class='switcher' data-pos='2'><div>Photo</div></a>";


echo "<div class='switch switch1'>";
		forms_doPostField($_GET["id"]);
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
		
	if (isset($_GET["id"]))
	{
		$_GET["col"] = $_GET["id"];
		include($_SERVER["DOCUMENT_ROOT"]."/ui/actions/loadPosts.php");
	}	/*$items = getCollectionPosts($userId, getget("id"));
		

		//for ($i = 0; $i<10; $i++){


$lasttype = -1;
		foreach ($items as $item)
		{
			$result  = post_format($item);
			if ($result[1] != $lasttype)
			{
				if ($lasttype == 1)echo "<br class='cb'/></div>"; //img box end has to stop float:left
				else	echo "</div>";


			if ($result[1] == 1)
				echo "<div class='collectionImgbox'>";
			if ($result[1] == 2)
				echo "<div class='collectionPostbox'>";
			}

			echo $result[0];

			$lasttype = $result[1];
		}


if ($lasttype == 1)echo "<br class='cb'/></div>";
else if ($lasttype != -1)echo "</div>";
		//}
	echo "</div>";*/


	echo "</div>";



}


echo "</div></div>";

echo "</div>";//ADDED
?>
</div></div>
<?
// I am glad you read this comment.
?>
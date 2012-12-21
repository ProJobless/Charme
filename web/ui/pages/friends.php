<?
//This is a page template
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/lists.php");

needSession();
fw_load("page");

actionBarSet('<a style="background-position:-60px 0;"  data-bgpos="-60"  href="javascript:addListButton()" class="actionButton"></a>');


//TODO: GET LISTS!!


$lists = array();
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/lists.php");
$cur = getLists($_SESSION["charme_user"]);


$lists[] = subMenuActionAdd("All", "0");

$first = "";
foreach ($cur as $item)
{
	if ($first == "")
		$first = $item["_id"];

	$lists[] = subMenuActionAdd($item["name"], $item["_id"]);
}

$selected = (isset($_GET["q"])) ? $_GET["q"] : $first;


subMenuAdd(
$lists

);
//Default cricles: Friends, Acquaintances, Colleauges
echo "ID$selected";

$name = "All lists";

	echo "<div class='p32' style='padding-bottom:0px' >";

//invite/add people, documents, propoerties 
	echo '<a style="float: right; background-position: 0px 0px;" data-bgpos="0" class="actionIcon" id="but_addCollection"> </a>';


	echo "<div style='font-size: 16px'>".$name."</div><div style='padding: 8px 0 0px 0;'>22 People</div>";
echo "</div>";



echo "<div class='p16' id='friendItemContainer'>";


	$listItems = getListitemsByList($_SESSION["charme_user"], $selected );

//print_r($listItems);



fw_load("lists");
	//People in my lists, or subscribers? => just subscribers!
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/follow.php");

	echo lists_start();
	foreach ($listItems as $item)
	{
		echo lists_doItem($item["item"], "NAME OF ".$item["item"]);

	}
	echo lists_end();


echo "</div>";



//Add friend from URL
page_init("Stream", 1);
?>
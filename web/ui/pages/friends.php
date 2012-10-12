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



$listItems = getListitemsByList($_SESSION["charme_user"], $selected );
print_r($listItems);


foreach ($listItems as $item){
echo $item["item"]."<br>";
}



//Add friend from URL
page_init("Stream", 1);
?>
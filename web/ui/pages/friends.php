<?
//This is a page template
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");


needSession();
fw_load("page");

actionBarSet('<a style="background-position:-60px 0;"  data-bgpos="-60"  href="javascript:addListButton()" class="actionButton"></a>');


//TODO: GET LISTS!!


$lists = array();
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/lists.php");
$cur = getLists($_SESSION["charme_user"]);
foreach ($cur as $item)
{

	$lists[] = subMenuActionAdd($item["name"], $item["_id"]);
}


subMenuAdd(
$lists

);
//Default cricles: Friends, Acquaintances, Colleauges


page_init("Stream", 1);
?>Add friend from URL
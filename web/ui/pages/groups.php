<?
//This is a page template
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/groups/groups.php");

needSession();
fw_load("page");

actionBarSet('<a style="background-position:-60px 0;"  data-bgpos="-60"  href="javascript:addGroup()" class="actionButton"></a>');
page_init("Stream", 1);


/*
GROUPS: MUST HAVE
- invitations
- type: per invitation, per accept (no public due to spam)
- wall

groups: should have:
- optional forums
- 


*/

$groups = getGroups($_SESSION["charme_user"]);
$groupsui = array();

foreach ($groups as $item)
{


	$groupsui[] =subMenuActionAdd($item["name"], $item["_id"]);
}
subMenuAdd(
$groupsui

);
?>Button: group invitation
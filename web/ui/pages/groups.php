<?
//This is a page template
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/groups/groups.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/getStream.php");



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


	$groupsui[] =subMenuActionAdd($item["name"], $item["groupid"]);
}
subMenuAdd(
$groupsui

);
?>



<?
if (isset($_GET["q"]))
{
	if (isset($_GET["action"]) && $_GET["action"] == "members")
	{
		$groupInfo = getGroupInfo($groupId, array("name", "type"));
		echo "<div class='p32' >";

	
		echo "<div style='font-size: 16px'>".$groupInfo["name"]." -&raquo; Members</div><div style='padding: 8px 0 0px 0;'>Typ: ".$groupInfo["type"]." - 1337 Members</div>";
		echo "</div><div class='p32' style='padding-top:0;border-bottom:1px silver solid; '>";

		fw_load("forms");
		fw_load("post");

		forms_doPostField($groupId, true);
		echo "</div>";
	}
	else
	{
		$groupId= $_GET["q"];
		$groupInfo = getGroupInfo($groupId, array("name", "type"));

		//Make Header
		echo "<div class='p32' >";

		//invite/add people, documents, propoerties 
		echo '<a title="Add People"  onclick=\'addPeople("'.$groupId.'")\' style="float: right; background-position: 0px 0px;" data-bgpos="0" class="actionIcon" > </a>';
		echo '<a title="Settings" onclick=\'showSettings("'.$groupId.'")\' style="float: right; background-position: -144px 0px;" data-bgpos="-144" class="actionIcon"> </a>';
		echo "<div style='font-size: 16px'>".$groupInfo["name"]."</div><div style='padding: 8px 0 0px 0;'>Typ: ".$groupInfo["type"]." - <a href='#'>1337 Members</a></div>";
		echo "</div><div class='p32' style='padding-top:0;border-bottom:1px silver solid; '>";

		fw_load("forms");
		fw_load("post");

		forms_doPostField($groupId, true);
		echo "</div>";
		echo "<div class='stream'>";
		$arr = groupStreamAsArray($_SESSION["charme_user"], $groupId);


		if (Count($arr) == 0){ //There are not any posts in the feed
			echo "<div class='infobox'>There are no posts in this group yet.
		</div>";
		}

		foreach ($arr as $item)
		{
			echo post_format($item, true)[0];
		}
		echo "</div>";
	}

}

?>
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

$default = -1;
// level exists => loaded via javascript
//if ((isset($_GET["q"]) && !isset($_POST["level"])) || !isset($_GET["q"]))


if (!isset($_POST["level"]) || $_POST["level"] == 0)
{
	$groups = getGroups($_SESSION["charme_user"]);
	$groupsui = array();



	$firstid= "";

	foreach ($groups as $item)
	{
		if ($firstid == "")
			$firstid =  (string)$item["groupid"];

		if (!isset($_GET["q"]) && isset($item["position"]) && $item["position"] == 1)
		{
			$default  = (string)$item["groupid"];
			$groupsui[] =subMenuActionAdd($item["name"], urlencode($item["groupid"]), true);
		}
		else
		$groupsui[] =subMenuActionAdd($item["name"], urlencode($item["groupid"]));	
	}


	if (!isset($_GET["q"]) && $default==-1)
	{

		if ($firstid != "")
		$_GET["q"] =$firstid;
		else

			echo "<div class='infobox'>You have not added any groups yet. Create a new group or join a group.</div>";
	}

	subMenuAdd(
	$groupsui

	);
}

?>



<?
	$groupId= urldecode($_GET["q"]);

if (isset($_GET["q"]) ||$default != -1)
{
	if ($default != -1)
		$_GET["q"] = $default;

	if (isset($_GET["action"]) && $_GET["action"] == "members")
	{
		$groupinfos = getGroupInfos(array("info" => true, "members" => true), $_SESSION["charme_user"], $groupId);
		//$groupInfo = getGroupInfo($groupId, array("name", "type"));
		echo "<div class='p32' >";
$name= $groupinfos ["info"]["name"];
	
		echo "<div style='font-size: 16px'><a data-page2='groups' data-pagearg='&q="
			.urlencode($_GET["q"])
			."'>".$name."</a> - Members</div><div style='padding: 8px 0 0px 0;'>1337 in Total</div>";
		echo "</div><div class='p32' style='padding-top:0;border-bottom:1px silver solid; '>";

		fw_load("forms");
	
		
		echo "</div>";
	}
	else
	{
	
	$typedef = array("Closed Group", "Open Group", "Hidden Group");
		//echo $groupId;

		// returns array(stream, info)
		$groupstream = getGroupInfos(array("info" => true, "stream" => true), $_SESSION["charme_user"], $groupId);
		$groupInfo = $groupstream["info"];

		//Make Header
		echo "<div class='p32' >";

		//invite/add people, documents, propoerties 
		echo '<a title="Add People"  onclick=\'addPeople("'.urlencode(($groupId)).'")\' style="float: right; background-position: 0px 0px;" data-bgpos="0" class="actionIcon" > </a>';
		echo '<a title="Settings" onclick=\'showSettings("'.urlencode(($groupId)).'")\' style="float: right; background-position: -144px 0px;" data-bgpos="-144" class="actionIcon"> </a>';
		echo "<div style='font-size: 16px'>".$groupInfo["name"]."</div><div style='padding: 8px 0 0px 0;'>".$typedef[$groupInfo["type"]]." - 

		<a data-page2='groups' data-pagearg='&q="
			.urlencode($_GET["q"])
			."&action=members'>1337 Members</a></div>";
		echo "</div><div class='p32' style='padding-top:0;border-bottom:1px silver solid; '>";

		fw_load("forms");
		fw_load("post");

		forms_doPostField($groupId, true);
		echo "</div>";
		echo "<div class='stream'>";
		$arr = $groupstream["stream"];


		if (Count($arr) == 0){ //There are not any posts in the feed
			echo "<div class='infobox'>There are no posts in this group yet.
		</div>";
		}

		foreach ($arr as $item)
		{
			echo post_format($item, true, $groupId)[0];
		}
		echo "</div>";
	}

}

?>
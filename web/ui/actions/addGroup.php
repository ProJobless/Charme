<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/groups/groups.php");
needSession();


if (isset($_POST["col_name"]))
{

	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/collections.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	//0 should be parent colleciton id.



	if (isset($_POST["groupId"]))
	{

		updateGroup($_POST["groupId"], $_POST["col_name"], $_POST["col_description"], $_POST["col_type"]);

	}
	else
	{
		$gid = addGroup($_SESSION["charme_user"],$_POST["col_name"], $_POST["col_description"], $_POST["col_type"]);
		addGroupMember($_SESSION["charme_user"],$_SESSION["charme_user"], $gid, $_POST["col_name"]);
	}

	//echo "<a class='collection' data-page2='profile' data-pagearg='&q=collections&id=".$cid."'>".$_POST["col_name"]."</a>";	
	
}
else
{
	$info = array();
	$info2 = array();

	function infoGet($arr, $key)
	{
		if (!isset($arr[$key]))
			return "";
		else
			return $arr[$key];
	}

	if (isset($_POST["groupId"]))
	{
 		$info = getGroupInfo($_POST["groupId"], array("name", "type", "description"));
 		$info2 = getGroupMemberInfo($_SESSION["charme_user"],$_POST["groupId"], array("isdefault", "notifications"));

	}

	fw_load("forms");

	$fc = new formCollection();
		$fc->add(new formHTML("<h1 style='margin-top:0'>Group Settings</h1>", "", ""));
	$fc->add(new formText("col_name", "Name", infoGet($info, "name")));
	$fc->add(new formArea("col_description", "Description", infoGet($info, "description")));

	//$fc->add(new formPeople("col_visible", "Visible", ""));

	$fd = new formDrop("col_type", "Who can join", infoGet($info, "type"));
	$fd->addOption(0, "Only invited people");
	$fd->addOption(1, "Accepted people");
	$fd->addOption(2, "Everybody (Captcha)");
	$fc->add($fd);

	if (isset($_POST["groupId"]))
	{
		// If groupId -> group Edit -> Show member Settings
	$fc->add(new formHTML("<h1>Membership Settings</h1>", "", ""));
	$fc->add(new formHidden("groupId", "", $_POST["groupId"]));

	$fd = new formDrop("col_type", "Notifications", "");
	$fd->addOption(0, "Enable");
	$fd->addOption(1, "Disable");
	$fc->add($fd);

	$str = "";


	if (!infoGet($info2, "isdefault"))
$str = "<a id='group_setdef' onclick='setDefaultGroup(\"".$_POST["groupId"]."\")'>Set as Default Group</a> - ";

	$fc->add(new formHTML2($str."<a onclick='leaveGroup(\"".$_POST["groupId"]."\")'>Leave Group", "", ""));


	}


	$fc->printOut("", false, "");
}

//addCollection($owner, $name, $description, $parent);

//return html for square which is going to be appened to existing html


?>
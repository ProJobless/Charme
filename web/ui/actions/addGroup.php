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

	$gid = addGroup($_SESSION["charme_user"],$_POST["col_name"], $_POST["col_description"], $_POST["col_type"]);
	addGroupMember($_SESSION["charme_user"],$_SESSION["charme_user"], $gid);


	//echo "<a class='collection' data-page2='profile' data-pagearg='&q=collections&id=".$cid."'>".$_POST["col_name"]."</a>";	
	
}
else
{
	fw_load("forms");
	$fc = new formCollection();
	$fc->add(new formText("col_name", "Name", ""));
	$fc->add(new formArea("col_description", "Description", ""));

	//$fc->add(new formPeople("col_visible", "Visible", ""));

	$fd = new formDrop("col_type", "Who can join", "");
	$fd->addOption(0, "Only invited people");
	$fd->addOption(1, "Accepted people");
	$fd->addOption(2, "Everybody (Captcha)");
	$fc->add($fd);



	$fc->printOut("", false, "");
}

//addCollection($owner, $name, $description, $parent);

//return html for square which is going to be appened to existing html


?>
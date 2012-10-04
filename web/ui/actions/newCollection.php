<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");

needSession();


if (isset($_POST["col_name"]))
{
	var_dump($_POST);
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/collections.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	//0 should be parent colleciton id.
	addCollection($_SESSION["charme_user"] , $_POST["col_name"], $_POST["col_description"], $_GET["id"]);
}
else
{
	fw_load("forms");
	$fc = new formCollection();
	$fc->add(new formText("col_name", "Name", ""));
	$fc->add(new formArea("col_description", "Description", ""));
	$fc->printOut("", false, true);
}

//addCollection($owner, $name, $description, $parent);

//return html for square which is going to be appened to existing html


?>
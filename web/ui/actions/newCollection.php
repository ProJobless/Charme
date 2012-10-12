<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
needSession();


if (isset($_POST["col_name"]))
{

	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/collections.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	//0 should be parent colleciton id.
	$cid = addCollection($_SESSION["charme_user"] , $_POST["col_name"], $_POST["col_description"], $_GET["id"]);


	echo "<a class='collection' data-page2='profile' data-pagearg='&q=collections&id=".$cid."'>".$_POST["col_name"]."</a>";	
	
}
else
{
	fw_load("forms");
	$fc = new formCollection();
	$fc->add(new formText("col_name", "Name", ""));
	$fc->add(new formArea("col_description", "Description", ""));

	$fc->add(new formPeople("col_visible", "Visible", ""));



	$fc->printOut("", false, "");
}

//addCollection($owner, $name, $description, $parent);

//return html for square which is going to be appened to existing html


?>
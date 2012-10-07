<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");

needSession();


if (isset($_POST["col_name"]))
{

	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/lists.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	//0 should be parent colleciton id.
	$cid = addList($_SESSION["charme_user"] , $_POST["col_name"]);


	echo "<li><a ref='$cid'>".$_POST["col_name"]."</a></li>";	
	
}
else
{
	fw_load("forms");
	$fc = new formCollection();
	$fc->add(new formText("col_name", "Name", ""));



	$fc->printOut("", false, false);
}

//addCollection($owner, $name, $description, $parent);

//return html for square which is going to be appened to existing html


?>
<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
needSession();


if (isset($_POST["col_name"]))
{

	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/collections.php");


	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	//0 should be parent colleciton id.


 	print_r ($_POST["col_visible"]); //ty
	print_r ($_POST["people_col_visible"]); //, splitted, people start with p


 	//POST: col_visible is visibility type (1 public, 2 lists, 3 spec)


 	//+= type, people
 	if (!$_POST["groupId"])
 	{
 		addCollection($_SESSION["charme_user"] , $_POST["col_name"], $_POST["col_description"], $_GET["id"], $_POST["col_visible"], $_POST["people_col_visible"]);
 	}
 	else
 	{
 	 	saveCollection($_SESSION["charme_user"] , $_POST["col_name"], $_POST["col_description"], $_GET["id"], $_POST["col_visible"], $_POST["people_col_visible"]);
	
 	}
	



	echo "<a class='collection' data-page2='profile' data-pagearg='&q=collections&id=".$cid."'>".$_POST["col_name"]."</a>";	
	
}
else
{

	fw_load("forms");
	$fc = new formCollection();
	$arr = array();
	if (isset($_GET["col"]))
	{
		$fc->add(new formHidden("groupId", "", $_GET["col"]));

		include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/collections.php");
		$arr = getCollectionInfo($_SESSION["charme_user"], $_GET["col"]);

		
	}
	
	
	function infoGet($arr, $key)
	{
		if (!isset($arr[$key]))
			return "";
		else
			return $arr[$key];
	}

	//if $GET ID -> EDIT MODE! -> add hidden id field


	
	$fc->add(new formText("col_name", "Name", infoGet($arr, "name")));
	$fc->add(new formArea("col_description", "Description", infoGet($arr, "description")));


	$valvs = "";
	if (isset($_GET["col"]))
	{
	$l = ",l".implode(",l", infoGet($arr, "lists"));


		$valvs =  infoGet($arr, "visibletype")."p".implode(",p", infoGet($arr, "people"));

		if (strlen($l) > 2) // Add lists if exist
			$valvs .= $l;

		echo $valvs;
	}

	$fc->add(new formPeople("col_visible", "Visible", $valvs));

	if (isset($_GET["col"]))
	{
$fc->add(new formHTML2("<a>Delete Collection</a>", "", ""));
		
	}



	$fc->printOut("", false, "");
}

//addCollection($owner, $name, $description, $parent);

//return html for square which is going to be appened to existing html


?>
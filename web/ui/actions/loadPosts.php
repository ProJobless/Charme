<?
/*
This file can either be loaded via ajax or be included by talks.php
Make sure both possibilities work!
*/


// If file is loaded by ajax, we need to include the used libraries
// It it loaded per ajax if the varaible $basepath is undefined (else included in framework.php)

if (!isset($basepath))
{
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/collections.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
needSession(); // Check if user is logged in
fw_load("post");
$userId = urldecode($_GET["userid"]);
}




$count =5; // How many items are loaded with one request?


if (!isset($_GET["s"])) // No start index given -> get index of last comments
{
	$start = getCollectionPostCount($userId, $_GET["col"])-$count; //TODO!!!getMessageCount($_GET["q"])-$items;
}
else
{
	$start = (isset($_GET["s"]) ? $_GET["s"] : 0);
}

if ($start < 0)
{
	$count = $count+$start;
	$start = 0;
}









	fw_load("post");

		$items = getCollectionPosts($userId, $_GET["col"], $count, $start);
		

		//for ($i = 0; $i<10; $i++){

$lasttype = -1;
		foreach ($items as $item)
		{
			$result  = post_format($item);
			if ($result[1] != $lasttype)
			{
				if ($lasttype != -1) // Do not close div if no div created yet
				{
					if ($lasttype == 1)echo "<br class='cb'/></div>"; // img box end has to stop float:left
					else	echo "</div>"; // Post end, does not need to cancel float
				}

			if ($result[1] == 1)
				echo "<div class='collectionImgbox'>";
			if ($result[1] == 2)
				echo "<div class='collectionPostbox'>";
			}

			echo $result[0];

			$lasttype = $result[1];
		}


if ($lasttype == 1)echo "<br class='cb'/></div>";
else if ($lasttype != -1)echo "</div>";
		//}



$newstart = $start-$count;

if ($start>0)
 	echo "<a class='more' style='margin: 8px 32px 32px 32px;' onclick='loadCollection(\"".urlencode($userId)."\", $newstart, \"".$_GET["col"]."\")' style='margin:0 16px'>More...</a>";

?>


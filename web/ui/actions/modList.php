<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/lists.php");
needSession();

$userId= urldecode($_POST["userId"]);

$all = getLists($_SESSION["charme_user"]);
$selectedOld2 = getListitemsWithName($_SESSION["charme_user"], $userId);
$selectedOld = array();


foreach ($selectedOld2 as $item){
$selectedOld[] = $item["list"];
}

$selectedNew = $_POST["ar"];

foreach ($all as $item)
{	
	if (in_array($item["_id"], $selectedNew ) && !in_array($item["_id"], $selectedOld))//item not yet in list
  	{

  		
  		addListItem($_SESSION["charme_user"], $item["_id"], $userId);
  	}
  	else if (!in_array($item["_id"], $selectedNew ) && in_array($item["_id"], $selectedOld))//item was removed
	{

		removeListItem($_SESSION["charme_user"], $item["_id"], $userId);
	}
	//else: item is already in list
}	
?>
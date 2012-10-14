<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/lists.php");
needSession();



$q = $_GET["q"];

$lists = findLists($_SESSION["charme_user"], $q);
$people = findPeople($_SESSION["charme_user"], $q);


$json = array();
foreach ($lists as $list)
{
	$json[] = array("id" => "l".(string)$list["_id"], "name" => $list["name"]);
}

foreach ($people as $item)
{
	$json[] = array("id" => "p".(string)$item["item"], "name" => $item["item"]);
}

echo json_encode($json);

?>

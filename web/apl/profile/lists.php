<?
/*
Add a user to a list
*/
function addList($owner, $name)
{
	global $db_charme;
	$content = array("userid" => $_SESSION["charme_user"],
			"name" => $name);
	$db_charme->lists->insert($content);

	return $content ["_id"];
}
function getLists($owner)
{
	global $db_charme;
	$col = $db_charme->lists;
	$cursor = $col->find(array("userid"=>$owner))->sort(array("name" => 1));
	return $cursor;

}
function findLists($owner, $q)
{

	global $db_charme;
	$col = $db_charme->lists;
	$cursor = $col->find(array("userid"=>$owner, "name"=> array('$regex' => $q)));
	return $cursor;

}
function findPeople($owner, $q)
{

	global $db_charme;
	$col = $db_charme->listitems;
	$cursor = $col->find(array("userid"=>$owner, "item"=> array('$regex' => $q)));
	return $cursor;

}

function getListItems($owner)
{
	global $db_charme;
	$col = $db_charme->lists;
	$cursor = $col->find(array("userid"=>$owner))->sort(array("name" => 1));
	return $cursor;
}
function getListitemsByList($owner, $needle)
{
	global $db_charme;
	$col = $db_charme->listitems;

	$cursor = $col->find(array("userid"=>$owner, "list"=> new MongoId($needle)));

	return $cursor;
}

function getListitemsWithName($owner, $needle)
{
	global $db_charme;
	$col = $db_charme->listitems;
	
	$cursor = $col->find(array("userid"=>$owner, "item"=>  $needle));

	return $cursor;

}
function addListItem($owner, $list, $person)
{
	global $db_charme;

	$db_charme->listitems->insert(array("userid"=> $owner, "item"=>$person, "list"=>$list)
		);

	/*
	Send Notification to the person added
	*/
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/remote.php");
	$rr = new remoteRequest($person, $_SESSION["charme_user"], "list_added");
	$rr->setPayload(array());
	$rr->send();


}
function removeListItem($owner, $list, $person)
{
	global $db_charme;
	$db_charme->listitems->remove(array("userid"=>$owner, "list"=>$list, "item" =>$person));
}

function getListItemsByUser($owner)
{
	global $db_charme;
	$col = $db_charme->listitems;
	$cursor = $col->find(array("userid"=>$owner));
	return $cursor;
}


?>
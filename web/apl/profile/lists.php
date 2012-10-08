<?

function addList($owner, $name)
{
	//TODO: CHECK IF PARENT COLLECTION BELONGS TO USER!!

	//get db...
	global $db_charme;


	
	$content = array("userid" => $_SESSION["charme_user"],
			"name" => $name,
		
		
			);

	$db_charme->lists->insert($content
		);
return $content ["_id"];

	
}
function getLists($owner)
{
	global $db_charme;
	$col = $db_charme->lists;
	$cursor = $col->find(array("userid"=>$owner))->sort(array("name" => 1));
	return $cursor;

}
function getListItems($owner)
{
	global $db_charme;
	$col = $db_charme->lists;
	$cursor = $col->find(array("userid"=>$owner))->sort(array("name" => 1));
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
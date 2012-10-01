<?
//JSON encoded
function addCollection($owner, $name, $description, $parent)
{
	//get db...
	global $db_charme;
	//todo: validate strings!!
	$db_charme->usercollections->insert(
		array("userid" => $_SESSION["charme_user"],
			"name" => $name,
			"description" => $description,
			"parent" => $parent
		
			));


	
}
function getCollection($owner, $filter)
{
	$m = new Mongo();
	$db = $m->charme;
	$collection = $db->usercollections;
	


	
	
	$cursor = $collection->find();
	return $cursor;
}

?>
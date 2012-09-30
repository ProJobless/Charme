<?
$db_internal_mongo= new Mongo();
$db_charme = $db_internal_mongo->charme;


function db_setUserField($field, $value)
{
	global $db_charme;
	
	$db_charme->users->update(array("userid" => $_SESSION["charme_user"]),
		array('$set' => array($field => $value)));
}
function db_getUserField($field)
{
	global $db_charme;
	
	


	$collection = $db_charme->users;
	$cursor = $collection->findOne(array("userid" => $_SESSION["charme_user"]), array($field));

	return $cursor["color"];
}


?>
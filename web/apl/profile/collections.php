<?
//JSON encoded
function addCollection($owner, $name, $description, $parent)
{
	
	
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
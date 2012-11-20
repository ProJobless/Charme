<?
function addGroup($creator, $name, $description, $type)
{
	global $db_charme;
	$content = array("creator" => $creator,
			"name" => $name,"description" => $description,"type" => $type);
	$db_charme->groups->insert($content);

	return $content ["_id"];
}
function addGroupMember($userid, $memberid, $groupid)
{
	global $db_charme;

	$ref = MongoDBRef::create("groups", $groupid);
	$content = array(
			"memberid" => $memberid,"groupid" => $groupid, "nameref"=>$ref);

	$db_charme->groupmembers->insert($content);





	return $content ["_id"];
}
function getGroupInfo($groupId, $fields)
{
	global $db_charme;

	$collection = $db_charme->groups;
	

	$cur = $collection->findOne(array("_id"=> new MongoId($groupId)), $fields);
	return $cur;

}
function getGroups($userid)
{
	global $db_charme;
	$col = $db_charme->groupmembers;
	$cursor = $col->find(array("memberid"=>$userid));
	$values = array();
	foreach ($cursor as $item)
	{

	
$nn = MongoDBRef::get($db_charme, $item['nameref']);



	$item["name"] =$nn["name"];
	$values[] = $item;
	//var_dump($item);
	}


	return $values;
}


?>
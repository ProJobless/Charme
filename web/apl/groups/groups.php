<?
function setDefaultGroup($userId, $groupId)
{	
	global $db_charme;
echo $userId.$groupId;
	// Remove default status from other groups
	$db_charme->groupmembers->update(array("memberid" => $userId),array('$set' => array("position" => 0)), array("multiple" => true));

	// Set default status for new group
	$db_charme->groupmembers->update(array("memberid" => $userId,"groupid"=>  ($groupId)),array('$set' => array("position" => 1)));
}
function addGroup($creator, $name, $description, $type)
{
	global $db_charme;

	include_once($_SERVER['DOCUMENT_ROOT']."/config.php");



	$content = array("creator" => $creator,
			"name" => $name,"description" => $description,"type" => $type);
	$db_charme->groups->insert($content);

	$groupid = "#".$content["_id"]."@".$CHARME_SETTINGS["serverURL"];


	$db_charme->groups->update(array("_id" =>  $content ["_id"]),array('$set' => array("groupid" => $groupid)));



	return $groupid;
}
function updateGroup($groupId ,  $name, $description, $type)
{
	echo $groupId;

	global $db_charme;
	$content = array(
			"name" => $name,"description" => $description,"type" => $type);

	$db_charme->groups->update(array("_id"=> new MongoId($groupId)),array('$set' => $content));

	return 1;
}

function setNotifications($groupId)
{


}

function getNotifications($groupId)
{

}


function addGroupMember($userid, $memberid, $groupid, $name)
{
	global $db_charme;

	$ref = MongoDBRef::create("groups", $groupid);
	$content = array(
			"memberid" => $memberid,"groupid" => $groupid, "name"=>$name);

	$db_charme->groupmembers->insert($content);





	return $content ["_id"];
}
function getGroupMemberInfo($userId, $groupId, $fields)
{
	
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


	return ($cursor);
}


?>
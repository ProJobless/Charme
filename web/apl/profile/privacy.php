<?

$privacy_fields = array(
array("id"=> 1, "default" => 1),
array("id"=> 2, "default" => 1),
array("id"=> 3, "default" => 1),

	);

function privacy_getAll()
{
global $privacy_fields;


return $privacy_fields;
}
function privacy_hasAccess($owner, $invader, $pid)
{


}
function privacy_getAllValues($us)
{
	global $db_charme;
	$col = $db_charme->privacy;
	$cursor = $col->find(array("userid"=>$us));
	return $cursor;



}

function setPrivacy($user, $pid,$val, $people)
{
//setPrivacy($_SESSION["charme_user"], $valId,$valTyp, $valPeople);
global $db_charme;


//$db_charme->privacy->ensureIndex(array("userid" => 1, "pid" => 1), array("unique" => 1, "dropDups" => 1));

	$content = array("userid" => $user,
			"pid" => $pid, "val"=> $val, "people"=>$people 
			);

	$db_charme->privacy->update(array("userid" => $user, "pid" => $pid), $content, array("upsert" => true));
	return true;

}


?>
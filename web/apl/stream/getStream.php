<?
//$start, $userid (PROOF) etc
 


function StreamAsArray($userId)
{
	global $db_charme;

	//TODO: CHECK AUTHENTICATION!!
	

	$qu = array("userid" => $userId);
	return $db_charme->stream->find($qu);


}
function groupStreamAsArray($userId, $groupId)
{
	global $db_charme;

	//TODO: CHECK AUTHENTICATION and if user can access group id!!!
	


	$qu = array("groupid" => new MongoId($groupId));
	$xy =  $db_charme->posts->find($qu);

return $xy;

}


?>
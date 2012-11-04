<?
//$start, $userid (PROOF) etc
 


function StreamAsArray($userId)
{
	global $db_charme;

	//TODO: CHECK AUTHENTICATION!!
	

	$qu = array("userid" => $userId);
	return $db_charme->stream->find($qu);


}

?>
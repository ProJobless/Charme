<?

function getProfile($userId, $invader)
{
	//TODO: JSON request if not my server!!

	include_once($_SERVER['DOCUMENT_ROOT']."/apl/remote.php");
	$rr = new remoteRequest($userId, $invader, "profile_get");
	//$rr->setPayload(array());

	$ret =  ($rr->send());




	return $ret;
/*


	global $db_charme;
	$col = $db_charme->users;
	$cursor = $col->findOne(array("userid"=>$userId));

	// Cursor 2 contains collection. TODO: Sort and maximum numer=5 (?), TODO: Select only fields which are necessary

	$cursor2 = $db_charme->usercollections->find(array("userid"=> ($userId)),array("name", "_id"));

	//Only if visible to me!!!!!!





	return array($cursor, $cursor2);
*/



}
function getName()
{

	
}
?>
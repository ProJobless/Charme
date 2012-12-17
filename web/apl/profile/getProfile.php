<?

function getProfile($invader, $fields, $userId)
{
	//TODO: JSON request if not my server!!

	global $db_charme;
	$col = $db_charme->users;
	$cursor = $col->findOne(array("userid"=>$userId));

	// Cursor 2 contains collection. TODO: Sort and maximum numer=5 (?), TODO: Select only fields which are necessary

	$cursor2 = $db_charme->usercollections->find(array("userid"=> ($userId)),array("name", "_id"));

	//Only if visible to me!!!!!!


	return array($cursor, $cursor2);

}
function getName()
{

	
}
?>
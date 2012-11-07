<?

function getProfile($fields, $userId)
{
	//TODO: JSON request if not my server!!

	global $db_charme;
	$col = $db_charme->users;
	$cursor = $col->findOne(array("userid"=>$userId));
	return $cursor;

}
function getName()
{

	
}
?>
<?

function getProfile($invader, $fields, $userId)
{
	//TODO: JSON request if not my server!!

	global $db_charme;
	$col = $db_charme->users;
	$cursor = $col->findOne(array("userid"=>$userId));


	//Only if visible to me!!!!!!



	$collections = ""; //array("name", "id")

	return array($cursor, $collections);

}
function getName()
{

	
}
?>
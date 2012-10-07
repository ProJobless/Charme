<?

function addList($owner, $name)
{
	//TODO: CHECK IF PARENT COLLECTION BELONGS TO USER!!

	//get db...
	global $db_charme;


	
	$content = array("userid" => $_SESSION["charme_user"],
			"name" => $name,
		
		
			);

	$db_charme->lists->insert($content
		);
return $content ["_id"];

	
}
function getLists($owner)
{
	global $db_charme;
	$col = $db_charme->lists;
	$cursor = $col->find(array("userid"=>$owner))->sort(array("name" => 1));
	return $cursor;

}

?>
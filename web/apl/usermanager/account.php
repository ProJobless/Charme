<?
function saveAccount($userId, $firstname, $lastname, $email)
{


	global $db_charme;



	$db_charme->users->update(array("userid" => $userId),
		array('$set' => array("firstname"=>$firstname, "lastname"=>$lastname, "email" =>$email)));
}

function getAccount($userId)
{
	
	global $db_charme;
	$collection = $db_charme->users;
	//TODO: Check if Email has changed -> resend confirm

	$cursor = $collection->findOne(array("userid" => $userId), array("firstname", "lastname", "email" ));


	return $cursor;
}

?>
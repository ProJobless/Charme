<?
function changePassword($old, $old2, $new, $owner)
{


	global $db_charme;
	include_once($_SERVER['DOCUMENT_ROOT']."/config.php");



	if ($old != $old2)
		return "1";
	else
	{

	$col = $db_charme->users;
	$cursor = $col->findOne(array("userid"=>$owner, "password"=> md5($CHARME_SETTINGS["passwordSalt"].$old)), array("password"));
	


		if ($cursor["password"] == md5($CHARME_SETTINGS["passwordSalt"].$old))
		{
			$db_charme->users->update(array("userid" => $owner),
			array('$set' => array("password" => md5($CHARME_SETTINGS["passwordSalt"].$new))));
			return "0";
		} 
		else
			return "2";

	}

}

?>
<?


function addUser($username, $email, $servername,$password, $firstname,$lastname )
{
	include_once($_SERVER['DOCUMENT_ROOT']."/config.php");
	$m = new Mongo();
	$db = $m->charme;
	$collection = $db->users;
	

	
	$obj = array("username" => $username,"password"=>md5($CHARME_SETTINGS["passwordSalt"].$password), "userid" => $username."@".$CHARME_SETTINGS["serverURL"], "email" => $email, "firstname" => $firstname, "lastname" => $lastname );
	$collection->insert($obj);
//	$collection->ensureIndex('myindex',array("unique" => true));
	$cursor = $collection->find();

	foreach ($cursor as $obj) {
		print_r($obj);
		//echo $obj["username"] . "\n";
	}
}
function listUsers($filter)
{
	$m = new Mongo();
	$db = $m->charme;
	$collection = $db->users;
	$cursor = $collection->find();
	$str = "";
	foreach ($cursor as $obj) {
		$str .=  str_pad($number, 10 ,'0', STR_PAD_LEFT)." ".$obj["userid"]."\n";
	}
	return $str;
}
function tryLogin($username, $password)
{
	

	include_once($_SERVER['DOCUMENT_ROOT']."/config.php");
$p = md5($CHARME_SETTINGS["passwordSalt"].$password);

	
	global $db_charme;

	$collection = $db_charme->users;
	$cursor = $collection->findOne(array("username"=> $username, "password"=>$p), array('username'));
	if ($cursor["username"]==$username)
		return "2";
	else
		return "1";

}

?>
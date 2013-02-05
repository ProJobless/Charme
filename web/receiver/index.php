<?
//If remote Request Package -> Do Loop

//urldecode unnötig!


$username = ($_POST["receiver"]);
$data = json_decode(($_POST["json"]), true); //Second parameter ensures return value is array

include("functions.php");

/*
 	Multiple Requests on this server. Like get_username AND get_profile
*/
if (isset($_POST["multi"]) && $_POST["multi"] == true) 
{
	$bigArray = array();

	foreach ($data as $item)
	{
		$bigArray[$item["rqid"]] = parseRequest($item["rqid"], $username, $item["data"], $_POST["sender"]);

	}

	echo json_encode($bigArray);
}
else
{
	$action  =($_POST["action"]);
echo json_encode(parseRequest($action, $username, $data, $_POST["sender"]));
}
?>
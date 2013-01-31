<?
//If remote Request Package -> Do Loop

//urldecode unnötig!
$action  =($_POST["action"]);
$username = ($_POST["receiver"]);
$data = json_decode(($_POST["json"]), true); //Second parameter ensures return value is array

include("functions.php");

if (isset($_POST["multi"]) && $_POST["multi"] == true) 
{
	$bigArray = array();

	foreach ($data as $item)
	{
		$bigArray[] = parseRequest($item["rqid"], $username, $item["data"], $_POST["sender"]);

	}

	echo json_encode($bigArray);
}
else
echo json_encode(parseRequest($action, $username, $data, $_POST["sender"]));

?>
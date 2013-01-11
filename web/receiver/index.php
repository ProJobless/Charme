<?
//If remote Request Package -> Do Loop

//urldecode unnötig!
$action  =($_POST["action"]);
$username = ($_POST["receiver"]);
$data = json_decode(($_POST["json"]), true); //Second parameter ensures return value is array





include("functions.php");
echo json_encode(parseRequest($action, $username, $data, $_POST["sender"]));

?>
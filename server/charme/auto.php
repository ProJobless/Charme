<?php
header('Access-Control-Allow-Origin: http://client.local');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // if POST, GET, OPTIONS then $_POST will be empty.
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

header('Content-type: application/json');
header('Access-Control-Allow-Credentials: true'); 
//

if ($_GET["debug"] == 1)
{
session_start();
 
 //$_SESSION["charme_userid"] = "a2";

echo $_SESSION["charme_userid"];
$_SESSION["charme_userid"] = "schuldi@server.local";

}
//


echo json_encode(
	array(
		array("id" => "schuldi@charme.local", "name" => "Manuel ")
		)
	);



?>
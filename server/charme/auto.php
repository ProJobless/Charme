<?php
header('Access-Control-Allow-Origin: http://client.local');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // if POST, GET, OPTIONS then $_POST will be empty.
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

header('Content-type: application/json');

//session_start();


//echo $_SESSION["charme_userid"];

//$_SESSION["charme_userid"] = "schuldi@server.local";

echo json_encode(
	array(
		array("id" => "schuldi@charme.local", "name" => "Manuel ")
		)
	);



?>
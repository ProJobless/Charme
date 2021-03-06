<?php
// Autocomplete JSONP provider

header('Access-Control-Allow-Origin: http://client.local');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // if POST, GET, OPTIONS then $_POST will be empty.
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type');

header('Content-type: application/json');
header('Access-Control-Allow-Credentials: true'); 


session_start();
 



require_once 'lib/App/ClassLoader/UniversalClassLoader.php';
use Symfony\Component\ClassLoader\UniversalClassLoader;

$loader = new UniversalClassLoader();
$loader->registerNamespaces(array('App' => __DIR__ . '/lib'));
$loader->register();




$col = \App\DB\Get::Collection();
$sel = array("owner" => $_SESSION["charme_userid"], 

	'username' => new MongoRegex('/'.$_GET["q"].'/i'));


$ar = iterator_to_array($col->listitems->find($sel), true);
$keys = array();
$jsonArr = array(); 

// Filter out duplicates
foreach ($ar as $key => $value) {

	if (!in_array($value["userId"], $keys))
	{
		$keys[] = $value["userId"];
		$jsonArr [] = array("name" => $value["username"], "id" => $value["userId"]);
	}
}

	


echo $_GET['callback']. '('.json_encode(
$jsonArr
	).")";



?>
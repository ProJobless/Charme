<?php
/*
	Charme Hydra - Handles your distributed requests asynchronously

	Notes: Please restart Apache Server when editing file

	If Gearman Worker was not found: Check if gearman is loaded via php -m
*/
include("log.php");

//
// Warning: Do not start session (aka session_start()) here as session file gets locked otherwise...
//

require_once 'lib/App/ClassLoader/UniversalClassLoader.php';
use Symfony\Component\ClassLoader\UniversalClassLoader;

// Load Symfony Class Loader
$loader = new UniversalClassLoader();
$loader->registerNamespaces(array('App' => __DIR__ . '/lib'));
$loader->register();

// Initialize Gearman
$gmworker= new GearmanWorker();
$gmworker->addServer("127.0.0.1", 4730 );
$gmworker->addFunction("hunt_postman", "hunt_postman_fn");

// Waiting for Job...
while($gmworker->work())
{
  if ($gmworker->returnCode() != GEARMAN_SUCCESS)
  {
    echo "return_code: " . $gmworker->returnCode() . "\n";
    break;
  }
}

function hunt_postman_fn($job)
{
	clog("gearman Received hunt_postman command");
	// Send items out

	$col = \App\DB\Get::Collection();
	$res2 = $col->outbox->find(); // TODO: order by priority

	foreach ($res2 as $resItem)
	{

		$req21 = new \App\Requests\JSON(
		$resItem["message"]["destination"],
		$resItem["message"]["source"],
		$resItem["message"]["payload"]
		
		);

		// Remove from collection
		$col->outbox->remove(array("_id"=> $resItem["_id"]));

		$req21->send(true, $resItem["priority"], $resItem["tries"]);
	}

}


?>
<?
/**
* 	What DB and collection do we use?
* 	Class directly returns a collection
*/

namespace App\Hydra;

// Usage: $col = new \App\DB\Get();
class Distribute
{

	public static function start()
	{

		$gmc= new \GearmanClient();
		$gmc->addServer("127.0.0.1",  4730);

		clog("Sent hunt postman command to gearman...");

		$data = array();
		$task= $gmc->doNormal("hunt_postman", "foo");
	

	}
}

/*
class DistributionService extends \Thread
{
    public function __construct($threadId)
    {
        $this->threadId = $threadId;
    }
 
    public function run()
    {	
		
    }
}
 */




?>
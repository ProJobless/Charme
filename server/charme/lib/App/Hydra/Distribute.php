<?
/**
* 	Send Messages to Gearman Client
*/

namespace App\Hydra;

class Distribute
{
	public static function start()
	{
		$gmc= new \GearmanClient();
		$gmc->addServer("127.0.0.1",  4730);

		$data = array();
		$task= $gmc->doNormal("hunt_postman", "foo");
	}
}
?>
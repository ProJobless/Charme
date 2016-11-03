<?php
/**
*
* Clusters after server id
*/

namespace App\Requests;

// Usage: $col = new \App\DB\Get();
class Cluster
{
	// Cluster people objects by server
	public static function ClusterPeople($people)
	{

		//$person is someone on the server!
		$servers = array();
		$fewpeople = array();

		foreach ($people as $item2)
		{
			$item = $item2["userId"];

			$ex = explode('@',  $item);
			$serverExt = $ex[1];

			if (!in_array($serverExt, $servers))
			{
				$servers[] = $serverExt;
				$fewpeople[] = $item2;

			}
		}




		return $fewpeople;
	}
}
?>

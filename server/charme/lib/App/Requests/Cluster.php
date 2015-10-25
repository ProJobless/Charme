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
			$item = $item["userId"];

			$ex = explode('@',  $item);
			$ex = $ex[1];

			if (!in_array($ex, $servers))
			{
				$servers[] = $ex;
				$fewpeople[] = $item2;

			}
		}




		return $fewpeople;
	}
}
?>

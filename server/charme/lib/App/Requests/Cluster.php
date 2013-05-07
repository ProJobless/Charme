<?php
/**
*
* Clusters after server id
*/

namespace App\Requests;

// Usage: $col = new \App\DB\Get();
class Cluster
{
	public static function ClusterPeople($people)
	{

		//$person is someone on the server!
		$servers = array();
		$fewpeople = array();

		foreach ($people as $item)
		{
			$ex = explode('@',  $item);
			$ex = $ex[1];

			if (!in_array($ex, $servers))
			{
				$servers[] = $ex;
				$fewpeople[] = $item;
					
			}
		}




		return $fewpeople;
	} 
}
?>
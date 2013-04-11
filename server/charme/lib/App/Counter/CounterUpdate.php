<?php
/**
* 	What DB and collection do we use?
* 	Class directly returns a collection
*/

namespace App\Counter;

// Usage: $col = new \App\DB\Get();
class CounterUpdate
{

	public static function set($userId, $counterId, $value)
	{
		$col = \App\DB\Get::Collection();
		$col->users->update(array("userid" => $userId), array('$set' => array('counter_'.$counterId => $value)));
	} 
	public static function get($userId, $counterIds)
	{
		$col = \App\DB\Get::Collection();
		$temp= array();
		foreach ($counterIds as $counter)
			$temp[] = "counter_".$counter;


		return ($col->users->findOne(array("userid" => $userId), $temp));

	} 

	public static function inc($userId, $counterId)
	{
		$col = \App\DB\Get::Collection();
		$col->users->update(array("userid" => $userId), array('$inc' => array('counter_'.$counterId => 1)));

	} 


}
?>
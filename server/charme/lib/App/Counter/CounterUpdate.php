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
		
		$blockIncrement = false;
		
		if ($counterId == "stream")
		{
			// Live updates for new stream items!!
			$context = new \ZMQContext(); // Notifiy events.php which send the notification via web sockets to the client.

			// Send notfication to events.php for push notification to user device.
			$socket = $context->getSocket(\ZMQ::SOCKET_PUSH, 'my pusher');
			$socket->connect("tcp://localhost:5555");
			 $socket->send(json_encode(array("type" => "newNotifications", "owner" =>  $userId)));
			$message = $socket->recv();
			clog2($message);


			
		}

		if (!$blockIncrement)
		{
			$col = \App\DB\Get::Collection();
			$col->users->update(array("userid" => $userId), array('$inc' => array('counter_'.$counterId => 1)));
		}

	} 


}
?>
<?php
/**
*	Notificaitons
*/

namespace App\Counter;


class Notify
{
	const notifyComment = 6;
    const notifyNewCollection = 3;
    const notifyListAdded = 4;
    const notifyLike = 5;
    const notifyNewKey = 7;
	
	public static function set($userId, $value)
	{
		$col = \App\DB\Get::Collection();
		$col->users->update(array("userid" => $userId), array('$set' => array('counter_notify' => $value)));
	} 

	public static function addNotification($userId, $item)
	{

		$col = \App\DB\Get::Collection();
			$col->users->update(array("userid" => $userId), array('$inc' => array('counter_notify' => 1)));

			
		$item["owner"] = $userId;
		$item["time"] = new \MongoDate();
		$col->notifications->insert($item);

		$context = new \ZMQContext(); // Notifiy events.php which send the notification via web sockets to the client.

		// Send notfication to events.php for push notification to user device.
		$socket = $context->getSocket(\ZMQ::SOCKET_PUSH, 'my pusher');
		$socket->connect("tcp://localhost:5555");
		$socket->send(json_encode(array("type" => "newNotifications", "owner" =>  $userId)));

		clog("ADD NOTIGF SENT3");



	} 
	public static function getNotifications($userId)
	{
		$col = \App\DB\Get::Collection();
		return iterator_to_array($col->notifications->find(array("owner" => $userId))->sort(array("time" => -1))->limit(10), false);
	} 


}
?>
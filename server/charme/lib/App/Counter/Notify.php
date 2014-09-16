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

	} 
	public static function getNotifications($userId)
	{
		$col = \App\DB\Get::Collection();
		return iterator_to_array($col->notifications->find(array("owner" => $userId))->sort(array("time" => -1))->limit(10), false);
	} 


}
?>
<?php

namespace App\Requests;

/***
	Name:
	App\Requests\JSON

	Info:
	Class for sending JSON requests from server to another server.

	Namespace:
	App/Requests

	Methods:
	send($debug=false):JSON: Submits request and returns JSON Result.

	Code:PHP:
	$req = new \App\Requests\JSON("someserver.com", "myserver.com", array());
	$req->send();
*/

class JSON
{
	var $destination, $source, $payload ;
	function __construct($a_destination, $a_source, $a_payload=array())
	{
		//$this->data = json_decode($d);
		$this->destination=$a_destination;
		$this->source=$a_source;
		$this->payload= ($a_payload);
	}
	function givePostman($priority, $errorcode=0, $tries=0)
	{
		//clog("POSTMAN PLAYLOAD IS"); clog2($this->payload);

		$message = array("destination" => $this->destination, "source" => $this->source, "payload" => ($this->payload)); // Payload contains request array
		$col = \App\DB\Get::Collection();
		$col->outbox->insert(array("message" => $message, "priority" => $priority, "errorcode" => $errorcode, "tries" => $tries));
	}
	function send($debug=false, $priority=1, $tries=0)
	{
		//clog("SEND PLAYLOAD IS"); clog2($this->payload);

		$dest = explode ('@',$this->destination);

		$server = $dest[1];
		$url = $server."/charme/req.php";


		$data_string = (json_encode($this->payload));
		//clog("DATA STRING IS");
		//clog($data_string);


		$fields = array(
								'd' => urlencode($data_string),
								'receiver' => urlencode($dest[0]),
								'sender' => urlencode($this->source),
						);
		$fields_string ="";
		foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
		rtrim($fields_string, '&');

		$ch = curl_init();


		curl_setopt($ch,CURLOPT_URL, $url);
		curl_setopt($ch,CURLOPT_POST, count($fields));
		curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
		curl_setopt($ch, CURLOPT_TIMEOUT, 2); // 2 seconds timeout, servers have to respond fast!

		// Return result and not status code for curl_exec. This is very important
		curl_setopt($ch, CURLOPT_RETURNTRANSFER , TRUE );


		$result = curl_exec($ch);

		if(curl_errno($ch))
		{
		    $cha = 0;
		    if (isset($ch))
		    	$cha = $ch;

		   $this->givePostman($priority, $cha, (intval($tries)+1));

		}


		curl_close($ch);

		if ($debug) // Use $plain=true for debugging
			echo str_replace('$', '\$', $result);

		clog($result);
		// Only decode if no local request!!!
		return json_decode($result, true);

	}
}
?>

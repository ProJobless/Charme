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
		$this->payload= array("requests" => $a_payload); 
	}

	function send($debug=false)
	{
		$dest = explode ('@',$this->destination);

		$server = $dest[1];
		$url = $server."/charme/req.php";
	                 

		$data_string = (json_encode($this->payload));    

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
		    clog( 'Curl error: ' . curl_error($ch));
		    // 28 is timeout! TODO: Save request and try to send again later on.
		}


		curl_close($ch);

		if ($debug) // Use $plain=true for debugging
			echo str_replace('$', '\$', $result);

		// Only decode if no local request!!!
		return json_decode($result, true);

	}
}
?>
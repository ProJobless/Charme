<?
/*
Class used for information exchange between 
different CHARME servers.
*/

//TODO: Remote Request Package (Bundle multiple messages to one server!)
class remoteRequestPackage
{


}

//ALTERNATIBE: Helper function for user clusterting to domains
function clusterServers($people)
{
	//$person is someone on the server!
	$servers = array();
	$fewpeople = array();

	
	foreach ($people as $item)
	{
		$ex = explode('@',  $item);
		$ex = $ex[1];
		$servers[$ex][] = $item;
	}
	return $servers;


//RETURN: Array with Servers with CharmeIds
}


// Bundles two or more remoteRequests into one HTTP Connection
class multiRequest
{
	var $destination, $source, $requests,$payload ;
	function multiRequest($a_destination, $a_source, $a_requests=array())
	{
		$this->destination=$a_destination;
		$this->source=$a_source;
		$this->requests= $a_requests; // is array! with (requestid, payload)
	}
	function send($debug=false)
	{
		$dest = explode ('@',$this->destination);


		foreach ($this->requests as $item)
		{
			
			$data[] = array("rqid" => $item->request_type, "data" => $item->payload); // $item is of class remoteREquest, get Data by getDAta();

		}


		$server = $dest[1];
		$url = $server."/receiver/index.php";
	                                                                  
		$data_string = (json_encode($data));    

		$fields = array(
								'json' => urlencode($data_string),
								
								'receiver' => urlencode($dest[0]),
								'sender' => urlencode($this->source),
								'multi' => true
							
								
						);
		$fields_string ="";  
		foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
		rtrim($fields_string, '&');

		$ch = curl_init();

		curl_setopt($ch,CURLOPT_URL, $url);
		curl_setopt($ch,CURLOPT_POST, count($fields));
		curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

		// Return result and not status code for curl_exec. This is very important
		curl_setopt($ch, CURLOPT_RETURNTRANSFER , TRUE );

				
		$result = curl_exec($ch);
		curl_close($ch);

		if ($debug) // Use $plain=true for debugging
			echo str_replace('$', '\$', $result);

		// Only decode if no local request!!!
		return json_decode($result, true);

	}
	// ...TODO!

	// remote Request: GET JSON!

}


// Outdated. Better use multiRequest
class remoteRequest
{
	var $destination, $source, $request_type,$payload ;

	//a_typ: See /receiver/index.php for different types of request.
	function remoteRequest($a_destination, $a_source, $a_typ)
	{

		$this->destination=$a_destination;
		$this->source=$a_source;
		$this->request_type= $a_typ;

	}
	public function setPayload($a_arr)
	{
		$this->payload = $a_arr;
	}

	// $plain: return plain query for debug reasons.
	public function send($plain=false)
	{
		$dest = explode ('@',$this->destination);
	
		//$this->payload["receiver"] =$dest[0];

		$server = $dest[1];

		$url = $server."/receiver/index.php";

	
	
		$data = $this->payload;                                                                    
		$data_string = (json_encode($data));    

		$fields_string ="";    


		$fields = array(
								'json' => urlencode($data_string),
								'action' => urlencode($this->request_type),
								'receiver' => urlencode($dest[0]),
								'sender' => urlencode($this->source)
							
								
						);


		foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
		rtrim($fields_string, '&');


		$ch = curl_init();

		


		curl_setopt($ch,CURLOPT_URL, $url);
		curl_setopt($ch,CURLOPT_POST, count($fields));
		curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

		// Return result and not status code for curl_exec. This is very important
		curl_setopt($ch, CURLOPT_RETURNTRANSFER , TRUE );

				
		$result = curl_exec($ch);
		curl_close($ch);

		if ($plain) // Use $plain=true for debugging
			echo str_replace('$', '\$', $result);

		// Only decode if no local request!!!
		return json_decode($result, true);
		
		// TODO: No decode if local request:
		// return ... 

/*
		$ch = curl_init($url);                                                                      
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
		curl_setopt($ch, CURLOPT_POSTFIELDS, 'json='.($data_string));                                                                  
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
		curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
		    'Content-Type: application/json',                                                                                
		    'Content-Length: ' . strlen($data_string))                                                                       
		);                                                                                                                   
		 
		$result = curl_exec($ch);

		echo $result;
*/
	}
}
?>
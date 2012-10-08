<?


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

	public function send()
	{
		$server = explode ('@',$this->destination);
		$server = $server[1];


		//file_get_contents
	}


}
?>
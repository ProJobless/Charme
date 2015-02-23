<?php
/**
* 	What DB and collection do we use?
* 	Class directly returns a collection
*/

namespace App\Security;

// Usage: $col = new \App\DB\Get();
class RequestVerificator
{
	// Check if it is a valid request
	/* 
		@param json: 	The JSON data of the request
		@param userId : The complete userId of the session owner e.g you@yourserver.com
	*/
	public static function Verify($json, $userId="")
	{
		// TODO!!
		return true;
	} 


}
?>
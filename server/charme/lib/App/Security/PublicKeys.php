<?
/**
* 	What DB and collection do we use?
* 	Class directly returns a collection
*/

namespace App\Security;

// Usage: $col = new \App\DB\Get();
class PublicKeys
{
	/*
		Trys to add a public key to the servers directory
		@param $userId 		The user id
		@param $revision 	The revision

		@returns 1: If newly added, 2: If already exists and no difference 3: If difference
	*/
	public static function tryToAdd($userId, $revision)
	{
		$col = \App\DB\Get::Collection();
		
		// Check if public key already exists
		$col->serverKeyDirectory->find(array("userId"=>$userId, "revision" => $revision));
		//return $db_internal_mongo->charme2;

		// If not found -> Send request!
		$data = array("requests" => array(
				"id" => "key_get",
				"profileId" => $userId,
				));

		$req21 = new \App\Requests\JSON(
		$userId,
		"SERVERNAME",
		$data);

		$redData = $req21->send();

		clog2($reqData);

		return true;
	} 
}
?>
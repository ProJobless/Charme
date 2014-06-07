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

		@returns 1 if success, 3 if key revision is outdated or invalid
	*/
	public static function tryToAdd($userId, $revision)
	{
		
		$col = \App\DB\Get::Collection();
		$result = $col->serverKeyDirectory->count(array("userId"=>$userId, "key.revision" => $revision));
		

		if ($result < 1)
		{
		// If not found -> Send request!
		$data = array("requests" => array(array(
				"id" => "key_get",
				"profileId" => $userId,
				)));

		$req21 = new \App\Requests\JSON(
		$userId,
		"SERVERNAME",
		$data);

		$reqData = $req21->send();
		if ($reqData["key_get"]["revision"] == $revision)
			$col->serverKeyDirectory->insert(array("userId" => $userId, "key" => $reqData["key_get"]));
		else
			return 3;
		//$reqData["key_get"];
		print_r($reqData);
		return true;
		// Check if public key already exists
		}
		else
			return 1;


	} 
}
?>
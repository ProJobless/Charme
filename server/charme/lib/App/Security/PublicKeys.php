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
	/*	
		@param object is a array with: {object, signature {keyRevision, hashvalue}}
	*/		
	public static function checkX509($object, $n, $e)
	{
		echo "verifying cert..........";
		$res_pubkey = RSAHelper::kimssl_pkey_get_public($n, $e);
		


//echo 'JSON  JS EXPORTED: {"test":"esr"} vs '.json_encode($object["object"]). "<br><br> SIGNATURE VALUE:". $object["signature"]["hashvalue"]."<br><br>";
echo "signature is".($object["signature"]["hashvalue"]);
		// $json = ' {"object":{"test":"esr"},"signature":{"keyRevision":2,"hashvalue":"3af9b3a1aa867ccc4f99e8b00d4de6943eab4ad7d484087f94f3b66b3704b264f6817d4751bd3b443b69438048ccc10f62ef7f9b73472276773b73398794669bd4fd5c47dda07a6ca8a1ea7cdb69261abb45f1258c8f089197047768786945c32e9ac29a89b5d69c6115e3444565d0ecca9d7b886836bf0ef8662bf4fc97759ca7cc70dc7e4abbce14090ff0d4a2a2fc5062d2f637b8de71200d535d3c4b6bda1abf6cdcc99e3bf55d891e17711c35653d4fa2f86418a8cd6be6144a4fea608f661d8a8927a0e8870bc4e682bcf2112153b87500e551132bab112a27f05daf0e173af62334165523b45b11300784e80f056fd04a51715509885ff781d56d450d"}}';
	
		echo "<br><br>VERIFY STATUS: ";
		$ok = openssl_verify(json_encode($object["object"]), hex2bin($object["signature"]["hashvalue"]), $res_pubkey, "sha256WithRSAEncryption");
		if ($ok == 1) {
		    echo "good";
		} elseif ($ok == 0) {
		    echo "bad";
		} else {
		    echo "ugly, error checking signature";
		}








	}
}
?>
<?
/**
* 	What DB and collection do we use?
* 	Class directly returns a collection
*/

namespace App\Verificator;

// Usage: $col = new \App\DB\Get();
class Check
{
	// Check if it is a valid request
	public static function Collection()
	{
		$db_internal_mongo= new \MongoClient();
		return $db_internal_mongo->charme2;
	} 


}
?>
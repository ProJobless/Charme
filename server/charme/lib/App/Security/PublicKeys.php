<?
/**
* 	What DB and collection do we use?
* 	Class directly returns a collection
*/

namespace App\Keys;

// Usage: $col = new \App\DB\Get();
class Manage
{

	public static function Collection()
	{
		$db_internal_mongo= new \MongoClient();
		
		//return $db_internal_mongo->charme2;
	} 


}
?>
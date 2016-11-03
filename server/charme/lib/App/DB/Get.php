<?php
/**
* 	What DB and collection do we use?
* 	Class directly returns a collection
*/

namespace App\DB;

// Usage: $col = new \App\DB\Get();
class Get
{

	public static function Collection()
	{
		$db_internal_mongo= new \MongoClient("mongodb://localhost");
		return $db_internal_mongo->charme2;
	} 


}
?>
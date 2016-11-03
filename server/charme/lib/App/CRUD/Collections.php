<?php
/**
*
* Posts in collections
*/

namespace App\CRUD;

class Collections
{
  // Deletes all content belonging to a post on a remote server.
	public static function Insert($owner, $name, $description)
	{
    $col = \App\DB\Get::Collection();
    $content = array(
            "owner" => $owner,
            "name" => $name,
            "description" => $description,
            "currentlist" => 0
            );

    $col->collections->insert($content);
    $content3 = array("owner" => $owner, "collectionOwner" => $owner, "collectionId" => new \MongoId($content["_id"]));
    $col->following->insert($content3);

    $content2 = array("follower" => $owner,
     "collectionId" => new \MongoId($content["_id"]));
    $col->followers->insert($content2);



    return true;
	}
}
?>

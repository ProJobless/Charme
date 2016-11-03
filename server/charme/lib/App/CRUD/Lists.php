<?php
/**
*
* List containing different users
*/

namespace App\CRUD;

class Lists
{
	public static function CreateList($listName, $ownerId)
	{
    $col = \App\DB\Get::Collection();
    $content = array("name" => $listName, "owner" => $ownerId);

    if ($listName != "") {
      $ins = $col->lists->insert($content);
    return   $content["_id"]->__toString();
    }
      return false;
	}
}
?>

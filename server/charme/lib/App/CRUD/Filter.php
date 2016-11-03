<?php
/**
*
* Manage filters for contextual posts
*/

namespace App\CRUD;

class Filter
{
	public static function CreateFilterWithList($owner, $context, $name, $lists, $hint="")
	{
    $col = \App\DB\Get::Collection();

    $data = array(
      "name" => $name,
      "owner" => $owner,
      "context" => array($context),
      "lists" => $lists,

    )

    ;

    if ($hint!="")
      $data["hint"] = $hint;

    $data = array("owner" =>$owner, "data" =>   $data, "createdAt" => new \MongoDate(), "class" => "filter");
    $ret = $col->simpleStorage->insert($data);
  /*
  [_id] => 566b21667f8b9ab70e8b4567
    [owner] => hryCrLzuoTytNiZaXfLY@charme.local
    [data] => Array
        (
            [name] => offer all
            [context] => Array
                (
                    [0] => offer
                )

            [constraints] => Array
                (
                )

        )

    [createdAt] => MongoDate Object
        (
            [sec] => 1449861478
            [usec] => 398000
        )

    [class] => filter
  */


	}
}
?>

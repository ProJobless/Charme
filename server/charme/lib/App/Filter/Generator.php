<?php

namespace App\Filter;

class Generator
{
  // Generate Server list we connect to....
  public static function getServerList($filterObject, $dbCollection) {

    $serverArray[] = array(); // Only needed on none remote servers!!
    $returnedServers = array();

    if (isset($filterObject) && isset($filterObject["lists"])) {

      $useList = true;
      // 1. get people in the lists!
      $listitems = [];
      foreach ($filterObject["lists"] as $listitem) {
      //  clog("----".$listitem);
        $listitems[] = new \MongoId($listitem);
      }

      $okusers = $dbCollection->listitems->find(array(
      'owner' => $_SESSION["charme_userid"],
        'list' => array('$in' => $listitems)), array("userId"));

      $people = [];
      foreach ($okusers as $user)
        $people[] = $user["userId"];

      // Get all the servers we gonna connect to....
      $serverArray = array();
      foreach ($people as $userIdString) {
        $splitArray = explode ('@', $userIdString);
        $server = $splitArray[1];
        $returnedServers[] = $server;

      }

    }
    else {
        $res2 = $dbCollection->keydirectory->find(array("owner" => $_SESSION["charme_userid"] ));
        foreach ($res2 as $resItem) {
          $splitArray = explode ('@', $resItem["userId"]);
          $server = $splitArray[1];
          $serverArray[] = $server;
      }
        $returnedServers =  array_slice($serverArray, 0, 5);

    }

    return array_unique($returnedServers);

  }

  // Filter Object: filter object got from client, dbCollection: MongoDB collection
  // onremote: are the contraints are generated on another server than the stream owners one (aka stream_respond request)
  public static function getConstraints($filterObject, $dbCollection, $onRemote=false)
	{
    $returnArray = array();

    $prefix = "post.metaData";
    if ($onRemote)
      $prefix = "postData.object.metaData"; // post collection items and stream collection items differentiate slightly

    $const1 = array();
    $const2 = array();
    $const3 = array();




    if (isset($filterObject) && isset($filterObject["context"])) {
      $const1 = array($prefix.".type" => array('$in' => $filterObject["context"]));
    }
    if (isset($filterObject)  && isset($filterObject["archived"]) && !$onRemote)
    {
      $const2 = array("archived" => true);
    }
    if (isset($filterObject)  && isset($filterObject["constraints"]))
    {

      // TODO: ensureIndex on GPS Location

      foreach ($filterObject["constraints"] as $constraint) {
        if ($constraint["type"] == "range") {
          $const3[$prefix.".".$constraint["name"]] = array('$gte' => intval( $constraint["start"]));
          $const3[$prefix.".".$constraint["name"]] = array('$lt' =>intval(  $constraint["end"]));
        }
        else  if ($constraint["type"] == "exact") {
          $const3[$prefix.".".$constraint["name"]] = $constraint["value"] ;
        }
        else  if ($constraint["type"] == "location") {

          // NOTE: Delete index if database layout changes


          if (false) {
              $dbCollection->streamitems->deleteIndex( "post.metaData.".$constraint["name"]."_data.position");
              $dbCollection->posts->deleteIndex("postData.object.metaData.".$constraint["name"]."_data.position");
          }


          else {
            // TODO: This is SLOW. Make this only once!!

              $dbCollection->posts->ensureIndex(
              array( "postData.object.metaData.".$constraint["name"]."_data.position" => '2dsphere'),
              array("sparse" => true));
              $dbCollection->streamitems->ensureIndex(
              array( "post.metaData.".$constraint["name"]."_data.position" => '2dsphere'),
              array("sparse" => true));
          }

          $const3[$prefix.".".$constraint["name"]."_data.position"] =
          array(
            '$nearSphere' => array(
            '$geometry' => array(
              "type" => "Point",
              "coordinates" =>
            array(floatval($constraint["value"]["position"]["coordinates"][0]),
            floatval($constraint["value"]["position"]["coordinates"][1]))

          ),

            '$maxDistance' => intval($constraint["radius"])*1000
          ));
        }


      }

    }

    return  array_merge($const1, $const2, $const3);


	}

}
?>

<?php

namespace App\Collections;

class Comments
{
  // Returns 3 newest comments of a post
  // Warning: charmeCollectionId is a charme collection, dbCollection is a MongoDB collection/
  // dont mix them up :)
  public static function Get($postId, $dbCollection, $useStreamComments = false) {
        if ($useStreamComments)
        $iter = $dbCollection->comments->find(array("commentData.object.postId" => $postId))->sort(array('commentId' => -1))->limit(3);
        else {
          $iter = $dbCollection->streamcomments->find(array("commentData.object.postId" => $postId))->sort(array('_id' => -1))->limit(3);
        }
        $newarray = array();
        foreach  ($iter as $item) {

        //  clog2($item["_id"], "montest");
            if (gettype($item["_id"]) == "MongoId" &&  !$useStreamComments)
            {
              $item["commentId"] = $item["_id"]->__toString();
            }
            unset($item["_id"]);

            $newarray[] = $item;
        }

        return array_reverse($newarray);
    }

    //
    // Converts a post to a  stream object
    //
    public static function Makestream($postItem, $dbCollection, $doesLike, $comments) {
      $postItem["meta"] = array(
        "time" => $postItem["time"],
        "hasImage" => $postItem["hasImage"],

        "username" => $postItem["username"])
      ;
      $postItem["post"] = $postItem["postData"]["object"];
      $postItem["postId"] =   $postItem["_id"]->__toString();
      $postItem["comments"] = $comments;
      $postItem["like"] = $doesLike;
      $postItem["postId"] = $postItem["_id"]->__toString();
      ;
      unset($postItem["postData"]["object"]);

      return $postItem;

    }

}
?>

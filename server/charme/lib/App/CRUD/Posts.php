<?php
/**
*
* Posts in collections
*/

namespace App\CRUD;

class Posts
{
  // Deletes all content belonging to a post on a remote server.
	public static function deleteOnRemote($postId)
	{
    $col = \App\DB\Get::Collection();
    $col->streamitems->remove(array("postId" => $postId));
    $col->streamcomments->remove(array("commentData.object.postId" => $postId));

    return true;
	}
}
?>

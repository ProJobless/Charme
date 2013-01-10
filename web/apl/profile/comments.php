<?
function addComment($postowner, $postid, $userId, $content)
{
	//Check if it is my host, or another host

	//send protocol to host....

	include_once($_SERVER['DOCUMENT_ROOT']."/apl/remote.php");


	$rr = new remoteRequest($postowner,  $userId, "comment_get");
	$rr->setPayload(array("postid"=> $postid, "content" => $content, "userid"=> $userId, "posttime"=> (time())));
	$rr->send(true);

}

//UserId: The person who wants to delete the comment.
function deleteComment($userid, $comId)
{
/*
	TODO: Cross Site Deletions!

*/

	global $db_charme;

	$count = $db_charme->postcomments->remove(array("userid" => $userid, "_id" => new MongoId( $comId)));

}
function getCommentCount($postid)
{
		//problem: STREAM ID != POSTID!!!
	global $db_charme;

	$count = $db_charme->postcomments->find(array("postid" => new MongoId( $postid)))->count();
	return $count;

}
function getComments($postid, $owner, $invader,  $start, $range)
{

	include_once($_SERVER['DOCUMENT_ROOT']."/apl/remote.php");


	$rr = new remoteRequest($owner,  $invader, "comment_read");
	$rr->setPayload(array("start"=> $start, "range" => $range, "postid"=>$postid));
	$ret =  $rr->send();

	return $ret;
	//If $start is negative, the first comment is $lastindex-$start
	/*
echo ".".$postid;
echo ".".$owner;
echo ".".$start;
echo ".".$range;*/



	//problem: STREAM ID != POSTID!!!


	// TODO: Cross Site Access!

	// TODO: CHECK AUTHENTICATION!!

	/*
	Warning: It is not possible to sort sub documents
	http://stackoverflow.com/questions/3848814/sort-sub-documents-in-mongodb for more information.
	This may become a problem, if some comments are received later, but where posted earlier.
	Therefore, the original posttime is ignored. Therefore posttime is the time when the comment is received.
	*/
	

	/*$re = $db_charme->posts->findOne(
		array("_id" => new MongoId( $postid)),
		array('comments' => array( '$slice' =>  array($start,$range)))
		);*/
	//$count = $db_charme->postcomments->find(array("postid" => new MongoId( $postid)))->count();


}



?>
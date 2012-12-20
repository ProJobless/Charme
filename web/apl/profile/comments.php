<?
function addComment($postowner, $postid, $userId, $content)
{
	//Check if it is my host, or another host

	//send protocol to host....

	include_once($_SERVER['DOCUMENT_ROOT']."/apl/remote.php");


	$rr = new remoteRequest($postowner, $_SESSION["charme_user"], "comment_get");
	$rr->setPayload(array("postid"=> $postid, "content" => $content, "userid"=> $userId, "posttime"=> (time())));
	$rr->send();

}

function getCommentCount($postid)
{
		//problem: STREAM ID != POSTID!!!
	global $db_charme;

	$count = $db_charme->postcomments->find(array("postid" => new MongoId( $postid)))->count();
	return $count;

}
function getComments($postid, $owner, $start, $range)
{

	//If $start is negative, the first comment is $lastindex-$start
	/*
echo ".".$postid;
echo ".".$owner;
echo ".".$start;
echo ".".$range;*/



	//problem: STREAM ID != POSTID!!!
	global $db_charme;

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
return $db_charme->postcomments->find(array("postid" => new MongoId( $postid)))->sort(array("posttime" => -1))->limit($range)->skip($start);


}
function receiveComment($data)
{
	//Check if it is my host, or another host

	//send protocol to host....

	//echo "ATTACH TO:".$data["postid"];
	//TODO: Send notification to (ALL?) post followers 
	//print_r($data);
	global $db_charme;
	$comment = array("postid" => new MongoId($data["postid"]), "userid" => $data["userid"], "content" => $data["content"], "posttime"=> new MongoDate(time()));//"postid" => $data["postid"]

	
/*
$historyDoc = array('_id'=>$uID.'-0',
        'count'=>1, 
        'events'=>array());
From there, you can simply take what you were going to put into the first index and upsert it later:

$collection->update($query, $historyDoc,
             array('safe'=>true,'timeout'=>5000,'upsert'=>true));

$collection->update($query,
            array('$push'=>array('events'=>$event)),
            array('safe'=>true,'timeout'=>5000,'upsert'=>true));


*/

//$xy = $db_charme->posts->update(array("_id"=>new MongoId($data["postid"])),	array('$set' => array("comments"=> array())));


	// Sub array like this is a bad idea, as with every new comment whole post has to be reordered in memory
	//$xy = $db_charme->posts->update(array("_id"=>new MongoId($data["postid"])),array('$push' => array('comments' => $comment)), array("upsert" =>true));
	

 	$db_charme->postcomments->insert($comment);
 
	//print_r($xy);


	//TODO: SEND UPDATE TO followers if not send within the last two minutes!



	return true;

}

?>
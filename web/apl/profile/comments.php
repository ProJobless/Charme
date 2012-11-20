<?
function addComment($postowner, $postid, $userId, $content)
{
	//Check if it is my host, or another host

	//send protocol to host....

	include_once($_SERVER['DOCUMENT_ROOT']."/apl/remote.php");


	$rr = new remoteRequest($postowner, $_SESSION["charme_user"], "comment_get");
	$rr->setPayload(array("postid"=> $postid, "content" => $content, "userid"=> $userId, "posttime"=>  new MongoDate(time())));
	$rr->send();

}
function getComments($postid, $owner, $start, $range)
{


	//problem: STREAM ID != POSTID!!!
	global $db_charme;

	//TODO: CHECK AUTHENTICATION!!

	$re = $db_charme->posts->findOne(array("_id" => new MongoId( $postid)), array('comments' => array( '$slice' =>  array($start,$range) )));
	


	return $re["comments"];



}
function receiveComment($data)
{
	//Check if it is my host, or another host

	//send protocol to host....

	//echo "ATTACH TO:".$data["postid"];
	//TODO: Send notification to (ALL?) post followers 
	//print_r($data);
	global $db_charme;
	$comment = array("userid" => $data["userid"], "content" => $data["content"]);//"postid" => $data["postid"]

	
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


	$xy = $db_charme->posts->update(array("_id"=>new MongoId($data["postid"])),array('$push' => array('comments' => $comment)), array("upsert" =>true));
	


	print_r($xy);


	//TODO: SEND UPDATE TO followers if not send within the last two minutes!



	return true;

}

?>
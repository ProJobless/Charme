<?
function getFollowers($collection, $userId, $invader)
{

	global $db_charme;
	$qu = array("collection" => $collection);
	return $db_charme->followers->find($qu);

	

}

function getFollowersOfUser($userId, $invader)
{
	/*
	global $db_charme;
	$qu = array("owner" => $userid);
	return $db_charme->followers->find($qu);
*/
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/remote.php");
	$rr = new remoteRequest($userId, $invader, "followers_get");
	//$rr->setPayload(array());
	$ret =  ($rr->send());
	return $ret;

}
function getFollowingOfUser($userId, $invader){
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/remote.php");
	$rr = new remoteRequest($userId, $invader, "following_get");
	//$rr->setPayload(array());
	$ret =  ($rr->send());
	return $ret;

	/*
	global $db_charme;
	$qu = array("owner" => $userid);
	return $db_charme->followerslocal->find($qu);*/

}
function followCollection($userId, $owner, $collection, $follow)
{
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/remote.php");

	//Step 1: Send follow request to collection owner
	
	global $db_charme;

	$rr = new remoteRequest($owner, $userId, "collection_follow");
	$rr->setPayload(array("collectionid"=> $collection, "sender" => $userId, "follow"=> $follow));
	$ret = $rr->send();
	


	if ($ret == "OK")
	{
		//If follows now
		if ($follow)
		{
			$content = array("collection" => $collection, "owner" => $owner, "follower" =>$userId);
			$xy = $db_charme->followerslocal->update($content, $content, array("upsert" =>true));
		}
		else
		{
			$content = array("collection" => $collection, "owner" => $owner, "follower" => $userId);
			$xy = $db_charme->followerslocal->remove($content);
		}
	}
return $ret;
	//insert into userfollowers...
	//If request succeeds then add to my collections, 
}
function registerCollectionFollow($data)
{

	global $db_charme;
	//(sender server has been validated now)
	$sender = urldecode($data["sender"]);

	$content = array("collection" => $data["collectionid"], "follower" => $data["sender"]);

	//TODO: Check if user can follow collection, check if collection exists, if user is not allowed to follow then echo AUTHERROR 
	if ($data["follow"])
		$xy = $db_charme->followers->update($content, $content, array("upsert" =>true));
	else
		$xy = $db_charme->followers->remove($content);
	

	return $data["follow"];
}
function doesFollow($userId, $collectionId)
{
	//This is used by the requested server to check if a $userId follows a certain local collection
	//Therefore a second argument for the invader is not necessary
	global $db_charme;

	$qu = array("collection" => $collectionId, "follower" =>$userId);

	$cursor = $db_charme->followers->findOne($qu );

	if ($cursor == NULL)
	return false;
	return true;
}
//Sometimes I write comments just for fun.
?>
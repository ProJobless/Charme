<?
function registerPost($data)
{

	//TODO: Chance 1/1000 => delete older posts then 3 days from streams!
	global $db_charme;
	foreach ($data["people"] as $person)
	{


	$db_charme->stream->insert(array("userid" =>$person, "post" => $data["post"] ));
	}
//
}


function postToCollection($collection, $content, $userId, $attachments=array(), $isGroup =false)
{
	//note: $collection is groupid if $isGroup = true
	$destfield = "collection";
	if ($isGroup)
		$destfield = "groupid";

echo "!!!".$isGroup."!!!";


	global $db_charme;
	//todo: validate strings!!
	$obj = ($collection==0) ? NULL : new MongoId($collection);
	//2do: getusername!!
$name = "testname";
$cont = array("userid" => $_SESSION["charme_user"],
			"username" => $name,
			"content" => $content,
			$destfield => $obj,
			"attachments" => $attachments,
			"posttime" =>  new MongoDate(time())
		
			);

	$db_charme->posts->insert($cont	);

foreach ($attachments as $file)
{
$filename = $file[1];  //




	
	$m = new Mongo();
	$db = $m->charme;
	$grid = $db->getGridFS();

$type = "JPG"; //TODO!!!!


	$grid->storeBytes($file[0], array('filename'=> $filename, 'owner' => $userId, 'type'=>$type,'owner' => $username,'postid' => $cont["_id"]));

	


						//TODO: GET File type!
//base64_decode($file[0]); //TODO:Save file lenght


//Insert file into GridFS

}


//echo "THE POSTID IS:".$cont["_id"]."!!!";

	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/follow.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/remote.php");

	$ar_followers = array();
	$arr = getFollowers($collection);
	foreach ($arr as $item){$ar_followers[] = $item["follower"];}

	$servers = clusterServers($ar_followers);

	foreach ($servers as $server)
	{
		$rr = new remoteRequest($server[0], $userId, "post_new");
		$rr->setPayload(array("post"=> $cont, "people"=> $server));
		$ret = $rr->send();
	}
	//TODO: notify followers!

	/*
$st = array(
	array("postId"=> 1234, "userId"=> "herp@myserver.com", "username" =>"Herp Derp", "content"=>"Hey whats up here", "attachments" =>array(array("typ"=>0, "name"=>"Google Logo", "url"=>"http://www.google.de/images/srpr/logo3w.png"),array("typ"=>0, "name"=>"Google Logo", "url"=>"http://www.google.de/images/srpr/logo3w.png"),array("typ"=>0, "name"=>"Google Logo", "url"=>"http://www.google.de/images/srpr/logo3w.png")), "time"=>123141),
	array("postId"=> 1234, "userId"=> "herp@myserver.com", "username" =>"Herp Derp", "content"=>"Hey whats up here", "time"=>123141),
	array("postId"=> 1234, "userId"=> "herp@myserver.com", "username" =>"Herp Derp", "content"=>"Hey whats up here", "time"=>123141),
		array("postId"=> 1234, "userId"=> "herp@myserver.com", "username" =>"Herp Derp", "content"=>"Hey whats up here", "time"=>123141),
			array("postId"=> 1234, "userId"=> "herp@myserver.com", "username" =>"Herp Derp", "content"=>"Hey whats up here", "time"=>123141),
				array("postId"=> 1234, "userId"=> "herp@myserver.com", "username" =>"Herp Derp", "content"=>"Hey whats up here", "time"=>123141),
	
	);
	return $st;
	*/
}
?>
<?

function postToCollection($collection, $content, $attachments=array())
{


	global $db_charme;
	//todo: validate strings!!
	$obj = ($collection==0) ? NULL : new MongoId($collection);
	//2do: getusername!!
$name = "testname";
	$db_charme->posts->insert(
		array("userid" => $_SESSION["charme_user"],
			"username" => $name,
			"content" => $content,
			"collection" => $obj,
			"attachments" => $attachments,
			"posttime" =>  new MongoDate(time())
		
			));

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
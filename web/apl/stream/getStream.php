<?
//$start, $userid (PROOF) etc
 


function StreamAsArray($userid)
{
	
	//TODO: CHECK AUTHENTICATION!!
	

	//postid = _id
	$st = array(
	array("postId"=> 1234, "userId"=> "herp@myserver.com", "username" =>"Herp Derp", "content"=>"Hey whats up here", "attachments" =>array(array("typ"=>0, "name"=>"Google Logo", "url"=>"http://www.google.de/images/srpr/logo3w.png"),array("typ"=>0, "name"=>"Google Logo", "url"=>"http://www.google.de/images/srpr/logo3w.png"),array("typ"=>0, "name"=>"Google Logo", "url"=>"http://www.google.de/images/srpr/logo3w.png")), "time"=>123141),
	array("postId"=> 1234, "userId"=> "herp@myserver.com", "username" =>"Herp Derp", "content"=>"Hey whats up here", "time"=>123141),
	array("postId"=> 1234, "userId"=> "herp@myserver.com", "username" =>"Herp Derp", "content"=>"Hey whats up here", "time"=>123141),
		array("postId"=> 1234, "userId"=> "herp@myserver.com", "username" =>"Herp Derp", "content"=>"Hey whats up here", "time"=>123141),
			array("postId"=> 1234, "userId"=> "herp@myserver.com", "username" =>"Herp Derp", "content"=>"Hey whats up here", "time"=>123141),
				array("postId"=> 1234, "userId"=> "herp@myserver.com", "username" =>"Herp Derp", "content"=>"Hey whats up here", "time"=>123141),
	
	);
	return $st;
}

?>
<?
function newMessage($sender, $receivers)
{
	$m = new Mongo();
	$db = $m->charme;
	$collection = $db->messages;
	
	$obj = array( "messageId" => "123", "author" => $sender, "to" => $receivers );
	
	foreach ($receivers as $userId)
	{
		//SEND PROTOCOLL
		
	}
	
	$collection->insert($obj);
}
function appendMessage($sender, $messageId)
{
	
	
}

?>
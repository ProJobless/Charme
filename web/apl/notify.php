<?
function notify_new($userid, $typ, $payload)
{
	global $db_charme;
	$db_charme->listitems->insert(array("userid"=> $owner, "typ" => $typ, "payload"=> $payload));
}
?>
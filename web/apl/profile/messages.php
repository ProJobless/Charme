<?
/*
registerMessage, will be called by receiver servers
*/
function registerMessage($data)
{
	global $db_charme;

	$people = $data["people"];
	/* Used collections:
	messageIds: to get a unique id for this group of users
	messageReceivers: contains a entry for all receivers of the message
	messages: 
	*/


	//STEP 1: check if sender is in ALL receivers lists.

	//	echo "HOST".$_SERVER['SERVER_NAME'] ;
	//STEP2: insert talkmessage with fields people, (_id), message, superid
	//superid is an unique id for this group of people

	//SuperID: (1) sort charmeIDs, (2) make md5, (3) Check if really charmeIDs
	


	sort ($people); //returns bool!, do not use asort as indexes are comparable


	$superID = md5(implode(',', $people)); //MD5 is only used for performance reasons, so its not a security vulnerability 

	//Insert into people ids to get uniqueID
	//Case 1: superID exists
	$content = array("superid" => $superID, "people" => $people);
	$db_charme->messageIds->update(array("superid" => $superID, "people" => $people), $content, array("upsert" => true));

	$cur = $db_charme->messageIds->findOne($content);

	//Case 2: superID does not exists -> Create new entry
	$uniqueID = $cur["_id"]; 

	//TODO: Avoid duplicates! (Also duplicate servers have been filtered out by sender!)

	$db_charme->messages->insert(array("uniqueId" => $uniqueID, "content" => $data["content"], "attachments" => $data["attachments"], "author" => $data["author"], "time"=>$data["time"]));


	//STEP 3: insert into messagesto for all people on this server!
	$people = $data["people"];
	foreach ($people as $item)
	{
		$ex = explode('@',  $item);
		//Person is on my server, so reference message in collection messagesto with fields
		//owner, superid, excerpt, newestpeople (als for images used!); USE UPSERT!!!
		if ($_SERVER['SERVER_NAME'] == $ex[1]) 
		{
				$content2 = array("time"=>$data["time"], "receiver"=> $item,"peoplecount"=> Count($people) , "uniqueId" => $uniqueID, "lastauthor" =>$data["author"], "preview" => $data["content"]); //TODO: Shorten preview!

				$db_charme->messageReceivers->update(array("uniqueId" => $uniqueID, "receiver" => $item), $content2, array("upsert" => true));
		}
	}
	//Done :)
}

function getMessageCount($userID)
{


}
function getMessageItems($userID, $uniqueId)
{
	
	global $db_charme;
	//TODO: CHeck if user part of ppl

	$col = $db_charme->messages;
	$cursor = $col->find(array("uniqueId"=>new MongoId($uniqueId)))->sort(array("time" => 1));
	return $cursor;

}
function getMessagePeople($userID, $uniqueId)
{
	global $db_charme;


	$col = $db_charme->messageIds;
	$cursor = $col->findOne(array("_id"=>new MongoId($uniqueId)));
	return $cursor;

}


function getAllMessages($userID, $start, $end)
{
	global $db_charme;

	$col = $db_charme->messageReceivers;
	$cursor = $col->find(array("receiver"=>$userID))->sort(array("time" => 1));
	return $cursor;

}
/*
sendMessage is called by sender server
*/
function sendMessage($sender, $receiverPeople, $content, $attachments =array())
{

	//Add sender to receivers!
	$receiverPeople[] = $sender;

//Eliminate duplicates!
$receiverPeople = array_unique ($receiverPeople); //Eliminate duplicates
	//send to all servers!


$payload = array(
"receivers" => $receiverPeople,


	);


	include_once($_SERVER['DOCUMENT_ROOT']."/apl/remote.php");


	//$person is someone on the server!
	$servers = array();
	$fewpeople = array();

	// Store attachments in database
	global $db_charme;
	$attachments2 = array();

if (!isset($attachments))
	$attachments = array();

	foreach ($attachments as $file)
	{
		/*
		The content of this loop should be mostly equivalent to the postToCollection functions file loop in
		apl/stream/post.php which is used for post attachments

		TODO: Build a function?
		*/

		$filename = $file[1];  //
		$grid = $db_charme->getGridFS();

		$file2 = explode(',',  $file[0]);

		// Get File Type e.g text/plain
		$tmp = explode(';',  $file2[0]);
		$tmp = explode(':',  $tmp[0]);
		
		//Return file type
		$type = $tmp[1];

		$objId = (string)$grid->storeBytes(base64_decode ($file2[1]), array('filename'=> $filename, 'owner' => $sender, 'type'=>$type));
		$attachments2[] = array("name" => $filename, "fileId"=>$objId);
	}

	//Send Message at one person per server!
	foreach ($receiverPeople as $item)
	{
		$ex = explode('@',  $item);
		$ex = $ex[1];

		if (!in_array($ex, $servers))
		{
			$servers[] = $ex;
			$fewpeople[] = $item;
		}
	}



	foreach ($fewpeople as $person)
	{
		$rr = new remoteRequest($person, $sender, "talk_postMessage");
		$rr->setPayload(array("attachments" => $attachments2, "people"=>  $receiverPeople, "content"=>$content, "author"=> $sender, "time"=> time()));
		$rr->send();
	}

	//TODO: If everything is ok add attachment!

	//Return attachment array which will be displayed by the gui
	return array("attachments"=>$attachments2);
}
//This is just a comment written for fun.

?>
<?
/*
This file can either be loaded via ajax or be included by talks.php
Make sure both possibilities work!
*/


// If file is loaded by ajax, we need to include the used libraries
// It it loaded per ajax if the varaible $basepath is undefined (else included in framework.php)

if (!isset($basepath))
{
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/messages.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
needSession(); // Check if user is logged in
fw_load("post");
}

$items =3; // How many items are loaded with one request?


if (!isset($_GET["s"])) // No start index given -> get index of last comments
{
	$start = getMessageCount($_GET["q"])-$items;
}
else
{
	$start = (isset($_GET["s"]) ? $_GET["s"] : 0);
}

$newstart = $start-$items;


if ($start < 0)
	$start = 0;

// Show more button only if needed
if ($start > 0)
	echo "<a class='more' onclick='loadMessages(\"".$_GET["q"]."\", $newstart)' style='margin:0 16px'>More...</a>";

$items = getMessageItems($_SESSION["charme_user"], $_GET["q"], $start,$items  );
foreach ($items as $item)
{
	echo message_format($item["author"], $item["content"], $item["attachments"]);
}

?>


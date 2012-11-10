<?
session_start();

include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/fs/images.php");
if ($_FILES["pic"]['name'] != "")
{
	echo "2";
	storeProfileImage("pic", $_SESSION["charme_user"]);	
	header("Location: /?p=config&q=5&m=1");
	die();
}?>
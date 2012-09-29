<?
$basepath = $_SERVER['DOCUMENT_ROOT']."/";

function needSession()
{
	session_start();
	if (!isset($_SESSION["charme_user"]))
	{
		echo "Please login to view this page.";
		die();
	}
	$_SESSION[id] = intval($_SESSION[id]);
}
function fw_load($module)
{
	global $basepath;
	include_once($basepath."/ui/framework/".$module.".php");
	
}
?>
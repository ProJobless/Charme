<?
$basepath = $_SERVER['DOCUMENT_ROOT']."/";

function needSession()
{
	if (!isset($_SESSION))
	session_start();
	if (!isset($_SESSION["charme_user"]))
	{
		echo "Please login to view this page.";
		die();
	}
	//$_SESSION[] = intval($_SESSION[id]);
}
function fw_load($module)
{
	global $basepath;
	include_once($basepath."/ui/framework/".$module.".php");
	
}
function getget($name)
{
	if (isset($_GET[$name]))
		return $_GET[$name];
		return 0;
}

function retget($item)
{
	if (isset($item))
		return $item;
		return "";
}
?>
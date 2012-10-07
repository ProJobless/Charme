<?
//This file will be called from welcome.php or mainframe.php and is used for login and logout.
session_start();




include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/usermanager/register.php");


if (isset($_GET["logout"]) && $_GET["logout"] == "1")
{
	session_destroy();
	header("Location: /index.php");
}
else
{

;






if (tryLogin($_POST["username"], $_POST["password"])==1)
{
	$_SESSION["charme_user"] = $_POST["username"];
	echo  "2";
}
else
	echo "1";

//2 means login succesful. Javascript does further actions

}
?>
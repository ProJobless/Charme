<?
//This file will be called from welcome.php or mainframe.php and is used for login and logout.
session_start();

if (isset($_GET["logout"]) && $_GET["logout"] == "1")
{
	session_destroy();
	header("Location: /index.php");
}
else
{

/*
$_POST["username"];
$_POST["password"];
*/

$_SESSION["charme_user"] = "schuldie@charme.local";

echo  "2"; //2 means login succesful. Javascript does further actions

}
?>
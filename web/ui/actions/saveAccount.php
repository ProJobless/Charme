<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/usermanager/account.php");
needSession();


$ret = saveAccount($_SESSION["charme_user"], $_POST["st_fname"], $_POST["st_lname"], $_POST["st_newmail"]);

if ($ret == 0)echo "OK";
else if ($ret == 1)echo "Error";

?>
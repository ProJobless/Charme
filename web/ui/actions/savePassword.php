<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/usermanager/password.php");
needSession();


$ret = changePassword($_POST["st_pass1"], $_POST["st_pass2"], $_POST["st_pass3"], $_SESSION["charme_user"]);

if ($ret == 0)echo "OK";
else if ($ret == 1)echo "Passwords do not match";
else if ($ret == 2)echo "Old Password is wrong";
?>
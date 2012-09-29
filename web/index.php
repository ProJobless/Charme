<?
session_start();
//URL Style ?p=user&arg1=...
//

//please delete the install dir if exists!
if (isset($_SESSION["charme_user"]))
include("ui/mainframe.php");
else
include("ui/welcome.php");


?>
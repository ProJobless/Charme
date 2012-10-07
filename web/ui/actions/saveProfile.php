<?

include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
needSession();
fw_load("forms");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/fields.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");



print_r($_POST);

foreach ($_POST as $key => $value)
{

	if (!$fc->contains($key))
		unset($_POST[$key]);


}

print_r($_POST);


saveProfile($_SESSION["charme_user"], $_POST);



?>
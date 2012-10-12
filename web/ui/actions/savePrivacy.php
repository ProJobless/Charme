<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/privacy.php");
needSession();
$all = privacy_getAll();



print_r($_POST
	);
foreach ($all as $key => $value) {
		$valId = $value["id"];


		$valTyp =  $_POST["st_priv".$value["id"]];
		$valPeople = ($_POST["people_st_priv".$value["id"]]);




		setPrivacy($_SESSION["charme_user"], $valId,$valTyp, $valPeople);

		//echo ;//TODO: Security: No circles from other people!


		//$fc->add(new formPeople(., $names[$value["id"]], $val));
	}



?>
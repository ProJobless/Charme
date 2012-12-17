<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
needSession();


if (isset($_POST["col_description"]))
{
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/messages.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/lists.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	fw_load("post"); // Contains message_format function
	$people = array();
	$fields = explode(',',$_POST["col_to"]);

	foreach ($fields as $str)
	{
		if ($str{0} == "p") //Is a person
		$people[] = substr($str, 1);
		else //Is a list -> getListItems
		{
			$cur = getListitemsByList($_SESSION["charme_user"], substr($str, 1));
			foreach ($cur as $item)
			{
				$people[] = (string)$item["item"];
			}
		}
	}


	$ret = sendMessage($_SESSION["charme_user"], $people, $_POST["col_description"], isset($_POST["files"]) ? $_POST["files"]:NULL);

	if ($_POST["col_type"] == "instant")
		echo message_format($_SESSION["charme_user"], $_POST["col_description"], $ret["attachments"]);

}
else
{
	fw_load("forms");

	// For Add Attachment GUI
	fw_load("attachment");

	$fc = new formCollection();

	$fc->add(new formPeople2("col_to", "Receivers", ""));
	$fc->add(new formArea("col_description", "Message", ""));


	$atf = new attachmentForm("atf_NEWMESSAGE"); // First argument is unique ID
	$fc->add(new formHTML2($atf->printContainer()."<div style='padding-top:8px'>".$atf->printAdd()."</div>", "", ""));

	$fc->printOut("", false, "");
}
?>
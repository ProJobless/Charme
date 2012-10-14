<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
needSession();


if (isset($_POST["col_description"]))
{
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/messages.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/lists.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");

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
	sendMessage($_SESSION["charme_user"], $people, $_POST["col_description"]);

if ($_POST["col_type"] == "instant")
echo "<div class='message'><div class='top'>".$_SESSION["charme_user"]."</div>".$_POST["col_description"]."</div>";

}
else
{
	fw_load("forms");
	$fc = new formCollection();
	//$fc->add(new formText("col_name", "Name", ""));
		$fc->add(new formPeople2("col_to", "Receivers", ""));
	$fc->add(new formArea("col_description", "Message", ""));
	$fc->add(new formHTML2("Add Attachment", "", ""));
	$fc->printOut("", false, "");
}
?>
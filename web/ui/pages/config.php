<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/fs/images.php");
needSession();

if (isset($_FILES["pic"]) && $_FILES["pic"]["name"] != "")
{
	storeProfileImage("pic", $_SESSION["charme_user"]);	
	header("Location: ?q=5&m=1");
	die();
}

if (isset($_POST["st_color"]))
{
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	db_setUserField("color", $_POST["st_color"]); //TODO:Validate input!
}
	
//This is a page template

fw_load("page");
page_init("User Settings", 1);


subMenuAdd(
array(
subMenuActionAdd("My Profile", "1"),
subMenuActionAdd("Account Settings", "2"),
subMenuActionAdd("Profile Image", "5"),
subMenuActionAdd("Password","3"),
subMenuActionAdd("Privacy","4"),
subMenuActionAdd("Customize","6"),
)
);
/*
Privacy Settings
*/
if (isset($_GET ["q"]) && $_GET["q"] == 4){
	fw_load("forms");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/privacy.php");
	$all = privacy_getAll();
	$allval = privacy_getAllValues($_SESSION["charme_user"]);

	$allval2=array();
	foreach ($allval as $item)
	{

		$allval2[$item["pid"]] = $item["val"];

		if ($item["people"] != "")
		$allval2[$item["pid"]] .= ($item["people"]);


	
	}

	echo "<div class='p32'><h1>Profile</h1>";

	$fc = new formCollection();
	$names = array(1 => "What I like", 2 => "Who can see who I follow", 3 => "Who can see my birthdate");
	foreach ($all as $key => $value) {
		$val = $value["default"];
		
		if (isset($allval2[$value["id"]]))
			$val = $allval2[$value["id"]];


//echo "€".$val."!!!";




		$fc->add(new formPeople("st_priv".$value["id"], $names[$value["id"]], $val));
	}
	$fc->printOut("", false,"savePrivacy()", "privacyForm");
	echo "</div>";
}
/*
Account Settings
*/
else if (isset($_GET ["q"]) && $_GET["q"] == 2){
	
echo "<div class='p32'>";
	fw_load("forms");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/usermanager/account.php");
	$all = getAccount($_SESSION["charme_user"]);

	$fc = new formCollection();

	$fc->add(new formText("st_newmail", "E-Mail Address", $all["email"]));
	$fc->add(new formHTML2("A confirmation mail will be send to the given mail address.", "First Name"));
	$fc->add(new formText("st_fname", "First Name", $all["firstname"]));
	$fc->add(new formText("st_lname", "Last Name", $all["lastname"]));
	$fc->printOut("", false,"saveAccount()", "accountForm");
	echo "</div>";


	}
/*
Color Selector
*/
else if (isset($_GET ["q"]) && $_GET["q"] == 6){
	//SELECT A COLOR:
	fw_load("forms");
	echo "<div class='p32'><h1>Color Scheme</h1>";
	$fc = new formCollection();
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	if (!isset($_POST["st_color"]))
	$_POST["st_color"] = db_getUserField("color");
	$fd = new formDrop("st_color", "Color", isset($_POST["st_color"]) ? $_POST["st_color"] : "");
	$fd->addOption(0, "Blue");
	$fd->addOption(1, "Red");
	$fd->addOption(2, "Green");
	$fd->addOption(3, "Purple");
	$fc->add($fd);
	$fc->printOut("");
	echo "</div>";
}
/*
Password
*/
else if (isset($_GET ["q"]) && $_GET["q"] == 3){
	echo "<div class='p32'>";
	fw_load("forms");
	$fc = new formCollection();

	$fc->add(new formPass("st_pass1", "Old Password", ""));
	$fc->add(new formPass("st_pass2", "Repeat Old Password", ""));
	$fc->add(new formPass("st_pass3", "New Password", ""));
	$fc->printOut("", false, "savePassword()", "form_pass");
	echo "</div>";
}
/*
Profile Image Settings
*/
else if (isset($_GET ["q"]) && $_GET["q"] == 5){
	
	if (isset($_GET ["m"]) && $_GET["m"] == 1)
	echo "Image changed succesfully.";
	

?>
<img src="apl/fs/?f=p_150_<?=$_SESSION["charme_user"] ?>" />
<form method="POST" action="ui/actions/changeImage.php" enctype="multipart/form-data">
     Please upload a profile picture: <input type="file" name="pic"/>
     <input type="submit"/>
</form>

<?
}
else{
	fw_load("forms");
	echo "<div class='p32'>";


	include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/fields.php");

	//readProfile($_SESSION["charme_user"]);


	$fc->fillFromArray(readProfile($_SESSION["charme_user"], $fc->getKeys()));

	$fc->printOut("", false, "saveProfile()", "form_profile");
		
		echo "</div>";
	
}
?>
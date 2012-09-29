<?
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/fs/images.php");

if ($_FILES["pic"]['name'] != "")
{
	storeProfileImage("pic", $_SESSION["charme_user"]);	
	header("Location: ?q=5&m=1");
	die();
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
if ($_GET[q] == 6){
//SELECT A COLOR:
fw_load("forms");
echo "<div class='p32'><h1>Color Scheme</h1>";
	
$fc = new formCollection();

$fd = new formDrop("st_color", "Color", $_POST["st_color"]);
$fd->addOption(3, "Blue");
$fd->addOption(2, "Green");
$fd->addOption(1, "Yellow");

$fc->add($fd);
$fc->printOut("");
	
echo "</div>";
}

else if ($_GET[q] == 5){
	
	if ($_GET[m] == 1)
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
$fc = new formCollection();
$fd = new formHTML("<h1>Personal information</h1>");
$fc->add($fd);
$fc->add(new formText("st_hometown", "Hometown", ""));
$fc->add(new formArea("st_aboutme", "About me", ""));

$fd = new formDrop("st_gender", "Gender", "");
$fd->addOption(0, "I dont tell");
$fd->addOption(1, "Male");
$fd->addOption(2, "Female");

$fd = new formHTML("<h1>What i like</h1>");
$fc->add($fd);
$fc->add(new formArea("st_aboutme", "Movies", ""));
$fc->add(new formArea("st_aboutme", "Books", ""));
$fc->add(new formArea("st_aboutme", "Games", ""));


$fd = new formHTML("<h1>Education</h1>");
$fc->add($fd);
$fc->add(new formArea("st_aboutme", "Movies", ""));
$fc->add(new formArea("st_aboutme", "Books", ""));
$fc->add(new formArea("st_aboutme", "Games", ""));




$fc->printOut("");
	
	echo "</div>";
	
}
?>
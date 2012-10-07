<?

$fc = new formCollection();
$fd = new formHTML("<h1>Personal information</h1>");
$fc->add($fd);
$fc->add(new formText("st_hometown", "Hometown", ""));
$fc->add(new formArea("st_aboutme", "About me", ""));

$fd = new formDrop("st_gender", "Gender", "");
$fd->addOption(0, "I dont tell");
$fd->addOption(1, "Male");
$fd->addOption(2, "Female");
$fc->add($fd);


$fd = new formHTML("<h1>What i like</h1>");
$fc->add($fd);
$fc->add(new formArea("st_movies", "Movies", ""));
$fc->add(new formArea("st_books", "Books", ""));
$fc->add(new formArea("st_games", "Games", ""));


/*
$fd = new formHTML("<h1>Education</h1>");
$fc->add($fd);
$fc->add(new formArea("st_aboutme", "Movies", ""));
$fc->add(new formArea("st_aboutme", "Books", ""));
$fc->add(new formArea("st_aboutme", "Games", ""));
*/


function readProfile($userId)
{
	global $db_charme;
	$col = $db_charme->users;
	$cursor = $col->findOne(array("userid"=>$userId));
	return $cursor;

}


function saveProfile($userId, $fields)
{
	global $db_charme;


	
	$db_charme->users->update(array("userid" => $userId),
		array('$set' => $fields));

}
?>
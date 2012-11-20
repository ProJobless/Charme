<?
function storePostImage($uplodedFile,$username, $collection)//uploaded file = pic, $newname = userid
{
	include_once($_SERVER['DOCUMENT_ROOT']."/tparty/wideimage/WideImage.php");
		global $db_charme;
	

		$grid = $db_charme->getGridFS();
		//$grid->remove(array("fname" => $username));


		$image = WideImage::load($uplodedFile['tmp_name']);
		
		//TODO:INSERT INTO POSTS......
	//todo: validate strings!!


		$gridID=$grid->storeBytes($image->resize(118, null, 'fill')->crop(0, 0, 118, 118)->output('jpg'), array('collection' => $collection, 'ftype'=>2,'owner' => $username));



	$obj = ($collection==0) ? NULL : new MongoId($collection);
	//2do: getusername!!
$name = "testname";

$data = array("userid" => $_SESSION["charme_user"],
			"typ" => 2,
			"username" => $name,
			"reference" =>new MongoId($gridID),
			"collection" => new MongoId($collection),
			"posttime" =>  new MongoDate(time())
		
			);


	$db_charme->posts->insert($data );

	return $gridID;

	//$image->->unsharp(80, 0.5, 3); 


		//$thisname = 'p_150_'.$username;
		//$grid->remove(array( 'fname' => $thisname));
	
}

?>
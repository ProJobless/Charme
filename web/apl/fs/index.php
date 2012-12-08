<?




	$m = new Mongo();
	$db = $m->charme;
	$grid = $db->getGridFS();


	if (isset($_GET["f"]))
	{

	$file = $grid->findOne(array('fname' => urldecode($_GET["f"])));
echo $file->getBytes();
	}
	else if (isset($_GET["g"]))
	{
	$file = $grid->findOne(array('_id' => new MongoId($_GET["g"])));
	 //$file = $grid->findOne(array('fname' => urldecode($_GET["f"])));

	header("Content-type: ".$file->file["type"]);
	header('Content-Disposition: attachment; filename="'.$file->file["filename"].'"');
	echo $file->getBytes();
	}

	//$file = $grid->findOne(array('_id' => new MongoId(($_GET["f"]))));



	else if (isset($_GET["i"]))
	{
		header("Content-type: image/jpg");
	 $file = $grid->findOne(array('_id' => new MongoId(urldecode($_GET["i"]))));
echo $file->getBytes();
	}
 //echo('Last-Modified: '..' GMT', true, 200);



//$fileModTime = strtotime($file->file["uploadDate"]->sec);
//echo $fileModTime;


//header('Last-Modified: '.gmdate('D, d M Y H:i:s', $fileModTime).' GMT', true, 200);



// var_dump($file);

//TODO: CACHE -> if ftype=1 cache ... else cache 20d...


?>
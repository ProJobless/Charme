<?
header("Content-type: image/jpg");


	$m = new Mongo();
	$db = $m->charme;
	$grid = $db->getGridFS();


	if (isset($_GET["f"]))
	 $file = $grid->findOne(array('fname' => $_GET["f"]));
	if (isset($_GET["i"]))
	 $file = $grid->findOne(array('_id' => new MongoId($_GET["i"])));
 //echo('Last-Modified: '..' GMT', true, 200);



//$fileModTime = strtotime($file->file["uploadDate"]->sec);
//echo $fileModTime;


//header('Last-Modified: '.gmdate('D, d M Y H:i:s', $fileModTime).' GMT', true, 200);



// var_dump($file);

//TODO: CACHE -> if ftype=1 cache ... else cache 20d...

echo $file->getBytes();
?>
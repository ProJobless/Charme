<?
header("Content-type: image/jpg");



	$m = new Mongo();
	$db = $m->charme;
	$grid = $db->getGridFS();
 $file = $grid->findOne(array('fname' => $_GET["f"]));
// var_dump($file);

//TODO: CACHE -> if ftype=1 cache ... else cache 20d...

echo $file->getBytes();
?>
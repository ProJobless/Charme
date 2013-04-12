<?php

require_once 'lib/App/ClassLoader/UniversalClassLoader.php';
use Symfony\Component\ClassLoader\UniversalClassLoader;

$loader = new UniversalClassLoader();
$loader->registerNamespaces(array('App' => __DIR__ . '/lib'));
$loader->register();


	$col = \App\DB\Get::Collection();
		
			$grid = $col->getGridFS();


	header("Content-type: image/jpg");
	 $file = $grid->findOne(array('type' => "profileimage", 'owner' => urldecode($_GET["u"]), 'size' => intval($_GET["s"])));
echo $file->getBytes();

?>
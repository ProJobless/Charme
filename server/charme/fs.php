<?php

require_once 'lib/App/ClassLoader/UniversalClassLoader.php';
use Symfony\Component\ClassLoader\UniversalClassLoader;

$loader = new UniversalClassLoader();
$loader->registerNamespaces(array('App' => __DIR__ . '/lib'));
$loader->register();


	$col = \App\DB\Get::Collection();
		
			$grid = $col->getGridFS();


	header("Content-type: image/jpg");

	header("Cache-Control: public, max-age=3600, s-maxage=3600"); // 60 second Cache


	 $file = $grid->findOne(array('type' => "profileimage", 'owner' => urldecode($_GET["u"]), 'size' => intval($_GET["s"])));
echo $file->getBytes();



if (!isset($file))
{


	$name = 'imgs/u64.jpg';
	$fp = fopen($name, 'rb');

	// send the right headers

	header("Content-Length: " . filesize($name));

	// dump the picture and stop the script
	fpassthru($fp);
	exit;

}
/*


*/



?>
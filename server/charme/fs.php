<?php


include_once("config.php");

 if (in_array($_SERVER['HTTP_ORIGIN'], $CHARME_SETTINGS["ACCEPTED_CLIENT_URL"]))
header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);


require_once 'lib/App/ClassLoader/UniversalClassLoader.php';
use Symfony\Component\ClassLoader\UniversalClassLoader;

$loader = new UniversalClassLoader();
$loader->registerNamespaces(array('App' => __DIR__ . '/lib'));
$loader->register();


$col = \App\DB\Get::Collection();
		
$grid = $col->getGridFS();

if (!isset($_GET["enc"]))
{	
	header("Content-type: image/jpg");
	if (isset($_GET["type"]) && $_GET["type"] == "post")
	{
	
	header("Cache-Control: public, max-age=31536000, s-maxage=31536000");

	
$file = $grid->findOne(array('post' => new MongoId($_GET["post"]), 'size' => intval($_GET["size"])));
	echo $file->getBytes();
	}

	else
	{
	
	 	$file = $grid->findOne(array('type' => "profileimage", 'owner' => urldecode($_GET["u"]), 'size' => intval($_GET["s"])));

	 	if (!isset($file))
		{


			$name = 'imgs/u'.$_GET["s"].'.jpg';
			$fp = fopen($name, 'rb');

			// send the right headers

			header("Content-Length: " . filesize($name));

			// dump the picture and stop the script
			fpassthru($fp);
			exit;

		}
		else
		echo $file->getBytes();
	}

}
else
{
	include_once("config.php");

 if (in_array($_SERVER['HTTP_ORIGIN'], $CHARME_SETTINGS["ACCEPTED_CLIENT_URL"]))
header('Access-Control-Allow-Origin: '.$_SERVER['HTTP_ORIGIN']);


header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); 
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true'); // Needed for CORS Cookie sending

if (isset($_GET["cache"]))
header("Cache-Control: public, max-age=3600, s-maxage=3600");

	// Encoded 
	header("Content-type: text/plain"); // return encoded picture
	if (isset($_GET["type"]) && $_GET["type"] == "original")
	$file = $grid->findOne(array('_id' => new MongoId($_GET["id"])));
	else
	$file = $grid->findOne(array('orgId' =>($_GET["id"])));
	

	echo $file->getBytes();


}

//	header("Cache-Control: public, max-age=3600, s-maxage=3600"); // 60 second Cache








/*


*/



?>
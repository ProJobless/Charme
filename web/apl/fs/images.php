<?
include_once($_SERVER['DOCUMENT_ROOT']."/apl/fs/fs.php");


// ( string $name [, array $metadata ] )
function storeProfileImage($uplodedFile,$username)//uploaded file = pic, $newname = userid
{
	include_once($_SERVER['DOCUMENT_ROOT']."/tparty/wideimage/WideImage.php");


	
	$m = new Mongo();
	$db = $m->charme;
	$grid = $db->getGridFS();

	$grid->remove(array("fname" => $username));




	

	$image = WideImage::load($_FILES[$uplodedFile]['tmp_name']);
	



//$image->->unsharp(80, 0.5, 3); 


	$thisname = 'p_150_'.$username;
	$grid->remove(array( 'fname' => $thisname));
	$grid->storeBytes($image->resize(150, null, 'fill')->crop(0, 0, 150, 50)->output('jpg'), array( 'fname' => $thisname, 'ftype'=>1,'owner' => $username,'visibility' => $visibility));

	
	
	$thisname = 'p_48_'.$username;
	$grid->remove(array( 'fname' => $thisname));
	$grid->storeBytes($image->resize(48, null, 'fill')->crop(0, 0, 48, 48)->output('jpg'), array( 'fname' => $thisname, 'ftype'=>1,'owner' => $username,'visibility' => $visibility));



	$thisname = 'p_200_'.$username;
	$grid->remove(array( 'fname' => $thisname));
	$grid->storeBytes($image->resize(150, null, 'fill')->crop(0, 0, 200, 200)->output('jpg'), array( 'fname' => $thisname, 'ftype'=>1,'owner' => $username,'visibility' => $visibility));




	//echo "STORE $filename";//!!! F$filename z.B tileset.jpg etc!!!!
}
?>
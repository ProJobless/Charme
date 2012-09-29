<?

//TYPE 1: Userimage, 2: Collection Image, 3. Collection File
function charm_rml_fs_store($filename, $data)
{
	$m = new Mongo();
	$db = $m->charme;
	$grid = $db->getGridFS();
	//$id = $grid->storeUpload( $data,$filename);
}

function charm_rml_fs_get($filename)
{
	
	
}

function charm_rml_fs_isset($filename)
{
	
	
}

?>
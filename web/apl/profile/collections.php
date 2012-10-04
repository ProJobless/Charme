<?
//JSON encoded
function addCollection($owner, $name, $description, $parent, $visibility=array())
{
	//TODO: CHECK IF PARENT COLLECTION BELONGS TO USER!!

	//get db...
	global $db_charme;


	$obj = ($parent==0) ? NULL : new MongoId($parent);
	//todo: validate strings!!
	$db_charme->usercollections->insert(
		array("userid" => $_SESSION["charme_user"],
			"name" => $name,
			"description" => $description,
			"parent" => $obj 
		
			));


	
}
function getParentList($collection)
{

if ($collection == NULL || $collection == 0)
	return array();

	//MAX 5!
	global $db_charme;
	$col = $db_charme->usercollections;



	$i = 0;
	$next = new MongoId($collection);
	$arr = array();


	while ($i  <= 5)
	{



		$i++;
		$next2= $col->findOne(array("_id"=> ($next)));//TODO: Just select the fields needed
		

		$arr[] = array("name" =>  $next2["name"],  "id" => $next2["_id"]);

		if ($next2["parent"] != NULL)
		{
			$next = $next2["parent"];
		
		}
		else
			break;
	
	}

	return array_reverse ($arr);
}

function getCollectionPosts($owner, $collection)
{
	global $db_charme;
	$col = $db_charme->posts;
	$cursor = $col->find(array("collection"=>new MongoId($collection)));
	return $cursor;

}
function getCollection($owner, $filter)
{
	$m = new Mongo();
	$db = $m->charme;
	$collection = $db->usercollections;
	


	//echo $filter."-";
	

	if ($filter == 0)
	$cursor = $collection->find(array("parent"=>NULL));
	else
	$cursor = $collection->find(array("parent"=>new MongoId($filter)));


	return $cursor;
}

?>
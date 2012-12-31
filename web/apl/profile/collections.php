<?

function deleteCollection($userId, $collectionId)
{
	global $db_charme;
	$db_charme->usercollections->remove(array("_id" => new MongoId($collectionId), "userid" => $userId));
	// TODO: Notify ALL subscribers!
}

function saveCollection($colId, $owner, $name, $description,  $visibletyp=1, $people="")
{
	global $db_charme;



	// This part is identical with the one in the function addCollection
	
	//todo: validate strings!!
	$content = array("userid" => $_SESSION["charme_user"],
			"name" => $name,
			"description" => $description,
	

			"visibletype" => intval($visibletyp),

		
	);
	if ($visibletyp == 3)
	{
		$p_arr= array();
		$l_arr = array();


		$all = explode(',', $people);


		foreach ($all as $item)
		{
			if ($item{0} == "p") //WARNING: ID CAN START WITH p!!!!!
				$p_arr[] = substr($item, 1);
			else if ($item{0} == "l")
				$l_arr[] = substr($item, 1);
		}


		$content["people"] = $p_arr;

		$content["lists"] = $l_arr;

	}

echo "UPADTE!!!";


echo $colId.$owner;

// Problem: Field parent is removed @update
	$db_charme->usercollections->update(array("_id" => new MongoId($colId), "userid" => $owner),array('$set' =>  $content));

// , array("upsert" => true)

}
function addCollection($owner, $name, $description, $parent, $visibletyp=1, $people="")
{
	//TODO: CHECK IF PARENT COLLECTION BELONGS TO USER!!

	//get db...
	global $db_charme;

//, splitted, people start with p




	$obj = ($parent==0) ? NULL : new MongoId($parent);
	//todo: validate strings!!
	$content = array("userid" => $_SESSION["charme_user"],
			"name" => $name,
			"description" => $description,
			"parent" => $obj ,

			"visibletype" => intval($visibletyp),

		
			);

	if ($visibletyp == 3)
	{
		$p_arr= array();
		$l_arr = array();


		$all = explode(',', $people);


		foreach ($all as $item)
		{
			if ($item{0} == "p") //WARNING: ID CAN START WITH p!!!!!
				$p_arr[] = substr($item, 1);
			else if ($item{0} == "l")
				$l_arr[] = substr($item, 1);
		}


		$content["people"] = $p_arr;

		$content["lists"] = $l_arr;

	}
	$db_charme->usercollections->insert($content
		);
return $content ["_id"];

	
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

// TODO: Has to work via remote request (if user is not on this server!)
function getCollectionPostCount($owner, $collection)
{
	global $db_charme;
	$col = $db_charme->posts;
	$cursor = $col->find(array("collection"=>new MongoId($collection)))->count();
	return $cursor;
	

}


function getCollectionPosts($owner, $collection, $count, $start)
{
	global $db_charme;
	$col = $db_charme->posts;
	$cursor = $col->find(array("collection"=>new MongoId($collection)))->sort(array("posttime" => -1))->skip($start)->limit($count);
	return $cursor;

}
function getCollectionInfo($userId, $collectionId)
{
	global $db_charme;
	
	return  $db_charme->usercollections->findOne(array("_id"=>new MongoId($collectionId), "userid"=>$userId), array("name","description", "visibletype", "people", "lists"));

}

function getCollection($userId, $owner, $filter)
{


	global $db_charme;
	$collection = $db_charme->usercollections;

	//echo $filter."-";
	

	//if not my server... ... ... 

	if ($filter == 0)
	$cursor = $collection->find(array("parent"=>NULL));
	else
	$cursor = $collection->find(array("parent"=>new MongoId($filter)));

	include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/follow.php");

	if ($filter == 0) $subscribed = false;
	else $subscribed = doesFollow($userId, $filter);

//echo "!!".$subscribed."!!";
	return array($cursor, $subscribed);
}

?>
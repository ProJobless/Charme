<?

//$useProfileImage, 
function post_format($obj)
{

if (isset($obj["typ"]) && $obj["typ"]==2)
{


	return array("<img src='apl/fs/?i=".$obj["reference"]."'>", 1);
}
else
{

	return array("<div class='collectionPost'>".$obj["content"]."

	<div>10 hours ago - Comments - Love
	</div>

</div>", 2);

}

}
?>
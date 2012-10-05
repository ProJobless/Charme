<?

//$useProfileImage, 
function post_format($obj)
{

if (isset($obj["typ"]) && $obj["typ"]==2)
{

	echo "<img src='apl/fs/?i=".$obj["reference"]."'>";
}
else
{
echo "<div class='collectionPost'>".$obj["content"]."

	<div>10 hours ago - Comments - Love
	</div>

</div>";



}

}
?>
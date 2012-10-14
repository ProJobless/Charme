<?
//This is a page template
include_once($_SERVER['DOCUMENT_ROOT']."/ui/framework/framework.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/stream/getStream.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/profile/messages.php");
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");
needSession();
fw_load("page");
fw_load("forms");
page_init("Talks", 0);


if (!isset($_POST["level"]) || $_POST["level"] !=3 )
{
?>
<div class='talkbarbg'>
</div>
<div class="talkbar">
<div style='padding:16px; border-bottom:1px silver solid'>
	<a style='background-position:-0px 0;' data-bgpos='-0'  class='functionButton actionIcon' id='but_newMessage'> </a>
</div>
<ul class='msgItems tabBar'>
<?




$i = 0;
$firstid= "";

$all = getAllMessages($_SESSION["charme_user"], 0, 100);
foreach ($all as $item)
{
	//receiver, uniqueid, lastauthor, preivew
if ($i==0)
$firstid=$item["uniqueId"];

$i++;
$more = ($item["peoplecount"] > 1) ? " and ".($item["peoplecount"]-1)." more" : "";
$acont = $item["lastauthor"].$more."<div>".$item["preview"]."</div>";


	 if ((isset($_GET["q"]) && $_GET["q"] == $item["uniqueId"]) || (!isset($_GET["q"]) && $i ==1))
	 echo '<li data-name="'.$item["uniqueId"].'" ><a class="active" ref="'.$item["uniqueId"].'">'.$acont.'</a></li>';
	else
	 echo '<li data-name="'.$item["uniqueId"].'"><a ref="'.$item["uniqueId"].'">'.$acont.'</a></li>';
}


?>
</ul>

<?
echo "<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda";
echo "<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda";
echo "<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda";
echo "<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda";
echo "<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda<br>asda";



?>
</div>

<div class='' id='page3' style="margin-left:300px;overflow:auto;">


<?
}


//TODO: Create dummy div with height of textarea+x to ensure every message stay visible


if ($firstid != "" && !isset($_GET["q"]))
$_GET["q"] = $firstid;







//display newest coneversation
if (isset($_GET["q"]))
{
	$ppl = getMessagePeople($_SESSION["charme_user"], $_GET["q"]);
//var_dump(iterator_to_array($ppl));
$ppl2 = $ppl["people"];
$ppl = "p".implode(",p",$ppl2);


echo '<div class="instantanswer"><form>
<input type="hidden" name="col_to" value="'.$ppl.'">
<input type="hidden" name="col_type" value="instant">
<textarea name="col_description" style="width:100%; margin-bottom:8px;"></textarea>
<a class="button" href="javascript:sendMessageInstant()">Send</a>
	</form></div>';

	
	echo "<div class='talkmessages'>";
	

	$items = getMessageItems($_SESSION["charme_user"], $_GET["q"]);
	foreach ($items as $item)
	{


		
		echo "<div class='message'><div class='top'>".$item["author"]."</div>".$item["content"]."</div>";
	}
	echo "</div>";
}

if (!isset($_POST["level"]) || $_POST["level"] !=3 )
echo "</div>";
?>


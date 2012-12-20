<?

$lists_iterator = 0;


function lists_doItem($userid, $name)
{
global  $lists_iterator;



if ($lists_iterator %5 == 0 && $lists_iterator!=0)
	echo "<br class='cb'>";
$lists_iterator++;


	$iurl = explode('@',	$userid);
	$iurl = $iurl[1];

	echo "<div class='item' data-userid='".$userid."'><a  href='/?p=profile&q=about&userId=".urlencode($userid)."'><img src='http://".$iurl."/apl/fs/?f=p_200_".urlencode($userid)."'>
	".$name."</a></div>";
}
function lists_start()
{
	global  $lists_iterator;
	$lists_iterator = 0;


	echo "<div class='usergrid'>";
}
function lists_end()
{
	echo "</div>";
}
//Did you know: This file is not the longest file in this repository
?>
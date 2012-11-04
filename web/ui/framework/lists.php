<?
function doUserListItem($userid, $name)
{

	$iurl = explode('@',	$userid);
	$iurl = $iurl[1];

	echo "<a  href='/?p=profile&q=about&userId=".urlencode($userid)."'><img src='http://".$iurl."/apl/fs/?f=p_200_".urlencode($userid)."'>
	".$name."</a>";
}
//Did you know: This file is not the longest file in this repository
?>
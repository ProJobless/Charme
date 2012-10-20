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

	<div>".supertime($obj["posttime"]->sec)." - <a onclick='displayCommentBox(this)'>Comment</a> - <a onclick='lovePost(this)'>Love</a> - <a onclick='followPost(this)'>Follow</a>
	<div class='commentBox'><textarea></textarea><br><a class='button' data-postid='".$obj["_id"]."' data-userid='".$obj["userid"]."' onclick='doCommentReq(this)'>Post comment</a></div>
	</div>

</div>", 2);

}

}

function supertime($ptime) {
    $etime = time() - $ptime;
 
    if ($etime > 0*24 * 60 * 60)
    	return date("d.m.y H:i",  ($ptime));
    if ($etime < 1) {
        return '0 seconds';
    }
    
    $a = array( 12 * 30 * 24 * 60 * 60  =>  'year',
                30 * 24 * 60 * 60       =>  'month',
                24 * 60 * 60            =>  'day',
                60 * 60                 =>  'hour',
                60                      =>  'minute',
                1                       =>  'second'
                );
    
    foreach ($a as $secs => $str) {
        $d = $etime / $secs;
        if ($d >= 1) {
            $r = round($d);
            return $r . ' ' . $str . ($r > 1 ? 's' : '')." ago";
        }
    }
}

?>
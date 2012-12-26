<?

//$useProfileImage, 

function string_format($str)
{


}
function comment_format($commentId, $userid, $username, $content, $time)
{
    $usid = "<a href='/?p=profile&q=about&userId=".urlencode($userid)."'>".$username."</a>";
    return "<div class='comment'><a onlick='deleteComment(\"".$commentId."\")' class='delete'> </a><div class='head'>$usid</div>$content</div>";
}

function message_format($author, $content, $attachments)
{
    $atta = "";

    //Add attachments to message outputs if avaiable
    if (Count($attachments)>0)
    {
               $atta .= "<div class='attach' style='margin-top:8px'>Attachments: ";
               foreach ($attachments as $att)
                {
                    $atta .= "<a href='apl/fs/?g=".$att["fileId"]."'> ".$att['name']."</a>";
                }
                $atta .= "</div>";
    }

    return "<div class='message'><div class='top'>".$author."</div>".$content."".$atta."</div>";
}

function post_format($obj, $useimg = false)
{



if (isset($obj["typ"]) && $obj["typ"]==2)
{




	return array("<a onclick='showPhoto(\"".$obj["reference"]."\", \"".$obj["userid"]."\")'><img src='apl/fs/?i=".$obj["reference"]."'></a>", 1);
}
else
{

    $img = "";
    $img2 = "";

    if ($useimg)
    {
        $img = "<a href='/?p=profile&q=about&userId=".urlencode($obj["userid"])."'>
        <img class='profilePic' src='ui/media/phantom.jpg'><div class='subDiv'></a>";
        $img2 = "</div>";
    }

    if (is_array($obj["_id"]))
    {
        $obj["_id"] = $obj["_id"]['$id'];
        $ttime = $obj["posttime"]["sec"];
    }
    else
    {
        $ttime = $obj["posttime"]->sec;
    }

    include_once($_SERVER["DOCUMENT_ROOT"]."/apl/profile/comments.php");





    //- <a onclick='followPost(this)'>Follow</a>

    $atta = "";

    if ($obj["attachments"])
            {
                 $atta .= "<div class='attach'>Attachments: ";

               //   $atta .= implode(", ", $obj["attachments"]);
               
               foreach ($obj["attachments"] as $att)
                {
                
                $atta .= "<a href='apl/fs/?g=".$att["fileId"]."'> ".$att['name']."</a>";
                }
             /*   
obj
             $atta .= "<br/>";
                //Do image Attachments!!
                foreach ($obj["attachments"] as $att)
                {
                if ($att["typ"] == 0)
                $atta .= "<img src='http://www.google.de/images/srpr/logo3w.png'>";
                }*/
                
                
                $atta .= "</div>";
            }




    	return array("<div class='collectionPost' id='post".$obj["_id"]."'><a class='delete' onclick='deletePost(\"".$obj["_id"]."\")'> </a>".$img."
    
    <a href='/?p=profile&q=about&userId=".urlencode($obj["userid"])."'>".$obj["username"]."</a><div class='cont'>".$obj["content"]."</div>
    	<div>".$atta."
        <span class='time'>".supertime($ttime)."</span>
         <a onclick='displayCommentBox(this, \"".$obj["userid"]."\", \"".$obj["_id"]."\")'>Comments <span class='countComments'>(2)</span></a>
          - <a onclick='lovePost(this)'>Love</a>
    	".commentBox($obj["_id"], $obj["userid"]).$img2." </div></div>", 2);




    }

}
function commentBox($objId, $ownerId, $instantVisible=false)
{

return "<div class='commentBox' ".($instantVisible  ? " style='display:block;'": "").">
            <div class='postcomments'></div><textarea></textarea><br>
            <a class='button' data-postid='".$objId."'
            data-userid='".$ownerId."' onclick='doCommentReq(this)'>Post comment</a>".($instantVisible  ? "": "or  <a onclick='stopComment(this)'>cancel</a>")." 
            </div>
        ";

    
}
function supertime($ptime) {
    $etime = time() - $ptime;
 

    $full = date("d.m.y H:i:s",  ($ptime));;


    if ($etime > 1*24 * 60 * 60)
    	return "<span title='$full'>".date("d.m H:i",  ($ptime))."</span>";
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
            return "<span title='$full'>".$r . ' ' . $str . ($r > 1 ? 's' : '')." ago</span>";
        }
    }
}

?>
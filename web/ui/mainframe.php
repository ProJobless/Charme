<?
//if needseesion:

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Charme</title>
<link rel="stylesheet" type="text/css" href="/ui/css/main.css">
<link rel="stylesheet" type="text/css" href="/ui/css/ui.css">
<link rel="stylesheet" type="text/css" href="/ui/css/stream.css">
<link rel="stylesheet" type="text/css" href="/ui/css/css.php?color=<?
	$m = new Mongo();
	$db = $m->charme;
	$collection = $db->users;
	$cursor = $collection->findOne(array("userid" => $_SESSION["charme_user"]), array("color"));
	echo $cursor["color"];

	
	
?>">
<script src='/ui/lib/jq.js'></script>
<script src='/ui/lib/page.js'></script>
<script src='/ui/lib/string.js'></script>
<script src='/ui/lib/txa.js'></script>
<script src='/ui/lib/profile.js'></script>
<script src='/ui/lib/stream.js'></script>
<script src='/ui/lib/ui.js'></script>
</head>

<body>
<div class="containerAll">
<div id="whitebg"></div>
<div class="sidebar sbAlpha">

<div class="actionCont"></div>

 <div class="actionBar">
       
 		<a data-bgpos="0" id="button_notifications" ref="notifications"  class="actionButton"></a><a data-bgpos="-30"  href="/ui/actions/login.php?logout=1" style="background-position:-30px 0; " class="actionButton"></a>
        
        <!--<a   data-bgpos="-30" style="background-position:-30px 0; " class="actionButton"></a>-->
       <!--  href="/ui/actions/login.php?logout=1" -->
        
        
        </div>

<div style="height:62px; background-color:#FBDBDB;">
<a data-page="profile" data-pagearg="&u=">
<img src="apl/fs/?f=p_150_<?=$_SESSION["charme_user"] ?>" style="width:150px; height:62px" />
</a>
</div>


<ul>
<?
$items = array(

array("Stream", "stream"),
array("My Profile", "profile"),
array("Talks", "talks"),
array("Collections", "collections"),
array("Friends", "friends"),
array("Groups", "groups"),
//array("Pages", "pages.php"),
array("Properties", "config"),

 );
 
 foreach ($items as $item)
 {
	 if ($_GET[p] == $item[1] ||(!$_GET[p] && $item[1] == "stream"))
	 echo '<li class="active"><a ref="'.$item[1].'">'.$item[0].'</a></li>';
else
 echo '<li><a ref="'.$item[1].'">'.$item[0].'</a></li>';
	 
}
?>



</ul>


About - Blog - 
</div>


    <div class="sbBetaCont">

        <div class="sidebar sbBeta">
   
        <div class="actionBar">
 		<!--<a style="background-position:-30px 0;" href="/ui/actions/login.php?logout=1" class="actionButton"></a>-->
        </div>

     <ul class="subCont">
     </ul>
        </div>
        
        <div class="content">
        <div class="page" style="padding:0px; " id="page">
        <?
		if (!$_GET[p])
		{
		include("ui/pages/stream.php");	
		}
		else
		{
		if (file_exists("ui/pages/".$_GET[p].".php"))
			include("ui/pages/".$_GET[p].".php");
		}?>
       
        </div>
        
        </div>
    </div>



</div>


</body>
</html>
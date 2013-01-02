<?
//if needseesion:
include_once($_SERVER['DOCUMENT_ROOT']."/apl/db.php");

//include db
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Charme</title>
<link rel="stylesheet" type="text/css" href="/ui/css/main.css">
<link rel="stylesheet" type="text/css" href="/ui/css/ui.css">
<link rel="stylesheet" type="text/css" href="/ui/css/stream.css">
<link rel="stylesheet" type="text/css" href="/ui/css/plugins.css">
<link rel="stylesheet" type="text/css" href="/ui/css/profile.css">
<link rel="stylesheet" type="text/css" href="/ui/css/talks.css">
<link rel="stylesheet" type="text/css" href="/ui/css/css.php?color=<?

if (isset($_POST["st_color"]))
echo $_POST["st_color"];
else
	echo db_getUserField("color");

	
	
?>">
<script src='/ui/lib/jq.js'></script>
<script src='/ui/lib/jqui.js'></script>
<script src='/ui/lib/page.js'></script>
<script src='/ui/lib/string.js'></script>
<script src='/ui/lib/txa.js'></script>
<script src='/ui/lib/profile.js'></script>
<script src='/ui/lib/config.js'></script>
<script src='/ui/lib/talks.js'></script>
<script src='/ui/lib/stream.js'></script>
<script src='/ui/lib/ui.js'></script>
<script src='/ui/lib/friends.js'></script>
<script src='/ui/lib/plugins.js'></script>
<script src='/ui/lib/groups.js'></script>


<script type="text/javascript" src="/tparty/latex2ml.js">


</script>
</head>

<body>



<div class="containerAll">
<div id="whitebg"></div>
<div class="sidebar sbAlpha">



 <div class="actionBar">
       <div class="actionCont"></div>
 		<a data-bgpos="0" id="button_notifications" ref="notifications"  class="actionButton">0</a><a data-bgpos="-30"  href="/ui/actions/login.php?logout=1" style="background-position:-30px 0; " class="actionButton"></a>
        
        <!--<a   data-bgpos="-30" style="background-position:-30px 0; " class="actionButton"></a>-->
       <!--  href="/ui/actions/login.php?logout=1" -->
        
        
        </div>

<div style="height:62px; background-color:#FBDBDB;">
<a data-page="profile" data-pagearg="&u=<?=urlencode($_SESSION["charme_user"])?>">
<img src="apl/fs/?f=p_150_<?=urlencode($_SESSION["charme_user"])?>" style="width:150px; height:62px" />
</a>
</div>


<ul>
<?
$items = array(

array("Stream", "stream"),
array("Profile", "profile"),
array("Talks", "talks"),
array("Friends", "friends"),
array("Groups", "groups"),
//array("Pages", "pages.php"),
array("Properties", "config"),

 );
 
 foreach ($items as $item)
 {
	 if ((isset($_GET["p"]) && $_GET["p"] == $item[1]) ||(!isset($_GET["p"]) && $item[1] == "stream"))
	 echo '<li class="active"><span class="count">4</span><a ref="'.$item[1].'">'.$item[0].'</a></li>';
else
 echo '<li><a ref="'.$item[1].'">'.$item[0].'</a></li>';
	 
}
?>



</ul>


<a data-page="about">About</a> - <a data-page="help">Help</a>
</div>


    <div class="sbBetaCont">

        <div class="sidebar sbBeta">
   
        <div class="actionBar">
 		

        </div>

     <ul class="subCont">
     </ul>
        </div>
        
        <div class="page_content">
        <div class="page" style="padding:0px; " id="page">
        <?
		if (!isset($_GET["p"]))
		{
		include("ui/pages/stream.php");	
		}
		else
		{
		if (file_exists("ui/pages/".$_GET["p"].".php"))
			include("ui/pages/".$_GET["p"].".php");
		}?>
       
        </div>
        
        </div>
    </div>



</div>


</body>
</html>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Charme</title>
<link rel="stylesheet" type="text/css" href="/ui/css/main.css">
<link rel="stylesheet" type="text/css" href="/ui/css/ui.css">
<link rel="stylesheet" type="text/css" href="/ui/css/stream.css">
<link rel="stylesheet" type="text/css" href="/ui/css/css.php?color=1" />
<script src='/ui/lib/jq.js'></script>
<script>
$(function() {
	var u = $('#login_user').focus();
	
	 $('#login_password').keypress(function(e) {
       
           code= (e.keyCode ? e.keyCode : e.which);
            if (code == 13)
            login();
    
        });
		$('#login_user').keypress(function(e) {
       
           code= (e.keyCode ? e.keyCode : e.which);
            if (code == 13)
            $('#login_password').focus().select();
    
        });
});
function login()
{
	var u = $('#login_user').val();
	var p = $('#login_password').val();
	
	$('#login_error').hide();
	$.post("ui/actions/login.php", {user:u, password:p}, function(d){
		if (d == 1)
		{$('#login_error').show();
		$('#login_user').focus().select();}
		if (d==2)
		$("#welcome_main").fadeOut("fast", function(){	location.reload();});
	
		
		});
	
	
}
</script>
</head>

<body style="background-color:#EEE">

<?
if ($_GET[p])
{
	echo '<div style="width:850px; margin:32px auto; " >
	<div style="padding:32px; background-color:#fff;border-bottom:1px silver solid;"><a href="/">&laquo; Back to Charme Homepage</a></div>
	<div style="padding:32px;background-color:#fff;"> ';
	include("ui/pages/".$_GET[p].".php");
echo "</div>";
echo '<div style="text-align:right;margin-top:16px;" class="lightLink"><a href="?p=about">About</a></div></div>';
}
else
{
?>




<div style="width:600px; margin:200px auto;" id="welcome_main" >
<img src="ui/media/welcome.png" />
<div style="float:right; width:264px;">
<div style="background-color:#fff;  padding:32px; border-radius:8px; margin-bottom:16px;">
<div id="login_error" style="background-color:#F7D2D2; padding:16px; display:none;  border-radius:8px; margin-bottom:16px;color:#C30; text-align:center;">Login failed. Please check your login data.</div>
Username:
<input id="login_user" class="box" style="margin:8px 0; width:190px;" />
Password:
<input id="login_password" type="password" class="box" style="margin:8px 0; width:190px;" />
<div style="position:relative;">
<a href="javascript:login();" class="button" style="float:left">Login</a><span style="float:left; top:6px; left:5px; position:relative;"> or <a href="?p=signup">Sign up</a></span>
<br class="cb" />
</div>
</div>
<div style="text-align:right" class="lightLink">
<a href="?p=password">Forgot Password?</a> - <a href="?p=about">About</a>
</div>
</div>
</div><?
}
?>

</body>
</html>
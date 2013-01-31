<!-- charmeproject.com -->
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
  <head>
    <title>Charme</title>
<script src="jq.js" type="text/javascript"></script>
<script>
$(document).ready(function() {
    var w = $(document).width();
        var d = $(document).height()-200;
$('.slider .item').css("width", w);
$('.slider .item').css("height", d);




 timeout_init();

});

var timeout;
function timeout_trigger() {

if (xpos == 4)
  xpos = 0;
else
  xpos++;


animate2(xpos);
timeout_init();
}

function timeout_clear() {
    clearTimeout(timeout);
}

function timeout_init() {
    timeout = setTimeout('timeout_trigger()', 5000);
}



function showhome()
{
  $('.info').animate({   height: 200}, 320);
  history.replaceState(null, "Charme", "?");
}
function showPage(id, title, href)
{
  timeout_clear();
  $(".infocontent").hide();

   $("."+href).show();

history.replaceState(null, title, "?p="+href);
showInfo();
}
function animate(x)
{
  timeout_clear();
  animate2(x);
}
 var xpos = 0;
function animate2(x)
{
  var xpos = x;
showhome();

	$('.leftcont a').removeClass("sel");
	$('.leftcont a:eq('+x+")").addClass("sel");

	
  var w = $(document).width();
  x = -x*w;
	$('.slider').animate({   left: x}, 320);

	
}
function showInfo()
{
$('.info').animate({   height: $(window).height() }, 320);
}
</script>
    <style>
    body
    {
      font-family: "Tahoma", "Sans Serif";
      font-size: 12px;
    	margin:0;
    }
a.sel
{
  background-position: 0 -32px;
}
.infodiv
{background-color: #000;
position: absolute;

}
.slider  img
{
  position: absolute;
  bottom:0px;


}
.slider .item
{
  background-color: #efefef;
  width:1600px;
  display: inline-block;;
   position: relative;
   float:left;
}
.pinfo h1
{
  margin: 0;
  padding: 0;
  font-size: 16px;
  margin-bottom: 16px;

}
h1
{
  margin: 0;
  padding: 0;
  font-size: 16px;
  margin-bottom: 16px;

}
.pinfo
{
  background-color:  #000;
  padding:32px;
  position: absolute;
  top:32px;
  left:32px;
  width:200px;
  color:#fff;
  letter-spacing: 1px;
  z-index: 999;
}
    .slider
    {
      position: absolute;
      width: 10000px;
    }
    .beta
    {}.infocontent
    {color:#fff; position:absolute; top:200px;}
    .info
    {
    	width:100%;
    	height:200px;
    	position: fixed;
    	bottom:0;
    	background-color: #000;
      overflow:hidden;
    }
    .images
    {
		position: absolute;
		height:100%;
		width:100%;
		overflow: hidden;
    }
    .button
    {
    	width:32px;
    	height:32px;
    	background-image: url('button.png');
    	display:inline-block;
      margin-right:8px;

    }
    a{color:#00B2C9; font-weight: bold; text-decoration: none;
      text-transform: uppercase;;}
    a:hover{color:#B3F6FF;}
    .leftcont
    {float:left;
    	width:300px;
    	color:#fff;
    	}
    </style>
  </head>
  <body>
  	<div class='images'>
<div class='slider'>
 
	<div class='item'><div class='pinfo'><h1>Hey You!</h1>Charme is an open source and distributed social network. This means you can choose a server, where your data is stored an kept private, or even set up your own.<br><br>It will be released in 2014, but you can contribute to the development on our community or register for a beta account.</div><img style=' margin-left:290px;' src='collections.png'></div>
<div class='item'><div class='pinfo'><h1>Multiple Walls</h1>You are not interested in someones private life, but like the music she or he produces?<br><br>Charme allows you to create different walls, so called collections,  which can be subscribed separately. So in this case you would only subscribe to the Music Collection.</div><img src='collections.png'></div>
<div class='item'><div class='pinfo'><h1>Mobility</h1>Access Charme from Android phones.</div><img src='123.jpg'></div>
<div class='item'><div class='pinfo'><h1>Minimalism at its finest</h1>The design is reduced on </div><img src='collections.png'></div>
<div class='item'><div class='pinfo'><h1>Stream</h1>Lorem ipsum<h1>Groups</h1><h1>Talks</h1>Messaging has never been easier!</div><img src='collections.png'></div>
  <div class='item'><div class='pinfo'><h1>Performance</h1>Charme uses GridFS and MongoDB in combination with PHP for a super scalable infrastructure which is capable to maintain millions of users on a single data center.</div><img src='collections.png'></div>

  	</div>


<div class='info' style='  z-index: 9999;'>

  <div style='position:relative; padding:32px;' id="bubblenav">
    <div class='leftcont'>
 
 <a class='button sel' href='javascript:animate(0)'></a><a href='javascript:animate(1)' class='button'></a><a href='javascript:animate(2)' class='button'></a><a href='javascript:animate(3)' class='button'></a><a href='javascript:animate(4)' class='button'></a><a href='javascript:animate(5)' class='button'></a>
    
     <br>
      <a href='javascript:showhome()'><img src='logo.png'></a>
      <br>
      <a href='http://mschultheiss.com'>Blog</a> - <a href='javascript:showPage(0, "Beta", "beta")'>Beta</a> - <a href='https://github.com/mschultheiss/wiki'>Wiki</a> - <a  href='https://github.com/mschultheiss/'>GitHub</a> - <a href='javascript:showPage(0, "About", "aboutcharme")'>About</a> 
    </div>
  </div>
  <br style='clear:both'>
  <div style='padding:32px; overflow:auto;'>
  <div class='aboutcharme infocontent'>
  <h1>Disclaimer</h1>
asdasdasd
   <br style='clear:both'>
  	</div>

  <div class='beta infocontent'>
  <h1>Sign up for Charme Beta</h1>
asdsads
   <br style='clear:both'>
    </div>
 </div>

</div>



   </div>
  </body>
</html>
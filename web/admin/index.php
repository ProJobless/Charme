<?
session_start();
$_SESSION["admin_nextfunction"] = "";
$_SESSION["admin_arguments"] = "";
?>
<html>

<body>

<head>
<script src='/ui/lib/jq.js'></script>
<script src='/admin/terminal.js'></script>
<script>



    $('body').terminal(function(c, t) {

if (c =="cls")
t.clear();
else
	$.post("parse.php", {command: c}, function(d){
		
		t.echo(d);
	
	});
		
  
}, { prompt: '>', name: 'test' ,    greetings: "Welcome to Charme Administration Console\nEnter help for help."})



	
</script>
<style>
body
{
	
margin:0;
padding:0px;}
.terminal .clipboard {
    position: absolute;
    bottom: 0;
    left: 0;
    opacity: 0.01;
    filter: alpha(opacity = 0.01);
    filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0.01);
    width: 2px;
}
.cmd > .clipboard {
    position: fixed;
}
.terminal {
    padding: 10px;
    position: relative;
    overflow: hidden;
}
.cmd {
    padding: 0;
    margin: 0;
    height: 1.3em;
}
.terminal .terminal-output div {
    display: block;
}
.terminal, .terminal .terminal-output, .terminal .terminal-output div,
.terminal .terminal-output div div, .cmd, .terminal .cmd span, .terminal .cmd div {
    font-family: "Consolas",monospace;
    color: #aaa;
    background-color: #000;
    font-size: 12px;
    line-height: 16px;
}
.terminal .cmd span {
    float: left;
}
.terminal .cmd span.inverted {
    background-color: #aaa;
    color: #000;
}
.terminal div::-moz-selection, .terminal span::-moz-selection {
    background-color: #aaa;
    color: #000;
}
.terminal div::selection, .terminal span::selection {
    background-color: #aaa;
    color: #000;
}
.terminal .terminal-output div.error, .terminal .terminal-output div.error div {
    color: red;
}
.tilda {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1100;
}
.clear {
    clear: both;
}
                    
</style></head><body style="background-color:#000"  id="term_demo">
</div></body>
<?
include_once("../config.php");
include_once("../version.php");
require_once '../lib/App/ClassLoader/UniversalClassLoader.php';
use Symfony\Component\ClassLoader\UniversalClassLoader;

$loader = new UniversalClassLoader();
$loader->registerNamespaces(array('App' => "../lib"));
$loader->register();


function printStatus($text, $color)
{
	echo "<span style='color:$color'>$text</span>";
}

?>
<b>Charme Info</b>
<br>Version <?php echo getVersion();  ?>
<br>Make sure you always have the latest version installed!<br><br>
<h1>System Status</h1>
Gearman: <?php

/*
$gmc= new \GearmanClient();
		$gmc->addServer("127.0.0.1",  4730);
		$task= $gmc->doNormal("hunt_postman", "foo");


function reverse_fail($task)
{
    echo "FAILED: " . $task->jobHandle() . "\n";
}
$gmc->setFailCallback("reverse_fail");
*/

 echo printStatus("Installed", "green") ;
 echo printStatus("Not installed", "red") ;
 ?><br>
Charme Hydra: <?php

echo printStatus("Running", "green");
echo printStatus("Not running", "red");

 ?>
 <?php
		$col = \App\DB\Get::Collection();
		
		?>
<h1>Database Status</h1>
Users: <?php 	echo $col->users->count(); ?><br>
Conversations: <?php 	echo $col->conversations->count(); ?><br>
Messages: <?php 	echo $col->messages->count(); ?><br>
Posts: <?php 	echo $col->posts->count(); ?><br>
Comments: <?php 	echo $col->comments->count(); ?><br>


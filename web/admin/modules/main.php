<?
$helparray["main"] = "[[bu;#09C;#000]Core]
cls
help
";


$helparray2["cls"] =array("","Clear console");
$helparray2["help"] =array("(String Command)","Show help");



function charme_admin_about()
{
	
	
}

function charme_admin_help($x="")
{

	
	if ($x == "")
	{
			global $helparray;
	foreach ($helparray as $value)
	{
	echo $value."\n";	
	}
	}
	else
	{
	global $helparray2;
		echo "[[b;#f00;#000]".$x."] [[;#fff;#000]".$helparray2[$x][0]."]\n[[i;#444;#000]".$helparray2[$x][1]."]";	
	}
	
}

?>
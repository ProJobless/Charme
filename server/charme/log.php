<?php
function clog($str)
{
	$fd = fopen("./log.txt", "a");
	fwrite($fd, $str."\r\n");
	fclose($fd);
}

function clog2($ar)
{
	clog(print_r($ar, true));
}
?>
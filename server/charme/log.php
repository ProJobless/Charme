<?php
function clog($str)
{
	global $CHARME_SETTINGS;
	if (isset($CHARME_SETTINGS) && $CHARME_SETTINGS["DEBUG"]) {
		$fd = fopen("./log.txt", "a");
		fwrite($fd, $str."\r\n");
		fclose($fd);
	}
}

function clog2($ar, $prefix="")
{
	clog($prefix." ".print_r($ar, true));
}
?>

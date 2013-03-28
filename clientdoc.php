<?
/*
	A small script for generating javascript documentation
*/


$input = array("jsclient/apl", "jsclient/lib");
$recursive = true;



/*f
	::input

	::output

	::name

	::Example

*/


// Strategy: look for /*f until */, if nextline start with :: thne new section else addd to section.


?>
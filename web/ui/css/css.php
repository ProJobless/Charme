<? header("Content-type: text/css");

//make schemes with http://colorschemedesigner.com/

//1142AA	2A4580	06276F	4573D5	6C8DD5
$colors = array(
"link" => "#1142AA",
"darker" => "#06276F",
"darkest" => "#05165E"
);
if ($_GET["color"] == 1)
{
	
}


echo "a {color: $colors[link];}";

echo ".button {background-color: $colors[link];border-color: $colors[darkest];}";
echo ".button:active {background-color: $colors[darkest];}";

echo ".sbAlpha ul li.active {background-color: $colors[link];}";
echo ".sbAlpha ul li {background-color: $colors[darker];}";
echo ".sbAlpha ul a:active {background-color: $colors[darkest];}";

echo ".sbBeta {background-color: $colors[link];}";
echo ".actionBar {background-color: $colors[link];border-color: $colors[darkest];}";
echo ".fixedBox  {border-color: $colors[link];}";
echo ".sbBetaCont  {background-color: $colors[link];}";
?>
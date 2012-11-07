<? header("Content-type: text/css");

//make schemes with http://colorschemedesigner.com/

//1142AA	2A4580	06276F	4573D5	6C8DD5
$colors = array(

array(
"main" => "#1A3C87", //links etc.
"dark" => "#000614",//button pressed

),

array(
"main" => "#960912", //links etc.
"dark" => "#360004",//button pressed

),

array(
"main" => "#4A8513", //links etc.
"dark" => "#275200",//button pressed

),

array(
"main" => "#8A2765", //links etc.
"dark" => "#1F0013",//button pressed

),

);



$colors = $colors[$_GET["color"]];



echo "a {color: $colors[main];}";

echo ".button {background-color: $colors[main];}";
echo ".button:active {background-color: $colors[dark];  box-shadow: inset 0 0 10px #000;}";

echo ".sbAlpha ul li.active {background-color:#C2C2C2;}";
echo ".sbAlpha ul li {background-color: #E0E0E0;}";
echo ".sbAlpha ul a:active {background-color:#C2C2C2;}";
echo ".sbBeta ul a:active {background-color:#fff;}";
echo ".sbBeta {background-color: #C2C2C2;}";
echo ".actionBar {background-color: #C2C2C2;}";
echo ".fixedBox  {border-color: $colors[main];}";
echo ".sbBetaCont  {background-color:#C2C2C2;}";
echo ".infobox  {border-color: $colors[main];}";


echo "#colorbg  {background-color: #C2C2C2;}";


echo ".tabBar ul li.active a   {background-color: $colors[dark];}";



?>
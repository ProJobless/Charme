<? header("Content-type: text/css");

//make schemes with http://colorschemedesigner.com/

//1142AA	2A4580	06276F	4573D5	6C8DD5
$colors = array(

array(
"link" => "#1142AA",
"darker" => "#06276F",
"darkest" => "#05165E"
),

array(
"link" => "#a60000",
"darker" => "#770000",
"darkest" => "#4E0000"
),

array(
"link" => "#3E6D00",
"darker" => "#375214",
"darkest" => "#284700"
),

array(
"link" => "#69008E",
"darker" => "#561B6B",
"darkest" => "#2C003B"
),

);



$colors = $colors[$_GET["color"]];



echo "a {color: $colors[link];}";

echo ".button {background-color: $colors[link];border-color: $colors[darkest];}";
echo ".button:active {background-color: $colors[link];  box-shadow: inset 0 0 10px #000;}";

echo ".sbAlpha ul li.active {background-color: $colors[link];}";
echo ".sbAlpha ul li {background-color: $colors[darker];}";
echo ".sbAlpha ul a:active {background-color: $colors[darkest];}";
echo ".sbBeta ul a:active {background-color: $colors[darkest];}";
echo ".sbBeta {background-color: $colors[link];}";
echo ".actionBar {background-color: $colors[link];border-color: $colors[darkest];}";
echo ".fixedBox  {border-color: $colors[link];}";
echo ".sbBetaCont  {background-color: $colors[link];}";

echo "#colorbg  {background-color: $colors[link];}";

?>
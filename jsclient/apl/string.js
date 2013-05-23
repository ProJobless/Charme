function xssText(str)
{

	// Returns xss Save Text.


	// Not completly secure yet, see answer on http://stackoverflow.com/questions/1147359/how-to-decode-html-entities-using-jquery
	return $("<div/>").html(str).text();

}
function formatDate(milliseconds)
{
	var d = new Date(milliseconds);
	return moment(milliseconds).fromNow();
}
function html2Text(str)
{
	return $("<div/>").html(str).text();
}
function smilieParse(str)
{
		// Find smilies here with regex
	// REGEX REPLACE: <img src='...' data-new="1,4"> with [[SMILIE1,4]]
	var search  = new Array(
		



// Replace image tags from smilie text area with [[[$1]]]
new Array(/<img\sdata-code="(.*?)"(.*?)>/gi, "[[[$1]]]")


		);


		for (i = 0; i < search.length; i++) {

		    str = str.replace(search[i][0], search[i][1]);
		}


	// br to \n

	str = str.replace(/<br\s*[\/]?>/gi, "\n");


	str = html2Text(str);


 return (str);

}
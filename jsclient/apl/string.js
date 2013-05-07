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
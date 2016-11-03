/***
	Name:
	xssText

	Info:
	Make Text between tags XSS save. 

	http://stackoverflow.com/questions/2794137/sanitizing-user-input-before-adding-it-to-the-dom-in-javascript/2794327#2794327
	
	DO NOT USE FOR ATTRIBUTES LIKE ID AND CLASS, USE xssAttr instead!

	Location:
	apl/string.js

	Code:JS:
	text= xssText("<script>alert();</script>");
*/

function xssText(str)
{
	// Returns xss Save Text ONLY for displaying inside tags, not as href, id etc. attribute.
	return  $('<span></span>').text(str).html();
	//old and false: return $("<div/>").html(str).text();
}

/***
	Name:
	xssAttr (TODO)

	Info:
	Make Attrbiute XSS save.. 
	WARNING not working yet...

	Location:
	apl/string.js

	Code:JS:
	addtohtml("<br id='"+xssAttr(str)+"'>")
*/

function xssAttr(str)
{
	return xssText(str);
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

function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

function smilieParse(str)
{
	// REGEX REPLACE: <img src='...' data-new="1,4"> with [[SMILIE1,4]]
	var search = new Array(
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
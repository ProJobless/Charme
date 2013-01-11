function escapeExpression(str) {

   return str.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
}


//Get URL Parameters, Usage: $.urlParam('param1', window.location.href);
$.urlParam = function(name, url){
	
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
	if (results==null)
	return "";
    return results[1] || 0;
}
/*
 	WARNING: Use this funciton only if user is logged in!!!!
*/


function apl_request(requests, callback, ses,srv)
{


	if (srv == null)
		srv = charmeUser.server;
	if (ses == null)
		ses = charmeUser.sessionID;


	// TIPP: http://stackoverflow.com/questions/15047279/how-can-i-retrieve-json-stringified-objects-in-php
	var url1 = "http://"+srv+"/charme/req.php?d="+encodeURIComponent(JSON.stringify(requests))+ "&session="+ses+"&callback=?";

	console.log("GOT THIS:");
	console.log(url1);

	$.ajax({
			  dataType: "jsonp",
			  url: url1,

			  success: function(data) {


	if(callback != undefined && typeof callback == 'function') 
	{
		if (data.logout == true)
			logout();!

		callback(data);
	}
	}});


}

/*
	Helper function for serializing forms.
	See http://jsfiddle.net/sxGtM/3/ and http://stackoverflow.com/questions/1184624/convert-form-data-to-js-object-with-jquery
*/

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
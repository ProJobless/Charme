/*
 	WARNING: Use this funciton only if user is logged in!!!!
*/


function apl_request(requests, callback)
{




	// TIPP: http://stackoverflow.com/questions/15047279/how-can-i-retrieve-json-stringified-objects-in-php
	var url1 = "http://"+charmeUser.server+"/charme/req.php?d="+encodeURIComponent(JSON.stringify(requests))+ "&charmeSession="+charmeUser.sessionID+"&callback=?";

	console.log("GOT THIS:");
	console.log(url1);

	$.ajax({
			  dataType: "jsonp",
			  url: url1,

			  success: function(data) {


	if(callback != undefined && typeof callback == 'function') callback(data);

	}});


}
/*
 	WARNING: Use this funciton only if user is logged in!!!!
*/


// apl posttest: only for debug!
function apl_posttest(requests)
{
	var ses ="";
	var url1 = "http://server.local/charme/auto.php?debug=1&session="+ses+"";

	$.ajax({

	  url: url1,

	type: "POST",

    data: {d:JSON.stringify(requests), test: "test"},
    dataType: "html",//json

    crossDomain : true,
 	xhrFields: {
    withCredentials: true
  },
        cache:false,



	  error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
      console.log(xhr.responseText);
 
     // console.log(ajaxOptions);
     // console.log(xhr);
      },
	  success: function(data) {

	  	console.log("posttest returns: "+ data);
	  }});


} 
function apl_request(requests, callback, ses,srv)
{
	//apl_posttest(requests);

	if (srv == null && charmeUser != null)
		srv = charmeUser.server;
	if (ses == null && charmeUser != null)
		ses = charmeUser.sessionID;


	// TIPP: http://stackoverflow.com/questions/15047279/how-can-i-retrieve-json-stringified-objects-in-php
	var url1 = "http://"+srv+"/charme/req.php?session="+ses+"";


	$.ajax({

		url: url1,
		type: "POST",
		data: {d:JSON.stringify(requests), test: "test"},
		dataType: "json",
		crossDomain : true,
		xhrFields: {
    withCredentials: true
  },
	
        /*     xhrFields: {// important: send session cookies!
       withCredentials: true
    },*/

		cache:false,

		error: function (xhr, status, thrownError) {
		 //console.log(thrownError);
		
		console.log(thrownError);
		console.log(status);
	
		console.log(xhr)
		// console.log(xhr);
		},
		success: function(data) {

		console.log("GOT THIS:");
		console.log(data);
		if(callback != undefined && typeof callback == 'function') 
		{
			if (data.ERROR == 1)
			{
			alert("Server Session expired. Perform logout.");
			logout();
			}
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
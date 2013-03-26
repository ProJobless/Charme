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
	var url1 = "http://"+srv+"/charme/req.php?session="+ses+"";


	$.ajax({

	  url: url1,
	

	type: "POST",

    data: {d:JSON.stringify(requests), test: "test"},
    dataType: "json",//json

    crossDomain : true,




	  error: function (xhr, ajaxOptions, thrownError) {
      console.log(thrownError);
      console.log(ajaxOptions);
      console.log(xhr);
      },
	  success: function(data) {



		console.log("GOT THIS:");
		console.log(data);
		console.log("on:"+url1);


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
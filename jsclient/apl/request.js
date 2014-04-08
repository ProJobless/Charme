
// apl posttest: only for debug!

function apl_posttest(requests) {
	var ses = "";
	var url1 = "http://server.local/charme/auto.php?debug=1&session=" + ses + "";

	$.ajax({

		url: url1,

		type: "POST",

		data: {
			d: JSON.stringify(requests),
			test: "test"
		},
		dataType: "html", //json

		crossDomain: true,
		xhrFields: {
			withCredentials: true
		},
		cache: false,

		error: function(xhr, ajaxOptions, thrownError) {
			console.log(thrownError);
			console.log(xhr.responseText);

		},
		success: function(data) {

			console.log("posttest returns: " + data);
		}
	});


}
/***
  Name:
  apl_request

  Info:
  Make a request to a charme Server

  Params:
  requestData:json:Data in json format 
  callback:function:Callback function
  SessionId:string:Not used currently, Write "null" in here
  Server:string:Server to which the request is send to. If its null, we will use the host of the logged in user.

  Location:
  apl

  Code:JS:
  // Send a info_about request to myserver.com
  apl_request({"requests" :
    [
      {"id" : "info_about"}
    ]
  }, function(data){ console.log(data.info_about);}, null, "myserver.com");
*/


function apl_request(requests, callback, ses,srv)
{
	//apl_posttest(requests);

	if (srv == null && charmeUser != null)
		srv = charmeUser.server;
	if (ses == null && charmeUser != null)
		ses = charmeUser.sessionID;


	// TIPP: http://stackoverflow.com/questions/15047279/how-can-i-retrieve-json-stringified-objects-in-php
	var url1 = "http://"+srv+"/charme/req.php";



	$.ajax({

		url: url1,
		type: "POST",
		data: {d:JSON.stringify(requests)},
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
			if (data.ERROR == 1 && srv == charmeUser.server)
			{
			alert("Server Session expired. Logging out...");
			logout();
			}
			callback(data);
		}

		}});
}




/***
	Name:
	$.fn.serializeObject

	Info:
	Serialize form to JSON object.

	Location:
	apl/request.js

	Code:JS:
	var json = $('#myform').serializeObject();
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
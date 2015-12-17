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


function apl_request(requests, callback, ses, srv, showNoErrors) {
  //apl_posttest(requests);


  if (srv == null && charmeUser != null)
    srv = charmeUser.server;
  if (ses == null && charmeUser != null)
    ses = charmeUser.sessionID;

  // TIPP: http://stackoverflow.com/questions/15047279/how-can-i-retrieve-json-stringified-objects-in-php
  var url1 = "http://" + srv + "/charme/req.php";

  var allowLogoutOnError = false;

  if (charmeUser != null && charmeUser.server==srv) {

   allowLogoutOnError = true;
}


  $.ajax({

    url: url1,
    type: "POST",
    data: {
      d: JSON.stringify(requests)
    },
    dataType: "json",
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },


    cache: false,
    error: function(xhr, status, thrownError) {

      console.log(thrownError);
      console.log(status);
      console.log(xhr)

      if (!showNoErrors) {
        $.get("templates/box_error.html", function(d) {

          var simpleMessage = "Uuuups, something went wrong...";
          if (xhr.readyState == 0)
            simpleMessage = "Connection to server failed. Please check your internet connection or server url.";

          var templateData = {
            simpleMessage: simpleMessage,
            allowLogoutOnError : allowLogoutOnError,
            errorMessage: thrownError + "\n\nStatus Code: " + status
          };

          _.templateSettings.variable = "rc";
          var template = _.template(d, templateData);
          ui_showBox(template);
        });
      }

    },
    success: function(data) {

      if (callback != undefined && typeof callback == 'function') {
        if (data.ERROR == 1 && typeof charmeUser !== 'undefined' && srv == charmeUser.server) {
          logout("tokenExpired");
        }
        callback(data);
      }

    }
  });
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

$.fn.serializeObject = function() {
  var o = {};
  var form = this;
  var a = this.serializeArray();
  console.log(a);
  $.each(a, function() {

    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {

      if ($(this).attr("data-typed") == "float")
        this.value == parseFloat(this.value);

      o[this.name] = this.value || '';

      if (true) {
        var d = $(form).find("[name=" + this.name + "]").data("storage");
        if (typeof d !== "undefined") {
          o[this.name + "_data"] = d;

        }
      }
    }
  });
  return o;
};

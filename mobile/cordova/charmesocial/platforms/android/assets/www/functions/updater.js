

/***
	Name:
	apl/updater.js

	Info:
	Will be called in certain intervals and looking for new updates like messages etc.

	Set .count fields.

	Location:
	jsclient/apl

*/
$(function(){

		if (typeof charmeUser !== 'undefined' && charmeUser != null) {


			CHARME_GLOBAL_SOCKETURL = "ws://" + charmeUser.getServer() + ":8085";


		if (CHARME_GLOBAL_SOCKETURL != "" && typeof CHARME_GLOBAL_SOCKETURL !== "undefined")
		var host = "ws://" + charmeUser.getServer() + ":8085"; ///charme/events.php
		else
		{
			AUTOBAHN_DEBUG = false;
			console.warn("Charme is connecting to localhost for websocket connection. This should not happen in the released version.");
			host = "ws://localhost:8085"; // Only for debugging
		}


		console.log("Socket connection host is "+host+"....");

		var conn = new ab.Session(host,
			function() {
				console.log("WAMP session started!");
				conn.subscribe(charmeUser.userId, function(topic, data) {
					// This is where you would add the new article to the DOM (beyond the scope of this tutorial)
					console.log('new message "' + topic + '" : ' + data);

					if (data.type=="newNotifications")
					{
						apl_request(
						    {"requests" : [
						    {"id" : "updates_get"}

						    ]
							}, function(data){

								apl_update_apply(data.updates_get);
							}, null, null, true);
					}
					else if (typeof container_main.currentView.sub.refreshMessages !== "undefined")
					{

						container_main.currentView.sub.refreshMessages([data]);
					}
					else
					{
						var currentNum = 0;

						if (!$("#item_talks").parent().hasClass("active") && $("#item_talks .count").length == 0)
							$("#item_talks").append('<span class="count">'+currentNum+'</span>');
						if ($("#item_talks .count").length > 0)
							currentNum = parseInt($("#item_talks .count").text());

						$("#item_talks .count").text((currentNum+1));

					}
				});
			},
			function() {
				console.warn('WebSocket connection closed');
			}, {
				'skipSubprotocolCheck': true
			}
		);



	/*
	var host = "http://" + charmeUser.getServer() + "/charme/events.php";

		refresh = function () {

		    $.ajax({
		        url: host,
		        type: 'POST',
		        dataType: "json",
		        async: true,
		        crossDomain : true,
						xhrFields: {
				    withCredentials: true
				 },
		        cache: false,
		        success: function (data, textStatus) {
		          console.log(data);
		        },
		    })
		    .done(function() {
		        console.log("success");
		        	refresh();
		    })
		    .fail(function(error) {
		        refresh();
		        console.log('Error: ' + error.statusText);
		    });
		}
		refresh();
*/


/*
$.doTimeout( 'getnotify', 1000*20, function(state){

apl_request(
    {"requests" : [
    {"id" : "updates_get"}

    ]
	}, function(data){
		apl_update_apply(data.updates_get);
	});


return true;


});*/
}
});






function apl_update_apply(jsondata)
{
$("#item_stream .count").remove();
$("#item_talks .count").remove();

// Set count if number!=0 and item is not selected
if (jsondata.counter_talks != undefined && jsondata.counter_talks > 0 && !$("#item_talks").parent().hasClass("active"))
	$("#item_talks").append('<span class="count">'+jsondata.counter_talks+'</span>');


if (jsondata.counter_stream != undefined &&  jsondata.counter_stream > 0 && !$("#item_stream").parent().hasClass("active"))
	$("#item_stream").append('<span class="count">'+jsondata.counter_stream+'</span>');

if (jsondata.counter_notify == undefined)
	$("#button_notifications").text("0").removeClass("highlight");
else
{
	if (jsondata.counter_notify > 9)
		jsondata.counter_notify = "9+";


	$("#button_notifications").text(jsondata.counter_notify);
	if (jsondata.counter_notify != 0)
	$("#button_notifications").addClass("highlight")

}

}

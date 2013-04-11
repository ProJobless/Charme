

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



$.doTimeout( 'getnotify', 1000*5, function(state){	

apl_request(
    {"requests" : [
    {"id" : "updates_get"} 

    ]
	}, function(data){
		apl_update_apply(data.updates_get);
	});


return true;


});

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


}


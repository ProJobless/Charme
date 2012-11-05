function but_newMessage()
{

	

		$.post("ui/actions/newMessage.php", function(d){
	ui_showBox(d+ui_Button("Send", "sendMessageNew()") +" or " + ui_closeBoxButton());
	//init buttons
	});



}
timer_msg_height = null;

function initTalks()
{
	clearInterval(timer_msg_height);
	timer_msg_height=setInterval(function(){changeHeight()},300);

	if ($(".msgItems").length > 0)
	{

		changeHeight();
		$.doTimeout( 'to_bottom', 10, function(){$(window).scrollTop(999999);$.doTimeout( 'to_bottom' );});
// do something in 1 second




		

	}


}
function changeHeight()
{


$(".talkmessages").css("margin-bottom", ($(".instantanswer").height()+48)+"px");




}
function sendMessage(a)
{
$.post("ui/actions/newMessage.php", $(a).serialize(), function(d){
		
	ui_closeBox();

	if (a == '.instantanswer form')
			$('.talkmessages').append(d);

	});

}
function sendMessageNew()
{
	sendMessage('.fixedBox form');
}
function sendMessageInstant()
{

	sendMessage('.instantanswer form');


}
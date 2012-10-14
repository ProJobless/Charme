function but_newMessage()
{

	

		$.post("ui/actions/newMessage.php", function(d){
	ui_showBox(d+ui_Button("Send", "sendMessageNew()") +" or " + ui_closeBoxButton());
	//init buttons
	});



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
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
	
$(window).resize(function() {
setSCHeight();
});

setSCHeight();

	


}
function setSCHeight()
{
$(".msgScrollContainer").css("height", ($(window).height()-82)+"px");
$('.nano').nanoScroller();
}

function changeHeight()
{


$(".talkmessages").css("margin-bottom", ($(".instantanswer").height()+48)+"px");






}
function sendMessage(a)
{
	var files;
	if (a == '.fixedBox form') // New message was created => Get files from new message form
		files = getAttachmentFiles("atf_NEWMESSAGE");
	else //Appended message => Get files from answer message form
		files = getAttachmentFiles("atf_stream_APPENDMESSAGE");
	

	
	/*
		Cannot use .serialize() for form here, because we also need to post attachement files!
	*/
	$.post("ui/actions/newMessage.php",{

		col_to: $(a+" input[name='col_to']").val(), 
		col_type: $(a+" input[name='col_type']").val(),
		col_description: $(a+" textarea[name='col_description']").val(),
		files: files

	 }, function(d){
	ui_closeBox();

	// Clear Textbox and attachment container after messages has been sent
	$(a+" textarea[name='col_description']").val("").focus();
	$("#attachmentsatf_stream_APPENDMESSAGE").html("")

	// Scroll to bottom
	$("html, body").animate({ scrollTop: $(document).height() }, "slow");

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
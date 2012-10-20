function addGroup()
{

		$.post("ui/actions/addGroup.php", function(d){
	ui_showBox(d+ui_Button("Send", "addGroupOk()") +" or " + ui_closeBoxButton());
	//init buttons
	});
}
function addGroupOk()
{

	$.post("ui/actions/addGroup.php", $('.fixedBox form').serialize(), function(d){
		ui_closeBox();

		
	});
}

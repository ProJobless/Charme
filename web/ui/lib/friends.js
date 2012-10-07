function addListButton()
{


	$.post("ui/actions/newList.php", function(d){
	ui_showBox(d+ui_Button("Add List", "addList()") +" or " + ui_closeBoxButton());
	//init buttons
	});
}
function addList()
{

	$.post("ui/actions/newList.php", $('.fixedBox form').serialize(), function(d){
		ui_closeBox();
		$('div[title=submenu_items]').append(d);
		initPage(0);
		
	});
}
function initFriends()
{


}
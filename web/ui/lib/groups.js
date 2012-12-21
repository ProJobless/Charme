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
function showSettings(groupId)
{
	$.post("ui/actions/addGroup.php",{'groupId': groupId}, function(d){
	ui_showBox(d+ui_Button("Save", "addGroupOk()") +" or " + ui_closeBoxButton());
	//init buttons
	});
}
function addPeople(groupId)
{
	$.post("ui/actions/addPeople.php", function(d){
	ui_showBox(d+ui_Button("Invite People", "group_invite()") +" or " + ui_closeBoxButton());
	//init buttons
	});
}
function leaveGroup(groupId)
{

	ui_showBox("Are you sure?"+ui_Button("Leave Group", "leaveGroup2('"+groupId+"')") +" or " + ui_closeBoxButton());
}
function leaveGroup2(groupId)
{


}
function group_setDefault(groupId)
{
alert("TODO");

}



function but_addCollection()
{
	

$.post("ui/actions/newCollection.php", function(d){

ui_showBox(d+ui_Button("Add Collection", "addCollection()") +" or " + ui_closeBoxButton());

//init buttons
});

	
	

}
function addCollection()
{
	//Serialize Form
	//1: get form by id, 2. form.serialize

$.post("ui/actions/newCollection.php", $('.fixedBox form').serialize(), function(d){
	
	ui_closeBox();
});

}

function initProfile()
{
	
}
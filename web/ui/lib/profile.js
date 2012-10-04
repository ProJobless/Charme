function but_addCollection()
{
	$.post("ui/actions/newCollection.php", function(d){
	ui_showBox(d+ui_Button("Add Collection", "addCollection()") +" or " + ui_closeBoxButton());
	//init buttons
	});
}

function postIntoCollection()
{
//var c = 
}

function addCollection()
{
	//Serialize Form
	//1: get form by id, 2. form.serialize
	var x = $.urlParam("id",location.href );
	x = (x=="") ?  "0" : x;
	$.post("ui/actions/newCollection.php?id="+x, $('.fixedBox form').serialize(), function(d){
		ui_closeBox();
		alert(d);
	});
}

function initProfile()
{
	$('.but_postCol').click(function(){ 

		var v = ($(this).parent().children("textarea").val());
		var x = $.urlParam("id",location.href );
		x = (x=="") ?  "0" : x;
		$.post("ui/actions/doPost.php?id="+x, {content:v}, function(d)
		{
			alert(d);
		});
	});
}
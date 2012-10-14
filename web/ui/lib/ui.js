function ui_userselect()
{

		$('.userSelect2').each (function(index)
	{
	$(this).tokenInput("ui/actions/auto_people.php", {hintText: "Typ in a person or a list"} );
	});

	$('.userSelect').each (function(index)
	{

	if ($(this).data("styp") != 3)
	$(this).parent().hide();


    jsonp = $(this).data("json");//jquery automatically converts string to json :) 


	console.log(jsonp);
	$(this).tokenInput("ui/actions/auto_people.php", {hintText: "Typ in a person or a list"} );
	var x = this;
	jQuery.each(jsonp, function(i, val) {
	
       $(x).tokenInput("add", val);
    });


	});

}

function ui_switch()
{
//...to data-switch


}

function ui_block(content)
{
	if (!$("body .uiBlock").length)
	$("body").prepend("<div class='uiBlock'></div>");
	
	$("body .uiBlock").fadeIn(400);
	
}
function ui_unblock(content)
{
	$("body .uiBlock").fadeOut(400);

}

function ui_showBox(content, func)
{
	ui_block();
	if (!$("body .fixedBox").length)
	$("body").prepend("<div class='fixedBox'></div>");
	
	
	$("body .fixedBox").html(content);
	 	ui_userselect();

 	 $("body .fixedBox").css("margin-left", -$("body .fixedBox").width() / 2);


	$("body .fixedBox").animate({
    top: '150px',
  }, 400, function() {

 
$("body .fixedBox input:first").focus();
  	if (func)
  		func
  });
	
}
function ui_closeBoxButton()
{
return "<a href='javascript:ui_closeBox();'>Close</a>";	
}
function ui_Button(name, func)
{
return "<a class='button' href='javascript:"+func+";'>"+name+"</a>";	
}

function ui_closeBox(content)
{
	ui_unblock();
	var h = $("body .fixedBox").height()+100;

	$("body .fixedBox").animate({
    top: '-'+h+'px',
  }, 400, function() {
	  
	 $("body .fixedBox"). html("");
	  
  });
	
	
}
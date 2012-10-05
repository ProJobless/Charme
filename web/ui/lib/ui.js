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

function ui_showBox(content)
{
	ui_block();
	if (!$("body .fixedBox").length)
	$("body").prepend("<div class='fixedBox'></div>");
	
	
	$("body .fixedBox").html(content).animate({
    top: '200px',
  }, 400, function() {
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
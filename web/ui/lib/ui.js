function ui_block(content)
{
	if (!$("body .uiBlock").length)
	$("body").prepend("<div class='uiBlock'></div>");
	
	$("body .uiBlock").fadeIn(200);
	
}
function ui_unblock(content)
{
	$("body .uiBlock").fadeOut(200);

}

function ui_showBox(content)
{
	ui_block();
	if (!$("body .fixedBox").length)
	$("body").prepend("<div class='fixedBox'></div>");
	
	
	$("body .fixedBox").html(content).animate({
    top: '200px',
  }, 200, function() {
  });
	
}
function ui_closeBoxButton()
{
return "<a href='javascript:ui_closeBox();'>Close</a>";	
}

function ui_closeBox(content)
{
	ui_unblock();
	$("body .fixedBox").animate({
    top: '-500px',
  }, 200, function() {
	  
	 $("body .fixedBox"). html("");
	  
  });
	
	
}
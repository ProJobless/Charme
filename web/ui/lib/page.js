$(document).ready(function() {
  var sus = location.href.split('&');
  var ar ="";
  var p = $.urlParam("p",location.href );
  
  //CHECK IF VIRTUAL PAGE!

  

 console.log("ready()");
  
  if (p=="")
  	p="stream";



	ar = (sus.length ==1) ?   "" :  sus[1];

  
  history.replaceState({ page: "ui/pages/"+p+".php?foo=1&"+ar}, "", "?p="+p+"&"+ar);

  $('.sbAlpha ul a').each (function(index)
  {$(this).click(function(){pageLoadWithHistory($(this).attr("ref"), "")});});



$("#button_notifications").click(function(){

	actionwindow($(this));
});



$(".actionBar a").mousedown(function(){
	var x = $(this).data("bgpos");

	if (!$(this).hasClass("active"))
	$(this).css("background-position",x+"px -31px");
}).mouseout(function(){
	var x = $(this).data("bgpos");
	if (!$(this).hasClass("active"))
	$(this).css("background-position",x+"px -0px");
	
});


 	initPage(0);

});

function actionwindow(obj)
{
	var x = $(obj).data("bgpos");



	 obj.addClass("active");
	obj.css("background-position",x+"px -62px");

	$('.actionCont').html(obj.attr("ref"));
	
	if ($('.actionCont').position().top > 0)
	{
		
		$('.actionBar a').removeClass("active");
		obj.css("background-position",x+"px -0px");
		
		
	$('.actionCont').animate({

    top: '-205'}, 100, function() {
		
    
  });
  	
	}else
	{
	
	$('.actionCont').animate({
    opacity: 1.0,
    top: '30'}, 100, function() {
   
  });
	}
	
	
	
}

window.onpopstate = function(e) {
	if (e.state != null)
	{

    pageLoadURL(e.state.page, 0);
	
	
	}
	
	//initPage(0);
};



function initPage(level)
{
	
	
		
	$('.tabBar a').unbind('click');
	$('.sbBeta a').unbind('click');
	$('a[data-page]').unbind('click');
	

	//Problem: actionbuttons initlized before, change to "sbBeta .actionbutton"?
	//$('.actionButton').unbind('click');
	
	
	$('textarea:not(.noAutoHeight)').autosize();
	
	if ($('div[title=page_layout]').html() == "1")
	{
			$('.content').css("width", "700px");
		$('.content').css("margin-left", "150px");
		$('.sbBeta').show();
		
	if (level == 0)
	$('.subCont').html($('div[title=submenu_items]').html());
	
	
	}
	else
	{
		$('.content').css("width", "850px");
		$('.content').css("margin-left", "0");
		$('.sbBeta').hide();
	}
	

	$('.functionButton').click(function(){ (eval(this.id+"("+$(this).data("fargs")+");"));	});

	$('.sbBeta a').each (function(index)
  {$(this).click(function(){ pageLoadWithHistoryBeta($(this).attr("ref"), 0);	});});
	
	$('.tabBar a').each (function(index)  {	$(this).click(function(){   pageLoadWithHistoryBeta($(this).attr("ref"), 1);});});
	
	$('.sbAlpha li').removeClass("active");
	$('.sbAlpha li a[ref='+ $.urlParam("p",location.href )+']').parent().addClass("active");
	
	$('.sbBeta li').removeClass("active");
	
		$('a[data-page]').each (function(index)  {	$(this).click(function(){   pageLoadWithHistory($(this).attr("data-page"),$(this).attr("data-pagearg"));});});
		
		
	
	var qq =  $.urlParam("q",location.href );

	if (qq=="")
	$('.sbBeta li a').first().parent().addClass("active");
	else
	$('.sbBeta li a[ref='+qq+']').parent().addClass("active");
}

function pageLoadWithHistoryBeta(q, dest)
{
	var p = $.urlParam("p",location.href );
	if (p=="")
		p="stream";
	console.log("ui/pages/"+p+".php?q="+q+"&");
	history.pushState({ page: "ui/pages/"+p+".php?q="+q+"&"}, "", "?p="+p+"&q="+q);

	if (dest == 1){
	pageLoad(p,"&q="+q, 3);
$('.tabBar li').removeClass("active");
$('.tabBar li[data-name='+q+']').addClass("active");

}
	else
		pageLoad(p,"&q="+q, 1);
}
function pageLoadWithHistory(pagename, args)
{
	history.pushState({ page: "ui/pages/"+pagename+".php?foo=1&"+args}, "", "?p="+pagename+args);
	pageLoad(pagename,args, 0);
}
//args: &arg1=23123&arg2=...
function pageLoad(pagename, args, level)
{

	pageLoadURL("ui/pages/"+pagename+".php?foo=1&"+args, level);
}
function pageLoadURL(url, level)
{

	//var p = '#page';
	//Problem: wenn back und nur in tabpagecontent laden?
	//if ($('#tabPageContent').length > 0)
 	//	p = '.tabPageContent';
		
	var t = '#page';
if (level == 3)
t = '#page3';

		$(t).load(url, {level:level},function() {
			
	
		if (level == 3)
	level = 0;
		initPage(level);
	});
	
}
function getNotifications()
{
	// JSON contains, number of new notifications, ....
}


$(document).ready(function() {

// Latex Test

//$(".tex")


$.doTimeout( 'getnotify', 1000*60, function(){
		
	getNotifications();
	return true; // return false to cancel loop

});



  var sus = location.href.split('&');
  var ar ="";
  var p = $.urlParam("p",location.href );
  
  //CHECK IF VIRTUAL PAGE!

  

 console.log("ready()");
  
  if (p=="")
  	p="stream";



	var ind = location.href.indexOf('&');
	if (ind == -1)
		ar = "";
	else
	ar = "&"+location.href.substr(ind+1);



  //alert(sus[1]);
  //Problem here: if more args then p and q -> problem!
  //history.replaceState({ page: "ui/pages/"+p+".php?foo=1&"+ar}, "", "?p="+p+"&"+ar);
	history.replaceState({ page: "ui/pages/"+p+".php?foo=1"+ar}, "", "?p="+p+""+ar);


  $('.sbAlpha ul a').each (function(index)
  {$(this).click(function(){pageLoadWithHistory($(this).attr("ref"), "")});});



$("#button_notifications").click(function(){

	actionwindow($(this));
});





 	initPage(0);

});

function actionwindow(obj)
{
	var x = $(obj).data("bgpos");

 //	$(obj).focus(); // Prevent selction by double click

	 obj.addClass("active");
	obj.css("background-position",x+"px -62px");


	$('.actionCont').html("Loading...");

	$.post("ui/actions/notifications.php?id="+x, {}, function(d)
	{
	$('.actionCont').html(d);
	});

$('.actionCont').css("left", $('#button_notifications').offset().left);


	if ($('.actionCont').position().top > 0)
	{
		
		$('.actionBar a').removeClass("active");
		obj.css("background-position",x+"px -0px");
		
		
	$('.actionCont').animate({

    top: '-205'}, 0, function() {
		
    
  });
  	
	}else
	{
	
	$('.actionCont').animate({
    opacity: 1.0,
    top: '31'}, 0, function() {
   
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
	// Do Latex
	translate();

	// stop timers if exists
	if (timer_msg_height)
		clearInterval(timer_msg_height);



	$(".actionIcon").mousedown(function(){
	var x = $(this).data("bgpos");

	if (!$(this).hasClass("active"))
	$(this).css("background-position",x+"px -48px");
}).mouseout(function(){
	var x = $(this).data("bgpos");
	if (!$(this).hasClass("active"))
	$(this).css("background-position",x+"px -0px");
	
});



	

		
	$('.tabBar a').unbind('click');
	$('.sbBeta a').unbind('click');
	$('a[data-page]').unbind('click');
	$('a[data-page]').unbind('click');



	$('.but_postCol').unbind("click").click(function(){ 


		var v = ($(this).parent().parent().children("textarea").val());
		var g = ($(this).parent().parent().children("input[name='groupid']").val());
		var x = $.urlParam("id",location.href );

		// Collection is selected by user via drop down
		var g2 = ($(this).parent().children("select").val());

		if (g2 != undefined)
			g = g2;

		var files = new Array();
		$('.attachmentContainer div').each (function(i,v)
 		{
		files.push(new Array($(v).data("filecontent").result,$(v).data("filecontent").file.name));
 	
 		});
		console.log(files);

		x = (x=="") ?  "0" : x;
		$.post("ui/actions/doPost.php?id="+x, {content:v, g:g, files:files}, function(d)
		{
			alert(d);
			var pv = new PostView({el: $('.collectionPostbox')});  
			console.log(pv);

		});
	});


	//Problem: actionbuttons initlized before, change to "sbBeta .actionbutton"?
	//$('.actionButton').unbind('click');
	
	
	$('textarea:not(.noAutoHeight)').autosize();
	
	if ($('div[title=page_layout]').html() == "1") // Use left sidebar
	{
		$('.page_content').css("width", "700px");
		$('.page_content').css("margin-left", "150px");
		$('.sbBeta').show();
		
		if (level == 0)
		{
			$('.sbBeta .actionBar').html(""); // Remove existing buttons
			$('.subCont').html($('div[title=submenu_items]').html());
			$('.sbBeta .actionBar').html($('div[title=action_bar]').html());
		}
	}
	else // Do not use left sidebar
	{
		$('.page_content').css("width", "850px");
		$('.page_content').css("margin-left", "0");
		$('.sbBeta').hide();
	}



	ui_userselect();



	$('.functionButton').click(function(){ (eval(this.id+"("+$(this).data("fargs")+");"));	});

	$('.sbBeta a').each (function(index)
  {$(this).click(function(){ pageLoadWithHistoryBeta($(this).attr("ref"), 0);	});});
	
	$('.tabBar a').each (function(index)  {	$(this).click(function(){   pageLoadWithHistoryBeta($(this).attr("ref"), 1);});});
	
	$('.sbAlpha li').removeClass("active");
	$('.sbAlpha li a[ref='+ $.urlParam("p",location.href )+']').parent().addClass("active");
	
	$('.sbBeta li').removeClass("active");
	
	//loads into #page div
	$('a[data-page]').each (function(index)  {	$(this).click(function(){ var x = $(this).attr("data-pagearg"); if (x== null) x = "";  pageLoadWithHistory($(this).attr("data-page"),x);});});
	//loads into #page3 div
	$('a[data-page2]').each (function(index)  {	$(this).click(function(){  var x = $(this).attr("data-pagearg"); if (x== null) x = "";   pageLoadWithHistoryBetaArg($(this).attr("data-page"),x);});});
		
		
	
	var qq =  $.urlParam("q",location.href );

	if (qq=="")
	{

		// If no active element specified, mark 1st element as active
		if ($('.sbBeta li a.active2').length == 0) 

			$('.sbBeta li a').first().parent().addClass("active");
		else
		{
			$('.sbBeta li a.active2').parent().addClass("active");
			$('.sbBeta li a.active2').removeClass("active2");
		}
	}
	else
	$('.sbBeta li a[ref='+escapeExpression(qq)+']').parent().addClass("active");


	//Has to be called after sbBeta actionbar init.
	$(".actionBar a").mousedown(function(){
	
		var x = $(this).data("bgpos");

		if (!$(this).hasClass("active"))
		$(this).css("background-position",x+"px -31px");
	}).mouseout(function(){
		var x = $(this).data("bgpos");
		if (!$(this).hasClass("active"))
		$(this).css("background-position",x+"px -0px");
		
	});

	initProfile();
	initTalks();
	initFriends();


	//if (MathJax)
	//MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

}
function pageLoadWithHistoryBetaArg(p, args)
{
	var p = $.urlParam("p",location.href );


	history.pushState({ page: "ui/pages/"+p+".php?foo=1"+args}, "", "?p="+p+""+args);
	pageLoad(p,args, 3);
}
function pageLoadWithHistoryBeta(q, dest)
{

	var p = $.urlParam("p",location.href );
	if (p=="")
		p="stream";
	console.log("ui/pages/"+p+".php?q="+q+"&");
	history.pushState({ page: "ui/pages/"+p+".php?q="+q+"&"}, "", "?p="+p+"&q="+q);

	if (dest == 1){ //Called from profile navigation
	pageLoad(p,"&q="+q, 3);

	
$('.tabBar li').removeClass("active");
$('.tabBar li[data-name="'+escapeExpression(q)+'"]').addClass("active");

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
if ($('#page3').length > 0 && level == 3){
t = '#page3';

}


		$(t).load(url, {level:level},function() {
			
	
		initPage(level);
	});
	
}
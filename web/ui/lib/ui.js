function ui_attachmentform()
{


}

function ui_attach(x)
{


if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.



$(x).siblings("input").unbind('change').change(function(h)
{  
var files = h.target.files; // FileList object
var output = [];
    for (var i = 0, f; f = files[i]; i++) {
    	$('.attachmentContainer').append("<div>"+ escape(f.name)+ "</div>");


  /*  output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');*/
    }
   // document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';

});
$(x).siblings("input").trigger("click");


 	

 	//.trigger('change', function(h){}, false);

} else {
  alert('The File APIs are not fully supported in this browser.');
}

//

}



function ui_userselect()
{
	$('.userSelectSwitcher').change(function() {
	  

	  if ($(this).val() == 3)
	$(this).siblings(".spec").show();
	else
	$(this).siblings(".spec").hide();

	});




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
	$("body").focus();//Because if not then problem when auto complete focused 
	ui_unblock();
	var h = $("body .fixedBox").height()+100;

	$("body .fixedBox").animate({
    top: '-'+h+'px',
  }, 400, function() {
	  
	 $("body .fixedBox"). html("");
	  
  });
	
	
}
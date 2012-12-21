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
		initPage(1);
	});
}
function initFriends()
{
	$("#friendItemContainer div .item").draggable({helper: 'clone',opacity: 0.8});


	$(".subCont li").droppable({
	accept: "#friendItemContainer div .item",
	activeClass: 'dp-active',
	hoverClass: 'dp-hover',
	drop: function(ev, ui) {
	
	var listId= $(this).children("a").attr("ref");

	var itemId= $(ui.draggable).data("userid");

	$(this).append("<span class='stateInfo'>Adding...</span>").show();
	
	var x = $(this); // Save element in temporary veriable

	$.post("ui/actions/dropList.php",{'listId': listId,'itemId': itemId},function(d){
		$(x).children(".stateInfo").html(" +1 Person").fadeOut(500);
		alert(d);
	});

	
	/*

	var lid= $(this).attr("id");
		
 var uid =  $(ui.draggable).attr("alt");
 

 
 
$.post("friends/drop.php",{uid: uid,lid: lid, SID:sid},function(data){


			});*/


		}
	});
}
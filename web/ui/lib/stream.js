function displayCommentBox(o)
{
	$(".commentBox").hide();
	$(o).siblings(".commentBox").show();
	//$(o).siblings(".commentBox textarea").select().focus(); //does not work because of auto height plugin!
	console.log($(o).siblings(".commentBox"));
}

function lovePost(o)
{
	$(o).text("Unlove");
}
function followPost(o)
{
	$(o).text("Unfollow");
}
function doCommentReq(o)
{
	var pid = $(o).data("postid");	
	var uid = $(o).data("userid");	
	var txt = $(o).siblings("textarea").val();

	$.post("ui/actions/doComment.php", {"pid":pid, "txt":txt, "uid":uid},function(d){
	alert(d);
	//init buttons
	});


	
}
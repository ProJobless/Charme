function displayCommentBox(o, userid, postid)
{
	//$(".commentBox").hide();
	
	//$(o).siblings(".commentBox textarea").select().focus(); //does not work because of auto height plugin!
	console.log($(o).siblings(".commentBox"));

	var p = $(o).siblings(".commentBox").children(".postcomments");


	if ($(p).data("loaded") != true)
	{
		$(p).data("loaded", true);

		$.post("ui/actions/showComments.php", {postid: postid, userid:userid},function(d){
		


		$(o).siblings(".commentBox").show();
		$(p).prepend(d);
		$(o).siblings(".commentBox").children("textarea").focus().select();

		});
	}
	else
	{
		$(o).siblings(".commentBox").show();
		$(o).siblings(".commentBox").children("textarea").focus().select();
	}


}
function stopComment(o)
{

	$(o).parent().hide();
	
}
function loadComments(postid, userid, o, start)
{

	$(o).css("color", "silver");
	

	if ($(o).data("loading") != true)
	{
		$(o).data("loading", true);
		$.post("ui/actions/showComments.php?s="+start, {postid: postid, userid:userid},function(d){
			var t = $(o).parent();

			$(o).remove();

			$(t).prepend(d);


			});
	}
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
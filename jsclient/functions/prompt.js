// Display a Yes/No Prompt
function ui_yesno(text, textYes, textNo, callback) {

	$.get("templates/box_yesno.html", function(d) {

		var templateData = {
			text: text,
			textYes: textYes,
			textNo: textNo
		};

		_.templateSettings.variable = "rc";
		var template = _.template(d, templateData);

		ui_showBox(template, function() {
			$("#but_yes").click(function() {
				callback();
			});
		});
	});
}

function ui_block(content)
{
	if (!$("body .uiBlock").length)
	$("body").prepend("<div class='uiBlock'></div>");

	$("body .uiBlock").fadeIn(400);
	$("body").addClass("noscroll");

}
function ui_unblock(content)
{
	$("body .uiBlock").fadeOut(400);
	$("body").removeClass("noscroll");

}
function ui_showImgBox(src, callback)
{
	ui_block();

	$("body").parent().append(
							$('<div class="imagePreview"><a class="close"><i class="fa fa-times"></i></a><img src="'+src+'" class=""></div>'));




							$(".imagePreview .close").click(function(){
								ui_closeBox();
								$('.imagePreview').remove();
							});



}

function ui_mapSelector(element, callback, keepMap) {

		var randomId = "map"+String(Math.floor( Math.random()*99999 ));

		$(".mapSelector").remove();
		$('<div/>', {
    id: randomId,
		style: "height: 300px;",
		class: "mapSelector mapOsm fixedBoxInner"
	}).insertAfter(element);

		var map = L.map(randomId).setView([48, 11], 4);

		function onMapClick(e) {
			if (true != keepMap)
				$(".mapSelector").remove();
		   callback(e.latlng.lng, e.latlng.lat);

			// Alert: Location was added...
		}

		map.on('click', onMapClick);

		// add an OpenStreetMap tile layer
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		// add a marker in the given location, attach some popup content to it and open the popup
		//L.marker([latitude, longitude]).addTo(map)
	//	L.bindPopup(name)
		//.openPopup();

}

function ui_showMap(latitude, longitude, name)
{

	ui_showBox("<div  ><div id='map' class='mapOsm fixedBoxInner'></div></div><div class='p32' style='background-color:#efefef'>" + ui_closeBoxButton() + "</div>", function()
		{
				// create a map in the "map" div, set the view to a given place and zoom
			var map = L.map('map').setView([latitude, longitude], 13);

			// add an OpenStreetMap tile layer
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

			// add a marker in the given location, attach some popup content to it and open the popup
			L.marker([latitude, longitude]).addTo(map)
			.bindPopup(name)
			.openPopup();


		}, 800);





}

/***
	Name:
	ui_showBox

	Info:
	Shows a Message box with specified HTML content.


	Params:
	content:string:HTML Content
	callback:function:Callback function when box animation is complete, Register events here.

	Location:
	apl/prompt.js

	Code:JS:
	ui_showBox("Hello World", function(){alert("Box is visible");});
*/

function ui_showBox(content, callback, a_width)
{

	//TODO: Remove box if already exists:!
	if (typeof a_width === "undefined")
		a_width = 400;
	ui_block();

	if (!$(".uiBlock .fixedBox").length)
	$(".uiBlock").prepend("<div class='fixedBox'></div>");

	$('.fixedBox').css("max-width", a_width+"px");


	$(".uiBlock .fixedBox").html(content);

	var h = $("body .fixedBox").height()+100;

	 $(".uiBlock .fixedBox").css("top", -h);


 	 $(".uiBlock .fixedBox").css("margin-left", -$("body .fixedBox").width() / 2);


	$(".uiBlock .fixedBox").animate({
    top: '150px',
  }, 200, function() {



//$("body .fixedBox input:first").focus();
  if(callback != undefined && typeof callback == 'function') callback();




  });

}
function ui_closeBoxButton()
{
	return "<a class='button' href='javascript:ui_closeBox();'>Close</a>";
}
function ui_Button(name, func)
{
	return "<a class='button' href='javascript:"+func+";'>"+name+"</a>";
}

/***
	Name:
	ui_closeBox

	Info:
	Close a Message box opened with ui_showBox

	Location:
	apl/prompt.js

	Code:JS:
	ui_closeBox();
*/
function ui_closeBox()
{
	$("body").focus();//Because if not then problem when auto complete focused
	ui_unblock();
	var h = $("body .fixedBox").height()+100;

	$("body .fixedBox").animate({
    top: '-'+h+'px',
  }, 200, function() {

	 $("body .fixedBox"). html("");

  });


}

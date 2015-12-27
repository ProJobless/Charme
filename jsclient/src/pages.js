/***
	Name:
	page_authenticated

	Info:
	Main container with navigation. Init at login() or $.ready when user is logged in.

	Properties:
	currentView:view_page:The current page. Do not set!

	Location:
	pages.js

	Code:JS:
	container_main= new page_authenticated({el:'#layout'});
*/


page_authenticated = Backbone.View.extend({

	el: '',
	sidebarLoad: false,
	currentView: null,
	events: {
		"click  #button_notifications": "showNotifications",
	},
	setCurrent: function(obj) {


		if (this.currentView != null) {
			console.log(this.currentView);

			// Important, we have to "unregister" events from subViews
			this.currentView.setSub(null);
			this.currentView.undelegateEvents();
			//	this.currentView.remove();
			//	this.currentView.unbind();
			//this.delegateEvents();
			//this.undelegateEvents();

		}
		this.currentView = obj;

		//this.hideNotificationsMenu();
	},

	hideNotificationsMenu: function() {
		$('.actionBar a').removeClass("active");
		$("#button_notifications").removeClass("highlight");

		$('.actionCont').hide();

		var obj = $('#button_notifications');
		var x = $(obj).data("bgpos");

		$(obj).css("background-position", x + "px -0px");

		return;
	},
	posNotificationMenu: function() {
		$('.actionCont').css("left", $('#button_notifications').offset().left);
	},
	showNotifications: function() {



		var obj = $('#button_notifications');
		var x = $(obj).data("bgpos");
		var that = this;


		if ($(obj).hasClass("active")) {
			that.hideNotificationsMenu();
			return;
		}


		$.get("templates/notifications.html", function(d) {
			apl_request({
				"requests": [{
						"id": "notifications_get"
					}

				]
			}, function(d2) {


				var templateData = d2;

				_.templateSettings.variable = "rc";
				var template = _.template(d, templateData);



				$("#button_notifications").text("0");

				obj.css("background-position", x + "px -62px");

				//$('.actionCont').append("");
				$('#notificationMain').html(template);

				that.posNotificationMenu(); {

					obj.addClass("active");
					$('.actionCont').show().css("top", $("#button_notifications").offset().top+31);;
				}
			});

		});



	},


	initialize: function() {

	},


	openPage: function(view, subview) {



	},

	showSettings: function()
	{
		$.get("templates/box_settings.html", function(d) {
			_.templateSettings.variable = "rc";
			var template = _.template(d, {});

			ui_showBox(template, function() {

			});
		});

	},

	render: function() {

		var str = "<div class='testversion'> This version of Charme is a TESTVERSION. It is NOT stable and NOT secure.\nDo not post any private data.\nYour data may get exposed otherwise!!!<br><a onclick='$(\".testversion\").remove()' class='testbutton'>Okay I understood</a></div>";
		str += '<div id="cnt_loggedIn"><div class="actionCont"><div class="whitespace"></div><div id="notificationMain"></div></div><div class="containerAll"><div id="whitebg"></div><div class="sidebar sbAlpha"><div class="actionBar"> \
		<a data-bgpos="0" id="button_notifications" ref="notifications"  class="actionButton">0</a><a data-bgpos="-30"  id="button_settings" style="background-position:-30px 0; " class="actionButton"></a></div> \
		<div style="height:64px; background-color:#000;"><a  href="#user/' + (charmeUser.userIdURL) + '"><img id="profileImage" src="http://' + charmeUser.server + '/charme/fs.php?s=150&u=' + (charmeUser.userIdURL) + '"></a> \
		</div> \
		 <div style="padding:1px;background-color:#cdcdcd; padding-top:0; margin-bottom: 0px;"> \
		     <input id="searchField" style="width:148px;padding:9px 8px; padding-bottom:9px; border:0px; margin:0;" placeholder="Find..." type="text"></div> \
		<ul></ul> \
		<a href="#about">About</a> - <a href="#help">Help</a></div> \
		    <div class="sbBetaCont"> \
		        <div class="sidebar sbBeta"> \
		           <div class="actionBar"> \
		        </div>\
		     <ul class="subCont"> \
		     </ul> \
		        </div> \
		        <div class="responsive header"> \
		        	<div class="row1"><a class="active"  data-topic="stream" href="#stream"><i class="fa fa-list"></i></a><a   data-topic="profile"  href="#user/' + (charmeUser.userIdURL) + '"><i class="fa fa-user"></i></a><a href="#talks" data-topic="talks"><i class="fa fa-envelope-o"></i></a><a href="#lists" data-topic="lists" ><i class="fa fa-users"></i></a><a data-topic="find" href="#find"><i class="fa fa-search"></i></a><a data-topic="notifications" href="#notifications" style="position:relative;  font-size:14px; line-height:25px;">0</a><a data-topic="settings" href="#settings"><i class="fa fa-cogs"></i></a></div> \
		       		<br style="clear:both"><div class="row2"><span><a id="barmenu" onclick="$(\'.sbBeta\').toggle()" style="float:right"><i class="fa fa-bars"></i></a></span><span id="responsiveTitle"></span></div><br style="clear:both"> \
		        </div> \
		        <div class="page_content"> \
		        <div class="page" style="padding:0px; " id="page"> \
		        </div> \
		        </div> \
		    </div> \
		</div></div>  \
		';


		if ($("#cnt_loggedIn").length < 1) {



			$(this.el).html(str);

			$(".sbAlpha ul").append("<li ><a id='item_stream' data-topic='stream' href='#stream'>Stream</a></li>");
			$(".sbAlpha ul").append("<li><a data-topic='profile' href='#user/" + (charmeUser.userIdURL) + "'>Profile</a></li>");
			//$(".sbAlpha ul").append("<li><a data-topic='rooms' href='#rooms'>Rooms</a></li>");
			$(".sbAlpha ul").append("<li><a  style='float:right; width: 17px; text-align:center; border-left: 1px #efefef solid;  color:#666;' href='javascript:sendMessageForm()'>+</a><a style='width:101px'  id='item_talks' data-topic='talks' href='#talks'>Talks</a></li>");
			$(".sbAlpha ul").append("<li><a data-topic='lists' href='#lists' >Lists</a></li>");
			//$(".sbAlpha ul").append("<li><a data-topic='groups' href='#groups'>Groups</a></li>");
			$(".sbAlpha ul").append("<li><a data-topic='settings' href='#settings'>Settings</a></li>");
		}


		// Set a color scheme (See lib/colors.js for function)
		setColor("#1A3C87", "#000614");

		$("#searchField").keypress(function(e) {


			if (e.which == 13)
				location.href = '#find/' + encodeURIComponent($("#searchField").val());


		});
		// Mouse Down effect for icons above main navigation
		$(".actionBar a").mousedown(function() {

			var x = $(this).data("bgpos");

			if (!$(this).hasClass("active"))
				$(this).css("background-position", x + "px -31px");
		}).mouseout(function() {
			var x = $(this).data("bgpos");
			if (!$(this).hasClass("active"))
				$(this).css("background-position", x + "px -0px");

		});

		var that = this;
		// Hide notification menu when clicking anywhere
		$(document).click(function(e) {
			if ($(e.target).closest('.actionCont').length === 0 &&
				$(e.target).closest('#button_notifications').length === 0

			) {
				that.hideNotificationsMenu();

			}
		});

		$(window).resize(function() {
			that.posNotificationMenu();


		});

		$("#button_settings").click(this.showSettings);

		apl_update_apply(this.tempCountData);

	}


});



/***
	Name:
	page_login

	Info:
	Container if user is NOT logged in.

*/
page_login = Backbone.View.extend({


	initialize: function() {
	},


	render: function() {

		$("#layout").html('<div style="max-width:600px; margin:0px auto;"><div id="page"></div></div>');


	}

});

/*
	Layout definitions of pages like Profile, Stream etc.
*/

// Derive following pages of this template:



// Extend close function to remove events!
Backbone.View.prototype.close = function() {


	/* if (this.onClose) {
        this.onClose();
    }
    this.remove();
    this.undelegateEvents();*/
}

/***
	Name:
	sendMessageForm

	Info:
	Generate a new message box with the specified receivers

	Params:
	receivers:JSON Object:Receiver list in format [{id: 'alice@myserver.com', name: 'Alice'},{id: "bob@myserver.com", name: "Bob"}]
	Location:
	apl/page_modules.js

	Code:JS:
	// Send a message to Alice
	sendMessage(Form(
		[
			{id: 'alice@myserver.com', name: 'Alice'}
		]);)
*/

function sendMessageForm(receivers) {

	$.get("templates/box_messageForm.html", function(d) {

		var templateData = {
			receivers: receivers
		};

		_.templateSettings.variable = "rc";
		var template = _.template(d, templateData);


		ui_showBox(template, function() {


			$("#token-input-inp_receivers").focus();
			
		});


		//alert("http://"+charmeUser.server+"/charme/auto.php");

		$('#inp_receivers').tokenInput("http://" + charmeUser.getServer() + "/charme/auto.php", {
			prePopulate: receivers,
			crossDomain: true
		});
	});
}


/***
	Name:
	view_page

	Info:
	Default page class. Build new pages on this model. `postRender` is called after rendering is complete.


	Properties:
	options.template:string:Which template from templates folder do we us?
	options.needLogin:bool:Only for registred users? (Default: true)
	options.useSidebar:bool:Sidebar enabled? (Default: false)
	options.navMatch:string:Which element of main navigation should be highlighted? 
	options.forceNewRender: true if view should be rendered new at route change

	Location:
	apl/crypto.js

	Code:JS:

	// Generate a page extending view_page
	var view_test= view_page.extend({

	events: 
	{
		'click #mybutton': 'myevent'
	},
	function myevent()
	{
		alert("!!!");
	},
	postRender: function()
	{
		$('#login_user').focus();
	}

	});
	
	// Open page
	var pa = new view_test({template: "welcome",  needLogin: false});

*/

view_page = Backbone.View.extend({



	subPage: null,
	el: '#page',


	options: {
		template: 'none',
		useSidebar: false,
		navMatch: '',
		needLogin: true
	},

	events: {

		//	"click  a" : "testClick"
	},



	initialize: function() {



	},


	// Warning: do not add initlize function, because passing arguments does not work then!

	getData: function() {

	},
	setSub: function(s) {

		// Close old subView first
		if (this.sub != null) {
			//Problem: #page is removed

			this.sub.undelegateEvents();

			// Hide notification menu when opening new page
			if (container_main)
				container_main.hideNotificationsMenu();
		}
		this.sub = s;

	},


	finishRender: function(d, d2) {

		if (container_main.currentViewId != "find")
			$("#searchField").val(""); // Reset search box

		//alert("find"+this.options.useSidebar);

		if (this.options.navMatch != '') {

			$(".sbAlpha ul li").removeClass("active");
			$(".sbAlpha ul li a[data-topic='" + this.options.navMatch + "']").parent().addClass("active");
		}

		if (this.options.useSidebar) {


			$('.page_content').css("width", "700px");
			$('.page_content').css("margin-left", "150px");
			$('.sbBeta').show();


			$('.subCont').html($('div[title=submenu_items]').html());

			// Do this after sidebar items were initialised:
			$(".subCont").append('<div id="colorbg"></div>');
			// call init sidebar function

			// init action bar (TODO!)
			/*
			$('.sbBeta .actionBar').html(""); // Remove existing buttons
			$('.subCont').html($('div[title=submenu_items]').html());
			$('.sbBeta .actionBar').html($('div[title=action_bar]').html());*/


		} else {
			$('.page_content').css("width", "850px");
			$('.page_content').css("margin-left", "0");
			$('.sbBeta').hide();
		}


		if (charmeUser == undefined)
			$(".loggedOutOnly").show();

		if (this.postRender != null) {
			this.postRender();
		}



	},

	render: function() {

		if (this.options.expViewId == undefined)
			this.options.expViewId = this.options.template;

		console.log("exp:" + this.options.expViewId);
		console.log("cur:" + this.options.expViewId);

		if (this.options.noLogin != true && !isLoggedIn()) {

			logout();
			return;

		}
		//alert("render");

		// Page has changed not changed. Only subpage. -> Just render subpage
		if (container_main.currentViewId == this.options.expViewId && !this.options.forceNewRender) {

			// Just update SubView, we are allowed to render it here as parent view is already rendered
			this.sub.render();

		} else {

			if (this.options.optionbar != null) {

				$(".sbBeta .actionBar").html(this.options.optionbar);
			} else
				$(".sbBeta .actionBar").html("");

			container_main.currentViewId = this.options.expViewId;
			var that = this;

			$.get("templates/" + this.options.template + ".html", function(d) {

				var templateData = that.getData();




				_.templateSettings.variable = "rc";
				var template = _.template(d, templateData);

				$(that.$el).html(template);


				that.finishRender(d);


				//else
				{

					that.delegateEvents();
				}
				//console.log("delegateEvents() in view");

				// Render SubView if exists
				if (that.sub != undefined)
					that.sub.render();


			});
		}

	},

});





view_subpage = Backbone.View.extend({
	el: '#page',
	options: {},

	initialize: function() {

	},

	render: function() {
		// Done in parent page!

		var that = this;

		// Cancel message update timer
		$.doTimeout( 'messageupdate', false );

		$.get("templates/" + this.options.template + ".html", function(d) {

			var templateData = {};

			if (that.getData != null) {

				templateData = that.getData();

				_.templateSettings.variable = "rc";

			}
			//console.log(templateData);


							console.log(templateData);
console.log(templateData);
console.log(templateData);


			var template = _.template(d, templateData);


			
			console.log(that.$el);

			// Problem: Selector may be okay, but element may have changed -> choose $el.selector in stead of el??
			$(that.$el.selector).html(template); //that.$el.selector



			// important:!!


			// mouse down effect for 32x32 imge buttons
			$(".actionIcon").mousedown(function() {
				var x = $(this).data("bgpos");

				if (!$(this).hasClass("active"))
					$(this).css("background-position", x + "px -48px");
			}).mouseup(function() {

				if (!$(this).hasClass("active"))
					$(this).css("background-position", $(this).data("bgpos") + "px -0px");

			}).mouseleave(function() {

				if (!$(this).hasClass("active"))
					$(this).css("background-position", $(this).data("bgpos") + "px -0px");

			});


			that.delegateEvents();

			if (that.postRender != null) {
				that.postRender();
			}


		});
		// Set sb beta
		//alert(that.options.navMatch);

		$(".sbBeta ul li, .profileTabs ul li, .navMatch ul li").removeClass("active");
		$(that.options.navMatch).addClass("active");

		// call prototype.finishredner();


		// if this.getData != null render...
	}
});


function setSCHeight() {

	$(".msgScrollContainer").css("height", ($(window).height() - 82) + "px");
	$('.nano').nanoScroller();

}

$(window).resize(function() {
	setSCHeight();
});




var view_find = view_page.extend({
	options: {
		template: 'find'
	}

	,
	postRender: function() {
		//
		$("#fld_q").text(this.options.q);;
	},
	getData: function()

	{
		console.log("this.options.data");
		console.log(this.options.data);
		return this.options.data;

	}
});


/*
	The registration view

*/


var view_register = view_page.extend({
	options: {
		template: 'signup'
	},
	events: {

		"click  #but_makecert": "makecert",
		"click  #but_signupok": "signup"
	},
	initialize: function() {;
	},


	postRender: function() {

		console.log("set talks height");
		$("#box_errors div").hide();
		$("#box_errors").hide();
	},
	signup: function() {

		var s = $("#form_signup").serializeObject();

		var serverurl = $('#inp_server').val();

		apl_request({
			"requests": [{
					"id": "user_register",
					"data": s
				}

			]
		}, function(d) {
			var data = d.user_register;


			if (data.error != null) {
				$("#box_errors").hide();
				$("#box_errors").show();
				$("#error" + data.error).show();
				// TODO: Scroll to bottom to make show errors are shown
				$(window).scrollTop(999999);
			} else if (data.success == 1) {



				location.replace('#signup_success');

			}

		}, "", serverurl);

		/*
		var u = 'http://'+$('#inp_server').val()+'/charme/req.php?action=newUser.register&'+s+'&callback=?';
		console.log("Loading JSON: "+u);
		$.ajax({
		  dataType: "jsonp",
		  url: u,
		  data: "",
		  success: function(data) {
		  
		  }

		});*/



	},
	makecert: function() {



		var worker = new Worker("lib/crypto/thread_makeSignature.js");
		$("#but_makecert").text("Please Wait...");


		//alert(rsa.n.toString(16));


		worker.onmessage = function(e) {

			console.log(e.data);


			// 

			//alert(e.data.n.toString());

			var fastkey1 = randomAesKey(32);
			var fastkey2 = randomAesKey(32);

			var randomsalt1 = randomSalt(32);
			var randomsalt2 = randomSalt(32);

			//n, e, d, p, q, dmp1, dmq1, coeff
			var certificate = [{
				revision: 1,
				fastkey1: fastkey1,
				fastkey2: fastkey2,

				randomsalt1: randomsalt1,
				randomsalt2: randomsalt2,


				rsa: {

					n: e.data.n.toString(),
					e: e.data.e.toString(),
					d: e.data.d.toString(),
					p: e.data.p.toString(),
					q: e.data.q.toString(),
					dmp1: e.data.dmp1.toString(),
					dmq1: e.data.dmq1.toString(),
					coeff: e.data.coeff.toString(),


				}
			}];
			console.log("keyring is");
			console.log(JSON.stringify(certificate));


			$('#template_certok').show();
			$('#template_certhint').hide();


			var passphrase = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < 20; i++)
				passphrase += possible.charAt(Math.floor(Math.random() * possible.length));



			console.log(JSON.stringify(certificate));


		
			// Encrypt certificate with passpharse
			var tt = aes_encrypt(passphrase, JSON.stringify(certificate));


			var pub = {
								revision: 1,
						

								publickey: {
									n: e.data.n,
									e: e.data.e
								}
							};


			$("#pubkey").val(JSON.stringify(pub));



			$("#template_certkey").text(passphrase);
			$("#rsa").val(tt);



		};


		worker.postMessage("");



		/*  */


	}

});




// Post field, user can post from here
control_postField = Backbone.View.extend({
	events: {
		'click #mypostbutton': 'doPost'

	},
	doPost: function() {

		var txt = $("#textfield").val();
		var collectionId = (this.options.collectionId == "");
		var that = this;

		if (this.options.collectionId == "") // If collection Seletor enabled, get value from collection selector
			collectionId = $("#postOptions select").val();
		else
			collectionId = this.options.collectionId;

		var repostdata;

		if ($('#repostContainer').is(':visible'))
			repostdata = $('#repostContainer').data("postdata");


		var x = $('#inp_postImg').data("filecontent");
		if (x != undefined)
			x = x.result;

		//if (x == undefined || x == "")

		apl_request({
			"requests": [{
				"id": "collection_post",
				"content": txt,
				"collectionId": collectionId,
				"repost": repostdata,
				"imgdata": x
			}, {
				"id": "profile_get_name",
				userId: charmeUser.userId
			}]
		}, function(d) {



			var name = d.profile_get_name.info.firstname + " " + d.profile_get_name.info.lastname;

			var elid, layout;
			if (that.options.collectionId != "") {

				elid = ".collectionPostbox";
			} else {
				layout = "stream";
				elid = "#streamContainer";
			}

			// Remove image
			$("#but_remImg").trigger('click');
			// TODO: Add username

			var p2 = new control_postItem({
				repost: repostdata,
				postId: d.collection_post.id,
				username: name,
				layout: layout,
				userId: charmeUser.userId,
				content: txt,
				time: new Date().getTime(),
				el: $(elid),
				prepend: true,
				hasImage: d.collection_post.hasImage
			});
			p2.render();



		});

	},

	render: function() {


		var that = this;

		var addbox = function(that, items) {

				that.$el.append("<textarea class='box' id='textfield' style=' width:100%;'></textarea><div  style='margin-top:8px; display:none;' id='imgPreview'></div><div style='margin-top:8px;'><a type='button' id='mypostbutton' class='button but_postCol' value='Post'>Post</a><span id='postOptions'></span><span id='postOptions2'></span></div>");

					$('#postOptions2').append(" - <input id='inp_postImg' type='file' style='display:none'><a id='but_addImg'>Add Image</a><a style='display:none' id='but_remImg'>Remove Image</a>");

					$('#inp_postImg').on("change", function(e) {
						that.fileChanged(e);
					});

					$('#but_addImg').click(function() {

						$("#inp_postImg").trigger('click');
					});

					$('#but_remImg').click(function() {

						$('#inp_postImg').data("filecontent", null);
						$("#but_remImg").hide();
						$("#but_addImg").show();

					});

					if (items != "")
							$('#postOptions').append(" in <select style='width:100px;' id='collectionSelector'>" + items + "</select>");



		};


		if (this.options.collectionId == "") {


			// Get collections json....
			apl_request({
				"requests": [{
					"id": "collection_getAll",
					"userId": charmeUser.userId
				}, ]
			}, function(d) {

				var items = "";

				jQuery.each(d.collection_getAll, function() {




					items += "<option value='" + this._id.$id + "'>" + xssText(this.name) + "</option>";


				});


				if (d.collection_getAll == 0)
					that.$el.append("Create <a href='#user/"+charmeUser.userIdURL+"/collections'>a collection</a> to start posting.");
				else {
					addbox(that, items);
				}

		
				



			});


		}else
		addbox(this, "");

		



	},
	fileChanged: function(h) {

		var files = h.target.files; // FileList object
		var reader = new FileReader();
		reader.file = files[0];
		reader.onload = function(e) {
			$('#inp_postImg').data("filecontent", this);
		}
		reader.readAsDataURL(reader.file);
		$("#but_remImg").show();
		$("#but_addImg").hide();
		$("#imgPreview").html("preview");


	},
	render2: function() {

	}

});

control_commentItem = Backbone.View.extend({
	render: function() {
		uniIdCounter++;


		var delitem = "<a data-commentid='" + this.options.commentId + "' id='delete_" + uniIdCounter + "' class='delete'></a>";



		var str = "<div class='comment'>" + delitem + "<div class='head'><a href='#/user/" + encodeURIComponent(this.options.userId) + "'>" + this.options.username + "</a></div>" + xssText(this.options.content) + "</div>";
		if (this.options.prepend)
			this.$el.prepend(str);
		else
			this.$el.append(str);


		// Imporant: Attach event handler AFTER ITEM HAS BEEN ADDED!
		$('#delete_' + uniIdCounter).click(function() {

			// Send this to MY server.
			// server will find out host  server and notify host server
			alert($(this).data("commentid"));

		});


	}
});

var uniIdCounter = 1; // Belongs to control_postItem below:
var repostTemp = null;

control_postItem = Backbone.View.extend({
	options: {
		prepend: false,
		counter: 0,
		commentCount: 0
	},


	setLikeText: function(itemCounter) {
		$("#counter" + itemCounter).text(this.options.counter);
		if (this.options.like) {
			$("#doLove" + itemCounter).text("Unlove");
		} else {
			$("#doLove" + itemCounter).text("Love");
		}
	},
	addComments: function(items, parentId, prepend) {
		var maxComments = 15;
		var iComments = 0; // !!! Please remove, we will get sued for this name


		jQuery.each(items, function() {

			iComments++;
			if (iComments > maxComments)
				return;



			var item = new control_commentItem({
				content: this.content,
				commentId: this._id.$id,
				"username": this.sendername,
				userId: this.userId,
				prepend: prepend,
				el: $('#postComments' + parentId)
			});

			item.render();
		});

	},
	

	render: function() {



		// Needed for generating unique element identifiers.,
		uniIdCounter++;


		//Use uniId inside events like .click() etc., because uniIdCounter is global!!
		var uniId = uniIdCounter;
	



				var that = this;
		var repoststr = "";
		var liksstr = "<div class='likes'><a class='counter' id='counter" + uniIdCounter + "'>0</a></div>";

		if (this.options.repost != null)
			repoststr = " reposts <a href='#user/" + encodeURIComponent(this.options.repost.userId) + "/post/" + this.options.repost.postId + "'>" + this.options.repost.username + "'s post</a> <div class='repost'>" + $.charmeMl(xssText(this.options.repost.content)) + "</div>";



		var str;
		var imgcont = "";
		var delitem = "<a id='del_post_"+uniIdCounter+"' class='delete'></a>";

	

		if (this.options.hasImage) {
			//
			imgcont = "<div style='margin-bottom:8px'><a target='_blank' href='http://" + this.options.userId.split("@")[1] + "/charme/fs.php?type=post&size=800&post=" + this.options.postId + "'><img src='http://" + this.options.userId.split("@")[1] + "/charme/fs.php?type=post&size=250&post=" + this.options.postId + "'></a></div>";

		}
		if (this.options.layout == "stream") {

			var postUser = new apl_user(this.options.userId);

			// 
			str = "<div class='collectionPost' id='post_"+that.options.postId+"'>" +
				"<a href='#user/" + postUser.userIdURL + "'><img class='profilePic' src='" + postUser.getImageURL(64) + "'></a>" + "<div class='subDiv'>" + liksstr + delitem + "<a href='#user/" + postUser.userIdURL + "'>" + xssText(this.options.username) + "</a>" + repoststr + "<div class='cont'>" + imgcont + $.charmeMl(xssText(this.options.content)) + "</div><div><a id='doLove" + uniId + "'>Love</a> - <a id='doRepost" + uniId + "'>Repost</a> -  <span class='time'>" + formatDate(this.options.time) + "</span></div>";
		} else
			str = "<div class='collectionPost' id='post_"+that.options.postId+"'>" + repoststr + "<div class='cont' style='padding-top:0'>" + imgcont + liksstr + delitem + "" + $.charmeMl(xssText(this.options.content)) + "</div><div><a id='doLove" + uniId + "'>Love</a> - <a id='doRepost" + uniId + "'>Repost</a> - <span class='time'>" + formatDate(this.options.time) + "</span>";



		str += "<div class='commentBox' id='commentBox" + uniId + "'><div class='postcomments' id='postComments" + uniId + "'></div><input id='inputComment" + uniId + "' class='box' type='text' style='width:250px; margin-top:1px;' placeholder='Write a comment'><br></div>"; //<a class='button' id='submitComment"+uniIdCounter+"'>Write Comment</a>
		str += "</div></div>";


		if (this.options.prepend)
			this.$el.prepend(str);
		else
			this.$el.append(str);



		// REgister event handler AFTER HTML has been added
		$("#del_post_"+uniIdCounter).click(function(){

			// TODO: ARE YOU SURE?

			// Send request for post deletion to server
			apl_request({
				"requests": [{
					"id": "post_delete",
					"postId": that.options.postId
				}, ]
			}, function(d) {

				// Remove post from GUI
				$("#post_"+that.options.postId).fadeOut(0);

			});
			
		});


		// append some comments
		var itemStartTime;
		if (this.options.comments != undefined && this.options.comments.length > 0) {

			that.addComments(this.options.comments, uniId, false);
			itemStartTime = this.options.comments[0].itemTime.sec;

		}



		if (this.options.commentCount > 3)
			$('#commentBox' + uniId).prepend("<a class='morecomments'>More</a>"); //data-start=TotalComments-6



		$('#commentBox' + uniId + " .morecomments").click(function() {



			if (that.options.start == undefined) {
				that.options.start = that.options.commentCount - 6;
				if (that.options.start < 0)
					that.options.start = 0;
			}


			var limit = 3;

			if (that.options.start == 0) {

				limit = that.options.commentCount % limit;

			}


			apl_request({
				"requests": [{
					"id": "comments_get",
					"postowner": that.options.userId,
					"itemStartTime": itemStartTime,
					"start": that.options.start,
					"limit": limit,
					"postId": that.options.postId
				}, ]
			}, function(d) {

				if (that.options.start == 0)
					$('#commentBox' + uniId + " .morecomments").remove();


				if (that.options.start == -1) // Save given start id
					that.options.start = d.comments_get.start;
				else
					that.options.start -= 3; // Succes -> Load further comments from here



				that.addComments(d.comments_get.comments, uniId, true);



				if (that.options.start < 0) {
					that.options.start = 0;

				}

			}, "", that.options.userId.split("@")[1]);

		});


	


		$("#inputComment" + uniId).keypress(function(e) {


			if (e.which == 13) {
				// Write comment
				// Get Text
		

				var content = $(this).val();
				var that2 = this;
				apl_request({
					"requests": [
						// Get posts of collection
						{
							"id": "post_comment",
							"userId": that.options.userId,
							"content": content,
							"postId": that.options.postId
						},
						// Get name of collection

					]
				}, function(d) {

				
					var item2 = new control_commentItem({
						"content": content,
						"username": d.post_comment.username,
						userId: 0,
						el: $('#postComments' + uniId),
						commentId: d.post_comment.commentId
					});
					item2.render();
					$(that2).val("");

				});

			}
		});



		$("#doRepost" + uniId).click(function() {

			repostTemp = {
				userId: that.options.userId,
				postId: that.options.postId,
				content: that.options.content,
				username: that.options.username
			};
			app_router.navigate("stream", {
				trigger: true
			});


			appendRepost();


		});


		$("#counter" + uniId).click(function() {



			// ! Request to profile owners server
			apl_request({
					"requests": [
						// Get posts of collection
						{
							"id": "post_getLikes",
							postId: that.options.postId
						},
						// Get name of collection

					]
				}, function(d2) {


					$.get("templates/box_likes.html", function(d) {
						_.templateSettings.variable = "rc";
						var template = _.template(d, d2);

						ui_showBox(template, function() {

						});

					});

				}

				, "", that.options.userId.split("@")[1]);


		});

		this.setLikeText(uniIdCounter);

		$("#doLove" + uniId).data("uniid", uniId);

		$("#doLove" + uniId).click(function() {

			var that2 = this;

			// Send like request to post owner:
			apl_request({
				"requests": [
					// Get posts of collection
					{
						"id": "post_like",
						"userId": that.options.userId,
						status: !! !that.options.like,
						postId: that.options.postId
					},
					// Get name of collection

				]
			}, function(d) {



				if (that.options.like) {
					that.options.counter--;
					that.options.like = false;
				} else {
					that.options.counter++;
					that.options.like = true;
				}

				that.setLikeText($(that2).data("uniid"));

			});

		});

	}

});


control_collectionItem = Backbone.View.extend({

	render: function() {

		this.$el.append("<a class='collection' href='#user/" + encodeURIComponent(container_main.currentView.options.userId) + "/collections/" + this.options.data._id.$id + "'>" + this.options.data.name + "</a>");
	}

});


/*
	GUI Helper for reposts, can be called from #stream or #profile
	Reposts the post, specified in reposTemp.
*/

function appendRepost() {
	/*
<div id='repostContainer' style='background-color: #efefef; display:none;'>
<a id='cancelRepost'>Cancel Repost</a>
<div id='repostUsername' style='padding-bottom:8px'></div>
<div id='repostContent'></div>
	*/
	if (repostTemp != null && $("#repostContainer").length > 0) {

		// repostTemp.username
		$('#repostContainer').show();

		// This data will be sent to server:
		$('#repostContainer').data("postdata", repostTemp);
		//  Also important: repostTemp.userId, repostTemp.postId
		$('#repostHeader span').text("You repost " + repostTemp.username + "'s post:");
		$('#repostContent').html($.charmeMl(xssText(repostTemp.content)));
		$('#textfield').focus();
		repostTemp = null;
	}
}



var view_stream_display = view_subpage.extend({
	events: {
		'click #cancelRepost': 'cancelRepost'

	},
	cancelRepost: function() {
		$('#repostContainer').hide();
	},

	postRender: function() {

		if (this.options.streamId == ""){
		var t = new control_postField({
			el: $("#postFieldContainer"),
			collectionId: ""
		});
		t.render();
	}
	else
		$("#postFieldContainer").hide();



		apl_request({
			"requests": [{
				"id": "stream_get",
				list: this.options.streamId
			}]
		}, function(d2) {

			// generate post controls...
			jQuery.each(d2.stream_get, function() {
				console.log("this.comments");
				console.log(this);


				var p2 = new control_postItem({
					commentCount: this.commentCount,
					comments: this.comments,
					like: this.like,
					counter: this.likecount,
					repost: this.post.repost,
					postId: this.postId.$id,
					username: this.username,
					userId: this.post.owner,
					layout: "stream",
					content: this.post.content,
					time: this.post.time.sec * 1000,
					el: $("#streamContainer"),
					prepend: false,
					hasImage: this.post.hasImage
				});
				p2.render();


			});

			$('#textfield').autosize();

		});


		// this.options.streamId is list, 0 is no list.

		// JSON Nrequest to server....

		appendRepost();
	}

});

var view_welcome = view_page.extend({

	events: {
		'keypress #login_password': 'keypass',
		'keypress #login_user': 'keyuser'
	},
	keyuser: function(e) {
		code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13)
			$('#login_password').focus().select();
	},
	keypass: function(e) {


		code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13)
			login();
	},

	postRender: function() {
		$('#login_user').focus();

	}

});


var view_stream = view_page.extend({

	userId: '',
	options: {},
	getData: function() {
		var templateData = {
			globaldata: [],
			test: "test"
		};
		//templateData["streamitems"] = apl_postloader_getAll();



		templateData["listitems"] = apl_postloader_getLists();


		return templateData;

	},

	events: {

		"click  .shareIt": "shareClick"
	},
	shareClick: function(ev) {
		// Load homepage and append to [sharecontainer]
		console.log("share");
	},
	postRender: function() {
		$("#item_stream .count").remove();



	}



});
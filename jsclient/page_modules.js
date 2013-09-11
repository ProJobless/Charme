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


			$("#inp_newmsg").focus();
		});


		//alert("http://"+charmeUser.server+"/charme/auto.php");

		$('#inp_receivers').tokenInput("http://" + charmeUser.getServer() + "/charme/auto.php", {
			prePopulate: receivers,
			crossDomain: true
		});
	});
}

function addPeopleOk() {
	// DO NOT USE AES HERE, as no message has to be encrypted.

}

function sendAnswer() {

	var aeskey = ($('#msg_aeskey').data("val"));
	var conversationId = ($('#msg_conversationId').data("val"));
	var message = smilieParse($('#inp_newmsginstant').html());
	var encMessage = aes_encrypt(aeskey, message);
	var messagePreview = aes_encrypt(aeskey, message.substring(0, 127));

	if (message == "") return;

	apl_request({
		"requests": [{
				"id": "message_distribute_answer",
				"conversationId": conversationId,
				"encMessage": encMessage,
				"messagePreview": messagePreview
			}

		]
	}, function(d2) {



		$(".talkmessages").css("margin-bottom", ($(".instantanswer").height() + 48) + "px");

		$.get("templates/control_messageview.html", function(d) {
			// RSA Decode, for each:
			// d2.messages_get_sub



			_.templateSettings.variable = "rc";
			var tmpl = _.template(d, {
				messages: [{
					msg: message,
					sender: charmeUser.userId,
					time: {
						sec: new Date().getTime() / 1000
					},
					sendername: d2.message_distribute_answer.sendername
				}]
			});

			$(".talkmessages").append(tmpl);

			$('#moremsg2').remove();

			$("html, body").animate({
				scrollTop: $(document).height()
			}, "slow");

			$('#inp_newmsginstant').html("").focus();

		});

	});

}

/***
	Name:
	sendMessage

	Info:
	Submit the form generated with `sendMessageForm()`. Warning: Should only be called after a message form
	has been generated with `sendMessageForm()`
	exists.

	The function itself uses a hybrid cryptosystem to encode the message.
	First a random AES key is generated with `randomAESKey()` and 
	the  message itself is encoded with this key.

	Then the AES Key is encoded with the public RSA key of each receiver.
	Then the encoded AES keys are send to the users server which distributes
	the messages.

	Location:
	page_modules.js

*/

function sendMessage() {
	var all;
	var message;



	all = $('#inp_receivers').val().split(",");
	all.push();


	var count = 0;
	message = $('#inp_newmsg').val();

	// make random key for hybrid encryption
	// probably more secure, but how to use?: var randKey  = sjcl.random.randomWords(4, 0);

	var receivers = new Array();



	var aeskey = randomAesKey(32);

	// Encrypt RSA Key for sender
	var aesEnc = "";
	var rsa = new RSAKey();

	// Message to me
	rsa.setPublic(getKeyByRevision(0).rsa.n, getKeyByRevision(0).rsa.e);
	aesEnc = rsa.encrypt(aeskey);



	receivers.push({
		charmeId: charmeUser.userId,
		aesEnc: aesEnc,
		revision: getKeyByRevision(0).revision
	});


	jQuery.each(all, function() {
		var str = this;

		// Get public key for each receiver, Warning: It's asynchronous!!!!!!
		apl_request({
			"requests": [{
					"id": "profile_pubKey",
					"profileId": this
				}

			]
		}, function(d1) {

			var pk = $.parseJSON(d1.profile_pubKey);
			count++;
			console.log(pk);
			// Encrypt random key  with public key

			var aesEnc = "";
			var rsa = new RSAKey();


			rsa.setPublic(pk.publickey.n, pk.publickey.e);
			// RSA encrypt aes key with pubKey:
			aesEnc = rsa.encrypt(aeskey);


			// Add to receivers
			receivers.push({
				charmeId: str,
				aesEnc: aesEnc,
				revision: pk.revision
			});

			console.log("RECEIVERS");
			console.log(receivers);

			// Send if last public key is here.
			if (count == all.length) // Encrypted all random keys -> send to my server for distribution
			{
				var encMessage = aes_encrypt(aeskey, message);
				var messagePreview = aes_encrypt(aeskey, message.substring(0, 127));

				apl_request({
					"requests": [{
							"id": "message_distribute",
							"receivers": receivers,
							"encMessage": encMessage,
							"messagePreview": messagePreview,
							"sender": charmeUser.userId
						
						}

					]
				}, function(d2) {


					ui_closeBox();
				});

			}
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

//view_subpage

view_test = Backbone.View.extend({

	options: {
		useSidebar: true,
		la2: 15
	},
	initialize: function() {
		//  this.options = _.extend(this.defaults, this.options);
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



		$.get("templates/" + this.options.template + ".html", function(d) {

			var templateData = {};

			if (that.getData != null) {

				templateData = that.getData();

				_.templateSettings.variable = "rc";

			}
			//console.log(templateData);


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



/*

	The List Page views

*/

var view_lists = view_page.extend({


	options: {
		template: 'profile',
		optionbar: '<a style="background-position: -60px 0px;" data-bgpos="-60" id="addListButton" class="actionButton"></a>'
	},
	viewId: 'listView',


	getData: function() {
		var templateData = {
			globaldata: []
		};
		templateData["listitems"] = apl_postloader_getLists();
		console.log(templateData);
		return templateData;
	},
	postRender: function() {

		// Problem: if opening another list form sidebar event gets unregistred.
		$('#addListButton').click(function() {
			var n = prompt("Enter a Name", "New List");

			// TODO: apl request to get id...

			apl_request({
				"requests": [{
						"id": "lists_add",
						"name": n
					}

				]
			}, function(d1) {

				apl_postloader_lists.items.push({
					'_id': {
						'$id': d1.lists_add.id.$id
					},
					name: n
				});

				// Add item to Sidebar
				$(".sbBeta .subCont").append('<li id="nav_' + d1.lists_add.id.$id + '"><a href="#lists/' + d1.lists_add.id.$id + '">' + n + '</a></li>');

				//

			});


		});
	}

});


var view_lists_subpage = view_subpage.extend({
	options: {
		template: 'lists_'
	},
	events: {

		"click  #but_renameList": "renameList",
		"click  #but_deleteList": "deleteList",

	},
	postRender: function() {
		// Hide Edit/delete button when showing all lists
		if (this.options.listId == "") {
			$('#listOptions').hide();

		}
	},
	renameList: function() {
		var that = this;
		$.get("templates/box_editlist.html", function(d) {
			var template = _.template(d, {});

			ui_showBox(template, function() {
				var oldName = $("#nav_" + that.options.listId).text();
				$("#inp_listNameEdit").val(oldName).focus().select();

				$('#but_editListOk').click(function() {
					// Notify user server about the changed name
					apl_request({
						"requests": [{
								"id": "lists_rename",
								"listId": that.options.listId,
								"newName": $("#inp_listNameEdit").val()
							}

						]
					}, function() {

						// Update sidebar item with new Text
						$("#nav_" + that.options.listId + " a").text($("#inp_listNameEdit").val());

						// Update Name
						apl_postloader_editList(that.options.listId, $("#inp_listNameEdit").val());

						// Close box dialog
						ui_closeBox();
					});



				});
			});
		});
	},
	deleteList: function() {
		var that = this;
		$.get("templates/box_deletelist.html", function(d) {
			var template = _.template(d, {});

			ui_showBox(template, function() {
				$("#but_deleteList").select().focus();
				$('#but_deleteList').click(function() {
					apl_request({
						"requests": [{
								"id": "lists_delete",
								"listId": that.options.listId
							}

						]
					}, function(d) {
						ui_closeBox();
						$("#nav_" + that.options.listId).remove();
						$("#page").text("");

						// Delete from script cache:
						apl_postloader_deleteList(that.options.listId);


					});

				});
			});
		});

	},
	getData: function() {
		return this.options.data;
	},


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

			//n, e, d, p, q, dmp1, dmq1, coeff
			var certificate = [{
				revision: 1,
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


/*

	The Profile Page views

*/


var view_profilepage = view_page.extend({


	options: {
		template: 'profile'
	},
	viewId: 'profileView', // important f


	events: {
		'click #but_sendMsg': 'sendMsg'

	},
	postRender: function() {
		// ,  name: container_main.currentView.username
		var that = this

		if (typeof this.username === 'undefined') {



			apl_request({
				"requests": [{
					"id": "profile_get_name",
					"userId": container_main.currentView.options.userId
				}, ]
			}, function(d) {

				container_main.currentView.username = d.profile_get_name.info.firstname + " " + d.profile_get_name.info.lastname;
				$(".profile_name").text(container_main.currentView.username);



			});

		}


	},
	sendMsg: function() {
		sendMessageForm([{
				id: this.options.userId,
				name: container_main.currentView.username
			}

		]); //
	},
	getData: function() {

		return {
			uid: this.options.userIdRaw,
			server: this.options.userId.split("@")[1]
		};

	}

});
control_smilies = Backbone.View.extend({
	render: function() {
		this.$el.append("<div class='smiliebox'></div>");

		// Smiliebox append...
		var width = Array(20, 9, 9, 8, 11, 10, 8, 3, 3, 6);
		for (var i = 0; i < 10; i++) {
			for (var j = 0; j < width[i]; j++) {
				var pos = "-" + (j * 32) + "px -" + (i * 32) + "px";

				this.$el.children(".smiliebox").append("<a data-y='" + i + "' data-x='" + j + "' style='background-position: " + pos + "'></a>");
			}
		}
		var that = this;


		var $textBox = that.options.area;



		replaceSelectedText = function(replacementText) {
			var e = $(replacementText);

			var sel, range;
			if (window.getSelection) {
				sel = window.getSelection();
				if (sel.rangeCount) {
					range = sel.getRangeAt(0);
					range.deleteContents();
					range.insertNode(e[0]); // document.createTextNode(replacementText)
					///range.setStartAfter (e);


				}

			} else if (document.selection && document.selection.createRange) {
				range = document.selection.createRange();
				range.insertNode(e[0]);
				// range.setStartAfter (e);


			}
		}


		restoreSelection = function(savedSelection) {

			if (!savedSelection)
				return;

			var sel = window.getSelection();
			sel.removeAllRanges();

			for (var i = 0, len = savedSelection.length; i < len; ++i) {
				savedSelection[i].focusOff
				sel.addRange(savedSelection[i]);

			}
		};



		var save_selection;


		$textBox.bind("mouseup keyup", function() {



			saveSelection = function() {
				var sel = window.getSelection(),
					ranges = [];
				if (sel.rangeCount) {
					for (var i = 0, len = sel.rangeCount; i < len; ++i) {
						ranges.push(sel.getRangeAt(i));
					}
				}

				return ranges;
			};



			save_selection = saveSelection();


		});



		$(".smiliebox a").click(function() {



			var x = $(this).data("x");
			var y = $(this).data("y");

			var pos = "-" + (x * 32) + "px -" + (y * 32) + "px";

			that.options.area.focus();

			restoreSelection(save_selection);


			replaceSelectedText("<img data-code=\"" + x + "," + y + "\" src='css/d.png' style='background-position: " + pos + "'>");



			// that.options.area.focus();



		});

		// Make click handler!, append to options.areaId

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
				$('#postOptions').append(" in <select style='width:100px;' id='collectionSelector'>" + items + "</select>");



			});


		}

		this.$el.append("<textarea class='box' id='textfield' style=' width:100%;'></textarea><div  style='margin-top:8px; display:none;' id='imgPreview'></div><div style='margin-top:8px;'><a type='button' id='mypostbutton' class='button but_postCol' value='Post'>Post</a><span id='postOptions'></span><span id='postOptions2'></span></div>");

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



		var str = "<div class='comment'>" + delitem + "<div class='head'><a href='#/user/" + encodeURIComponent(this.options.userId) + "'>" + this.options.username + "</a></div>" + this.options.content + "</div>";
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
				"<a href='#user/" + postUser.userIdURL + "'><img class='profilePic' src='" + postUser.getImageURL(64) + "'></a>" + "<div class='subDiv'>" + liksstr + delitem + "<a href='#user/" + postUser.userIdURL + "'>" + xssText(this.options.username) + "</a>" + repoststr + "<div class='cont'>" + imgcont + $.charmeMl(xssText(this.options.content)) + "</div><div><a id='doLove" + uniIdCounter + "'>Love</a> - <a id='doRepost" + uniIdCounter + "'>Repost</a> -  <span class='time'>" + formatDate(this.options.time) + "</span></div>";
		} else
			str = "<div class='collectionPost' id='post_"+that.options.postId+"'>" + repoststr + "<div class='cont' style='padding-top:0'>" + imgcont + liksstr + delitem + "" + $.charmeMl(xssText(this.options.content)) + "</div><div><a id='doLove" + uniIdCounter + "'>Love</a> - <a id='doRepost" + uniIdCounter + "'>Repost</a> - <span class='time'>" + formatDate(this.options.time) + "</span>";



		str += "<div class='commentBox' id='commentBox" + uniIdCounter + "'><div class='postcomments' id='postComments" + uniIdCounter + "'></div><input id='inputComment" + uniIdCounter + "' class='box' type='text' style='width:250px; margin-top:1px;' placeholder='Write a comment'><br></div>"; //<a class='button' id='submitComment"+uniIdCounter+"'>Write Comment</a>
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

			that.addComments(this.options.comments, uniIdCounter, false);
			itemStartTime = this.options.comments[0].itemTime.sec;

		}



		if (this.options.commentCount > 3)
			$('#commentBox' + uniIdCounter).prepend("<a class='morecomments'>More</a>"); //data-start=TotalComments-6



		$('#commentBox' + uniIdCounter + " .morecomments").click(function() {



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

			});

		});


		var zu = uniIdCounter;

		$("#inputComment" + uniIdCounter).keypress(function(e) {
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



		$("#doRepost" + uniIdCounter).click(function() {

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


		$("#counter" + uniIdCounter).click(function() {



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

		$("#doLove" + uniIdCounter).data("uniid", uniIdCounter);

		$("#doLove" + uniIdCounter).click(function() {

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

view_profilepage_collection_show = view_subpage.extend({


	options: {
		template: 'user_collections_show',
		navMatch: '#nav_profile_collections'
	},
	el: '#page3',



	postRender: function() {

		$(".profile_name").text(container_main.currentView.username);


		var that = this;
		$("#but_editCollection").click(function() {

			// Get current collection information
			apl_request({
				"requests": [{
					"id": "collection_editPrepare",
					"collectionId": that.options.collectionId
				}]
			}, function(d2) {

				console.log(d2);


				$.get("templates/box_collectionEdit.html", function(d) {
					_.templateSettings.variable = "rc";
					var template = _.template(d, {});

					ui_showBox(template, function() {

						$("#inp_box_name").focus().val(d2.collection_editPrepare.name);
						$('#inp_box_description').val(d2.collection_editPrepare.description);

						$('#but_box_save').click(function() {

							apl_request({
								"requests": [{
									"id": "collection_edit",
									"collectionId": that.options.collectionId,
									"name": $("#inp_box_name").val(),
									"description": $("#inp_box_description").val()
								}, ]
							}, function(d) {


								$("#colName").text($("#inp_box_name").val());
								ui_closeBox();
								// TODO: Add collection control...

							});


						});

					});

				});
			});
		});

		// Set header name
		$(".profile_name").text(container_main.currentView.username);


		// Add post field, if userId = charmeUser.userID
		if (container_main.currentView.options.userId == charmeUser.userId) {

			var t = new control_postField({
				el: $("#postFieldContainer"),
				collectionId: this.options.collectionId
			});
			t.render();
		}

		apl_request({
			"requests": [

				// Get posts of collection
				{
					"id": "collection_posts_get",
					"userId": container_main.currentView.options.userId,
					claimedUserId: charmeUser.userId,
					collectionId: this.options.collectionId
				},

				// Get name of collection
				{
					"id": "collection_getname",
					collectionId: this.options.collectionId
				},

				// Does the user follow the collection?
				{
					"id": "register_isfollow",
					collectionId: this.options.collectionId,
					"collectionOwner": container_main.currentView.options.userId,
					"userId": charmeUser.userId
				},

			]
		}, function(d) {

			if (d.register_isfollow.follows) {
				$('#but_followCollection').css("background-position", "-96px 0px");
				$('#but_followCollection').data("bgpos", "-96");
			}


			$("#colName").text(d.collection_getname.info.name);

			jQuery.each(d.collection_posts_get, function() {



				var p2 = new control_postItem({
					counter: this.likecount,
					comments: this.comments,
					commentCount: this.commentCount,
					like: this.likeit,
					repost: this.repost,
					postId: this._id.$id,
					content: this.content,
					username: this.username,
					userId: this.owner,
					time: this.time.sec * 1000,
					el: $(".collectionPostbox"),
					hasImage: this.hasImage
				});
				p2.render();



			});

		});


		var that = this;

		$("#but_followCollection").click(function() {

			var action;
			if ($('#but_followCollection').data("bgpos") == -96) {
				action = "unfollow";
				$('#but_followCollection').css("background-position", "-48px 0px");
				$('#but_followCollection').data("bgpos", "-48");
				// Do unsubscribe...
			} else {
				action = "follow";
				$('#but_followCollection').css("background-position", "-96px 0px");
				$('#but_followCollection').data("bgpos", "-96");
				// Do subscribe...
			}



			apl_request({
				"requests": [{
						"id": "collection_follow",
						"collectionOwner": container_main.currentView.options.userId,
						"userId": charmeUser.userId,
						"action": action,
						collectionId: that.options.collectionId
					},

				]
			}, function(d) {

			});

		});

	},

	getData: function() {

		return {
			userId: container_main.currentView.options.userId
		};
	}
});


var view_profilepage_posts = view_subpage.extend({

	postRender: function() {
		var that = this;

		$(".profile_name").text(container_main.currentView.username);

		apl_request({
			"requests": [

				// Get posts of collection
				{
					"id": "collection_posts_get",
					"userId": container_main.currentView.options.userId,
					claimedUserId: charmeUser.userId,
					postId: that.options.postId
				},
			]
		}, function(d) {

			jQuery.each(d.collection_posts_get, function() {



				var p2 = new control_postItem({
					counter: this.likecount,
					comments: this.comments,
					commentCount: this.commentCount,
					like: this.likeit,
					repost: this.repost,
					postId: this._id.$id,
					content: this.content,
					username: this.username,
					userId: this.owner,
					time: this.time.sec * 1000,
					el: $(".collectionPostbox"),
					hasImage: this.hasImage
				});
				p2.render();



			});

		});



	},
	getData: function() {

		return this.options.data;
	}
});



var view_profilepage_listitems = view_subpage.extend({

	postRender: function() {

		$(".profile_name").text(container_main.currentView.username);
	},
	getData: function() {



		return this.options.data;
	}
});

var view_profilepage_collection = view_subpage.extend({

	el: '#page3',

	postRender: function() {



		$(".profile_name").text(container_main.currentView.username);


		apl_request({
			"requests": [{
				"id": "collection_getAll",
				"userId": container_main.currentView.options.userId
			}, ]
		}, function(d) {

			jQuery.each(d.collection_getAll, function() {

				var search_view = new control_collectionItem({
					el: $("#collection_list"),
					data: this
				});
				search_view.render();

			});

			// TODO: Add collection control...

		});



		// load collections via json, and add as control to page
		$('#but_addNewCollection').click(function() {
			$.get("templates/box_collectionEdit.html", function(d) {
				_.templateSettings.variable = "rc";
				var template = _.template(d, {});

				ui_showBox(template, function() {
					$("#inp_box_name").focus();
					$('#but_box_save').click(function() {

						apl_request({
							"requests": [{
								"id": "collection_add",
								"name": $("#inp_box_name").val(),
								"description": $("#inp_box_description").val()
							}, ]
						}, function(d) {

							var search_view = new control_collectionItem({
								el: $("#collection_list"),
								data: {
									_id: {
										$id: d.collection_add.id.$id
									},
									description: $("#inp_box_description").val(),
									name: $("#inp_box_name").val()
								}
							});
							search_view.render();

							ui_closeBox();
							// TODO: Add collection control...

						});


					});

				});
			});
		});
	}

});


var view_profilepage_info = view_subpage.extend({

	el: '#page3',
	reqData: {},


	initialize: function() {


	},

	postRender: function() {

		//
		//this.reqData.lists = apl_postloader_getLists();
		// return this.reqData;

		var that = this;

		//#userinfo_container

		apl_request({
			"requests": [

				// TODO: Send this to profile owner's server, not user server!!!!
				{
					"id": "profile_get",
					"profileId": container_main.currentView.options.userId
				},

				// Send this to user server:
				{
					"id": "lists_getRegistred",
					"userId": container_main.currentView.options.userId
				}


			]
		}, function(d2) {



			$.get("templates/user__.html", function(d) {

				// Mark lists which contain the user

				var userlistsRegistred = new Array();
				var userlists = new Array();


				jQuery.each(d2.lists_getRegistred, function() {



					userlistsRegistred[this.list.$id] = true;



				});

				//console.log(userlistsRegistred);

				jQuery.each(apl_postloader_getLists().items, function() {



					if (userlistsRegistred[this._id.$id] != undefined)
						userlists.push({
							name: this.name,
							id: this._id.$id,
							isActive: true
						});
					else
						userlists.push({
							name: this.name,
							id: this._id.$id,
							isActive: false
						});

				});


				// Convert it to list (needed for underscore.js)



				_.templateSettings.variable = "rc";

				d2.userlists = userlists;
				d2.test = "userlists";

				var tmpl = _.template(d, d2);

				console.log(d2.lists);
				$("#userinfo_container").html(tmpl);



				if (container_main.currentView.options.userId == charmeUser.userId)
					$("#profileListBox").hide();
				else
					$("#editButton").hide();


				$("td:empty").parent().remove(); // Remove empty Info fields


				// Get box templates now and append to infopage:

				// Init list click events
				$('#select_lists a').click(function() {

					$(this).toggleClass("active");

					// declare variables here, so that they are avaiable if page has changed after timeout was called
					var uid = container_main.currentView.options.userId;
					var ar = $('#select_lists a.active').map(function(i, n) {
						return $(n).data("listid");
					}).get();


					$.doTimeout('listsave', 1000, function(state) {
						// Get ids of selected lists. Form: ["5162c2b6d8cc9a4014000001", "5162c3c5d8cc9a4014000005"]

						// Send a request to the user server
						apl_request({
							"requests": [{
									"id": "lists_update",
									"listIds": ar,
									"userId": uid,
									"username": container_main.currentView.username
								}

							]
						}, function(d) {

							// OK...

						});

						// TODO: Notify profile owner server


					}, true);

				});
			});



		});



		$(".profile_name").text(container_main.currentView.username);

	}

});


/*

	The Settings Page views

*/

var view_settings_sub = view_subpage.extend({


	events: {
		'click #but_saveProfile': 'saveProfile',
		'click #but_saveImage': 'saveImage',
		'change #profileImgFileUp': 'fileChanged'


	},
	initialize: function() {

	},
	saveImage: function() {

		alert($('#profileImgFileUp').data("filecontent").result.length);
		apl_request({
			"requests": [{
					"id": "profile_imagechange",
					"data": $('#profileImgFileUp').data("filecontent").result
				}

			]
		}, function(d) {


			alert("IMAGE SAVED");
			console.log(d);



		});



		//console.log();

	},
	fileChanged: function(h) {

		var files = h.target.files; // FileList object
		//var output = [];
		// atid = $(x).attr('id'); // ID of attachment container



		var reader = new FileReader();
		reader.file = files[0]; //http://stackoverflow.com/questions/4404361/html5-file-api-get-file-object-within-filereader-callback

		reader.onload = function(e) {
			//  $('#attachments'+atid).append("<div><a  class='delete' style='float:right' onclick='delAttachment(this)'> </a>"+ escape(this.file.name)+ "</div>");
			$('#profileImgFileUp').data("filecontent", this);

		}
		reader.readAsDataURL(reader.file);



	},
	saveProfile: function() {
		var s = $("#settingsform").serializeObject();

		var that = this;

		apl_request({
			"requests": [{
					"id": "profile_save",
					"data": s
				}

			]
		}, function(d) {


			alert("OK");
			console.log("FORM SAVED AND RETURNED:");
			console.log(d);



		});



	},

	getData: function() {
		if (this.options.data != undefined)
			return this.options.data;
		else
			return {};

	},


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


		var t = new control_postField({
			el: $("#postFieldContainer"),
			collectionId: ""
		});
		t.render();



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

var view_talks_subpage = view_subpage.extend({
	options: {
		template: 'talks_',
		el: '#page3'
	},


	initialize: function() {
		this.messagePaginationIndex = 0;

		if (this.options.superId != "")
			this.loadMessages(-1);
		console.log("cert");
		console.log(charmeUser.certificate);

	},
	fileChanged: function(h) {
		var that = this;

		var files = h.target.files; // FileList object
		//var output = [];
		// atid = $(x).attr('id'); // ID of attachment container


		var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;



		var reader = new FileReader();
		reader.file = files[0];


		reader.onload = function(e) {

			// Working:
			//document.getElementById("uploadPreview").src = e.target.result;
			var str = e.target.result;

			// encrypt:
			var startUpload = function(file, thumb) {
				// encrypt here
				var thumbEnc = aes_encrypt(that.aes, thumb);
				var fileEnc = aes_encrypt(that.aes, file);


				var conversationId = ($('#msg_conversationId').data("val"));

				apl_request({
					"requests": [{
							"id": "message_distribute_answer",
							"conversationId": conversationId,
							"encFile": fileEnc,
							"encFileThumb": thumbEnc,
						}

					]
				}, function(d2) {
					location.reload();
				});

				// Append thumb...


				// Send apl request here

			};

			var img = new Image;
			img.src = e.target.result;



			img.onload = function(e3) {

				var img2 = new Image;
				img2.src = e.target.result;

				img2.onload = function(e4) {
					startUpload(scaleImage(img2), makeThumb(img));
				};

			};



		}
		//  if (!rFilter.test(reader.file))
		// { alert("You must select a valid image file!"); return; }

		reader.readAsDataURL(reader.file);

	},
	postRender: function() {
		var that = this;
		$('#theFile').on("change", function(e) {
			that.fileChanged(e);
		});

	},
	uploadFile: function() {



		$("#theFile").trigger('click');



		// Check if image?
		// if yes -> make thumbnail!

		// encrypt file&thumbnail base64 with aes key.


	},
	addPeople: function() {

		$.get("templates/box_addPeople.html", function(d) {
			var template = _.template(d, {});

			ui_showBox(template, function() {

				$('#inp_receivers').tokenInput("http://" + charmeUser.getServer() + "/charme/auto.php", {
					crossDomain: true
				});


			});
		});
	},
	leaveConversation: function() {
		alert("leave conversation...");
	},
	loadMedia: function(start) {
		var that = this;
		var limit = -1;
		// APL request:
		apl_request({
			"requests": [{
				"id": "messages_get_sub",
				limit: limit,
				start: start,
				"superId": this.options.superId,
				onlyFiles: true
			}]
		}, function(d2) {

			$.get("templates/control_mediaview.html", function(d) {
				_.templateSettings.variable = "rc";

				var tmpl = _.template(d, d2.messages_get_sub);
				$("#mediaDisplayOn").html(tmpl);
				that.decodeImages();


			});
			/*	var rsa = new RSAKey();
				rsa.setPrivateEx(charmeUser.certificate.rsa.n, charmeUser.certificate.rsa.e, charmeUser.certificate.rsa.d,
				 charmeUser.certificate.rsa.p, charmeUser.certificate.rsa.q, charmeUser.certificate.rsa.dmp1, 
				 charmeUser.certificate.rsa.dmq1, charmeUser.certificate.rsa.coeff);
				

					//alert(d2.messages_get_sub.aesEnc);

						var aeskey = rsa.decrypt(d2.messages_get_sub.aesEnc);
*/

			//that.aes = aeskey;

			//d2.messages_get_sub.aesEnc  = aeskey;

			//that.aes


			/*jQuery.each(d2.messages_get_sub.messages, function(i) {

						});*/

		});


	},
	showMedia: function(on) {
		$("#but_showMessages").toggle();
		$("#but_showMedia").toggle();

		if (on) {
			this.mediaDisplayOn = true;
			$("#mediaDisplayOff").hide();
			$("#mediaDisplayOn").show();

			this.loadMedia(-1);


		} else {
			$("#mediaDisplayOff").show();
			$("#mediaDisplayOn").hide();


		}
	},
	decodeImages: function() {
		var that2 = this;
		$(".imageid").each(function(index) {
			var that = this;
			var loc = $(this).data("location");
			var par = $(that).parent();

			$.get(loc, function(d) {
				var i = new Image();
				i.src = aes_decrypt(that2.aes, d);



				//<a class='showImgEnc' data-location='"+$(this).data("location")+"'>

				//</a>

				$(par).append(
					$('<a class="imgThumb"></a>').click(function() {

						$(par).append(
							'<span class="imgLoading">Loading...</span>');


						$.get(loc + "&type=original", function(d2) {
							$(".imgLoading").remove();



							var worker = new Worker("lib/crypto/thread_decrypt.js");



							worker.onmessage = function(e) {

								// Hide cancel descryption button
								$(".cancelDec").hide();
								ui_showImgBox(e.data);

							}

							// Add cancel decryption button
							$(par).append(
								$('<a class="cancelDec">Cancel Decryption</a>').click(function() {

									$(this).remove();
									worker.terminate();
								}));

							worker.postMessage({
								key: that2.aes,
								encData: d2
							});



						});


					}).html($(i))

				);
				//remove class imageid
				$(that).remove();



			});

			// TODO: in own thread!

			// Open filestream

			// Decode



		});
	},
	loadMessages: function(start) {


		var limit = -1;

		if (start == 0)
			limit = this.countAll % 10;

		var that = this;
		apl_request({
			"requests": [{
				"id": "messages_get_sub",
				limit: limit,
				start: start,
				"superId": this.options.superId
			}]
		}, function(d2) {


			var newstart = start - 10;
			if (d2.messages_get_sub.count != -1) {
				that.countAll = d2.messages_get_sub.count;
				newstart = that.countAll - 20;
			}

			$.get("templates/control_messageview.html", function(d) {
				// RSA Decode, for each:
				// d2.messages_get_sub



				var rsa = new RSAKey();

				var key1 = getKeyByRevision(d2.messages_get_sub.revision);
					var key = key1.rsa;

					rsa.setPrivateEx(key.n, key.e, key.d,
						key.p, key.q, key.dmp1,
						key.dmq1, key.coeff);



				//rsa.setPrivateEx(charmeUser.certificate.rsa.n, charmeUser.certificate.rsa.e, charmeUser.certificate.rsa.d,
				//	charmeUser.certificate.rsa.p, charmeUser.certificate.rsa.q, charmeUser.certificate.rsa.dmp1,
				//	charmeUser.certificate.rsa.dmq1, charmeUser.certificate.rsa.coeff);


				//alert(d2.messages_get_sub.aesEnc);

				var aeskey = rsa.decrypt(d2.messages_get_sub.aesEnc);

				that.aes = aeskey;

				d2.messages_get_sub.aesEnc = aeskey;

				jQuery.each(d2.messages_get_sub.messages, function() {

					try {
						if (this.encMessage == "" || this.encMessage == undefined)
							this.encMessage = "";
						else
							this.msg = aes_decrypt(aeskey, this.encMessage);
					} catch (err) {
						this.msg = err;
					}
				});

				// Decode AES Key with private RSA Key
				/*

				

				 var aeskey = rsa.decrypt(this.aesEnc);*/ //sjcl.decrypt(aeskey, this.encMessage);

				_.templateSettings.variable = "rc";

				var tmpl = _.template(d, d2.messages_get_sub);

				if (start == -1) {
					jQuery.each(d2.messages_get_sub.people, function(i) {

						if (i != 0)
							$("#inp_receiversinstant").append(", ");

						if ($.isArray(this)) // just userid
						{
							$("#inp_receiversinstant").append("<a href='#user/" +
								encodeURIComponent(this.userId) + "'>" + this.username + "</a>");
						} else // {userid, name}
						{
							$("#inp_receiversinstant").append("<a href='#user/" +
								encodeURIComponent(this) + "'>" + this + "</a>");
						}


					});


				}

				$(".talkmessages").prepend(tmpl);

				that.decodeImages();
				// Decode images 
				/*
				$(".imageid").each(function( index ) {
					var that = this;
					var loc = $(this).data("location");
					var par = $(that).parent();

					$.get(loc, function(d)
					{
						var i = new Image();
						i.src = sjcl.decrypt(aeskey, d);



						


						//<a class='showImgEnc' data-location='"+$(this).data("location")+"'>

						//</a>

						$(par).append(
							$('<a class="imgThumb"></a>').click(function(){

							$(par).append(
								'<span class="imgLoading">Loading...</span>');


							$.get(loc+"&type=original", function(d2)
							{
								$(".imgLoading").remove();
							 	


							 	var worker = new Worker("lib/crypto/thread_decrypt.js");



								worker.onmessage = function(e) {
								    
								    // Hide cancel descryption button
									$(".cancelDec").hide();
									ui_showImgBox(e.data);

								}

								// Add cancel decryption button
								$(par).append(
								$('<a class="cancelDec">Cancel Decryption</a>').click(function(){
									
									$(this).remove();
									worker.terminate();
								}));

								worker.postMessage({key:aeskey, encData:d2 });

							
							
							});


							}).html($(i))

							);
							//remove class imageid
							$(that).remove();



						
					});

						// TODO: in own thread!

					// Open filestream

					// Decode



				});
*/
				// END DECODE IMAGES!



				$(".talkmessages").css("margin-bottom", ($(".instantanswer").height() + 48) + "px");

				if (start == -1) {

					$(window).scrollTop(999999);



					$("#but_file").click(function() {

						that.uploadFile();

					});
					$("#but_showMedia").click(function() {

						that.showMedia(true);

					});
					$("#but_showMessages").click(function() {

						that.showMedia(false);

					});
					$("#but_addPeople").click(function() {

						that.addPeople();

					});

					$("#but_smilies").click(function() {
						if ($("#msg_smiliecontainer").html() == "") {
							var t = new control_smilies({
								el: $("#msg_smiliecontainer"),
								area: $('#inp_newmsginstant')
							});
							t.render();
						} else {
							$("#msg_smiliecontainer").html("");
						}
						$(".talkmessages").css("margin-bottom", ($(".instantanswer").height() + 48) + "px");

					});


					$("#but_leaveConversation").click(function() {

						that.leaveConversation();

					});


					$('#but_instantsend').click(function() {
						sendAnswer();
					});

				}


				if (start == 0 || that.countAll < 10)
					$('#moremsg2').remove();


				if (newstart < 0)
					newstart = 0;



				$('#moremsg2').click(function() {

					$('#moremsg2').remove();
					that.loadMessages(newstart);



				});

			});

		});
	}
});


var view_talks = view_page.extend({

	events: {

		"click  #but_newMessage": "newMsg"

	},
	initialize: function() {
		this.paginationIndex = 0;
	},
	newMsg: function(ev) {
		// Load homepage and append to [sharecontainer]
		sendMessageForm({});
	},
	getData: function() {
		var templateData = {
			globaldata: [],
			test: "test"
		};
		templateData["listitems"] = apl_postloader_getLists();
		return templateData;

	},

	postRender: function() {


		this.loadMessages(0);
		$("#item_talks .count").remove();
		// Load some messages

	},
	loadMessages: function(start) {
		// load template
		var cr = false;
		if (start == 0)
			cr = true;


		var that = this;

		apl_request({
			"requests": [{
				"id": "messages_get",
				start: start,
				countReturn: cr
			}]
		}, function(d2) {

		

			$.get("templates/control_messagelist.html", function(d) {

				if (d2.messages_get.count != -1)
					that.maxMessages = d2.messages_get.count;



				jQuery.each(d2.messages_get.messages, function() {

					// Decode AES Key with private RSA Key

					var rsa = new RSAKey();

					// TODO: Cache keys for performance reasons!

					var key1 = getKeyByRevision(this.revision);
					var key = key1.rsa;

					rsa.setPrivateEx(key.n, key.e, key.d,
						key.p, key.q, key.dmp1,
						key.dmq1, key.coeff);


					var aeskey = rsa.decrypt(this.aesEnc); ///sjcl.decrypt(aeskey, this.encMessage);
					if (this.pplCount < 2)
						this.messageTitle = this.sendername;
					else
						this.messageTitle = this.sendername + " and " + (this.pplCount - 1) + " more";
					if (this.messagePreview)
						this.messagePreview = aes_decrypt(aeskey, this.messagePreview);
					else
						this.messagePreview = "";
					//.join(", ");

				});



				var data = {
					messages: d2.messages_get.messages
				};

				_.templateSettings.variable = "rc";
				var template = _.template(d, data);

				$(".msgItems").append(template);


				if ((that.paginationIndex + 1) * 7 > that.maxMessages)
					$('#moremsg').remove();

				$('#moremsg').click(function() {
					$('#moremsg').remove();

					that.paginationIndex += 1;


					that.loadMessages(that.paginationIndex);



				});

				$('.msgItems li a').click(function() {
					$('.msgItems li a').removeClass("active");
					$(this).addClass("active");

					$(this).parent().removeClass("new");

				});

				// Open first conversation, if no conversation open yet.
				if (that.sub.options.superId == "") {
					// Problem here, is really the first item selected?
					that.sub.options.superId = ($('.msgItems li a:first').data("messageid"));
					that.sub.loadMessages(-1);

					$('.msgItems li:first').removeClass("new");


				}


				$(".msgItems li a:first").addClass("active");
				setSCHeight();


			});

		});
		// Decrpyt, TODO: in background Thread!

		// append....

		// load first message
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
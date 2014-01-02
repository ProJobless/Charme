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
					}


				]
			}, function(d) {

				container_main.currentView.username = d.profile_get_name.info.firstname + " " + d.profile_get_name.info.lastname;
				$(".profile_name").text(container_main.currentView.username);



			}, "", this.options.userId.split("@")[1]);

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

		var save_selection;
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
		replaceSelectedText = function(replacementText) {
			var e = $(replacementText);

			var r = document.createRange();



			var sel, range;
			sel = window.getSelection();
			if (window.getSelection) {

				if (sel.rangeCount) {
					range = sel.getRangeAt(0);
					range.deleteContents();
					range.insertNode(e[0]); // document.createTextNode(replacementText)
					///range.setStartAfter (e);

					// Move cursor
					range.setStartAfter(e[0]);
					range.setEndAfter(e[0]);
					sel.removeAllRanges();
					sel.addRange(range);

				}


			} else if (document.selection && document.selection.createRange) {
				range = document.selection.createRange();
				range.insertNode(e[0]);


				//range.setStartAfter (e);


			}
			// Save cursorr position
			save_selection = saveSelection();

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

		$textBox.bind("mouseup keyup", function() {

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

		}, "", container_main.currentView.options.userId);


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

		},"",  container_main.currentView.options.userId.split("@")[1]);



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

		},"",  container_main.currentView.options.userId.split("@")[1]);



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
				}

				, 
				{
					"id": "piece_get4profile",
					"userId": container_main.currentView.options.userId,
					"invader" : charmeUser.userId
				} 
				

			]
		}, function(d2) {




				apl_request({
			"requests": [
				// Send this to user server:
				{
					"id": "lists_getRegistred",
					"userId": container_main.currentView.options.userId
				}
	]
		}, function(d9) {




			$.get("templates/user__.html", function(d) {

				// Mark lists which contain the user

				var userlistsRegistred = new Array();
				var userlists = new Array();


				jQuery.each(d9.lists_getRegistred, function() {



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





					$.each(d2.piece_get4profile.items, function() {

						var that2 = this;
						var rq = "";

						if (this.bucketaes == undefined && this.requested == 1)
						{
							rq ="<i>Waiting for reply...</i>";

						}
						else if (this.bucketaes != undefined)
						{	
							// bucketaes, bucketrsa, piecedata
							console.log((that2.bucketrsa));
							var key1 = mkRSA(getKeyByRevision(that2.bucketrsa.revision).rsa.rsa);
							
						
								//Use this cache version, if piece revisions are completed:
								
								// Look for cached AES key to save expensive RSA decryption time
								// Our unique key consits of revision, userid and piece key:
								var key = "--,"+container_main.currentView.options.userId+","+that2.version+","+this.key;
								var aes = checkCache(key);
								if (aes == null) {
									
									key1 = mkRSA(getKeyByRevision(that2.bucketrsa.revision).rsa.rsa);
									aes  = key1.decrypt(that2.bucketrsa.data); // get aes key to decrypt piecedata
									storeCache(key, aes);
								}
						

								if (that2.piecedata == "")
									{rq = ""}
								else
								{
								var t = aes_decrypt(aes, that2.piecedata);
								if (t != "")
									rq = xssText(t);
								else
									rq ="";
								}
						}
						else
						{
							// Can not request if empty fields:
							if (that2.empty == true)
								rq = "";
							else
							rq = "<a id='req_" + xssText(that2.key) + "'>" + lng_global.request + "</a>";

						}
						

				
						if (rq  != "")
						$("#table_prvInfo").append("<tr><td class='info'>" + xssText(lng_global.privateInfo[this.key]) + ":</td><td>" +  rq + "</td></tr>");

						

						$("#req_" + xssText(that2.key)).click(function() {

							var that3 = this;
							

							apl_request({
								"requests": [{
									"id": "piece_request",
									"key": that2.key,
									"userId" : container_main.currentView.options.userId
								}, ]
							}, function(d) {

								$(that3).parent().append("Request sent.");
								$(that3).remove();
								NProgress.start();
								NProgress.done();

							});

							//,"",  container_main.currentView.options.userId.split("@")[1]

							//alert(that2.key);

							// Send apl request to PROFILE OWNER server


						});
						
					});


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

		},"",  container_main.currentView.options.userId.split("@")[1]);



		$(".profile_name").text(container_main.currentView.username);

	}

});


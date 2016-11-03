function talks_encryptEdgekeys(edgeKeyList, messageKey) {
	peopleMessageKeys = [];

	$.each(edgeKeyList, function(index, item) {

		if (crypto_hmac_check(item.key)) {
		// Encrypt message key with edgekey here.
		var edgekey = crypto_decryptFK1(item.key.obj.edgekeyWithFK).message;
		var messageKeyEnc = aes_encrypt(edgekey, messageKey);

		peopleMessageKeys.push({
			messageKey: messageKeyEnc,
			userId: item.key.obj.publicKeyUserId,
			rsaEncEdgekey: item.key.obj.edgekeyWithPublicKey,
			revisionB: item.key.obj.publicKeyRevision
		});

		}
		else {
			alert("CRITICAL ERROR: HMAC VERIFICATION OF PUBLIC KEY FAILED");
		}


	});

	return peopleMessageKeys;
}

function talks_addPeople(revision, conversationId, currentUsernames) {

	newRevision = revision + 1;
	newMessageKey = randomAesKey(32);

	var uDir = makeConversationUserDirectory();
	var usernamesAdded = uDir.usernames;
	var output = uDir.output;

	// TOOD: output usernames

	var message = usernamesAdded.length + " people were added.";

	/*
		Remove duplicate Usernames from list
	*/
	var uidList = []
	var newUsernamesTemp = $.merge(usernamesAdded, currentUsernames);
	var allUsernames = [];
	$.each(newUsernamesTemp, function(i, el) {
		if ($.inArray(el.userId, uidList) === -1) {
			allUsernames.push(el);
			uidList.push(el.userId)
		}
	});


	message_data = crypto_hmac_make( // Make HMAC to protect message integrity
									{
									"usernames": allUsernames,
									"action": "addPeople",
									"sender": charmeUser.userId,
									"revision" : newRevision,
									"time": {
										sec: new Date().getTime() / 1000
									}
								}, newMessageKey, 0);

	message_data["conversationId"] = conversationId; // Warning: conversationId is not signed !!!!!
	message_data["revision"] = newRevision;


	apl_request({
		"requests": [{
			"id": "edgekeys_byUserIds",
			"userIdList": uidList
		}, ]
	}, function(d) {

		// TODO: Check Edgekeys!
		if (d.edgekeys_byUserIds.status=="KEYS_NOT_FOUND") {
			console.warn("Edgekeys were not found when adding new user...");
		}

		var peopleMessageKeys = talks_encryptEdgekeys(d.edgekeys_byUserIds.value, newMessageKey);
		apl_request({
			"requests": [{
				"id": "message_distribute",
				"messageKeys": peopleMessageKeys,
				"messageData":message_data
			}]
		}, function(d2) {
			location.href="#talks";
			ui_closeBox();
			location.reload();
			//	location.reload();
		});
	});
}


function makeConversationUserDirectory() {


	// Get receivers from UI element
	var receiversTemp = ($("#inp_receivers").tokenInput("get"));
	var receivers = [charmeUser.userId];

	// Get plain receiver userIds in a list
	var output = [charmeUser.userId];
	var usernames = [{
		userId: charmeUser.userId,
		name: charmeUser.getSignedData().username // TODO: Add real name provided in charmeUser Object.
	}];


	$.each(receiversTemp, function(index, item) {
		if ($.inArray(item.id, output) === -1) {

			receivers.push(item.id);
			output.push(item.id); // add userid
			usernames.push({
				userId: item.id,
				name: item.name
			});
		}
	});

	return {usernames: usernames, output: output };

}
// Fired on message ok button click, leave arguments empty if new conversation, fill in arguments if adding people to conversation
function talks_startConversation() {

	var uDir = makeConversationUserDirectory();
	var usernames = uDir.usernames;
	var output = uDir.output;

	var keyAlert = function(problems) {

		// Some keys are invalid, display them!
		$.get("templates/addkeys.html", function(d) {

			var templateData = {
				problems: problems
			};

			_.templateSettings.variable = "rc";
			var template = _.template(d, templateData);
			ui_showBox(template);
		});
	};
	// Send apl_request to server to get edgekeys
	apl_request({
			"requests": [{
				"id": "edgekeys_byUserIds",
				"userIdList": output
			}, ]
		}, function(d) {

			if (d.edgekeys_byUserIds.status=="KEYS_NOT_FOUND") { // one or more key were not found in the key directory
				keyAlert(d.edgekeys_byUserIds.users);
			} else {

				var messageKey = randomAesKey(32);
				var peopleMessageKeys = talks_encryptEdgekeys(d.edgekeys_byUserIds.value, messageKey);
				apl_request({
					"requests":[{
							"id": "message_distribute",
							"messageKeys": peopleMessageKeys, // Receivers must only accept the public newest key here. So we do not need integrity protection for the key revision
							"messageData": crypto_hmac_make( // Make HMAC to protect message integrity
														  {
															"usernames": usernames,
															"action": "initConversation"
															}, messageKey, 0)
						}]
				}, function(d2) {
					location.href = "#talks/"+d2.message_distribute.messageId;
					ui_closeBox(); // Open message in view
				});

			}
	});
}

// Backbone view for talk subpage (containing messages)
var view_talks_subpage = view_subpage.extend({
	options: {
		template: 'talks_',
		el: '#page3',
		isResponsiveMode: false, // Must be defined in postrender!
		messageKeys : []
	},


	initialize: function() {
		this.messagePaginationIndex = 0;
		this.options.lastid = 0;

	},
	refreshMessages: function(messageData) {

				var that = this;
		// Anonymous Function to render messages:
		var renderMessages = function(returnedServerData) {

			$.each(returnedServerData, function() {
				var msgKey = that.getMessageKey(this.message.object.msgKeyRevision, this.message.object.conversationId);
				that.options.lastid = this._id.$id;

				try {

					if (typeof this.message.object.content != 'undefined') // Check if it is not an image
						this.message.object.content = aes_decrypt(msgKey.key, this.message.object.content);
				} catch (err) {

					this.message.object.content = err + " \r\nmsgKeyRevision required: " + this.message.object.msgKeyRevision + " Found: " + msgKey.revision;
				}
			});


			if (returnedServerData[returnedServerData.length-1].message.object.conversationId == that.options.conversationId) // Only append to messages if conversation is active
			{
				$.get("templates/control_messageview.html", function(d) {

					_.templateSettings.variable = "rc";
					var tmpl = _.template(d, {messages: returnedServerData});
					console.log({messages: returnedServerData});

					$(".talkmessages").append(tmpl);

					that.decodeImages();


					if (messageData.length > 0)
						$(window).scrollTop(999999);

					// Remove client side generated messages
					//$(".tempmessage").remove();

				});
			}
			// Update sidebar preview
			$("a[data-messageid="+returnedServerData[returnedServerData.length-1].message.object.conversationId+"] div").text(returnedServerData[returnedServerData.length-1].message.object.content);
		};

		// Anonymous Function to check if message keys exist. If not then load them from host server:
		var keyCheck = function(serverData) {
			// Check if new key required:
			var newKeyRequired = false;
			var newest = that.getMessageKey(-1,  serverData[0].message.object.conversationId);

			$.each(serverData, function() {

				if (this.message.object.msgKeyRevision > newest.revision)
					newKeyRequired = true;
			});


			if (newKeyRequired) {


				apl_request({
					"requests": [{
						"id": "messages_get_keys",
						"conversationId": serverData[0].message.object.conversationId,

					}]
				}, function(d2) {

					var msgKeys = [];
					msgKeys[serverData[0].message.object.conversationId] = 	d2.messages_get_keys.messageKeys ;
					that.options.messageKeys = msgKeys;

					renderMessages(serverData);
				});


			} else {

				renderMessages(serverData);

			}
		};



		//console.log("refresh msg");
		//console.log("lastId is"+this.options.lastid);

		if (typeof messageData === "undefined") { // No new messages supplied -> Check server
			console.warn("message data is undefined");
			apl_request({
				"requests": [{
					"id": "message_get_sub_updates",
					lastId: this.options.lastid,
					conversationId: this.options.conversationId,

				}]
			}, function(d) {
				keyCheck(d.message_get_sub_updates);
			});
		}
		else
			keyCheck(messageData);




	},

	fileChanged: function(h) {
		var that = this;
		var files = h.target.files; // FileList object

		var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
		// (comment to fix atom syntax highlighting)

		var reader = new FileReader();

		reader.file = files[0];

		reader.onload = function(e) {

			var str = e.target.result;
			var startUpload = function(file, thumb) {

				var msgKeyRevision = that.getMessageKey(-1).revision;
				var thumbEnc = aes_encrypt(that.getMessageKey(-1).key, thumb);


				var fileEnc = aes_encrypt(that.getMessageKey(-1).key, file);
				var conversationId = ($('#msg_conversationId').data("val"));

				messageRaw = {
					"conversationId": that.options.conversationId,
					"encFileHash": CryptoJS.SHA256(fileEnc),
					"msgKeyRevision": msgKeyRevision,
					"sender": charmeUser.userId,
					// TODO: add receiver
					"time": {
						sec: new Date().getTime() / 1000
					},
				};

				NProgress.start();
				apl_request({
					"requests": [{
							"id": "message_distribute_answer",
							"message": CharmeModels.Signature.makeSignedJSON(messageRaw),
							"encFile": fileEnc,
							"encFileThumb": thumbEnc,
						}

					]
				}, function(d2) {
				location.reload();
					NProgress.done();
				});
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
		reader.readAsDataURL(reader.file);
	},

	postRender: function() {
		var that = this;
		$('#theFile').on("change", function(e) {
			that.fileChanged(e);
		});
		that.isResponsiveMode  = isResponsive();

		$(window).resize(function () {
			if (that.isResponsive != isResponsive()) {
				// Responsive Mode has changed -> Update the view, but do not reload the messages
				if (!isResponsive() || this.options.conversationId != "") {
					$(".messageDetails").addClass("active");
					$(".talkbar").addClass("inactive");
				} else {
					$(".messageDetails").removeClass("active");
					$(".talkbar").removeClass("inactive");
				}
			}
		});

		// Do not load messages of a conversation if in responsive mode. Here the user has
		// to select an conversation first.
		if (!isResponsive() || this.options.conversationId != "") {
			this.loadMessages(-1);
			$(".messageDetails").addClass("active");
			$(".talkbar").addClass("inactive");
		} else {
			$(".messageDetails").removeClass("active");
			$(".talkbar").removeClass("inactive");
		}
	},

	uploadFile: function() {
		$("#theFile").trigger('click');
	},

	addPeople: function() {

		var that = this;
		$.get("templates/box_addPeople.html", function(d) {
			var template = _.template(d, {});

			ui_showBox(template, function() {

				$('#inp_receivers').tokenInput("http://" + charmeUser.getServer() + "/charme/auto.php", {
					crossDomain: true
				});

				$("#but_addPeopleOk").click(function() {
					// Update key directory first, maybe the newest message key revision has already changed!
					apl_request({
						"requests": [{
							"id": "messages_get_keys",
							"conversationId": that.options.conversationId,

						}]
					}, function(d2) {

						var msgKeys = [];
						msgKeys[that.options.conversationId] = 	d2.messages_get_keys.messageKeys ;
						that.options.messageKeys = msgKeys;

						talks_addPeople(that.getMessageKey(-1).revision, that.options.conversationId, that.options.usernames);
					});
				});
			});
		});
	},

	leaveConversation: function() {
		alert("Not implmenented yet.");
	},

	loadMedia: function(start) {
		var that = this;
		var limit = -1;
		// APL request:
		apl_request({
			"requests": [{
				"id": "messages_get_sub",
				limit: limit,
				start: 0,
				"conversationId": this.options.conversationId,
				onlyFiles: true
			}]
		}, function(d2) {


			$.get("templates/control_mediaview.html", function(d) {
				_.templateSettings.variable = "rc";

				var tmpl = _.template(d, d2.messages_get_sub);

				$("#mediaDisplayOn").html(tmpl);
				that.decodeImages();


				$("#but_downloadimgs").click(function() {

					$.get("templates/box_zipdown.html", function(d123) {
						_.templateSettings.variable = "rc";

						var template = _.template(d123, {});
						ui_showBox(template);

						// Download Images Now

						$('#but_downloadimages').click(function() {


							apl_request({
								"requests": [{
									"id": "messages_get_sub",
									limit: -1,
									start: 0,
									"conversationId": that.options.conversationId,
									onlyFiles: true
								}]
							}, function(d3) {
								console.log(d3.messages_get_sub);
								var fileidlist = [];
								$.each(d3.messages_get_sub.messages, function(d341) {

									// Sender name is needed for server
									if (this.fileId != 0) {
										fileidlist.push({
											fileId: this.fileId,
											sender: this.message.object.sender,
											msgKeyRevision: this.message.object.msgKeyRevision

										});
									}
								});

								console.log(fileidlist);


								var allimagescount = fileidlist.length;
								var imgnow = 0;

								// Now start download of files. But only only download and decrypt one file after another.

								// todo: Terminate current worker on cancel.
								$("#but_downloadimages, #download_cancel").hide();

								var zip = new JSZip();

								$("#status").text("Starting Image Download...");
								var imgDownloader = function() {

									$("#status").text("Download Image " + (imgnow + 1) + " of " + allimagescount);
									// 1. Download file
									var loc = "http://" + fileidlist[imgnow].sender.split("@")[1] + "/charme/fs.php?cache=true&enc=1&id=" + fileidlist[imgnow].fileId;
									$.get(loc + "&type=original", function(d2) {

										console.log("DOWNLOADED " + imgnow);
										// 2. Decrypt File
										var worker = new Worker("lib/crypto/thread_decrypt.js");

										worker.onmessage = function(e) {
											// Image is decrypted -> add to archiv. Start Next download!

											$("#status").text("Decrypt Image " + (imgnow + 1) + " of " + allimagescount);

											console.log("DECRYPTED " + imgnow);
											zip.file("Image" + imgnow + ".jpg", e.data.substr(e.data.indexOf(',') + 1), {
												base64: true
											});


											imgnow++;
											if (imgnow < allimagescount)
												imgDownloader(); // Recursivly call function
											else {
												$("#status").text("Done.");
												content = zip.generate(); // base64



												var pom = document.createElement('a');
												pom.setAttribute('href', "data:application/zip;base64," + content);
												pom.setAttribute('download', "CharmeImages.zip");
												pom.click();
												ui_closeBox();


											}
											// Increment Index Counter
										}


										worker.postMessage({
											key: that.getMessageKey(fileidlist[imgnow].msgKeyRevision).key,
											encData: d2
										});
									});
								};

								imgDownloader();

							});
						});
					});
				});
			});
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


			try {
				var that = this;
				var loc = $(this).data("location");
				var msgKeyRevision = $(this).data("revision");
				var par = $(that).parent();


				$.get(loc, function(d) {

					var worker2 = new Worker("lib/crypto/thread_decrypt.js");
					var el = $('<a class="imgThumb"></a>');

					$(par).append(el);

					worker2.onmessage = function(e) {

						var i = new Image();
						i.src = e.data;

						(
							el.click(function() {

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
										key: that2.getMessageKey(msgKeyRevision).key,
										encData: d2
									});
								});
							}).html($(i))
						);
					}


					console.log( "1...."+CryptoJS.HmacSHA256("chypertext", "password").toString(CryptoJS.enc.Base64));

					worker2.postMessage({
						key: that2.getMessageKey(msgKeyRevision).key,
						encData: d
					});
					$(that).remove();
				});
			} catch (e) {
				alert(e);
			}
		});
	},

	// -1 for newest revision:
	getMessageKey: function(revision, conversationId) {

		if (typeof conversationId === "undefined")
			conversationId = this.options.conversationId;

		if (typeof this.options.messageKeys[conversationId] === "undefined") {
			alert("ERROR: Did not find any message keys...");

		}

		var maxRevision = -1;
		var bestKey;

		$.each(this.options.messageKeys[conversationId], function(i) {
			if ((this.revision > maxRevision && revision == -1) || revision == this.revision) {
				bestKey = this;
				maxRevision = this.revision;
			}
		});

		var edgekey_raw = crypto_rsaDecryptWithRevision(bestKey.key.rsaEncEdgekey, 0);
		var msgKey = aes_decrypt(edgekey_raw, bestKey.key.messageKey);

		return {
			key: msgKey,
			revision: bestKey.revision
		};
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
				"conversationId": this.options.conversationId
			}]
		}, function(d2) {
			$(".instantanswer").show();
			that.options.conversationId = d2.messages_get_sub.conversationId;
			that.options.receivers = d2.messages_get_sub.receivers;
			that.options.usernames = d2.messages_get_sub.usernames;



			var newstart = start - 10;
			if (d2.messages_get_sub.count != -1) {
				that.countAll = d2.messages_get_sub.count;
				newstart = that.countAll - 20;
			}

			$.get("templates/control_messageview.html", function(d) {


				that.options.messageKeys[that.options.conversationId] = d2.messages_get_sub.messageKeys;


				$.each(d2.messages_get_sub.messages, function() {


					var msgKey = that.getMessageKey(this.message.object.msgKeyRevision, that.options.conversationId);




					if (start == -1) // Only after first load messages
						that.options.lastid = this._id.$id;

					try {
						if (typeof this.message.object.content != 'undefined')
							this.message.object.content = aes_decrypt(msgKey.key, this.message.object.content);



					} catch (err) {
						this.message.object.content = err + "\r\nmsgKeyRevision required: " + this.message.object.msgKeyRevision + " Found: " + msgKey.revision;
					}
				});

				_.templateSettings.variable = "rc";

				var tmpl = _.template(d, d2.messages_get_sub);
				$(".talkmessages").prepend(tmpl);




				if (start == -1) {

					try
					{jQuery.each(d2.messages_get_sub.usernames, function(i) {

											if (i != 0)
												$("#inp_receiversinstant").append(", ");


											// {userid, name}
											{
												$("#inp_receiversinstant").append("<a href='#user/" +
													encodeURIComponent(d2.messages_get_sub.usernames[i].userId) + "'>" + xssText(d2.messages_get_sub.usernames[i].name) + "</a>");
											}
										});}
					catch(e){console.log("WARNING: Usernames of Conversation are NULL")}
				}


				that.decodeImages();


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


					// Direct Answer on message
					$('#but_instantsend').click(function() {

						var msgKey = that.getMessageKey(-1).key;
						var msgKeyRevision = that.getMessageKey(-1).revision;



						var messageUnencrypted = smilieParse($('#inp_newmsginstant').html());
						if (messageUnencrypted == "") return;

						messageEncrypted = aes_encrypt(msgKey, messageUnencrypted);
						messageEncryptedPreview = aes_encrypt(msgKey, messageUnencrypted.substring(0, 127));


						//var conversationId = ($('#msg_conversationId').data("val"));

						messageRaw = {
							"conversationId": that.options.conversationId,
							"content": messageEncrypted,
							"preview": messageEncryptedPreview,
							"msgKeyRevision": msgKeyRevision,
							"sender": charmeUser.userId,
							"time": {
								sec: new Date().getTime() / 1000
							},
						};
						NProgress.start();

						console.log(messageRaw);
						apl_request({
							"requests": [{
									"id": "message_distribute_answer",
									"message": CharmeModels.Signature.makeSignedJSON(messageRaw)
								}

							]
						}, function(d2) {

							NProgress.done();
							$(".talkmessages").css("margin-bottom", ($(".instantanswer").height() + 48) + "px");

							$.get("templates/control_messageview.html", function(d) {

								_.templateSettings.variable = "rc";
								var tmpl = _.template(d, {
									messages: [{
										tag: "tempmessage",
										message: {
											object: {
												content: messageUnencrypted,
												time: {
													sec: new Date().getTime() / 1000
												}
											}
										},
										class: "tempMessage",
										owner: charmeUser.userId,

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

	// Get the newest message key to decrypt preview of a message
	getNewestMessageKey: function(messageKeys) {
		var maxRevision = -1;
		var bestKey;
		$.each(messageKeys, function(i) {
			if (this.revision > maxRevision) {
				bestKey = this;
				maxRevision = this.revision;
			}
		});


		var edgekey_raw = crypto_rsaDecryptWithRevision(bestKey.key.rsaEncEdgekey, 0);
		var msgKey = aes_decrypt(edgekey_raw, bestKey.key.messageKey);
		return {
			key: msgKey,
			revision: bestKey.revision
		};

	},

	// Function to load conversations
	loadMessages: function(start) {
		// load template
		var that = this;

		var messageCountValueReturnedByServer = false;
		if (start == 0)
			messageCountValueReturnedByServer = true;

		apl_request({
			"requests": [{
				"id": "messages_get",
				start: start,
				countReturn: messageCountValueReturnedByServer
			}]
		}, function(d2) {
			$.get("templates/control_messagelist.html", function(d) {

				if (d2.messages_get.count != -1)
					that.maxMessages = d2.messages_get.count;

				// Iterate through each message
				jQuery.each(d2.messages_get.messages, function(index, item) {

					// Decode AES Key with private RSA Key
					var msgKeys = [];
					jQuery.each(d2.messages_get.messageKeys, function(index2, item2) {
						if (item2.conversationId.$id == item.messageData.conversationId)
							msgKeys.push(item2);
					});

					this.messageKeys = msgKeys;
					this.messageTitle = this.messageData.obj.usernames[0].name;
					if (this.messageData.obj.usernames.length > 1)
						this.messageTitle += " and " + (this.messageData.obj.usernames.length - 1) + " more.";



					try {
						var msgKey = that.getNewestMessageKey(msgKeys).key;

						this.messagePreview = aes_decrypt(msgKey, this.preview);
						this.messagePreview = $.charmeMl(this.messagePreview, {
							tags: ["smiliedelete"]
						});


					} catch (e) {
						console.error(e);
					}


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
	}
});

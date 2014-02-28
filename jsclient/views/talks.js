// Fired on message ok button click, leave arguments empty if new conversation, fill in arguments if adding people to conversation
function but_initConversationOk(currentAESKey, currentConversationId)
{
	// This could be a message which is currently empty
	var message = "";

	// Get receivers from UI element
	var receivers = ($("#inp_receivers").tokenInput("get"));

	// Get plain receiver userIds in a list
	var output = [];
	console.log(receivers);
	$.each(receivers, function(index, item) {
		output.push(item.id); // add userid
	});

	// (1) Build key directory hash query keys
	var hashes = crypto_buildHashKeyDir(output);
	console.log(hashes);



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
	 



	// Send apl_request with hash query keys to server to get public keys
	apl_request({
		"requests": [{
			"id": "key_getMultipleFromDir",
			"hashes": hashes
		}, ]
	}, function(d) {


		var length = d.key_getMultipleFromDir.value.length;
		var counter = 0;
		var problems =  [];


		
		// Add receivers that are not in the key dir with revision -1
		var output2 = [];
		
		$.each(d.key_getMultipleFromDir.value, function(index, item) {
			var key = decryptKeyDirValue(item.value);
			output2.push(key.userId);
		});

		$.each(output,function(index,item){

			if ($.inArray(item, output2) == -1)
			{

				// Add receivers that are not in the key dir to problems[]
				problems.push(item);

			}
		});

		// Show alert if no keys are in the Key Directory
		if (length == 0 && problems.length>0)
		{
			keyAlert(problems);
		}


		$.each(d.key_getMultipleFromDir.value, function(index, item) {
			

			var key = decryptKeyDirValue(item.value);
			console.log(key);
			// returns key.key.e|n, key.revision, key.userid
			// (2) Now check if key.revision matches with the users server. TODO: This should also check his friends servers to prevent evil servers.
			apl_request({
				"requests": [{
					"id": "key_get",
					"profileId": key.userId
				}, ] // TODO: handle errors
			}, function(d2) {
				


				console.log("KEYGET:");
				console.log(d2.key_get);
				counter++;

				if (key.revision < d2.key_get.revision)
				{
					problems.push(key.userId);
				}


				if (counter == length) // Queries Completed!
				{

					// (3) Does server revision match with key directory.
					// If yes-> initConversation,
					// If not -> Show message: This keys are not up to date anymore.


					if (problems.length > 0)
					{	
						keyAlert(problems);

					}
					else
					{
					

						// Start a new conversation		

						if (currentConversationId == undefined) {
							apl_talks_initConversation("", receivers, d.key_getMultipleFromDir.value, undefined, undefined, function() {
								ui_closeBox();
							});
						} else {
							// Or append people to existing conversation
							alert("append people..");
							// Encrypt the aes key with their public key first
							var encKeys = apl_talks_encryptAESKey(d.key_getMultipleFromDir.value, currentAESKey);

							//currentAESKey

							// Compare this to apl_talks_initConversation, which uses also
							// message_distribute, but with different parameters
							apl_request({
								"requests": [{
										"id": "message_distribute",
										"receivers": encKeys,
										"status": "addPeople", // New param
										"conversationId": currentConversationId, // New param
										"encMessage": "",
										"messagePreview": "",
										"sender": charmeUser.userId

									}

								]
							}, function(d2) {
									location.reload();
							});
						}
					}
					




				}
			});
		});
	});

	



}






// Backbone view for talk subpage (containing messages)
var view_talks_subpage = view_subpage.extend({
	options: {
		template: 'talks_',
		el: '#page3'
	},


	initialize: function() {
		this.messagePaginationIndex = 0;

		this.options.lastid = 0;


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

		var that = this;
		$.get("templates/box_addPeople.html", function(d) {
			var template = _.template(d, {});

			ui_showBox(template, function() {

				$('#inp_receivers').tokenInput("http://" + charmeUser.getServer() + "/charme/auto.php", {
					crossDomain: true
				});

				$("#but_addPeopleOk").click(function(){
			
					// DO NOT USE AES HERE, as no message has to be encrypted.
					var conversationId = $('#msg_conversationId').data("val");

					but_initConversationOk(that.aes, conversationId);

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


				$("#but_downloadimgs").click(function(){

					$.get("templates/box_zipdown.html", function(d123) {
					_.templateSettings.variable = "rc";

					var template = _.template(d123, {});
					ui_showBox(template);

					// Download Images Now

					$('#but_downloadimages').click(function(){


						apl_request({
							"requests": [{
								"id": "messages_get_sub",
								limit: -1,
								start: start,
								"superId": that.options.superId,
								onlyFiles: true
							}]
						}, function(d3){
							console.log(d3.messages_get_sub);
							var fileidlist = [];
							$.each(d3.messages_get_sub.messages, function(d341) {

								// Sender name is needed for server
								fileidlist.push({fileId: this.fileId, sender: this.sender});
							});

							console.log(fileidlist);

							
							var allimagescount = fileidlist.length;
							console.log("COUNT IS"+allimagescount);
							var imgnow = 0;

							// Now start download of files. But only only download and decrypt one file after another.

							// todo: Terminate current worker on cancel.
							$("#but_downloadimages, #download_cancel").hide();

							var zip = new JSZip();

							$("#status").text("Starting Image Download...");
							var imgDownloader = function() {

								$("#status").text("Download Image "+ (imgnow+1) + " of " + allimagescount);
								// 1. Download file
								var loc = "http://"+ fileidlist[imgnow].sender.split("@")[1] +"/charme/fs.php?cache=true&enc=1&id="+ fileidlist[imgnow].fileId;
								$.get(loc + "&type=original", function(d2) {

									console.log("DOWNLOADED "+imgnow);
									// 2. Decrypt File
									var worker = new Worker("lib/crypto/thread_decrypt.js");

									worker.onmessage = function(e) {
										// Image is decrypted -> add to archiv. Start Next download!
										
										$("#status").text("Decrypt Image "+ (imgnow+1) + " of " + allimagescount);

										console.log("DECRYPTED "+imgnow);
										zip.file("Image"+imgnow+".jpg", e.data.substr(e.data.indexOf(',')+1), {base64: true});

										
										imgnow++; 
										if (imgnow < allimagescount)
											imgDownloader(); // Recursivly call function
										else
										{
											$("#status").text("Done.");
											content = zip.generate(); // base64

											

											  var pom = document.createElement('a');
											    pom.setAttribute('href', "data:application/zip;base64,"+content);
											    pom.setAttribute('download', "CharmeImages.zip");
											    pom.click();
											    ui_closeBox();


										}
										// Increment Index Counter
									}

								
									worker.postMessage({
										key: that.aes,
										encData: d2
									});


								});
							};

							imgDownloader();

							
							


						});



					});

					// Step 1: Get a List of all images

					/*
					var loc = data location...
						$.get(loc + "&type=original", function(d2) {
							$(".imgLoading").remove();



							var worker = new Worker("lib/crypto/thread_decrypt.js");



							worker.onmessage = function(e) {
								// Image is decrypted -> add to archiv.
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



						});*/




					});



				
				});


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
					var key = key1.rsa.rsa;

					rsa.setPrivateEx(key.n, key.e, key.d,
						key.p, key.q, key.dmp1,
						key.dmq1, key.coeff);

				var aeskey = rsa.decrypt(d2.messages_get_sub.aesEnc);
				that.aes = aeskey;


				console.log(d2.messages_get_sub.peoplenames);
				console.log(d2.messages_get_sub.peoplenames);
				// Add people list to output
				if (start == -1) {
				jQuery.each(d2.messages_get_sub.people, function(i) {

					if (i != 0)
						$("#inp_receiversinstant").append(", ");

					/*if ($.isArray(this)) // just userid
					{
						$("#inp_receiversinstant").append("<a href='#user/" +
							encodeURIComponent(this.userId) + "'>" + this.username + "</a>");
					}*/
				 // {userid, name}
					{
						$("#inp_receiversinstant").append("<a href='#user/" +
							encodeURIComponent(this) + "'>" + xssText(d2.messages_get_sub.peoplenames[i]) + "</a>");
					}
				});
				}



				d2.messages_get_sub.aesEnc = aeskey;

				
				jQuery.each(d2.messages_get_sub.messages, function() {


					if (start == -1) // Only after first load messages
						that.options.lastid = this._id.$id;

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
				
		
				_.templateSettings.variable = "rc";

				var tmpl = _.template(d, d2.messages_get_sub);



				$(".talkmessages").prepend(tmpl);

				// timout to check for new messages after `lastid`
				if (that.options.lastid != 0)
				{
				$.doTimeout('messageupdate', 5000, function(state) {
				
					apl_request({
						"requests": [{
							"id": "message_get_sub_updates",
							lastid: that.options.lastid,
							conversationId: d2.messages_get_sub.conversationId.$id,

						}]
					}, function(d4) {

						$.each(d4.message_get_sub_updates.messages, function() {


							//qif (start == -1) // Only after first load messages
							that.options.lastid = this._id.$id;

							// Decrypt messages
							try {
								if (this.encMessage == "" || this.encMessage == undefined)
									this.encMessage = "";
								else
									this.msg = aes_decrypt(aeskey, this.encMessage);
							} catch (err) {
								this.msg = err;
							}
						});

						var tmpl = _.template(d, d4.message_get_sub_updates);
						// append html
						$(".talkmessages").append(tmpl);
						
						// remove own messages that have been inserted directly, as these are returned by server also and should not appear twice
						$(".tempmessage").remove();
						if (d4.message_get_sub_updates.messages.length > 0)
						$(window).scrollTop(999999);

						// TODO: if message id still active!

						// 	console.log("UPDATE!!!"+that.options.superId);
					});
					// 

					return true;
				});

				}
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


			// Direct Answer on message
			$('#but_instantsend').click(function() {
				

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
								tag: "tempmessage",
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

					console.log(this._id.$id);



					// Look for cached AES key to save expensive RSA decryption time
					var aeskey = checkCache("msg" + this._id.$id);
					if (aeskey == null) {
						var rsa = new RSAKey();
						var key1 = getKeyByRevision(this.revision);
						var key = key1.rsa.rsa;
						rsa.setPrivateEx(key.n, key.e, key.d,
							key.p, key.q, key.dmp1,
							key.dmq1, key.coeff);

						aeskey = rsa.decrypt(this.aesEnc);
						storeCache("msg" + this._id.$id, aeskey);
					}
					else
						console.log("EXISTS");


					if (this.pplCount < 2)
						this.messageTitle = this.sendername;
					else
						this.messageTitle = this.sendername + " and " + (this.pplCount - 1) + " more";
					if (this.messagePreview)
						this.messagePreview = aes_decrypt(aeskey, this.messagePreview);
					else
						this.messagePreview = "";


							this.messagePreview = $.charmeMl(this.messagePreview, {tags: [ "smiliedelete"]});
	

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


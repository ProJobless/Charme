/*
	Layout definitions of pages like Profile, Stream etc.
*/



CharmeModels = {} // CoffeScript Namespace

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

			$(".sbAlpha ul li, .header.responsive .row1 a").removeClass("active");

			$(".sbAlpha ul li a[data-topic='" + this.options.navMatch + "']").parent().addClass("active");
			$(".header .row1 a[data-topic='" + this.options.navMatch + "']").addClass("active");
		}
		if (this.options.useSidebar || this.options.useResponsiveSidebar)
			$('.subCont').html($('div[title=submenu_items]').html());

		if (this.options.useSidebar) {

			$('.sbBeta').removeClass("responsive");

			$('.page_content').css("width", "700px");
			$('.page_content').css("margin-left", "150px");
			$('.sbBeta').show();
			$('#barmenu').show();



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
			$('#barmenu').hide();
			$('.sbBeta').addClass("responsive");

			if (this.options.useResponsiveSidebar) {
				$('#barmenu').show();
				$('.sbBeta').addClass("responsive");
			}


		}

		if (isResponsive())
			$(".sbBeta").hide();



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

				$(".sbBeta .actionBar").html(this.options.optionbar + "<br style='clear:both'>");
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
		var that = this;

		// Cancel message update timer
		$.doTimeout('messageupdate', false);

		$.get("templates/" + this.options.template + ".html", function(d) {

			var templateData = {};

			if (that.getData != null) {

				templateData = that.getData();

				_.templateSettings.variable = "rc";

			}
			var template = _.template(d, templateData);

			// Problem: Selector may be okay, but element may have changed -> choose $el.selector in stead of el??
			$(that.$el.selector).html(template); //that.$el.selector

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

			$(".sbBeta ul li, .profileTabs ul li, .navMatch ul li").removeClass("active");
			$(that.options.navMatch).addClass("active");


			if (that.postRender != null) {
				that.postRender();



				updateTitle();


			}


		});
		// Set sb beta
		//alert(that.options.navMatch);



		// call prototype.finishredner();


		// if this.getData != null render...
	}
});

function updateTitle() {

	var title = $(".meta[title='title']").text(); // Page Title
	if (title == "")
		title = "&nbsp;";


	$("#responsiveTitle").html(title);

}

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
		updateTitle();
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
	showError: function(code) {
		$("#box_errors div").hide();
		$("#box_errors").hide();
		$("#box_errors").show();
		$("#error" + code).show();
	},

	postRender: function() {

		console.log("set talks height");
		$("#box_errors div").hide();
		$("#box_errors").hide();
	},
	signup: function() {

		var that = this;
		var serverurl = $('#inp_server').val();

		var userid = $("#inp_username").val() + "@" + serverurl;

		var pass = $('#inp_pass').val();
		/*
		TODO: check errors!
			if ($data["password"] != $data["password2"])
			$arr["error"] = 12;
		else if (strlen($data["password"]) < 4 || strlen($data["password"]) >30)
			$arr["error"] = 4;
		else
		*/

		if ($('#inp_pass2').val() != $('#inp_pass').val()) {
			this.showError(12);
			return;

		} else if ($('#inp_pass').val().length < 4 || $('#inp_pass').val().length > 32) {

			this.showError(4);
			return;
		}

		$('#inp_pass2').val("");
		$('#inp_pass').val(""); // DO NOT SERIALIZE PASSWORDS!!

		//reg_salt_set

		apl_request({
			"requests": [{
					"id": "reg_salt_set",
					"userid": userid
				}

			]
		}, function(d2) {


			var hashpass = CryptoJS.SHA256(pass + d2.reg_salt_set.salt).toString(CryptoJS.enc.Base64);
			var s = $("#form_signup").serializeObject();
			s.hashpass = hashpass;

			apl_request({
				"requests": [{
						"id": "user_register",
						"data": s
					}

				]
			}, function(d) {
				var data = d.user_register;


				if (data.error != null) {

					that.showError(data.error);
					// TODO: Scroll to bottom to make sure errors are shown
					$(window).scrollTop(999999);
				} else if (data.success == 1) {



					location.replace('#signup_success');

				}

			}, "", serverurl);
		}, "", serverurl);
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
				}
			}];

			$('#template_certok').show();
			$('#template_certhint').hide();


			var passphrase = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i = 0; i < 20; i++)
				passphrase += possible.charAt(Math.floor(Math.random() * possible.length));



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

			var newpublickeyPEM = CharmeModels.Signature.keyToPem(e.data.n, e.data.e);
			$("#pemkey").val(newpublickeyPEM);


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
		'click #mypostbutton': 'doPost',
		'click #btn_addContext': 'addContext',
		'change #collectionSelector': 'changeCollection'

	},
	addContext: function() {
		$.get("templates/box_context.html", function(d) {
			_.templateSettings.variable = "rc";
			var template = _.template(d, {});

			ui_showBox(template, function() {
				$(".contextItem").click(function() {
					$("#contextContainer .scroller").animate({
						left: -400
					}, 400);
					$("#but_addContext").fadeIn(400);

					var html = CharmeModels.Context.getForm($(this).data("type"));
					$("#contextDetails").html(html);
				});
			});

		});
	},

	doRealPost: function(postText, edgekeys) {



		var myPostKey = "";
		var isEncrypted = 0;
		var fkEncPostKey = "";
		keys = [];
		var postKey;
		if (edgekeys != "-") {



			postKey = randomAesKey(32);
			postText = aes_encrypt(postKey, postText);
			isEncrypted = 1;


			jQuery.each(edgekeys, function() {

				/*
					[_id] => 5405d60b109ce304934ebf7f
					[revisionA] => 4
					[revisionB] => 4
					[revision] => 8
					[rsaEncEdgekey] => 321c2eb37ea301e7358f09203650c8cc25c50986c73479acb55b09cf9d5dd728c14c0519225cb58f8ab1496366361cbf213cc21ad1650d4433f40e19b9f5219e8b1366545ca50c85ac8fb993ead46a79bc48abf3d4425fbc7386ef55376ce731c82920c11468b0c221e21f3cf01cc8e31978e55423b4faf48e2443d264c41b2903f261106707e399ada1bc9d5f13d4790b64b95231f5fd869f1ca20b0f355790197296f9e3f2efa0d76b604ea8d0b8a1ec7af0ec06f489ebf35de628ed50b91327cd2d7262e263321c144834bcd5bf212087d8d00e84afcc0334292b8e24a8316976e28fe1b05ff0d2fea5ee02074b1ddba5e6a428818ac84b89352388c884f7
					[fkEncEdgekey] => U2FsdGVkX1+zQdfHE4qRyl561ChAefAAbA4hfgWe08o+NIsGj0GPmaTp9BWV6ojj

					[userId] => test8@charme.local
					[owner] => test8@charme.local
					[newest] => 1
				*/

				var fastkey = getFastKey(0, 1);
				var edgekey = aes_decrypt(fastkey.fastkey1, this.fkEncEdgekey);
				var postKeyEnc = aes_encrypt(edgekey, postKey);

				fkEncPostKey = aes_encrypt(fastkey.fastkey1, postKey);

				keys.push({
					userId: this.userId,
					key: postKeyEnc,
					revisionB: this.revisionB,
					edgeKeyRevision: this.revision
				});
				if (this.userId == charmeUser.userId)
					myPostKey = postKey;

				//this.fkEncEdgekey
			});
			// Encrypt edgekeys here.

		}


		var that = this;
		var collectionId;
		if (this.options.collectionId == "") // If collection Seletor enabled, get value from collection selector
			collectionId = $("#collectionSelector option:selected:first").data("collectionid");
		else
			collectionId = this.options.collectionId;


		var repostdata;

		if ($('#repostContainer').is(':visible'))
			repostdata = $('#repostContainer').data("postdata");





		var imgFileContent = $('#inp_postImg').data("filecontent");
		
		completePost = function(images){
				var signature = new CharmeModels.Signature(postText + imgFileContent);
		// TODO: encrypt post if collection is encrypted here!		

		// All Data that will be signed with the private key



		var postObj = {
			content: postText,
			collectionId: collectionId,
			isEncrypted: isEncrypted,
			keyRevision: getFastKey(0, 1).revision, // Current Fastkey, needed to get decryption key version.
			repost: repostdata,
			author: charmeUser.userId
		};



		// TODO: encrypt image in encrypted collections!

		var postData = CharmeModels.Signature.makeSignedJSON(postObj);

		console.log("postData");
		console.log(postData);

		console.log(keys);
		//if (x == undefined || x == "")
		if (images == undefined)
		{
			images = [];
			images[200] = "";
			images[900] = "";

		}

		apl_request({
			"requests": [{
				"id": "collection_post",
				"postData": postData,
				"imgdata": images[900],
				"imgthumbdata": images[200],
				"fkEncPostKey": fkEncPostKey,
				"keys": keys
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
			/*
					JSON Dump:
						[_id] => 53b276a2d8cc9ae43b8b4567
					    [post] => Array
					        (
					            [content] => asdasda
					            [collectionId] => 52164bd2d8cc9af2188b4568
					            [imgHash] => e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
					        )

					    [postId] => MongoId Object
					        (
					            [$id] => 53b276a2d8cc9a8b3b8b4567
					        )
						[time]
							sec
							usec
					    [owner] => ms@charme.local
					    [username] => 
				*/

			//var p2 = new control_postItem({
			//	postObj: this,

			postObj.postKey = myPostKey;
			var postItem3 = {
				post: postObj,
				postId: {
					$id: d.collection_post.id
				},
				time: {
					sec: new Date().getTime()
				},
				meta: {
					username: name
				},

			};

			var p2 = new control_postItem({
				//repost: repostdata,
				postObj: postItem3,
				liveAdd: true,

				//postId: d.collection_post.id,
				//username: name,
				layout: layout,
				//time: new Date().getTime(),
				el: $(elid),
				prepend: true,
				hasImage: d.collection_post.hasImage
			});
			p2.render();



		});
		}

		if (imgFileContent != undefined)
		{
			if (isEncrypted == 1)
			{
				
				var srcimg = new Image();
				srcimg.src = imgFileContent.result;
				srcimg.onload = function(){
					imagesTemp = imageManipulate_multiscale(srcimg, [200, 900]);
					
					images = []
					// Encrypt Images:
					  jQuery.each(imagesTemp, function(index, item) {
					  
						images[index] = aes_encrypt(postKey,item);
					});
					completePost(images);
				}
			}
			else
			{
				var srcimg = new Image();
				srcimg.src = imgFileContent.result;
				srcimg.onload = function(){
					images = imageManipulate_multiscale(srcimg, [200, 900]);
					// Encrypt Images:
					imgFileContent = aes_encrypt(postKey,imgFileContent.result);
					console.log(images);
					completePost(images);
				}
			}
		}
		else
			completePost();

	

	},
	doPost: function() {

		var txt = $("#textfield").val();
		var that = this;


		// Check if we need to encrypt the collection
		if (that.options.forceCurrentList != 0 && that.options.forceCurrentList != undefined)
		{

			apl_request({
				"requests": [{
					"id": "edgekeys_bylist",
					"listId": that.options.forceCurrentList,
				}]
			}, function(d) {

				that.doRealPost(txt, d.edgekeys_bylist.value);
			});
		}
		else if ($("#collectionSelector option:selected:first").data("isencrypted") == true) {
			apl_request({
				"requests": [{
					"id": "edgekeys_bylist",
					"listId": $("#collectionSelector").val(),
				}]
			}, function(d) {

				console.log("DGEKEYS");
				console.log(d.edgekeys_bylist);

		

				if (d.edgekeys_bylist.value.length < 1)
				{
					alert("Error: No Public Keys found....");
					return;
				}


				that.doRealPost(txt, d.edgekeys_bylist.value);
			});
		} else
			this.doRealPost(txt, "-");

	},

	render: function() {


		var that = this;

		var addbox = function(that, items) {

			that.$el.append("<textarea class='box' id='textfield' style=' width:100%;'></textarea><div  style='margin-top:8px; display:none;' id='imgPreview'></div><div style='margin-top:8px;'><a type='button' id='mypostbutton' class='button but_postCol' style='margin-right:8px;' value='Post'>Post</a><span id='postOptions'></span><span id='postOptions2'></span></div>");

			$('#postOptions2').append("<input id='inp_postImg' type='file' style='display:none'><a class='cui_imgbutton' id='but_addImg'><i class='fa fa-plus'></i></a><a title='Add Context' class='cui_imgbutton' id='btn_addContext'><i class='fa fa-eye'></i></a><a style='display:none' id='but_remImg'>Remove Image</a>");

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
				$('#postOptions').append("in<select  id='collectionSelector'>" + items + "</select>");

			if (that.options.forceCurrentList!=0 &&that.options.forceCurrentList!=undefined)
			{
				$('#postOptions').append("POSTS ARE ENCRYPTED");
			}


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


					var isEncryptedCollection = "false";
					if (this.currentlist != undefined && this.currentlist != 0)
						isEncryptedCollection = "true";

					items += "<option data-collectionid='" + xssAttr(this._id.$id) + "' data-isencrypted='" + xssAttr(isEncryptedCollection) + "' value='" + xssAttr(this.currentlist) + "'>" + xssAttr(this.name) + "</option>";


				});


				if (d.collection_getAll == 0)
					that.$el.append("Create <a href='#user/" + xssAttr(charmeUser.userIdURL) + "/collections'>a collection</a> to start posting.");
				else {
					addbox(that, items);
				}

				that.changeCollection(); // Make yellow field for encrypted collections

			});


		} else
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
	changeCollection: function() {


		if ($("#collectionSelector option:selected:first").data("isencrypted") == true) {
			$("#collectionSelector").addClass("encrypted");
		} else
			$("#collectionSelector").removeClass("encrypted");



	}

});

control_commentItem = Backbone.View.extend({
	render: function() {
		uniIdCounter++;


		var delitem = "<a data-commentid='" + this.options.commentId + "' id='delete_" + uniIdCounter + "' class='delete'></a>";



		var str = "<div class='comment' id='comment_" + this.options.commentId + "'>" + delitem + "<div class='head'><a href='#/user/" + encodeURIComponent(this.options.userId) + "'>" + this.options.username + "</a></div>" + xssText(this.options.content) + "</div>";
		if (this.options.prepend)
			this.$el.prepend(str);
		else
			this.$el.append(str);

		var that = this;
		// Imporant: Attach event handler AFTER ITEM HAS BEEN ADDED!
		$('#delete_' + uniIdCounter).click(function() {

	
			apl_request({
				"requests": [{
					"id": "comment_delete",
					"commentId": that.options.commentId
				}, ]
			}, function(d) {

				// Remove post from GUI
				$("#comment_" + that.options.commentId).fadeOut(0);

			});



		});


	}
});

var uniIdCounter = 1; // Belongs to control_postItem below:
var repostTemp = null;

/*
        commentCount: this.commentCount,
                    comments: this.comments,
                    like: this.like,
                    counter: this.likecount,
                    repost: this.post.repost,
                    postId: this.postId.$id,
                    username: this.meta.username,
                    userId: this.post.author,
                    content: this.post.content,
                    time: this.meta.time.sec * 1000,
                    hasImage:  this.meta.hasImage
    */

control_postItem = Backbone.View.extend({
	options: {
		prepend: false,
		counter: 0,
		commentCount: 0
	},


	setLikeText: function(itemCounter) {

		$("#counter" + itemCounter).text(this.options.postObj.likecount);
		if (this.options.postObj.like) {
			$("#doLove" + itemCounter).text("Unlove");
		} else {
			$("#doLove" + itemCounter).text("Love");
		}
	},
	addComments: function(items, parentId, prepend) {
		var maxComments = 15;
		var iComments = 0; // !!! Please remove, we will get sued for this name
		var that = this;


		jQuery.each(items, function() {

			iComments++;
			if (iComments > maxComments)
				return;

			// Decrypt content here...
			console.log("COMMENT:");
			console.log(this);


			if (that.options.postObj.post.isEncrypted == 1) {
				this.commentData.object.text = aes_decrypt(that.options.postKey, this.commentData.object.text);
			}

			var item = new control_commentItem({
				content: this.commentData.object.text,
				commentId: this._id.$id,
				"username": this.sendername,
				userId: this.userId,
				prepend: prepend,
				el: $('#postComments' + parentId)
			});


			item.render();
		});

	},
	renderFunction: function(that) {

		// Needed for generating unique element identifiers.,
		uniIdCounter++;


		//Use uniId inside events like .click() etc., because uniIdCounter is global!!
		var uniId = uniIdCounter;
		var postObj = this.options.postObj;
		var that = this;



		var repoststr = "";
		var liksstr = "<div class='likes'><a class='counter' id='counter" + uniIdCounter + "'>0</a></div>";


		if (this.options.postObj.post.repost != null)
			repoststr = " reposts <a href='#user/" + encodeURIComponent(this.options.postObj.post.repost.userId) + "/post/" + this.options.postObj.post.repost.postId + "'>" + this.options.postObj.post.repost.username + "'s post</a> <div class='repost'>" + $.charmeMl(xssText(this.options.postObj.post.repost.content)) + "</div>";

		var str;
		var imgcont = "";
		var delitem = "<a id='del_post_" + uniIdCounter + "' class='delete'></a>";

		if (this.options.postObj.meta.hasImage) {
			//


			// <a target='_blank' href='http://" + xssAttr(this.options.postObj.post.author.split("@")[1]) + "/charme/fs.php?type=post&size=800&post=" + xssAttr(this.options.postObj.postId.$id) + "'>

			imgcont = "<div style='margin-bottom:8px'><img id='img_"+postObj.postId.$id+"'></div>";
			
			var url = "http://" + this.options.postObj.post.author.split("@")[1] + "/charme/fs.php?type=post&size=250&post=" + this.options.postObj.postId.$id;

			console.log(url);
			$.get(url, function(d){

				if (that.options.postObj.post.isEncrypted == 1)
					$("#img_"+postObj.postId.$id+"").attr("src", aes_decrypt(that.options.postKey, d));
				else
				$("#img_"+postObj.postId.$id+"").attr("src", d);


				
			});
		}



		if (that.options.layout == "stream") {



			var postUser = new apl_user(that.options.postObj.post.author);
			// 
			str = "<div class='collectionPost' id='post_" + that.options.postId + "'>" +
				"<a href='#user/" + postUser.userIdURL + "'><img class='profilePic' src='" + postUser.getImageURL(64) + "'></a>" + "<div class='subDiv'>" + liksstr + delitem + "<a href='#user/" + postUser.userIdURL + "'>" + xssText(that.options.postObj.meta.username) + "</a>" + repoststr + "<div class='cont selectable'>" + imgcont + $.charmeMl(xssText(that.options.postObj.post.content)) + "</div><div class='postoptions'><a id='doLove" + uniId + "'>Love</a><!-- - <a id='doRepost" + uniId + "'>Repost</a>--> - <a id='checkSignature_" + uniId + "'>Check Signature</a> -  <span class='time'>" + formatDate(that.options.postObj.time) + "</span></div>";
		} else
			str = "<div class='collectionPost' id='post_" + that.options.postObj.postId.$id + "'>" + repoststr + "<div class='cont selectable' style='padding-top:0'>" + imgcont + liksstr + delitem + "" + $.charmeMl(xssText(this.options.postObj.post.content)) + "</div><div><a id='doLove" + uniId + "'>Love</a><!--- <a id='doRepost" + uniId + "'>Repost</a>--> - <span class='time'>" + formatDate(that.options.postObj.time) + "</span>";



		str += "<div class='commentBox' id='commentBox" + xssAttr(uniId) + "'><div class='postcomments' id='postComments" + xssAttr(uniId) + "'></div><input id='inputComment" + xssAttr(uniId) + "' class='box' type='text' style='width:250px; margin-top:1px;' placeholder='Write a comment'><br></div>"; //<a class='button' id='submitComment"+uniIdCounter+"'>Write Comment</a>
		str += "</div></div>";


		if (that.options.prepend)
			that.$el.prepend(str);
		else
			that.$el.append(str);



		$("#checkSignature_" + uniIdCounter).click(function() {
			CharmeModels.Signature.showDialog();
		});
		// REgister event handler AFTER HTML has been added
		$("#del_post_" + uniIdCounter).click(function() {

			// TODO: ARE YOU SURE?

			var signature = CharmeModels.Signature.makeSignedJSON({
				postId: that.options.postId,
				action: "delete_post"
			});


			// Send request for post deletion to server
			apl_request({
				"requests": [{
					"id": "post_delete",
					"postId": that.options.postObj.postId.$id,
					"signature": signature
				}, ]
			}, function(d) {

				// Remove post from GUI
				$("#post_" + that.options.postObj.postId.$id).fadeOut(0);

			});

		});

		that.setLikeText(uniIdCounter);

		$("#doLove" + uniId).data("uniid", uniId);

		$("#doLove" + uniId).click(function() {


			var that2 = this;
			NProgress.start();
			// Send like request to post owner:
			apl_request({
				"requests": [
					// Get posts of collection
					{
						"id": "post_like",
						"userId": that.options.postObj.post.author,
						status: !! !that.options.postObj.like,
						postId: that.options.postObj.postId.$id
					},
					// Get name of collection

				]
			}, function(d) {

							NProgress.done();

				if (that.options.postObj.like) {
					that.options.postObj.likecount--;
					that.options.postObj.like = false;
				} else {
					that.options.postObj.likecount++;
					that.options.postObj.like = true;
				}

				that.setLikeText($(that2).data("uniid"));

			});

		});

		

		// append some comments
		var itemStartTime;
		if (that.options.postObj.comments != undefined && that.options.postObj.comments.length > 0) {


			that.addComments(that.options.postObj.comments, uniId, false);
			itemStartTime = that.options.postObj.comments[0].itemTime.sec;

		}



		if (that.options.postObj.commentCount > 3)
			$('#commentBox' + uniId).prepend("<a class='morecomments'>More</a>"); //data-start=TotalComments-6

		



		$('#commentBox' + uniId + " .morecomments").click(function() {



			if (that.options.start == undefined) {
				that.options.start = that.options.postObj.commentCount - 6;
				if (that.options.start < 0)
					that.options.start = 0;
			}


			var limit = 3;

			if (that.options.start == 0) {

				limit = that.options.postObj.commentCount % limit;

			}

			NProgress.start();
			apl_request({
				"requests": [{
					"id": "comments_get",
					"postowner": that.options.postObj.post.author,
					"itemStartTime": itemStartTime,
					"start": that.options.start,
					"limit": limit,
					"postId": that.options.postObj.postId.$id
				}, ]
			}, function(d) {
				NProgress.done();
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

			}, "", that.options.postObj.post.author.split("@")[1]);

		});



		$("#inputComment" + uniId).unbind("keypress").keypress(function(e) {

			// Send comment when pressing return key
			if (e.which == 13) {

				var content = $("#inputComment" + xssAttr(uniId)).val();
				var contentRaw = content; // Used for displaying text.
				var that2 = that;

				if (that.options.postObj.post.isEncrypted == 1) {

					if (that.options.postObj.post.postKey != undefined) {
						// Post Control item was added after post click
						content = aes_encrypt(that.options.postObj.post.postKey, content);
					} else if (that.options.postKey != undefined) {
						// Post Control was added after stream was loaded
						content = aes_encrypt(that.options.postKey, content);
					} else {
						return;
					}

				}
				// Make signed comment object.
				var commentData = CharmeModels.Signature.makeSignedJSON({
					"text": content,
					"postId": that.options.postObj.postId.$id,
					"userId": that.options.postObj.post.author

				});


				apl_request({
					"requests": [{
						"id": "post_comment",
						"commentData": commentData,

					}, ]
				}, function(d) {
					var item2 = new control_commentItem({
						"content": contentRaw,
						"username": d.post_comment.username,
						userId: 0,
						el: $('#postComments' + uniId),
						commentId: d.post_comment.commentId
					});
					item2.render();
					$("#inputComment" + xssAttr(uniId)).val("");

				});

			}
		});



		$("#doRepost" + uniId).click(function() {

			repostTemp = {
				userId: that.options.postObj.post.author,
				postId: that.options.postObj.postId.$id,
				content: that.options.postObj.content,
				username: that.options.postObj.username
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
							postId: that.options.postObj.postId.$id
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

				, "", that.options.postObj.post.author.split("@")[1]);


		});



	}, // Render Function end


	render: function() {

		var postObj = this.options.postObj;
		var that = this;

		if (that.options.isCollectionView)
		{
			if (that.options.postKey != "")
			{
			that.options.postObj.post.content = aes_decrypt(that.options.postKeyTemp, that.options.postObj.post.content);
			that.options.postObj.post.postKey = that.options.postKeyTemp;
}

			that.renderFunction(that);
		}
		else if (this.options.postObj.post.isEncrypted == 1 && !this.options.liveAdd) {



			// If we do not have the edgekey yet, then get it and decrypt it!
		

			apl_request({
				"requests": [{
					"id": "edgekey_request",
					"publicKeyOwner": that.options.postObj.post.author,
					"revision": this.options.postObj.edgeKeyRevision,
					"privateKeyOwner": charmeUser.userId, // This is me
				}, ]
			}, function(data) {
				// Decrypt public key with fk1 first
				console.log("EDGEKEYREQ");
				console.log(data);
				fk1 = getFastKey(0, 1);

			
			//	var pubkey = $.parseJSON(aes_decrypt(fk1.fastkey1, data.edgekey_request.data.value));
			//	console.log(pubkey);

				//alert(postObj.postKey);

				var edgeKey = (crypto_rsaDecryptWithRevision(data.edgekey_request.data.rsaEncEdgekey, data.edgekey_request.data.revisionB));

				// 

				var postKey = aes_decrypt(edgeKey, postObj.postKey);
				var text = aes_decrypt(postKey, postObj.post.content)
				console.log(postObj);

				that.options.postKey = postKey;


				that.options.postObj.post.content = text;

				that.renderFunction(that);

			}, "", that.options.postObj.post.author.split("@")[1]);

		} else if (this.options.liveAdd && this.options.postObj.post.isEncrypted == 1) {
		
			that.options.postObj.post.content = aes_decrypt(that.options.postObj.post.postKey, that.options.postObj.post.content);
			that.renderFunction(that);
		} else
			that.renderFunction(that);



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

		if (this.options.streamId == "") {
			var t = new control_postField({
				el: $("#postFieldContainer"),
				collectionId: ""
			});
			t.render();
		} else
			$("#postFieldContainer").hide();



		apl_request({
			"requests": [{
				"id": "stream_get",
				list: this.options.streamId
			}]
		}, function(d2) {

			// generate post controls...
			jQuery.each(d2.stream_get, function() {


				/*
					JSON Dump:
						[_id] => 53b276a2d8cc9ae43b8b4567
					    [post] => Array
					        (
					            [content] => asdasda
					            [collectionId] => 52164bd2d8cc9af2188b4568
					            [imgHash] => e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
					        )

					    [postId] => MongoId Object
					        (
					            [$id] => 53b276a2d8cc9a8b3b8b4567
					        )
						[time]
							sec
							usec
					    [owner] => ms@charme.local
					    [username] => 
				*/

				var p2 = new control_postItem({
					postObj: this,
					layout: "stream",
					el: $("#streamContainer"),
					prepend: false,
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
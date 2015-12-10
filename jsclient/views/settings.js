var charme_global_pictureAppendix = ""; // This is appended to profile image src to avoid reloading

var view_settings_pwchange = view_subpage.extend({


	events: {


	},
	postRender: function() {

		$("#but_savePassword").click(function() {
			NProgress.start();
			var oldpass = $("input[name=inp_oldpassword]").val();
			var newpass = $("input[name=inp_newpassword]").val();


			if (newpass != $("input[name=inp_newpassword2]").val()) {
				alert("New passwords do not match...");
				return;
			}
			else if (newpass.length<5)
			{
				alert("Password is to short...");
				return;
			}
			apl_request({
				"requests": [{
						"id": "reg_salt_get",
						"userid": charmeUser.userId
					}

				]
			}, function(d2) {

				var hashpassOld = CryptoJS.SHA256(oldpass + d2.reg_salt_get.salt).toString(CryptoJS.enc.Base64);

				var hashpassNew = CryptoJS.SHA256(newpass + d2.reg_salt_get.salt).toString(CryptoJS.enc.Base64);




				apl_request({
					"requests": [{
							"id": "reg_changepassword",
							"oldPasswordHash": hashpassOld,
							"newPasswordHash": hashpassNew
						}

					]
				}, function(d) {
					if (d.reg_changepassword.STATUS == "WRONG_PASSWORD")
					{
						alert("Old password is incorrect.");
						$("input[name=inp_oldpassword]").focus();
					}
					else if (d.reg_changepassword.STATUS == "OK")
					{
						alert("Password has been changed successfully. Will now logout...");
						delTemp();
						logout();
					}

					NProgress.done();
					console.log(d);
				});


			});
		});

	}
});


var view_settings_locationmanager = view_subpage.extend({


	events: {


	},
	getData: function() {
		console.warn(this.options.data);
		if (this.options.data != undefined)
			return this.options.data;
		else
			return {};

	},
registerClick: function() {
	$(".locations a ").click(function(){
		var that=this;
		 apl_request({
			 "requests": [{
				 "id": "simpleStore",
				 "action": "delete",
				 "class": "location",
				 "itemId": $(this).data("locationid")
			 }]
		 }, function(d22) {
			 $(that).parent().remove();
		});
	});
},
	postRender: function() {
		global_addLocation("#map", this.registerClick, true);
		this.registerClick();
	}
});


var view_settings_keymanager = view_subpage.extend({


	events: {


	},
	postRender: function() {

		/*<a style='float:right;' href="javascript:requestNewKey('ms@charme.local')">Check for new key</a>Manuel S. (ms@charme.local)
	<br>
	Public Key: <b>12109jd01d9j1d9dn1kjbk1jbkdjb</b> Revision: <b>1</b>
*/

		var fastkey = getFastKey(0, 1);
		var key = getKeyByRevision(0);
		var text = CryptoJS.SHA256(key.rsa.rsa.n).toString(CryptoJS.enc.Base64);


		$("#mypub").text(text);
		$("#myrev").text(key.revision);

		// Here we may get a problem if fastkey is too old.


		var elementId = 0;

		jQuery.each(this.options.data.key_getAll.items, function(index, item) {
			elementId++;


			var text = item.key.obj.fingerprint;


			var username =item.key.obj.username;
			var userId = item.key.obj.publicKeyUserId;

			hmac = " <span style='color:red'>HMAC Verification failed!</span>";
			if (crypto_hmac_check(item.key))
			hmac = "";

			var key = " - REVISION: " + item.key.obj.publicKeyRevision + "  "+hmac+ "<br>" + text;

			$("#keys").append("<div id='key_" + elementId + "'><b>" + userId + "</b><span style='word-wrap: break-word;'>" + key + "</span></div><br>");

			$("#key_" + elementId).prepend($('<a style="float:right;">Get new key</a>').click(function() {
					requestNewKey(userId);

				})

			);


		});



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

		NProgress.start();
		apl_request({
			"requests": [{
					"id": "profile_imagechange",
					"data": $('#profileImgFileUp').data("filecontent").result
				}

			]
		}, function(d) {


		 var src = 'http://' + charmeUser.server + '/charme/fs.php?s=150&u=' + (charmeUser.userIdURL) + '&'+d.profile_imagechange.random;
		charme_global_pictureAppendix = d.profile_imagechange.random;
			$("#profileImage").attr("src", src);
			NProgress.done();

		});

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
		NProgress.start();
		apl_request({
			"requests": [{
					"id": "profile_save",
					"data": s
				}

			]
		}, function(d) {


			NProgress.done();
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

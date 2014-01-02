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


		var elementId = 0;

		jQuery.each(this.options.data.key_getAll.items, function(index, item) {
			elementId++;

			// Descrypt key directory value here



			// alert(passphrase);
			var aesstr = aes_decrypt(fastkey.fastkey1, item.value);

			var aesobj = $.parseJSON(aesstr);

			console.log("ELEMETNT");
			console.log(aesobj);
			//var obj = aes_decrypt(passphrase, item.value);

			var text = CryptoJS.SHA256(aesobj.key.n).toString(CryptoJS.enc.Base64);


			var username = "test";
			var userId = aesobj.userId;
			var key = " - REVISION " + aesobj.revision + "<br>" + text;

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


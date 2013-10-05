var view_settings_keymanager = view_subpage.extend({


	events: {


	},
	postRender: function() {

		/*<a style='float:right;' href="javascript:requestNewKey('ms@charme.local')">Check for new key</a>Manuel S. (ms@charme.local)
	<br>
	Public Key: <b>12109jd01d9j1d9dn1kjbk1jbkdjb</b> Revision: <b>1</b>
*/


		
		var sesPass = localStorage.getItem("sessionPassphrase");

		var passphrase = (aes_decrypt(charmeUser.sessionId, sesPass));

		var key = getKeyByRevision(0);
		$("#mypub").text(key.rsa.n);
		$("#myrev").text(key.revision);

		

		var elementId = 0;




		jQuery.each(this.options.data.key_getAll.items, function(index, item) {
			elementId++;

			// Descrypt key directory value here
		

			// alert(passphrase);
			var aesstr = aes_decrypt(passphrase, item.value);

			var aesobj = $.parseJSON(aesstr);
			
			console.log("ELEMETNT");
			console.log(aesobj);
			//var obj = aes_decrypt(passphrase, item.value);



			var username = "test";
			var userId = aesobj.userId;
			var key = " - REVISION X<br>" + aesobj.key.n;

			$("#keys").append("<div id='key_" + elementId + "'><b>" + userId + "</b><span style='word-wrap: break-word;'>" + key + "</span></div><br>");

			$("#key_" + elementId).prepend($('<a style="float:right;">Get new key</a>').click(function() {
					requestNewKey(userId);

				})

			);


		});



	}
});

function makeNewKey(userId) {
	$.get("templates/box_newkey.html", function(d) {

		var templateData = {};

		_.templateSettings.variable = "rc";
		var template = _.template(d, templateData);

		ui_showBox(template, function() {
			// Click handler on alert.
			// Recryption Process: DO NOT create an extra function to prevent URL execution.


			// Generate certificate
			var worker = new Worker("lib/crypto/thread_makeSignature.js");
			$("#but_makecert").text("Please Wait...");


			//alert(rsa.n.toString(16));
			$('#but_box_save').click(function() {
				// Request to server, get keyring..., send password
				var password = $('#inp_password').val();
				var passphrase = $('#inp_passphrase').val();

				if ($("#rsa").val() == "") {
					alert("Please wait until passphrase is generated.");
					return;

				}

				apl_request({
					"requests": [{
						"id": "key_update_phase1",
						"password": password
					}, ]
				}, function(d) {



					if (d.key_update_phase1.error) {
						alert("Wrong password.");
					} else {
						// Decrypt old keyring with old passphrase
						var keyring = [];
						var error = false;

						if (d.key_update_phase1.keyring == null ||
							d.key_update_phase1.keyring == "") {

						} else {
							try {

								var dec = aes_decrypt(passphrase, d.key_update_phase1.keyring);

								alert(dec);

								keyring = jQuery.parseJSON(dec);
							} catch (err) {
								console.log("ERROR:");
								console.log(err);
								error = true;
								alert("Wrong passphrase given.");
							}


						}

						if (!error) {
							var maxrev = 0;

							// Get revision
							jQuery.each(keyring, function(index, item) {
								if (item.revision > maxrev) maxrev = item.revision;
							});
							// Increment revision
							maxrev = maxrev + 1;



							// Add new RSA key, get json first
							var rsa = jQuery.parseJSON($("#rsa").val());


							keyring.push({
								revision: maxrev,
								rsa: rsa
							});

							console.log("KEYRING");
							console.log(rsa);

							// Convert JSON to string
							keyring = JSON.stringify(keyring);

							// Encrypt keyring with new passphrase
							var key = $("#template_certkey").text();
							var newkeyring = aes_encrypt(key, keyring);


							var newpublickey = {
								revision: maxrev,
								publickey: {
									n: rsa.rsa.n,
									e: rsa.rsa.e
								}
							};

							// Now start phase 2
							apl_request({
								"requests": [{
									"id": "key_update_phase2",
									"password": password,
									"newkeyring": newkeyring,
									"publickey": newpublickey
								}, ]
							}, function(d) {
								alert("Update sucessful, will now logout");
							});
						}
					}
				});
			});

			worker.onmessage = function(e) {

				//n, e, d, p, q, dmp1, dmq1, coeff
				var certificate = {
					version: 1,
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
				};
				console.log("certificate is");
				console.log(JSON.stringify(certificate));


				$('#template_certok').show();
				$('#template_certhint').hide();


				var passphrase = "";
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

				for (var i = 0; i < 20; i++)
					passphrase += possible.charAt(Math.floor(Math.random() * possible.length));



				console.log(JSON.stringify(certificate));


				// Encrypt certificate with passpharse
				var tt = JSON.stringify(certificate);

				var pub = {
					"n": e.data.n,
					"e": e.data.e
				};

				$("#pubkey").val(JSON.stringify(pub));
				$("#template_certkey").text(passphrase);

				$("#rsa").val(tt);

			};


			worker.postMessage("");



		});
	});


}



function requestNewKey(userId) {



	var user = userId.split("@")[0];
	var server = userId.split("@")[1];


	// Make request to users server to get Key and username
	apl_request({
		"requests": [{
			"id": "key_get",
			"profileId": userId
		}, {
			"id": "profile_get_name",
			"userId": userId
		}]
	}, function(d) {

		// Get template
		var key = d.key_get.publickey;

		$.get("templates/box_requestkey.html", function(d2) {


			var templateData = {
				key: key.n,
				userId: userId,
				revision: d.key_get.revision
			};

			_.templateSettings.variable = "rc";
			var template = _.template(d2, templateData);



			console.log("key");
console.log(templateData);
			// more info click handler


			ui_showBox(template, function() {

				// Make request to my server to check revision and get encrypted public key

				var sesPass = localStorage.getItem("sessionPassphrase");

				var passphrase = (aes_decrypt(charmeUser.sessionId, sesPass));

				// Build key hash
				var e_key = CryptoJS.SHA256(passphrase + userId).toString(CryptoJS.enc.Base64);



				apl_request({
					"requests": [{
						"id": "key_getFromDir",
						"key": e_key
					}, ]
				}, function(d3) {


					if (d3.key_getFromDir.value != null) {



						console.log(d3.key_getFromDir.value);

						var oldValue = $.parseJSON(aes_decrypt(passphrase, d3.key_getFromDir.value));


						if (oldValue.key.n != key.n)
							$("#keyChanged").show();
						else
							$("#keySame").show();


					} else
						$("#keyNew").show();
					// Get public key if exists
					// The key is AES encrypted with passphrase
					// So 

					// On click button
					$('#but_box_save').click(function() {



						// Build value hash
						var e_value = aes_encrypt(passphrase, JSON.stringify({
							key: key,
							userId: userId
						}));


						apl_request({
							"requests": [{
								"id": "key_storeInDir",
								"key": e_key,

								"value": e_value
							}, ]
						}, function(d4) {


							// Sucess is here.,
							ui_closeBox();
						});


						// Encrypt new key with passphrase

					});

				});



			});
		});

	}, "", server);



}

function acceptKey(userId) {

}

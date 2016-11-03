function mkqrcode() {
	var key = getKeyByRevision(0);
	ui_showBox("<div class='p32' id='qrcode'>" + "</div>" + "<div class='p32' style='padding-top:0'>" + ui_closeBoxButton() + "</div>", function() {});
	new QRCode(document.getElementById("qrcode"), "FINGERPRINT");

}

/// Increase Key Revision Validator
function keymanager_increaseKRC(value)
{

}
function keymanager_checkRevCounter(callback)
{
	$.get("templates/box_askrc.html", function(d) {

		var templateData = {};

		_.templateSettings.variable = "rc";
		var template = _.template(d, templateData);
		ui_showBox(template, function() {

			 $("#box_info_ok").click(function()
			 	{
			 		ui_closeBox();
			 		 if(callback != undefined && typeof callback == 'function') callback();
			 	});
		});
	});
}


function updateDataOK() {

	apl_request({
	"requests": [{
		"id": "key_update_recrypt_getData"
		}]
	}, function(d) {

		$("#upddatalog").html("Update Data...");

		var rsaKeyNewest = getKeyByRevision(0);
		var currentFastKey1 =  rsaKeyNewest.fastkey1;
		var currentFastKey2 =  rsaKeyNewest.fastkey2;

		var recryptedData = {
			"conversations" : [],
			"keydirectory" : [],
			"pieces" : [],
			"piecebuckets" : []
		};

		// d.key_update_recrypt_getData.data.conversations
		$.each(d.key_update_recrypt_getData.data.conversations, function(index, item) {

			//if (this.revision < rsaKeyNewest.revision)
			{
				var rsakey = getKeyByRevision(this.revision).rsa.rsa;

				var newAesTemp = crypto_rsaDecrypt(this.aesEnc, rsakey);
				var newAesEnc = crypto_rsaEncrypt(newAesTemp, rsaKeyNewest.rsa.rsa);

				recryptedData["conversations"].push({id: this._id.$id, aesEnc: newAesEnc, revision: rsaKeyNewest.revision });
			}
		});

		$.each(d.key_update_recrypt_getData.data.pieces, function(index, item) {

			//if (this.value.revision < rsaKeyNewest.revision)
			{
				var fastkey = getFastKey(this.value.revision, 1);



				var newAesTemp = aes_decrypt(fastkey.fastkey1, this.value.aesEnc);



				var newAesEnc = aes_encrypt(rsaKeyNewest.fastkey1, newAesTemp);
				recryptedData["pieces"].push({id: this._id.$id, aesEnc: newAesEnc, revision: rsaKeyNewest.revision });
			}
		});


		$.each(d.key_update_recrypt_getData.data.keydirectory, function(index, item) {

			//if (this.fkrevision < rsaKeyNewest.revision)
			{

				var fastkey = getFastKey(this.fkrevision, 1);
				var newAesTemp = aes_decrypt(fastkey.fastkey1, this.value);
				var newValue = aes_encrypt(rsaKeyNewest.fastkey1, newAesTemp);
				var edgekeyTemp = aes_decrypt(fastkey.fastkey1, this.fkEncEdgekey);
				var edgekeyNew =  aes_encrypt(rsaKeyNewest.fastkey1, edgekeyTemp);

				var rsaKey = $.parseJSON(newAesTemp);

				rsa = new RSAKey();
				rsa.setPublic(rsaKey.key.n, rsaKey.key.e);
				rsaEncKey = rsa.encrypt(edgekeyTemp);

				//console.log(newAesTemp);
				//var newAesEnc = crypto_rsaEncrypt(newAesTemp, rsaKeyNewest.rsa.rsa);
				recryptedData["keydirectory"].push({rsaEncEdgekey: rsaEncKey, id: this._id.$id, fkEncEdgekey: edgekeyNew, value: newValue, revision: rsaKeyNewest.revision });
			}
		});

		$.each(d.key_update_recrypt_getData.data.pieceBucketItems, function(index, item) {

			//if (this.fkrevision < rsaKeyNewest.revision)
			{
				/*

					bucketkey: Object
					data: "720cfafabced36" (rsa encrypted)
					revision: 2
				*/


				try
				{
								console.log("REV 4 is"+this.bucketkey.revision);

				var rsakey = getKeyByRevision(this.bucketkey.revision).rsa.rsa;
				var newAesTemp = crypto_rsaDecrypt(this.bucketkey.data, rsakey); // Is null if
						console.log(rsakey);

				var newAesEnc = crypto_rsaEncrypt(newAesTemp, rsaKeyNewest.rsa.rsa);

				console.log("UPDATED dir DATA:");
				console.log({id: this._id.$id, bucketkeyData: newAesEnc, revision: rsaKeyNewest.revision });

				recryptedData["piecebuckets"].push({id: this._id.$id, bucketkeyData: newAesEnc, revision: rsaKeyNewest.revision });
				}
				catch(exeption){
					console.log("CRITICAL WARNING: ID "+this._id.$id+ "could not be recrypted: "+exeption);
				}

			}
		});

		console.log("RECRYPTED DATA IS");
		console.log(recryptedData);

		NProgress.start();

		apl_request({
			"requests": [{
				"id": "key_update_recrypt_setData",
				"recryptedData": recryptedData
			}, ]
		}, function(d) {

			NProgress.done();
			ui_closeBox();
		});





		// missing: keydirectory



	});




}

function updateData() {


	$.get("templates/box_updatedata.html", function(d) {

		var templateData = {};

		_.templateSettings.variable = "rc";
		var template = _.template(d, templateData);
		apl_request({
			"requests": [{
					"id": "key_getAllFromDir"

				}

			]
		}, function(d1) {
			console.log(d1);

			ui_showBox(template, function() {

				// Get fastkey1 of revision used here.

				// This is the object we will send to the server later on
				var updData = {
					keys: [],
					buckets: [],
					messages: []
				};

				// Iterate to all keys and recrypt them.
				$.each(d1.key_getAllFromDir.value, function(index, item) {


					var fastkey = getFastKey(item.fkrevision, 1);
					var fastkeynew = getFastKey(0, 1);
					console.log("ITEM");

					// ONLY FOR DEBUG <=, RELEASE MUST BE <
					if (fastkey.revision <= fastkeynew.revision) {
						// Decrypt value witzh old key
						var plain = aes_decrypt(fastkey.fastkey1, this.value);

						// Encrypt value with new key
						var newval = aes_encrypt(fastkeynew.fastkey1, plain);

						console.log("NEWENC:" + newval);

						updData["keys"].push({
							oldId: item._id.$id,
							newval: newval
						});
					}
				});

				console.log(updData);

				// Register OK click event

			});
		});
	});


	// box_updatedata.html
}



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
							"id": "reg_salt_get",
							"userid": charmeUser.userId
						}

					]
				}, function(d2) {

					var hashpass = CryptoJS.SHA256(password+d2.reg_salt_get.salt).toString(CryptoJS.enc.Base64);

					apl_request({
						"requests": [{
							"id": "key_update_phase1",
							"password": hashpass
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

								var fastkey1 = randomAesKey(32);
								var fastkey2 = randomAesKey(32);

								var randomsalt1 = randomSalt(32);
								var randomsalt2 = randomSalt(32);

								keyring.push({
									revision: maxrev,
									fastkey1: fastkey1,
									fastkey2: fastkey2,
									randomsalt1: randomsalt1,
									randomsalt2: randomsalt2,
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
								var newpublickeyPEM = CharmeModels.Signature.keyToPem(rsa.rsa.n, rsa.rsa.e);

								// Now start phase 2
								apl_request({
									"requests": [{
										"id": "key_update_phase2",
										"password": hashpass,
										"newkeyring": newkeyring,
										"publickey": newpublickey,
										"pemkey":newpublickeyPEM
									}, ]
								}, function(d) {
									alert("Update sucessful, will now logout. Next you should recrypt your data from this page on.");
								});
							}
						}
					});
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


// This function shows a box prompting for verification of the public key belonging to a certain user
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

			var text = CryptoJS.SHA256(key.n).toString(CryptoJS.enc.Base64);

			// Setup the popup html template
			var templateData = {
				key: text, // This is a SHA key!
				userId: userId,
				revision: d.key_get.revision
			};
			_.templateSettings.variable = "rc";
			var template = _.template(d2, templateData);

			ui_showBox(template, function() {

				// Make request to my server to check revision and get encrypted public key

				// The keys are encrypted with fastkey1,
				// This is one of Charmes symmetric key only known by the user, not by the server
				var fastkey = getFastKey(0, 1);

				// Build key hash
				var e_key = CharmeModels.Keys.mapDirectoryKey(userId);

				apl_request({
					"requests": [{
						"id": "key_getFromDir",
						"key": e_key
					}, ]
				}, function(d3) {

					if (d3.key_getFromDir.value != null) {
						var oldValue = $.parseJSON(aes_decrypt(fastkey.fastkey1, d3.key_getFromDir.value));
						if (oldValue.key.n != key.n)
							$("#keyChanged").show();
						else
							$("#keySame").show(); // If the key has not changed we do not need to update it!
					} else
						$("#keyNew").show();


					$('#but_box_save').click(function() { // Register button event

						var requestObject = CharmeModels.Keys.makeKeyStoreRequestObject(
								key, // The public key
								d.key_get.revision, // Revision of public key
								userId, // User id of currently logged in user
								d.profile_get_name.info.firstname + ' ' + d.profile_get_name.info.lastname // The username
							);
							
						apl_request({
							// (publicKey, addedPublicKeyRevision,  currentUserId, username) -


							"requests": [requestObject]
},						function(d4) {

							//
							// All data previously which was
							// encrypted with the old edgekey needs to be decrypted with the old edgekey
							// and encrypted with the new one.
							//

							apl_request({
								"requests": [{
									"id": "edgekey_recrypt_getData",
									"userId": userId

								}, ]
							}, function(d5) {



								newpostkeys = [];
								$.each(d5.edgekey_recrypt_getData.data.postKeys, function(index, item) {
									var postkey = aes_decryptWithFastKey1(item.fkEncPostKey, item.postData.signature.keyRevision);
									newpostkeys.push({postId: this._id.$id, postKeyEnc: aes_encrypt(requestObject.fkEncEdgekey, postkey.message)});
								});

								apl_request({
									"requests": [{
										"id": "edgekey_recrypt_setData",
										"userId": userId,
										"newPostKeys": newpostkeys,

									}, ]
								}, function(d5) {
									// Sucess is here.,
									ui_closeBox();

									// Allow sending messages and adding to lists on profile
									$(".but_sendMsg").show();
									$(".but_verifyKey").hide();
									$(".but_verifyKey2").show();

									if (userId != charmeUser.userId) // Can not add myself to a list
										$("#profileListBox").show();

								});
							});
						});
					});
				});
			});
		});

	}, "", server);
}

function acceptKey(userId) {

}

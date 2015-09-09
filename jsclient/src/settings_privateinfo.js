var view_settings_privateinfo_requests = view_subpage.extend({
	postRender: function()
	{

			$(".btnDecline").click(function() {
				var that = this;
				var key = ($(this).parent().data("key"));
				var userId = ($(this).parent().data("invader"));

				apl_request({
						"requests": [{
							"key" : key ,// Information Key, like "phone" or "hometown"
							"id": "piece_request_deny",
							"userid" : userId,
					}, ]
						}, function(d2) {
							if (d2.piece_request_deny.OK == 1)
							$(that).parent().parent().remove();
						});


			});


		// Attach click events
		$(".btnAccept").click(function() {

			var that = this;
			var key = ($(this).parent().data("key"));
			var userId = ($(this).parent().data("invader"));

			// Generate Random AES, this key will ONLY be used if a new Bucket is created.
			var mykey  = randomAesKey(32);


			// Encrypt AES Key with fastkey1
			var fastkey = getFastKey(0, 1);
			var aesEnc = crypto_encryptFK1(mykey).message;

			/// APL GET AES HERE!

			// This request gets a bucket id of a free bucket
			// Also we get the public key of the user.

			/// key hash is used to query the public key directory
			// Build key hash
			var e_key = CryptoJS.SHA256(fastkey.fastkey1 + userId).toString(CryptoJS.enc.Base64);


			apl_request({
				"requests": [{
					"id": "piece_request_findbucket",
					"bucketaes": aesEnc,
					"userid" : userId, // Not necessary?
					"key" : key
				},

				{
					"id": "key_getFromDir",
					"userId": userId, // This is the public key, this is not the piece key!

				},

				// Get all piece to encrypt bucketcontent with bucketaes
				{
					"id": "piece_request_single",
					"key": key,

				}

				 ]
			}, function(d) {

				// Encode aes to decrypt information with
				// public key
				if (d.key_getFromDir.key == null)
				{
					alert("Key not found in key directory. Please add user to key directory.");
				}
				else
				{
					console.warn(d.key_getFromDir);
					if (!crypto_hmac_check(d.key_getFromDir.key)) {
						alert("Error: HMAC verification failed.");
						return;
					}
					var mainObj = d.key_getFromDir.key.obj;
					var edgekeyWithFK = crypto_decryptFK1(mainObj.edgekeyWithFK); // TODO!

					if (mainObj.publicKeyUserId != userId)
					{
						alert("Userid does not match. Your server returned public key of another user.");
					}
					else
					{
						// Now we encrypt the bucket AES with the RSA Key
						// Make RSA Object

						var rsa = mkRSAPublic(mainObj.publicKey);

						console.warn(d.piece_request_findbucket);
						// Get the real bucket AES and decrypt with fastkey. DO NOT USE aesENC as we do not know if it was accepted
						var bucketaes= crypto_decryptFK1(d.piece_request_findbucket.bucketaes).message;

						// Rsa encrypted key to decrypt private information for users
						var rsabucketkey = {data: rsa.encrypt(bucketaes), revision :mainObj.publicKeyRevision }; // TODO: HMAC needed?
						var piecedata = "";


						if (d.piece_request_single.value != null)
						{
							var piecedataRAW = decryptField(d.piece_request_single.value);
							// Encrypt piece data
							var piecedata = aes_encrypt(bucketaes, piecedataRAW);
						}

						// Now we have a key bucket. Now
						apl_request({
						"requests": [{
							"key" : key ,// Information Key, like "phone" or "hometown"
							"id": "piece_request_accept",
							"userid" : userId,
							"piecedata" : piecedata,
							"bucketkey" : rsabucketkey, // rsa encrypted bucket key for user
							"bucket" : d.piece_request_findbucket.bucketid
						}, ]
						}, function(d2) {

							$(that).parent().parent().remove();
						});
					}
				}
			});
		});
	},
	getData: function()
	{
		return this.options.data;
	}
});


var view_settings_privateinfo = view_subpage.extend({


	events: {


	},
	getData: function()
	{
		return this.options.data;
	},
	initialize: function() {

	},
	postRender: function() {

		// Attach SaveButton click event.
		$("#but_savePrivateProfile").click(function() {


			NProgress.start();
			var fields =
			{
				phone: encryptField($("input[name=phone]").val()),
				currentcity: encryptField($("input[name=currentcity]").val()),
				mail: encryptField($("input[name=mail]").val()),
			};

			// First we need to get our buckets
			apl_request({
				"requests": [{
					"id": "piece_getbuckets",
					"data1": ""
				}, ]
			}, function(d2) {

				console.log("PIECEBUCKETS");
				console.log(d2);
				var bucketaesdir = {};

				// Then we have to recrypt the buckets
				$.each( d2.piece_getbuckets.items, function(){

					var fastkey = getFastKey(0, 1);

					// Get aes key to encrypt information
					var bucketaes = crypto_decryptFK1(this.bucketaes).message;

					var tz = ""; // Empty value if empty field!

					if ( $("input[name="+this.key+"]").val() != "")
					tz =  aes_encrypt(bucketaes, $("input[name="+this.key+"]").val()); // Encrypt the item (phone etc.) with bucket aes key

					console.log("BUCKETAES IS "+bucketaes);
					// Encrypt field for buckets here
					// Add to array
					bucketaesdir[this.key] = tz;

				});

				console.log("fields");
				console.log(bucketaesdir);

				apl_request({
					"requests": [{
						"id": "piece_store",
						"fields": fields,
						"fielddata" : bucketaesdir
					}, ]
				}, function(d) {

					NProgress.done();
				});
			});


		});
	}
});
function decryptField(encfield) {

	if (encfield== "")
		return "";

		return crypto_decryptFK1(encfield).message;

}
function encryptField(fieldvalue) {

	if (fieldvalue == "")
		return "";

	return crypto_encryptFK1(fieldvalue).message;
}

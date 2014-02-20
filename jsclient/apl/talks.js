
function apl_talks_encryptAESKey(peoplekeys, aeskey)
{
	var receivers = [];
	var fastkey = getFastKey(0, 1); // Current fast key
	jQuery.each(peoplekeys, function() {
			var aesstrPK = aes_decrypt(fastkey.fastkey1, this.value);
			var pk = $.parseJSON(aesstrPK);

			var rsa = new RSAKey();
			rsa.setPublic(pk.key.n, pk.key.e);
			// RSA encrypt aes key with pubKey:
			var aesEnc = rsa.encrypt(aeskey);

			// Add to receivers
			receivers.push({
				charmeId: pk.userId, // UID?
				aesEnc: aesEnc,
				revision: pk.revision
			});
	});
	return receivers;
}



/***
	Name:
	sendMessage

	Info:
	Submit the form generated with `sendMessageForm()`.
	exists. First parameter is the message, Second parameter is the receiver array in form ["a@server.com", "b@server.com"]

	The function itself uses a hybrid cryptosystem to encode the message.
	First a random AES key is generated with `randomAESKey()` and 
	the  message itself is encoded with this key.

	Then the AES Key is encoded with the public RSA key of each receiver.
	Then the encoded AES keys are send to the users server which distributes
	the messages.

	TODO callback if key not found in directory, callback if error

	Location:
	apl/talks.js
*/

/*
	Callbacks:
	if(callback != undefined && typeof callback == 'function') callback();
*/





function apl_talks_initConversation(message, receiverArray, peoplekeys, callbackKeyNotFound, callbackError, callbackSuccess) {
	var all;
	var message;

	// "all" is an array containing all receiver userids (Example: ["test@myserver.com", "ms@yourserver.com", ...])
	all = receiverArray;
	all.push();

	var count = 0;
	var receivers = new Array();

	// make random key for hybrid encryption
	var aeskey = randomAesKey(32);

	// Encrypt RSA Key for sender
	var aesEnc = "";
	var rsa = new RSAKey();

	// Message to me
	rsa.setPublic(getKeyByRevision(0).rsa.rsa.n, getKeyByRevision(0).rsa.rsa.e);
	aesEnc = rsa.encrypt(aeskey);

	// Add myself to receivers
	receivers.push({
		charmeId: charmeUser.userId,
		aesEnc: aesEnc,
		revision: getKeyByRevision(0).revision,
		// username will be added on server
	});


	// First we do an request to our key directory to get all public keys
	// Therefore we build the hash keys to query thew key directory first
	var fastkey = getFastKey(0, 1); // Current fast key
	var allhashes = [];
	jQuery.each(all, function() {
		// Build key hash, needed for key directory query
		var e_key = CryptoJS.SHA256(fastkey.fastkey1 + this).toString(CryptoJS.enc.Base64);
		allhashes.push(e_key);
	});



		jQuery.each(peoplekeys, function() {
			var aesstrPK = aes_decrypt(fastkey.fastkey1, this.value);
			var pk = $.parseJSON(aesstrPK);

			var rsa = new RSAKey();
			rsa.setPublic(pk.key.n, pk.key.e);
			// RSA encrypt aes key with pubKey:
			var aesEnc = rsa.encrypt(aeskey);

			// Add to receivers
			receivers.push({
				charmeId: pk.userId, // UID?
				aesEnc: aesEnc,
				revision: pk.revision
			});
		});

		var encMessage = aes_encrypt(aeskey, message);
		var messagePreview = aes_encrypt(aeskey, message.substring(0, 127));

		// Send encrypted message to server
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
			console.log(receivers);
			
			if(callbackSuccess != undefined && typeof callbackSuccess == 'function') callbackSuccess();

			ui_closeBox();
		});





}


function apl_talks_sendanswer()
{

}
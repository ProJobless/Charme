class CharmeModels.Keys

	# Function used to hash public keys, requires key object with RSA exponent and modulus {e: "...", n: "..."}
	@buildFingerprint: (key) ->
		return CryptoJS.SHA256(key.n + key.e).toString(CryptoJS.enc.Base64);

	# Warning: Never store returned object directly in database, as it contains also the unencrypted key!
	@makeRsaFkKeypair: (publicKey) ->
		randomKey = randomAesKey(32);
		fastkey = getFastKey(0, 1);
		rk = crypto_encryptFK1(randomKey).message

		rsa = new RSAKey();
		rsa.setPublic(publicKey.n, publicKey.e);
		rsaEncKey = rsa.encrypt(randomKey);

		return { rsaEncKey: rsaEncKey, "revision" : fastkey.revision, "randomKey": rk}

	# Genera`tes an id for a given userId used to find keys via the id in the key directory
	#@mapDirectoryKey: (userId) ->
	#	fastkey = getFastKey(0, 1)
	#	dirkey = CryptoJS.SHA256(fastkey.fastkey1 + userId).toString(CryptoJS.enc.Base64)
	#	return dirkey

  # generates a new object for the private key storage on the server
	@makeKeyStoreRequestObject: (publicKey, addedPublicKeyRevision,  publicKeyUserId, username) ->

		keypair = CharmeModels.Keys.makeRsaFkKeypair(publicKey)

		e_value = crypto_hmac_make(
			username : username
			revisionSum: (addedPublicKeyRevision+keypair.revision)
			publicKey: publicKey
			publicKeyUserId: publicKeyUserId
			publicKeyRevision: addedPublicKeyRevision, 			# ...and of the public key owner
			edgekeyWithFK: keypair.randomKey,
			edgekeyWithPublicKey: keypair.rsaEncKey,
			fingerprint: CharmeModels.Keys.buildFingerprint(publicKey)
		)

		request = {
			"id": "key_storeInDir",
			"key" : e_value, # Revision of public key of user B!
		}

		return request

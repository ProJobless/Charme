class CharmeModels.Keys

	# Function used to hash public keys, requires key object with RSA exponent and modulus {e: "...", n: "..."}
	@buildHash: (key) ->
		return CryptoJS.SHA256(CryptoJS.SHA256(key.n)+CryptoJS.SHA256(key.e))

	# Warning: Never store returned object directly in database, as it contains also the unencrypted key!
	@makeRsaFkKeypair: (publicKey) ->
		randomKey = randomAesKey(32);
		fastkey = getFastKey(0, 1);
		rk = aes_encrypt(fastkey.fastkey1, randomKey)

		rsa = new RSAKey();
		rsa.setPublic(publicKey.n, publicKey.e);
		rsaEncKey = rsa.encrypt(randomKey);

		return { rsaEncKey: rsaEncKey, "revision" : fastkey.revision, "randomKey": rk, "randomKeyRaw" : randomKey}

	# Genera`tes an id for a given userId used to find keys via the id in the key directory
	@mapDirectoryKey: (userId) ->
		fastkey = getFastKey(0, 1)
		dirkey = CryptoJS.SHA256(fastkey.fastkey1 + userId).toString(CryptoJS.enc.Base64)
		return dirkey

  # generates a new object for the private key storage on the server
	@makeKeyStoreRequestObject: (publicKey, addedPublicKeyRevision,  publicKeyUserId, username) ->
		fastkey = getFastKey(0, 1);

		# This is the public key which will be encrypted and stored in the database.
		e_value = aes_encrypt(fastkey.fastkey1,	JSON.stringify(
			key: publicKey
			revision: addedPublicKeyRevision
			userId: publicKeyUserId)
		)

		# A hashed key is needed for verification later (="Fingerprint")
		keyhash = aes_encrypt_json(fastkey.fastkey1,
			revision: addedPublicKeyRevision
			hash: CharmeModels.Keys.buildHash(publicKey)
		)

		# This generates a new  AES key (aka edgekey), encrypted with the public key which was just verified.
		# The returned object also contains the unencrypted value (randomKeyRaw)
		# So be careful and do not store the object completly on the server!!
		keypair = CharmeModels.Keys.makeRsaFkKeypair(publicKey)

		# The edgekey is stored in a seperate mongoDB collection
		edgekey =
		{
			"revisionA": fastkey.revision, 	 			# Remember the public/private/symmetric pair key version of the user
			"revisionB": addedPublicKeyRevision, 			# ...and of the key owner
			"revision" :  fastkey.revision+
										addedPublicKeyRevision,			# The sum of both is the edgekey version: TODO: Count up old one by 1 instead!
			"rsaEncEdgekey" : keypair.rsaEncKey,	# The edgekey encrypted with the public key for user B
			"fkEncEdgekey" : keypair.randomKey,   # The edgekey encrypted with the fast key for...
																						# ...the current logged in user (owner of the key directory)
			"userId": publicKeyUserId											# UserId of the user who we got the  public key from
		};

		request = {
			"id": "key_storeInDir",
			"key": CharmeModels.Keys.mapDirectoryKey(publicKeyUserId), 				# We can query edgekeys by a hashed key
			"userId" : publicKeyUserId,		# UserId of the user whos public key we store
			"keyhash" : keyhash,
			"username" : username,
			"pubKeyRevision" : addedPublicKeyRevision, # Revision of public key of user B!
			"fkrevision": fastkey.revision, # Pubkey revision of user A
			"rsaEncEdgekey" : keypair.rsaEncKey,
			"fkEncEdgekey" : keypair.randomKey,
			"value": e_value,
			"edgekey" : edgekey
		}

		return request

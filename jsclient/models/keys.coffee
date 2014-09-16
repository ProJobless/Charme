class CharmeModels.Keys

	# Function used to hash public keys, requires key object with RSA exponent and modulus {e: "...", n: "..."}

	# Warning: Never store returned object directly in database, as it contains also the unencrypted key!
	@buildHash: (key) ->
		return CryptoJS.SHA256(CryptoJS.SHA256(key.n)+CryptoJS.SHA256(key.e))

	@querySignatureDirectory: (user) ->

	@makeRsaFkKeypair: (publicKey) ->
		randomKey = randomAesKey(32);
		fastkey = getFastKey(0, 1);
		rk = aes_encrypt(fastkey.fastkey1, randomKey)

		rsa = new RSAKey();
		rsa.setPublic(publicKey.n, publicKey.e);
		rsaEncKey = rsa.encrypt(randomKey);

		return { rsaEncKey: rsaEncKey, "revision" : fastkey.revision, "randomKey": rk, "randomKeyRaw" : randomKey}
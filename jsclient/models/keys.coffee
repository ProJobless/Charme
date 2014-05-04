class CharmeModels.Keys

	# Function used to hash public keys, requires key object with RSA exponent and modulus {e: "...", n: "..."}
	@buildHash: (key) ->
		return CryptoJS.SHA256(CryptoJS.SHA256(key.n)+CryptoJS.SHA256(key.e))
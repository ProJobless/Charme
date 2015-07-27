class CharmeModels.ListOperations

	@makeUniqueList: (list) ->
		uniqueNames = []
		$.each list, (i, el) ->
			uniqueNames.push el  if $.inArray(el, uniqueNames) is -1
		return uniqueNames


		#return CryptoJS.SHA256(CryptoJS.SHA256(key.n)+CryptoJS.SHA256(key.e))


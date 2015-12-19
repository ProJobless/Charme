class CharmeModels.SimpleStorage
	
	#
	# This is class for performing operations on a remote key value storage.
	# The values are currently unencrypted (As data like filter GPS positions have to be transimtted to the server anyway sooner or later),
	# but should be encryptable later
	#

	#
	# Returns all items for a given class name
	#
	@getItems: (className, encrypt=false, callbackFunction) -> # WARNING: encryption currently not supported!!!!
		apl_request { 'requests': [ {
		  'id': 'simpleStore'
		  'action': 'get'
		  'class': className
		} ] }, (dataFromServer) ->
		  	callbackFunction? dataFromServer.simpleStore
	
	#
	# Stores a item on the server for a given class name
	#
	@storeItem: (className, data, encrypt=false, callbackFunction) ->  # WARNING: encryption currently not supported!!!!
		apl_request { 'requests': [ {
		  'id': 'simpleStore'
		  'action': 'add'
		  'class': className
		  'data': data
		} ] }, (d) ->
			status = 200 # = ok
			callbackFunction? status
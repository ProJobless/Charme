# Sharing private information



## Challenges

* Make sure the information is really from the user we requested it from. -> sign it!

## Draft

A user can have private information, other users can only access by request.


We call such information a "piece". A piece can be your telephone number for example.


When a new piece is created, we generate a random AES Key first.
The information will be stored encrypted with this AES key on the users server. 
The AES key itself will be encrypted with the users RSA key and stored on the user A's server too.




	Save private information
		|
		|
		|
		v
	Check if field exists on server
	|			|
	| Yes     	|  No
	|			|
	| 			V
	|		Create new AES Key, encrypt AES with my private RSA Key
	|		
	|			|
	|			|
	V			V
	Encrypt field with AES Key, send to server




Other users can request this information. In this case, the information owner will click on "Accept" and send the information, encrypted with the public key to the user B who requests it. The server of user B will store this encrypted information in the database. 

When user B requests the profile of the first user, the information will be decrypted with the keyring and displayed.


Now we have to ensure, that a user will only receive information of the real information owner. This means requests to user B's server can not be sent by anybody.

To ensure this, we create a random value when user B requests the information and encrypt it with the public key of user A.

User A can decrypt it and send it back, also encrypted with the random AES key used to encrypt the information.


## Requests

* piece_store
* piece_store_get
* piece_getkeys
* piece_request
* piece_request_receive
* piece_send
* piece_send_receive

## MongoDB Collections

Users server

* pieces
	* contains passphrase encrypted private data. This colllection is requested by the owner of the data if he wants to change it
	* Fields: key, value, owner 
* pieceRequests
	* if another user wants to request private information from you he or she will send you a pieceRequest. This request contains your userID and the key of the requested information.


Other users server

* pieceStorage

## Files

* src/settings_privateinfo.js - Global functions
* (ROUTING) routes.js - Routing

## Roadmap

* Local Storage
*
*

## Status


# Sharing private information



## TODO

* Make sure the information is really from the user we requested it from. -> sign it!
* Revision for pubkey and piece



## Introduction

A user can have private information, other users can only access by request.

We call such information a "piece". A piece can be your telephone number for example.


## Allow someone access to private information

We use the bucket system described in the following to avoid time inefficient
RSA encryption for each user that can access the resource when updating a piece.

Every bucket contains the piece encrypted with a random AES key. This key is encrypted with the public RSA Key of a certain number (=bucketsize; Currently 5) of people. 

When we allow 

## Revoke Access

When we revoke access we have to generate a new bucket key and send it AES encrypted to each person without the person we do not want to allow access anymore.


## Update private information

Here we have to get the AES Key and encrypt the new information with this key. Afterwards we update the data field for each pieceBucket.

## Query private information

We get the public key encrypted private information form the server (pieceBucketItems Collection) and use our private key to obtain the AES key 1. This key will be used to decrypt the private information.


## Update Keyring

Here we have to update the field value in the pieces collection. The old value must be decrypted with the old fastkey1 and encrypted with the new fastkey1.


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
	* contains fastkey1 encrypted private data. This colllection is requested by the owner of the data if he wants to change it
	* Fields: key, value, owner 

* pieceRequests
	* if another user wants to request private information from you he or she will send you a pieceRequest. This request contains your userID and the key of the requested information.

* pieceBucketItems
	* Contains for each user in this bucket the RSA encrypted AES Key 1 to decrypt the desired information
	* Fields: key, bucketkey, owner, userid, bucket
* pieceBucket
	* Contains the desired information encrypted with AES Key 1
	* Fields: owner, bucketaes.


## Files

* /jsclient/src/settings_privateinfo.js - Global functions
* (ROUTING) /jsclient/lib/routes.js - Routing
## Defintions
* Password: Used to authenticate to server
* Passphrase: Only known by user, used to protect sensitive information and private keys.
* Keyring: All private keys
* fastkey1 randomAESKey, stored passphrase encrypted on server, only known by user
* Key Directory: Public keys of a users friend.

## Encrypting messages
As known from PGP every user has a public and a private key.
If Alice wants to send a message to Bob, she uses his public key to encrypt some information and only Bob can decrypt it with his private key.

As RSA is quite expensive, we use a hybrid cryptosystem. This means we generate a random 256Bit AES Key, which we use to encrypt a message. Then we encrypt the AES Key with RSA and send it to all receivers. Future messages in this conversation are encrypted only with the AES key only.


## Keyring and Key Directory
In case a private key  has been compromised, there is a function to create a new key pair. In this case, also a new passphrase is generated. We also have to save the old keys to be able to decrypt old messages. All private keys are saved on the server, encrypted with the 20 digit passphrase. We call this file keyring from now on. Only the user can see it. When the key is updated, the keyring is decrypted with the old passphrase, the new key is appended and afterwards encrypted with the new passphrase.

Second, we have to manage the public keys for every users friend on its own, as the server could deliver a false public key for doing a man in the middle attack.

The user can verify a private key client side and send a fastkey1 encrypted version  to the server. The server has no chance to change the key, as the client side decryption would not work anymore. When the user send a message he requests this encrypted version and decrypts it with his passphrase.

However, with this concept the server can deliver an old key revision as long as the key directories owner passphrase has not changed.

                                
                                        KEY DIRECTORY
                                        ON SERVER
                                     +----------------+
     +--------+                      |Alice's         |
     |        |                      |encrypted public|
     |  User  |<--------------------+|key in revision |
     |        |       Server returns |5               |
     +--------+       revision 4     |                |
                      instead of     |----------------|
                      revision 5     |      ....      |
                                     +----------------+



To avoid that the server returns an old public key we also provide a number that increases with every revision ("revision sum") and should never decrease. Therefore we first have a so called revision directory which stored pfastkey1 encrypted on the server:

    User Hash  | Revision  | owner
    ---------------------
    134A1B31	4 (aes fastkey1 encrypted to prevent decreasing)           ...
    213A2131	9
    ...

The sum of the revisions ("revision sum") is now (4+9+...). If an evil server tries to provide and old key than either the revision does not match with the revision directory, or if he also provides an old revision directory, than the revision number decreases. This will be noticed by the client and a warning will appear. If the user adds a new device, he or she has to check the revision sum by him or herself.

However, there are some things to take care of:
1. An evil Server could decrease a revision from a user a key and decrease a revision from user b key. Therefore we need to encrypt the revision numbers with fastkey1. As a result the evil server can not increase a revision anymore.
2. A Server also should not be able to return duplicates of keys to sum up. Therefore we need to make sure that every user id is only counted once.
3. Make sure server does not return encrypted revision from someone else -> also encrypt user id -> encrypted object contains: {userid, revision}
#### Needed Functions

**Client Side:**

EVENT: no revision found at login. display warning/import popup, if clicked ocntinue, use get !

EVENT:OnKeyUpdate: increase revision counter by 1 and invalidate

EVENT: OnKeyGet/Send Message:
Call getAKey

FUNCTION: getCache: (if checkInvalidated) get all values and store them locally. Then sum revision and compare them with revision number

FUNCTION: getAllFromCache: get keys from cache.

FUNCTION: getAKey: verifyRevision(key k) -> if(!checkInvalidated) call getAllFromCache if cache exists or get keys from server via getKeysFromServer

FUNCTION: getKeysFromServer, get keys from server and store in cache.

FUNCTION: checkInvalidated: ask server if any client application has invalidated the key directory

**Server Side:**

keyrc_storeValue(owner, userid, encryptedData (revision+userid)), ??Combine with key store function???

keyrc_getAllValues(get server revision)

**Cache**
Contains local copy of keydirectory, can be invalidated and will be fetched from server in this case.


### Questions
* What if another client adds a new key, how is the first client notified?
* Is key version verified when encrypting private infromation / pieces?

### Todo
Recrypt Fastkeys!


## TODOs
* Message signatures
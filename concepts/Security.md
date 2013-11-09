## Defintions
* Password: Used to authenticate to server
* Passphrase: Only known by user, used to protect sensitive information and private keys.
* Keyring: All private keys
* Key Directory: Public keys of a users friend.

## Encrypting messages
As known from PGP every user has a public and a private key.
If Alice wants to send a message to Bob, she uses his public key to encrypt it and only Bob can decrypt it with his private key.

As RSA is quite expensive, we use a hybrid cryptosystem. This means we generate a random 256Bit AES Key, which we use to encrypt a message. Then we encrypt the AES Key with RSA and send it to all receivers. Future messages are encrypted only with the AES key.


## Keyring and Key Directory
In case a private key  has been hacked, there is a function to create a new key pair. In this case, also a new passphrase is generated. We also have to save the old keys to be able to decrypt old messages. All private keys are saved on the server, encrypted with the 20 digit passphrase. We call this file keyring from now on. Only the user can see it. When the key is updated, the keyring is decrypted with the old passphrase, the new key is appended and afterwards encrypted with the new passphrase.

Second, we have to manage the public keys for every users friend on its own, as the server could deliver a false public key for doing a man in the middle attack.

The user can verify a private key client side and send a passphrase encrypted version to the server. The server has no chance to change the key, as the client side decryption would not work anymore. When the user send a message he requests this encrypted version and decrypts it with his passphrase.

However, with this concept the server could deliver an old key revision (from which he has the private key of the receiver) as long as the key directories owner passphrase has not changed.

                                
                                        KEY DIRECTORY
                                        ON SERVER
                                     +----------------+
     +--------+                      |Alice's         |
     |        |                      |encrypted public|
     |  User  |<--------------------+|key in revision |
     |        |       Server returns |5               |
     +--------+       revision 4     |                |
                      instead        |----------------|
                                     |      ....      |
                                     +----------------+


Therefore we do not tell the server the revision and the person of the public key. We use a directory like

    owner | key | value

where key is a hash value of public key owner and passphrase and value is an AES encrypted JSON with key and revision. We call this directory "hidden directory" from now on.
This makes it hard for the server to exchange a key. However, in the beginning the server could estimate some values. When the password changes 
we have to recrypt the hidden directory.

To avoid that the server returns an old public key we also provide a number that increases with every revision ("revision sum") and should never decrease. Therefore we first have a so called revision directory which is both stored locally and passphrase AES encrypted on the server:

    User Hash  | Revision
    ---------------------
    134A1B31	4
    213A2131	9
    ...

The sum of the revisions ("revision sum") is now (4+9+...). If an evil server tries to provide and old key than either the revision does not match with the revision directory, or if he also provides an old revision directory, than the revision number decreases. This will be noticed by the client and a warning will appear. If the user adds a new device, he or she has to check the revision sum by him or herself.



## TODOs
* Server Password Transmission. Currently unencrypted. However, attackers can not read private messages, even if they know the server password, as they do not know the passphrase.
* Message signatures
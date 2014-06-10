Functions:
sign = new CharmeModels.Signature(message)
sign.getJSON

CharmeModels.Signature.Verifiy()

TODO: Server Side Verification:
Server only adds if signature is correct

1. if incoming post check if revision&key exist in server public key directory
2. if not then send request to server with revision&userid
3. only add if key has been verified

Alternative/additional Client Side Verification:
  +-----------------+      +-------------------+
  |                 |      |                   |
  |  CLICK ON       |      | GET SIGNATURE     |
  |  USERNAME       |+---->|                   |
  |                 |      |                   |
  +-----------------+      +-------------------+
                                    +
                                    |
                                    |
                                    v
  +-----------+             +------------------+
  |           |<-----------+|                  |
  | get key   | NOT EXISTS  | GET KEY FROM MY  |
  | from owner|             | KEY DIRECTORY    |
  |     server|             |                  |
  |           |             |                  |
  |           |             +------------------+
  |           |                      +
  |           |                      |
  +-----------+                      | EXISTS
         +                           |
         |                           v
         | unobstrusive      +-----------------+
         | WARNING           |                 |+------------------>  REDIRECT TO PROFILE
         |                   |  CHECK SIGN     |
         +-------------+---> |  ATURE          |
                             |                 |+---------> ERROR
                             +-----------------+


Key Directory:
-------------------------------
Extend with older public key revisions
vs.
save public keys only on owner server, check when clicking on username



Things to sign
--------------------------------
messages
posts
people in my list (sign hash hash all names)


Diffuse Key Check
---------------------------------
- Check 3 random friend servers for public key


Important Server side functions
----------------------------------
key_getByRevision  Get key by revision
key_update_phase2  Add new public keys to local keyDirectory here


Public key dir on server
------------------------------------
Problems: Evil server may publish compromised keys of their clients. Solution: Also ask other servers for public key.
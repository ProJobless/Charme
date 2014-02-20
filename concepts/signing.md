Functions:
crypto_sign
crypto_checksign


Important: revisions, make it work with older revisions!


crypto_sign
- generate signature






check_sign



Server Side Verification:

Server only adds if signature is correct


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





Signature extension to RSA Lib from Tom Wu.
--------------------------------


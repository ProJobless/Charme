Here we have to recrypt the follwing data:





* Key Directory
* 
* Private Fields


Also we have to delete the local storage cache.

On recrypt we do the following steps.

1. gather all data to be recrypted via key_update_recrypt_getData in req.php
2. decrypt with old key and encrypt data with new key and send to server piecewise
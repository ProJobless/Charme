/*
 	decrypt aes asyncrounous
*/

importScripts("gibberish.js");

importScripts("../crypto.js");



self.addEventListener('message', function(e) {
self.postMessage(aes_decrypt(e.data.key, e.data.encData));

}, false);


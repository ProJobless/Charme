/*
 	decrypt aes asyncrounous
*/

importScripts("sjcl.js");





self.addEventListener('message', function(e) {

self.postMessage(sjcl.decrypt(e.data.key, e.data.encData));

}, false);


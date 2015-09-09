/*
 	decrypts content asyncrounous
*/

if((typeof alert) === 'undefined') {

    alert = function(message) {
        console.log(message);
    }
}

importScripts("gibberish.js");
importScripts("../crypto.js");
importScripts("crypto-1.1.js");
importScripts("hmac-sha256.js");
importScripts("enc-base64-min.js");

self.addEventListener('message', function(e) {
  self.postMessage(aes_decrypt(e.data.key, e.data.encData)); // Send result back to main thread
}, false);

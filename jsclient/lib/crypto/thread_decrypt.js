/*
 	decrypt aes asyncrounous

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

console.log( "...."+ CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256("chypertext", "password")));
self.postMessage(aes_decrypt(e.data.key, e.data.encData));


}, false);

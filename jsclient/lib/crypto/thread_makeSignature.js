self.onmessage = function(e) {

 importScripts("jsbn.js", "jsbn2.js", "prng.js", "rng.js", "rsa.js", "rsa2.js");

 var rsa = new RSAKey();
 self.postMessage(rsa);

});
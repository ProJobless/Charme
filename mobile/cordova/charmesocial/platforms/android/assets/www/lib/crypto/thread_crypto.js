
self.onmessage = function(e) {

  // Import required scripts
  importScripts("jsbn.js", "jsbn2.js", "prng.js", "rng.js", "rsa.js", "rsa2.js");
 

   var rsa = new RSAKey();
   rsa.generate(parseInt(1024),"10001");
   // -> Cyphertext can not be longer than modulus -> |Chypertext| <= 1024bit

   // Now we need to generate a symetric 1024 bit long key.


   // make session key for message






     // rsa.setPublic(document.rsatest.n.value, document.rsatest.e.value
    var res = rsa.encrypt(e.data);
        
    var before = new Date();
    res2 = rsa.decrypt(res);

    var after = new Date();
     

/*
    if(res) {
        document.rsatest.ciphertext.value = linebrk(res, 64);
        document.rsatest.cipherb64.value = linebrk(hex2b64(res), 64);

        console.log("TIME: " + (after - before) + "ms");

     }*/
     

  self.postMessage(res);


};


  
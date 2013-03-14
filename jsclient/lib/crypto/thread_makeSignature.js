self.onmessage = function(e) {

 importScripts("jsbn.js", "jsbn2.js", "prng.js", "rng.js", "rsa.js", "rsa2.js");

 var rsa = new RSAKey();
 rsa.generate(parseInt(1024),"10001");

 self.postMessage(rsa);

};


/*

http://www-cs-students.stanford.edu/~tjw/jsbn/rsa2.html


For encryption with public key n and e  (rsa.n and rsa.e)
rsa.setPublic(document.rsatest.n.value, document.rsatest.e.value);




For decryption you need 
rsa.setPrivateEx(dr.n.value, dr.e.value, dr.d.value, dr.p.value, dr.q.value, dr.dmp1.value, dr.dmq1.value, dr.coeff.value);



*/
self.onmessage = function(e) {

 importScripts("jsbn.js", "jsbn2.js", "prng.js", "rng.js", "rsa.js", "rsa2.js");

 var rsa = new RSAKey();
 rsa.generate(parseInt(1024),"10001");

//console.log(rsa);


 self.postMessage(

 	{n: rsa.n.toString(16),
 	 e: rsa.e.toString(16),
	 d: rsa.d.toString(16),
	 p: rsa.p.toString(16),
	 q: rsa.q.toString(16),
	 dmp1: rsa.dmp1.toString(16),
	 dmq1: rsa.dmq1.toString(16),
	 coeff: rsa.coeff.toString(16),

 });

};


/*

http://www-cs-students.stanford.edu/~tjw/jsbn/rsa2.html


For encryption with public key n and e  (rsa.n and rsa.e)
rsa.setPublic(document.rsatest.n.value, document.rsatest.e.value);




For decryption you need 
rsa.setPrivateEx(dr.n.value, dr.e.value, dr.d.value, dr.p.value, dr.q.value, dr.dmp1.value, dr.dmq1.value, dr.coeff.value);



*/
self.onmessage = function(e) {

 importScripts("jsbn.js", "jsbn2.js", "prng.js", "rng.js", "rsa.js", "rsa2.js");

 var rsa = new RSAKey();
 rsa.generate(parseInt(2048),"10001");

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



/***
	Name:
	rsa

	Info:
	See also the [RSA Library Documentation](http://www-cs-students.stanford.edu/~tjw/jsbn/rsa2.html).
	


	Location:
	apl/crypto.js

	Code:JS:
	var rsa = new RSAKey();
	// A 1024bit long RSA Key
	rsa.generate(parseInt(1024),"10001");


	Code:JS:
	// Reuse key:
	var rsa = new RSAKey();

	// All variables must be in string format!!
	var e =  rsa.e.toString(16);
	var n =  rsa.n.toString(16);
	//...

	// All variables must be in string format!!
	rsa.setPublic(n, e);
	// This is how to set properties for encryption
	// rsa.setPrivateEx(n, e, d, p, q, dmp1, dmq1, coeff);

	// Decryption:
	var str = rsa.decrypt("SOME ENCRYPTED TEXT HERE");
*/

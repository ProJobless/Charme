/***
	Name:
	aes_encryypt

	Info:
	Encrypts String with AES Key


	Location:
	crypto.js

	Code:JS:
	enctext= aes_encrypt("myaeskey", "mytext");
*/

function aes_encrypt(pass, text)
{
	// .replace does a linebreak cleanup
	return GibberishAES.enc(text, pass).replace(/(\r\n|\n|\r)/gm,"\n");
}


/***
	Name:
	aes_decryypt

	Info:
	Decrypts String with AES Key


	Location:
	crypto.js

	Code:JS:
	enctext= aes_decrypt("myaeskey", "mytext");
*/


function aes_decrypt(pass, encText)
{
	// .replace does a linebreak cleanup
	return GibberishAES.dec(encText.replace(/(\r\n|\n|\r)/gm,"\n"), pass);
}



/***
	Name:
	mkRSA

	Info:
	Generate a public RSA Object which prodvides encrypt functions


	Location:
	crypto.js

	Code:JS:
	var rsa = mkRSAPublic(key);
	rsa.encrypt(...);
*/


function mkRSAPublic(key)
{
	var rsa = new RSAKey();
	rsa.setPublic(key.n, key.e);
	return rsa;
}




/***
	Name:
	mkRSA

	Info:
	Generate RSA Object which prodvides encrypt/decrypt functions 
	of Key Object


	Location:
	crypto.js

	Code:JS:
	var rsa = mkRSA(key);
	rsa.encrypt(...);
*/


function mkRSA(key)
{

	var rsa = new RSAKey();

	rsa.setPrivateEx(key.n, key.e, key.d,
		key.p, key.q, key.dmp1,
		key.dmq1, key.coeff);
	return rsa;

}

/***
	Name:
	getFastKey

	Info:
	Get symmetric AES key for fast encryption/decryption
	First Parameter is certificate Version, second is fastkey number
	(which is 1 or 2)
	Returns {fastkey1, revision}
	
	Location:
	crypto.js

	Code:JS:
	var key1 = getFastKey(0, 1);
*/



function getFastKey(version, number)
{
	var key1 = getKeyByRevision(version);
	if (number == 1)
	return {fastkey1: key1.fastkey1, revision: key1.revision };
	if (number == 2)
	return {fastkey2: key1.fastkey2, revision: key1.revision };

}

function getCurrentFastKey(number)
{
	return getFastKey(0,number);
}


/***
	Name:
	getCurrentRSAKey

	Info:
	Returns current RSA Key in form {rsa, revision}

	Location:
	crypto.js

	Code:JS:
	var rsa = function getCurrentRSAKey()
*/



function getCurrentRSAKey() {

	var rsa = new RSAKey();

	var key1 = getKeyByRevision(0);

	var key = key1.rsa;

	rsa.setPrivateEx(key.n, key.e, key.d,
		key.p, key.q, key.dmp1,
		key.dmq1, key.coeff);


	return {rsa: rsa, revision: key1.revision};
}

/***
	Name:
	randomAesKey

	Info:
	Generates a random AES Key. 

	TODO:LV1: Add Mouse movement etc. as `Math.random()` is NOT a reliable RNG.

	Params:
	lenghtInByte:int:Key lenght in byte

	Location:
	apl/crypto.js

	Code:JS:
	var k = randomAesKey(32); // Generate a random AES key with lenght of 256 Bit.

*/



function randomAesKey(lenghtInByte)
{

var key = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        key += possible.charAt(Math.floor(Math.random() * possible.length));
return key;


}


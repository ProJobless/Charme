

/***
	Name:
	crypto_sign

	Info:
	Generate a signature with the users private key.
	
	Params:
	message:string:The message you want to sign

	Location:
	crypto.js

	Code:JS:
	var signature = crypto_sign("hallo welt", );

*/
function crypto_sign(message)
{

	var rsa = new RSAKey();
	var key1 = getKeyByRevision(0);





	rsa.setPrivateEx(key1.rsa.rsa.n, key1.rsa.rsa.e, key1.rsa.rsa.d,
						key1.rsa.rsa.p, key1.rsa.rsa.q, key1.rsa.rsa.dmp1,
						key1.rsa.rsa.dmq1, key1.rsa.rsa.coeff);

	var hSig = rsa.signString(message, "sha1");



	return hSig;
}

function cryptotest()
{
	var msg = "ein test";
	var sign = crypto_sign(msg);

	console.log(crypto_checksign(sign, msg, ""));
		console.log(crypto_checksign(sign, "false signature", ""));
	//console.log(crypto_checksign(sign, "boese nachricht", ""));
}
/***
	Name:
	crypto_checksign

	Info:
	Verify a signature. Returns TRUE or FALSE

	Params:
	signature:string:The signature to check
	message:string:The message you want to check
	publicKey:object:The publicKey (usually from key directory)

	Location:
	crypto.js

	Code:JS:
	hashkeys = buildHashKeyDir(["test@test.de"]);

*/
function crypto_checksign(signature, message, publicKey)
{	
	var key1 = getKeyByRevision(0);


	var x509 = new X509();
	x509.readCertNE(key1.rsa.rsa.n, key1.rsa.rsa.e);
	console.log("MESSAGE:"+message+"SIGN"+signature);
	var result = x509.subjectPublicKeyRSA.verifyString(message, signature);


	if (result)
	{

		return true;
	}
	else
		return false;
}


/***
	Name:
	crypto_buildHashKeyDir

	Info:
	Build the hash keys for querying the key directory. Returns a list in form [{userid, keyhash}, {userid, keyhash}, ...]


	Location:
	crypto.js

	Code:JS:
	hashkeys = buildHashKeyDir(["test@test.de"]);

*/
function crypto_buildHashKeyDir(inputItems)
{
	// TODO!!!!!
	var fastkey = getFastKey(0, 1);
	var output = [];

	


	$.each(inputItems, function(index, item) {

		var e_key = CryptoJS.SHA256(fastkey.fastkey1 + item).toString(CryptoJS.enc.Base64);
		output.push(e_key);
	});
	return output;
}

function decryptKeyDirValue(keyvalue)
{
	var fastkey = getFastKey(0, 1);
	return $.parseJSON(aes_decrypt(fastkey.fastkey1,keyvalue));

}
function compareRevisions()
{

}

/***
	Name:
	crypto_checkKeyUpdate

	Info:
	Check if public keys are up to date.
	Returns an array with outdated keys.


	Location:
	crypto.js

	Code:JS:
	upToDate = crypto_checkKeyUpdate(["test@test.de", "test2@test3.de"]);
*/

function crypto_checkKeyUpdate(inputItems)
{
	var fastkey = getFastKey(0, 1);
	var key = getKeyByRevision(0);
	var text = CryptoJS.SHA256(key.rsa.rsa.n).toString(CryptoJS.enc.Base64);

	var output = [];

	$.each(inputItems, function(index, item) {
			output.push();
	});
}



/***
	Name:
	asymkey_create

	Info:
	Creates an asymetic key pair


	Location:
	crypto.js

	Code:JS:
	somekey = asymkey_create();
*/


function asymkey_create()
{

}





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

	// TODO: better return a json array with aes encryption version to provide backwards compatibility later
}



/***
	Name:
	checkCache

	Info:
	Uses  local storage cache to get data encrypted with fastkey1.
	Useful for RSA decrypted values for example. Returns false if Cache was empty


	Location:
	crypto.js

	Code:JS:
	var x = checkCache("key");
	if (x == null)
	{
	  x = 4+4;
	  storeCache("key", x);
	}

	alert(x);

*/

function checkCache(key2)
{

	var txt = localStorage.getItem(charmeUser.userId+key2);

	if (txt == null)
	{
		console.log("NULL"+charmeUser.userId+key2);
		return null;
	}

	var data = txt.split(',');
	var key = getFastKey(data[0], 1);
	var txt = aes_decrypt(key.fastkey1, data[1]);

 	return txt;
}



/***
	Name:
	storeCache

	Info:
	Uses  local storage cache to store data encrypted with fastkey1.
	Useful for RSA decrypted values for example. See also: checkCache


	Location:
	crypto.js

	Code:JS:
	var x = checkCache("key");
	if (x == false)
	{
	  x = 4+4;
	  storeCache("key", x);
	}

	alert(x);

*/

function storeCache(key2, value)
{

	var key = getFastKey(0, 1);
	var txt = key.revision + ","+aes_encrypt(key.fastkey1, value);


 	localStorage.setItem(charmeUser.userId+key2, txt);
}






/***
	Name:
	aes_decryypt

	Info:
	Decrypts String with AES Key, returns string


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
	mkRSAPublic

	Info:
	Generate a public RSA Object which prodvides encrypt functions
	

	Location:
	crypto.js

	Code:JS:
	var key = { n: 12345..., e: 100011} // Do not define n and e yourself!
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
	

	Params:
	version:int:fast key version, must be saved in fastkey encrypted values to maintain decryption ability for older values.
	number:int:1 or 2


	Location:
	crypto.js

	Code:JS:
	var key1 = getFastKey(0, 1);
*/



function getFastKey(version, number) {
	var key1 = getKeyByRevision(version);
	if (number == 1)
		return {
			fastkey1: key1.fastkey1,
			revision: key1.revision
		};
	if (number == 2)
		return {
			fastkey2: key1.fastkey2,
			revision: key1.revision
		};
}
/***
	Name:
	getCurrentFastKey

	Info:
	Returns current fast key. This is the same as
	
	Params:
	number:int:1 or 2

	Location:
	crypto.js

	Code:JS:
	var fk = getFastKey(getCurrentFastKey);
*/


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
	randomSalt

	Info:
	Generates a random Salt for SHA256 Hashing 

	TODO:LV1: Add Mouse movement etc. as `Math.random()` is NOT a reliable RNG.

	Params:
	lenghtInByte:int:Salt lenght in byte

	Location:
	apl/crypto.js

	Code:JS:
	var k = randomSalt(32);

*/



function randomSalt(lenghtInByte)
{

var key = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        key += possible.charAt(Math.floor(Math.random() * possible.length));
return key;

	
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


// maye a more secure sjcl function is var randKey  = sjcl.random.randomWords(4, 0);

function randomAesKey(lenghtInByte)
{

var key = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        key += possible.charAt(Math.floor(Math.random() * possible.length));
return key;


}


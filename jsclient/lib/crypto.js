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
	randomAesKey

	Info:
	Generates a random AES Key. 

	TODO:LV1: Add Mouse movement as `Math.random()` is vulnerable to cryptoanalysis.

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


// TODO: RSA Decryption with Caching
function rsaCacheDecrypt(lenghtInByte)
{


}
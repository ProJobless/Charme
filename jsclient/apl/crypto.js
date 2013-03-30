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
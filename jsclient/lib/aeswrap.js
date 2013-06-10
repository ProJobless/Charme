/***
	Name:
	aesEncrypt

	Info:
	AES Encrpt String

	Params:
	key:string:Key
	data:string:The data to encyrpt
	Location:
	lib/aeswrap.js

	Code:JS:
	aesEncrypt("passwod", "data");
*/

function aesEncrypt(key,data)
{
	sjcl.encrypt(key, data);
}



/***
	Name:
	aesDecrypt

	Info:
	AES Decrpt String

	Params:
	key:string:Key
	data:string:The data to decyrpt

	Location:
	lib/aeswrap.js

	Code:JS:
	aesDecrypt("passwod", "AES ENRYPTED STRING");
*/

function aesDecrypt(key,data)
{
	sjcl.decrypt(key, data);
}
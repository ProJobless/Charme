

function test()
{

console.log(JSON.stringify(CharmeModels.Signature.makeSignedJSON({test: 'esr'})));

console.log("public key is ");
console.log(getKeyByRevision(0));


key1 = getKeyByRevision(0)
var rsa = new RSAKey();
rsa.setPublic( key1.rsa.rsa.n,key1.rsa.rsa.e)

console.log("n IS");
console.log(key1.rsa.rsa.n);
console.log("e IS");
console.log(key1.rsa.rsa.e);

console.log("PEM IS");


console.log(CharmeModels.Signature.keyToPem(key1.rsa.rsa.n, key1.rsa.rsa.e));


/* */


/* */
}

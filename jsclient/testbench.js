

function test()
{
console.log(JSON.stringify(CharmeModels.Signature.makeSignedJSON({test: 'esr'})));

console.log("public key is ");
console.log(getKeyByRevision(0));
}

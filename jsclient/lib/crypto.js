function pgpPerformanceTest()
{

	// Make pgp Keys
  openpgp.init();
  

  
 var k = openpgp.generate_key_pair(1, 1024 , "User Name <username@email.com>" , "passparse"); // can alos be 2048bit


  // keytype (1==rsa) , numberofbits

var start = new Date();

for (var i = 0; i<1; i++){
var pub_key = openpgp.read_publicKey(k.publicKeyArmored);//openpgp.read_publicKey($('#pubkey').text());


var x = openpgp.write_encrypted_message(pub_key,"lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ");

}


var ende = new Date();




var startK = start.getHours() * 60 * 60 * 1000 + start.getMinutes() * 60 * 1000 + start.getSeconds() * 1000 + start.getMilliseconds();
var endeK = ende.getHours() * 60 * 60 * 1000 + ende.getMinutes() * 60 * 1000 + ende.getSeconds() * 1000 + ende.getMilliseconds();

var dif = (endeK-startK) /1000;


alert(dif);

/*
uriContent = "data:application/octet-stream," + "content";

 newWindow=window.open(uriContent, 'RANDOMNUMBER');
*/


}

// Enrypt message with public key
function encrypt(puk)
{


  openpgp.init();
  var pub_key = openpgp.read_publicKey($('#pubkey').text());


  $('#message').val(openpgp.write_encrypted_message(pub_key,$('#message').val()));

}

// Decrpyt Message with private Key
function decrypt(prk)
{

}


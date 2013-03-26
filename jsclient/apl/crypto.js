function randomAesKey(lenghtInByte)
{
	/*
		Todo: Implement Mouse movements to increase security as javascripts number generator is not 
		so secure!
	*/
var key = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        key += possible.charAt(Math.floor(Math.random() * possible.length));
return key;


}
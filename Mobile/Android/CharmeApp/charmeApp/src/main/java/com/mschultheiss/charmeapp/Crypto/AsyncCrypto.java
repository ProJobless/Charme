package com.mschultheiss.charmeapp.Crypto;

import android.os.AsyncTask;


public class AsyncCrypto  extends AsyncTask<AsyncCryptoArgs, Void, String> {
	     protected String doInBackground(AsyncCryptoArgs... arguments) {
			
    		if (arguments[0].Action == AsyncCryptoArgs.ACTION_SIGN)
        	{
    			return arguments[0].RSA.makeSignedJSON(arguments[0].JSON, arguments[0].Revision).toString();
    			
    			//arguments[0].RSA asdasd
        	}
    		else if (arguments[0].Action == AsyncCryptoArgs.ACTION_DECRYPT)
    		{
    			return arguments[0].RSA.decryptText(arguments[0].TextToProcess);
    		}
    		return "OPPERATION NOT SUPPORTED";

	     }

	     protected void onProgressUpdate(Integer... progress) {
	    	 // emtpy
	     }

	 }



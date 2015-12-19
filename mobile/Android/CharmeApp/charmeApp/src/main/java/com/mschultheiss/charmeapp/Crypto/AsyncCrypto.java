package com.mschultheiss.charmeapp.Crypto;

import android.content.SharedPreferences;
import android.os.AsyncTask;


public class AsyncCrypto  extends AsyncTask<AsyncCryptoArgs, Void, String> {
	     protected String doInBackground(AsyncCryptoArgs... arguments) {
			
    		if (arguments[0].Action == AsyncCryptoArgs.ACTION_SIGN)
        	{
    			return arguments[0].RSA.makeSignedJSON(arguments[0].JSON, arguments[0].Revision).toString();
    			
    			//arguments[0].RSA asdasd
        	}
    		else {
				if (arguments[0].Action == AsyncCryptoArgs.ACTION_DECRYPT) {


					int rev = Crypto.getFastKey1Revision(arguments[0].Context);
					if (rev == -1)
						System.out.println("Critical Fast Key 1 Error!  Revision not found!");

					// 1. Build key
					String key = String.valueOf(arguments[0].TextToProcess.hashCode())+String.valueOf(rev);

					// 2. Check if it exits
					SharedPreferences preferences = arguments[0].Context
							.					getSharedPreferences("cryptoRSACache", arguments[0].Context.MODE_PRIVATE);

					String res = preferences.getString(key, "");
					System.out.println("M IS"+res);
					if (!res.equals("")) {
						String ret =  Crypto.decryptFastKeyLocal(res, arguments[0].Context);
						if (ret != null) {
							System.out.println("M USE CACHE!");
							return ret;
						}
						else // Decryption Error? Decrypt with RSA then!
							res = "";
					}

					if (res.equals("")) {
						String s = arguments[0].RSA.decryptText(arguments[0].TextToProcess);
						SharedPreferences.Editor editor = preferences.edit();
						editor.putString(key, Crypto.encryptFastKeyLocal(s, arguments[0].Context));
						editor.commit();
						return s;
					}


				}
			}
    		return "OPPERATION NOT SUPPORTED";

	     }

	     protected void onProgressUpdate(Integer... progress) {
	    	 // emtpy
	     }

	 }



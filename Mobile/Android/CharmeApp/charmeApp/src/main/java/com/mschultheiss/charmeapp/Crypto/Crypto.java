package com.mschultheiss.charmeapp.Crypto;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import android.content.Context;
import android.util.Base64;

import com.mschultheiss.charmeapp.Controllers.ActivityLogin;

import org.json.JSONObject;

public class Crypto {

		// Return object for decrypted object containing revision and plain text
		public static class DecryptReturn {

			public int revision;
			public String message;

			public DecryptReturn(String message, int revision) {
				this.message  = message;
				this.revision =  revision;
			}

		}

		public static DecryptReturn decryptFastKey1(JSONObject encryptedObject, Context context) {

			try {
				JSONObject keyringObj = ActivityLogin.findKey(encryptedObject.getInt("revision"), context);

				final GibberishAESCrypto gib = new GibberishAESCrypto();

				// TODO: Check HMAC, CRITICAL SECURITY FEATURE!!!!
				String text = gib.decrypt(
						keyringObj.getString("fastkey1"),encryptedObject.getString("ciphertext").toCharArray());

				return new Crypto.DecryptReturn(text, encryptedObject.getInt("revision"));
			}
			catch(Exception x) {

				return null;
			}

		}

		public static String makeSha256(String text, boolean useBase64)
		{
			MessageDigest md;
			try {
				md = MessageDigest.getInstance("SHA-256");
				md.update(text.getBytes("UTF-8"));
				byte[] digest = md.digest();
				 
				if (useBase64)
				return Base64.encodeToString(digest, Base64.DEFAULT).trim(); // trim is important as otherwise new line is added
				else
					return bytesToHex(digest);
				
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				System.out.println("CHARME CRYPTO ERROR AT SHA256");
			}
			return "";
			
		
		}
		 public static String bytesToHex(byte[] bytes) {
		        StringBuffer result = new StringBuffer();
		        for (byte byt : bytes) result.append(Integer.toString((byt & 0xff) + 0x100, 16).substring(1));
		        return result.toString();
		    }
	
}

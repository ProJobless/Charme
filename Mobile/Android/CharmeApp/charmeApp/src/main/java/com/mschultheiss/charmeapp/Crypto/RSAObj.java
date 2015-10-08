package com.mschultheiss.charmeapp.Crypto;

import org.json.JSONObject;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.spec.RSAPrivateKeySpec;

import javax.crypto.Cipher;

public class RSAObj {
	public String n; // Modulus
	public String d; // Private Exponent
	public String e; // Public Exponent
	public String p;
	public String q;


	PrivateKey getPrivateKey()
	{
		try{
		BigInteger modulus = new BigInteger(
				n,
				16);

		KeyFactory factory2 = KeyFactory.getInstance("RSA");

		// Private Exponent for private key!
		BigInteger exponent2 = new BigInteger(
				d,
				16);

		RSAPrivateKeySpec spec2 = new RSAPrivateKeySpec(modulus, exponent2);
		
		return factory2.generatePrivate(spec2);
		}
		catch(Exception ex)
		{
			ex.printStackTrace();
			return null;
		}
		
	}
	public Cipher getPrivateChipher()
	{
		try{//
			
			PrivateKey privKey = getPrivateKey();
			Cipher cipher2 = Cipher.getInstance("RSA/NONE/PKCS1Padding"); // , "BC"
			cipher2.init(Cipher.DECRYPT_MODE, privKey);

			return cipher2;
		}
		catch(Exception ex)
		{
			ex.printStackTrace();
			return null;
		}
	}

	public JSONObject makeSignedJSON(JSONObject json, int keyRevision)
	{	
		JSONObject returnOb = new JSONObject();
		try
		{
			String jsonStr = json.toString();
			returnOb.put("object", json);
			
			//{keyRevision: this.revision, hashvalue: this.hash }
			JSONObject signatureObj = new JSONObject();
			signatureObj.put("keyRevision", keyRevision );

			// Generate new key
			KeyPair keyPair = KeyPairGenerator.getInstance("RSA").generateKeyPair();
			PrivateKey privateKey = getPrivateKey();

			// Compute signature
			Signature instance = Signature.getInstance("SHA1withRSA");
			instance.initSign(privateKey);
			instance.update((jsonStr).getBytes());
			byte[] signature = instance.sign();

			// Compute digest
			MessageDigest sha1 = MessageDigest.getInstance("SHA1");
		
			byte[] digest = sha1.digest((jsonStr).getBytes());

			// Encrypt digest
			Cipher cipher = Cipher.getInstance("RSA");
			cipher.init(Cipher.ENCRYPT_MODE, privateKey);
			byte[] cipherText = cipher.doFinal(digest);

			// Display results
			System.out.println("Input data: " + jsonStr);
			System.out.println("Digest: " + bytesToHex(digest));
			System.out.println("Cipher text: " + bytesToHex(cipherText));
			System.out.println("Signature: " + bytesToHex(signature));

			signatureObj.put("hashvalue", bytesToHex(signature));
			returnOb.put("signature", signature);
			

			System.out.println("signed is " +returnOb.toString());
			
			return returnOb;
		}
		catch(Exception ee){
			
			ee.printStackTrace();
		}
		return returnOb; // TODO!!!
	}
	public String decryptText(String chypText)
	{
		try{
		BigInteger modulus = new BigInteger(
				n,
				16);

		KeyFactory factory2 = KeyFactory.getInstance("RSA"); // RSA/ECB/PKCS1Padding may be helpful according to http://stackoverflow.com/questions/24988787/throws-badpaddingexception-when-i-try-to-decrypt-the-encrypted-data-in-android

		// Private Exponent for private key!
		BigInteger exponent2 = new BigInteger(
				d,
				16);

		RSAPrivateKeySpec spec2 = new RSAPrivateKeySpec(modulus, exponent2);
		PrivateKey privKey = factory2.generatePrivate(spec2);

		Cipher cipher2 = getPrivateChipher();

	

		// Integer.parseInt(chypText, 16);

		byte[] plainText = cipher2.doFinal(hexStringToByteArray(chypText));
		return new String(plainText);
		// RSAPublicKeySpec spec = new RSAPublicKeySpec(modulus, exponent);
		}
		catch(Exception ee){

            ee.printStackTrace();
			return "";
		}
   
   
	}
	
	 public static String bytesToHex(byte[] bytes) {
		    final char[] hexArray = {'0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'};
		    char[] hexChars = new char[bytes.length * 2];
		    int v;
		    for ( int j = 0; j < bytes.length; j++ ) {
		        v = bytes[j] & 0xFF;
		        hexChars[j * 2] = hexArray[v >>> 4];
		        hexChars[j * 2 + 1] = hexArray[v & 0x0F];
		    }
		    return new String(hexChars);
		}
		     public static byte[] hexStringToByteArray(String s) {
		    byte[] b = new byte[s.length() / 2];
		    for (int i = 0; i < b.length; i++) {
		      int index = i * 2;
		      int v = Integer.parseInt(s.substring(index, index + 2), 16);
		      b[i] = (byte) v;
		    }
		    return b;
		  }

}

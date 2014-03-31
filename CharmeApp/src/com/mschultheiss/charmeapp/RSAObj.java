package com.mschultheiss.charmeapp;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.Security;
import java.security.spec.RSAPrivateKeySpec;

import javax.crypto.Cipher;

public class RSAObj {
	public String n; // Modulus
	public String d; // Private Exponent
	public String e; // Public Exponent
	public String p;
	public String q;
	
	public String decryptText(String chypText)
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
		PrivateKey privKey = factory2.generatePrivate(spec2);

		Cipher cipher2 = Cipher.getInstance("RSA/NONE/PKCS1Padding"); // , "BC"

		System.out.print("CHYP TEXT: " + chypText); // IS HEX!!!!
		cipher2.init(Cipher.DECRYPT_MODE, privKey);

		// Integer.parseInt(chypText, 16);

		byte[] plainText = cipher2.doFinal(hexStringToByteArray(chypText));
		return new String(plainText);
		// RSAPublicKeySpec spec = new RSAPublicKeySpec(modulus, exponent);
		}
		catch(Exception ee){
			System.out.println("CH1: cryptoerror"+ee.toString());
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

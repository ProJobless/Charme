package com.example.charmeapp;

import java.security.Security;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class Crypto {
	public static String encRSA() {

		return "";
	}

	public static String decRSA() {

		return "";
	}
	
	// AES From http://www.scottjjohnson.com/blog/AesWithCbcExample.java
	public static String encAES(String plainText, String encryptionKey) {
		 
			try
			{
			    byte[] iv = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
		        IvParameterSpec ivspec = new IvParameterSpec(iv);
		        
		        
				   Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
				    SecretKeySpec key = new SecretKeySpec(encryptionKey.getBytes("UTF-8"), "AES");
				    cipher.init(Cipher.ENCRYPT_MODE, key,ivspec);
				    return new String(cipher.doFinal(plainText.getBytes("UTF-8")),"UTF-8");
				    
			}
			catch(Exception ex){
				System.out.println("CRYPTO AESENC FAILED!"+ex.toString());
			}
	        
	        
		return "";
	}
	

	public static String decAES(String cipherText, String encryptionKey) {
		try
		{
			// Shorten key
			if (encryptionKey.length()>24)
				encryptionKey = encryptionKey.substring(0, 24);
			else if (encryptionKey.length()>16)
				encryptionKey = encryptionKey.substring(0, 16);
			
	
			

        byte[] iv = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
        IvParameterSpec ivspec = new IvParameterSpec(iv);

        
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        SecretKeySpec key = new SecretKeySpec(encryptionKey.getBytes("UTF-8"), "AES");
        cipher.init(Cipher.DECRYPT_MODE, key,ivspec);
        return new String(cipher.doFinal(cipherText.getBytes("UTF-8")),"UTF-8");
        
        
		}
		catch(Exception ex){
			
			System.out.println("CRYPTO AESDEC FAILED!"+ex.toString());
		}
        
        
	return "";
	
	
	}
	
	
}

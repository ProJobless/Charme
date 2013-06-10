package com.mschultheiss.charme;

import java.security.AlgorithmParameters;
import java.security.KeyPair;
import java.security.spec.KeySpec;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

import android.util.Base64;

public class CharmeCrypto {
	
	public KeyPair RSA;
	public static String EncryptRSA(String message)
	{
		//PublicKey publicKey = new PublicK
		//KeyPair keyPair = new KeyPair(publicKey, privateKey);
		
		
		return "";
	}
	public static String DecryptRSA(String message)
	{
		
		return  "";
	}

	 
	 
	public static String encryptAES(String base64EncryptedData, String password)
	{
		
		
       return "";
		
	}
	public static String decryptAES(String base64EncryptedData, String password)
	{
		
	
		/*
		 * 
		 * {\"iv\":\"UgEhBgfdJWlIt2x+2JMxUw\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\"
		 * ,\"adata\":\"\",\"
		 * cipher\":\"aes\",\"salt\":\"Ji5UquwKRxw\",\"ct\":\"R5jf8sAYpz6OOKQ\"}"
		 */
		
  	    /*
	     * 
	     * *SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 1024, 256);
SecretKey tmp = factory.generateSecret(spec);
SecretKey secret = new SecretKeySpec(tmp.getEncoded(), "AES");

Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
cipher.init(Cipher.DECRYPT_MODE, secret, new IvParameterSpec(iv));
String plaintext = new String(cipher.doFinal(ciphertext), "UTF-8");
return plaintext;/
	     */
		
		
			 try
		        {
		        		// SJCL uses PBKDF2WithHmacSHA256, see sjcl discussion on google groups
		        	  
		        	    byte[] salt = new String("Ji5UquwKRxw").getBytes(); // SALT!!
		        	    int itCount = 1000; // TODO: from json
		        	    int keyLenght = 128; // TODO: From json
		        	    SecretKey key;
		        	    
		        	    // PBKDF2WithHmacSHA1
		        	    SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
		               
		        	    KeySpec spec = new PBEKeySpec(password.toCharArray(), salt, itCount, keyLenght);
		                SecretKey tmp = factory.generateSecret(spec);
		                key = new SecretKeySpec(tmp.getEncoded(), "AES");
		                Cipher aescipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		                
		              //  aescipher.init(Cipher.DECRYPT_MODE, key); // Change for encryption here!
		               AlgorithmParameters params = aescipher.getParameters();
		                
		        	    byte[] iv = params.getParameterSpec(IvParameterSpec.class).getIV();
		        	    
		        	    aescipher.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(iv));
		        	    byte[] decryptedData = Base64.decode(base64EncryptedData, Base64.DEFAULT);
		        	    byte[] utf8 = aescipher.doFinal(decryptedData);
		                return  new String(utf8, "UTF8");
				  
			        
		        }
		        catch(Exception ex)
		        {
		        	System.out.println("CHARME ERROR 42");
		        	ex.printStackTrace();
		        	return "DECRPYPTION ERROR";
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

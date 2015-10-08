package com.mschultheiss.charmeapp.Crypto;

import java.io.ByteArrayOutputStream;
import java.util.Random;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.PBEParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import android.util.Base64;

import org.json.JSONObject;

// Gibberish AES Support adapted from http://watchitlater.com/blog/tag/aes/
// Also added HMAC support

public class GibberishAESCrypto {  
  
  private static final String CIPHER_ALG = "PBEWITHMD5AND256BITAES-CBC-OPENSSL";
  private static final char AES_ALGORITHM_VERSION = '1'; // The currently used algorithm version. 1 is favored as it contains integrity protection
  private static final String PREFIX = "Salted__";  // First 8 Bytes for the initialization vector
  private static final String UTF_8 = "UTF-8";  
  
  public String encrypt(String plainText, char[] password) throws Exception {

    if (AES_ALGORITHM_VERSION == '1') {

      JSONObject json = new JSONObject();
      StringBuilder sb = new StringBuilder(64);
      sb.append(password);
      sb.append(AES_ALGORITHM_VERSION); // Algorithm Version of encoded Object
      char passwordNew[] = sb.toString().toCharArray();
      byte[] salt = new byte[8];
      new Random().nextBytes(salt);

      Cipher cipher = createCipher(Cipher.ENCRYPT_MODE, salt, passwordNew);
      byte[] cipherText = cipher.doFinal(plainText.getBytes(UTF_8));
      ByteArrayOutputStream baos = new ByteArrayOutputStream(cipherText.length + 16);
      baos.write(PREFIX.getBytes(UTF_8));
      baos.write(salt);
      baos.write(cipherText);
      String finalChiperText =  Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP);

      json.put("a", String.valueOf(AES_ALGORITHM_VERSION));
      json.put("m", finalChiperText);
      json.put("h", SHA256HMAC(sb.toString(), finalChiperText));
      System.out.println("chipher m text is " + json.toString());

      return json.toString();
    }
    else { // AES without HMAC! DO NOT USE THIS RIGHT NOW!!!!!
      byte[] salt = new byte[8];
      new Random().nextBytes(salt);
      Cipher cipher = createCipher(Cipher.ENCRYPT_MODE, salt, password);
      byte[] cipherText = cipher.doFinal(plainText.getBytes(UTF_8));
      ByteArrayOutputStream baos = new ByteArrayOutputStream(cipherText.length + 16);
      baos.write(PREFIX.getBytes(UTF_8));
      baos.write(salt);
      baos.write(cipherText);
      System.out.println("chipher m text is " + Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP));

      return Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP);
    }
  }  

  public String decrypt(String cipherText, char[] password) throws Exception {

    try {
      JSONObject json = new JSONObject(cipherText);
      StringBuilder sb = new StringBuilder(64);
      sb.append(password);
      sb.append(json.getString("a")); // Algorithm Version of encoded Object. MUST BE TYPE CHAR!!!
      char passwordNew[] = sb.toString().toCharArray();

      System.out.println("alg ois "+json.getString("a"));
      System.out.println("pass is "+sb.toString());


      byte[] input = Base64.decode(json.getString("m"), Base64.NO_WRAP);
      byte[] salt = new byte[8];
      System.arraycopy(input, 8, salt, 0, salt.length);
      Cipher cipher = createCipher(Cipher.DECRYPT_MODE, salt, passwordNew);

      byte[] plainText = cipher.doFinal(input, 16, input.length - 16);
      String plain = new String(plainText, UTF_8);

      String y =  SHA256HMAC(sb.toString(), json.getString("m"));
      if (y.equals(json.getString("h")))
      {
        return plain;
      }
      else {
        System.out.println("SECURITY ERROR: COULD NOT VALIDATE SHA256 HMAC IN AES DECRYPT!");
        return "";
      }
    }
    catch(Exception ex) { // None JSON, old crypto without HMAC
      System.out.println("EXCEPTION IS "+ex.toString());
      ex.printStackTrace();

      System.out.println("gbaes IS " + cipherText + " with key " + String.valueOf(password));
      byte[] input = Base64.decode(cipherText, Base64.NO_WRAP);
      byte[] salt = new byte[8];
      System.arraycopy(input, 8, salt, 0, salt.length);
      Cipher cipher = createCipher(Cipher.DECRYPT_MODE, salt, password);
      byte[] plainText = cipher.doFinal(input, 16, input.length - 16);

      System.out.println("gbaes resultr IS "+new String(plainText, UTF_8)+" with key "+password.toString());
      return new String(plainText, UTF_8);
    }
  }

  // Must return same as Javascript CryptoJs.Sha256Hmac
  public static String SHA256HMAC(String key, String data) throws Exception {
    Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
    SecretKeySpec secret_key = new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA256");
    sha256_HMAC.init(secret_key);
    System.out.println(sha256_HMAC.doFinal(data.getBytes()).toString());
    return  Base64.encodeToString(sha256_HMAC.doFinal(data.getBytes()), Base64.NO_WRAP);
  }

  private Cipher createCipher(int cipherMode, byte[] salt, char[] password)  
      throws Exception {  
  
    PBEKeySpec pbeSpec = new PBEKeySpec(password);  
    SecretKeyFactory keyFact = SecretKeyFactory.getInstance(CIPHER_ALG);  
    PBEParameterSpec defParams = new PBEParameterSpec(salt, 0);  
  
    Cipher cipher = Cipher.getInstance(CIPHER_ALG);  
    cipher.init(cipherMode, keyFact.generateSecret(pbeSpec), defParams);  
    return cipher;  
  }  
}
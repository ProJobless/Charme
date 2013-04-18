/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cryptotest;

import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
import java.awt.RenderingHints.Key;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.Security;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.RSAPrivateKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

/**
 *
 * @author ms
 */
public class CryptoTest {
    // Some good links:
    // http://stackoverflow.com/questions/2023549/creating-rsa-keys-from-known-parameters-in-java
    // http://stackoverflow.com/questions/9548569/java-unreliable-rsa-encryption-decryption-of-strings
  
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, UnsupportedEncodingException, IllegalBlockSizeException, BadPaddingException, NoSuchProviderException, InvalidKeyException {
        // TODO code application logic here
              String encrypted = "48c1af013a37e47a125a5586967eb6d0eec8979dedeae16da3f836e8b030cdc4e73d8df88fe6c28935d27b099741c8604e1148f91b792eb1e7d58aa36e4113735a7cc5f08871db57494ce7b1ff51e6aa72a6a3eb7c0a06e842613dc9a0c13cdb1f0802a59ac464da10f5fcfc84bf2246b92992fa47dc84fe64acaf5cf885ef85";
              
    
              
             
              
       String toEncrypt = "Hello Worldöäü";
              
 
       BigInteger modulus = new BigInteger("b112e5d5e231a6873ce765a1c1e259b460c732586ef742ab86d67cdcfe797d54a0f3cf1877533c725f492c495c28afb2c7b011a84b0e486864f1389c0ad059eaf9ce0d54e7a5953efb0210a742520ad1a4748d4f85eec26df07c06c40c7b2e709c9d345bcb2265c6867e47ae7282301321729eaa13120fed31b61d9dc564b693", 16);
       

       BigInteger exponent = new BigInteger("10001", 16);
       
       RSAPublicKeySpec spec = new RSAPublicKeySpec(modulus, exponent);
        
       KeyFactory factory = KeyFactory.getInstance("RSA");
       PublicKey pub = factory.generatePublic(spec);
       
       
       // Javascript impl.  uses utf-8 encoding in pkcs1pad2 scheme
       
       Cipher cipher = Cipher.getInstance("RSA");
     byte[] cipherData = null;
     byte[] dataToEncrypt = toEncrypt.getBytes("UTF-8");
        try {
            cipher.init(Cipher.ENCRYPT_MODE, pub);
            cipherData = cipher.doFinal(dataToEncrypt);
        } catch (Exception e1) {
            System.out.println("Encrypt error");
        }
     //String s = Base64.encode(cipherData);
        String chypText = bytesToHex(cipherData) ;
        
     System.out.println(chypText);
     
     RSADecrypt(chypText);
    
     
     // Decrypt RSA, need Private Key:
      // See: http://www.java2s.com/Tutorial/Java/0490__Security/RSAexamplewithPKCS1Padding.htm
     
     // d is private exponent!!
     // http://stackoverflow.com/questions/7611383/generating-rsa-keys-in-pkcs1-format-in-java
     
     
  
     
     
    }
    public static void RSADecrypt(String chypText) throws NoSuchAlgorithmException, InvalidKeySpecException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException, NoSuchProviderException, NoSuchPaddingException, UnsupportedEncodingException
    {
          BigInteger modulus = new BigInteger("b112e5d5e231a6873ce765a1c1e259b460c732586ef742ab86d67cdcfe797d54a0f3cf1877533c725f492c495c28afb2c7b011a84b0e486864f1389c0ad059eaf9ce0d54e7a5953efb0210a742520ad1a4748d4f85eec26df07c06c40c7b2e709c9d345bcb2265c6867e47ae7282301321729eaa13120fed31b61d9dc564b693", 16);
          
          
         Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());

    KeyFactory factory2 = KeyFactory.getInstance("RSA");
   
    // Private Exponent for private key!
    BigInteger exponent2 = new BigInteger("91eb16c7384cde0417e63fd41aa7e27048481e6ecd92a8b81cb767d1dd4a544387172313f0510140e6d0afd40c43e2f59aa4b7084e4188ddae4131fb34d61921af3e65aadf51a4f91f0ea240a05798eab694d7ad06de1959dfa5bee7be1239b49c38e7c86834ef69d5adac2766c5b770457820dd81c6565111b3608cb36928f1", 16);
    
    
    RSAPrivateKeySpec spec2 = new RSAPrivateKeySpec(modulus, exponent2);
    PrivateKey privKey  =  factory2.generatePrivate(spec2);
      
       
    
    Cipher cipher2 = Cipher.getInstance("RSA/NONE/PKCS1Padding", "BC");
  
    System.out.print("CHYP TEXT: "+chypText); // IS HEX!!!!
    cipher2.init(Cipher.DECRYPT_MODE, privKey);
    
//Integer.parseInt(chypText, 16);
    
    byte[] plainText = cipher2.doFinal(hexStringToByteArray(chypText)); 
    System.out.println("plain : " + new String(plainText));
    // RSAPublicKeySpec spec = new RSAPublicKeySpec(modulus, exponent);
     
     
     
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

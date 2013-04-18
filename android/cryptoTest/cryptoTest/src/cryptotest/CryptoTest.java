/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cryptotest;

import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.RSAPublicKeySpec;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.Cipher;
import javax.crypto.NoSuchPaddingException;

/**
 *
 * @author ms
 */
public class CryptoTest {
    // Some good links:
    // http://stackoverflow.com/questions/2023549/creating-rsa-keys-from-known-parameters-in-java
    // http://stackoverflow.com/questions/9548569/java-unreliable-rsa-encryption-decryption-of-strings
    // http://www.pohlig.de/Unterricht/Inf2004/Kap26/26.4_Implementierung_von_RSA.htm
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, UnsupportedEncodingException {
        // TODO code application logic here
              String encrypted = "48c1af013a37e47a125a5586967eb6d0eec8979dedeae16da3f836e8b030cdc4e73d8df88fe6c28935d27b099741c8604e1148f91b792eb1e7d58aa36e4113735a7cc5f08871db57494ce7b1ff51e6aa72a6a3eb7c0a06e842613dc9a0c13cdb1f0802a59ac464da10f5fcfc84bf2246b92992fa47dc84fe64acaf5cf885ef85";
              
              String modulusStr = "b112e5d5e231a6873ce765a1c1e259b460c732586ef742ab86d67cdcfe797d54a0f3cf1877533c725f492c495c28afb2c7b011a84b0e486864f1389c0ad059eaf9ce0d54e7a5953efb0210a742520ad1a4748d4f85eec26df07c06c40c7b2e709c9d345bcb2265c6867e47ae7282301321729eaa13120fed31b61d9dc564b693";
              
             
              
       String toEncrypt = "Hello Worldöäü";
              
 
       BigInteger modulus = new BigInteger(modulusStr, 16);
       

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
        String outp = bytesToHex(cipherData) ;
        
     System.out.println(outp);
     
     
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
}

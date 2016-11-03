package com.mschultheiss.charmeapp.Crypto;

import java.security.SecureRandom;
import java.util.Random;

/**
 * Created by ms on 10/4/15.
 */
public class RandomString {

    private static char[] VALID_CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456879".toCharArray();

    // cs = cryptographically secure
    public static String alphaNumeric(int numChars) {
        SecureRandom srand = new SecureRandom();
        Random rand = new Random();
        char[] buff = new char[numChars];

        for (int i = 0; i < numChars; ++i) {
            // reseed rand once you've used up all available entropy bits
            if ((i % 10) == 0) {
                rand.setSeed(srand.nextLong()); // 64 bits of random!
            }
            buff[i] = VALID_CHARACTERS[rand.nextInt(VALID_CHARACTERS.length)];
        }
        return new String(buff);
    }
}

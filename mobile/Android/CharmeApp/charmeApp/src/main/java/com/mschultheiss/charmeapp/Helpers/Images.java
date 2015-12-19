package com.mschultheiss.charmeapp.Helpers;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

/**
 * Created by ms on 12/11/15.
 */
public class Images {
    public static Bitmap bmpFromBase64(String base64)
    {

        byte[] bytes = Base64.decode(base64, Base64.DEFAULT);

        Bitmap decodedByte = BitmapFactory.decodeByteArray(
                bytes, 0, bytes.length);


        return BitmapFactory.decodeByteArray(
                bytes, 0, bytes.length);

    }

}

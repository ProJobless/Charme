package com.mschultheiss.charmeapp.Helpers;

import org.json.JSONObject;

/**
 * Created by ms on 12/11/15.
 */
public class Time {
    public static double getCurrentTimeSecondsAsDouble()
    {
        double seconds = System.currentTimeMillis() / 1000;
        return seconds;
    }

    public static JSONObject getCurrentTimeSeconds()
    {

        try {
            double seconds = System.currentTimeMillis() / 1000;
            JSONObject date2 = new JSONObject();
            date2.put("sec", String.valueOf(seconds));

            return date2;
        }
        catch(Exception ea)
        {
            return new JSONObject();
        }
    }

}

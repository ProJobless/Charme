package com.mschultheiss.charmeapp.Helpers;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.preference.PreferenceManager;

import com.mschultheiss.charmeapp.R;

import org.json.JSONArray;

/**
 * Created by ms on 10/8/15.
 */
public class GroupTools {

    public static int getImageByReceivers(JSONArray names, Context context) {

        try {
            String a = "";
            for (int i = 0; i<names.length(); i++)
                a += names.getJSONObject(i).getString("userId");

            int[] numImages = {0, 0, 4, 2,4, 1,1}; // The available images for each peope count
            int receiverNumber = names.length();

            if (receiverNumber>numImages.length)
                return R.drawable.i91;
            else
            {

                int hah = a.hashCode()%numImages[names.length()];
                if (hah<0)
                    hah=hah*-1;
                hah+=1;
                String index = String.valueOf(names.length())+String.valueOf(hah);


                Resources resources = context.getResources();
                 int resourceId = resources.getIdentifier("i"+index, "drawable",
                        context.getPackageName());

                if (resourceId == 0)
                    resourceId = R.drawable.i91;

                return resourceId;
            }



        }
        catch(Exception x) {
            System.out.println(x.toString());
            return R.drawable.i91;
        }

    }

    public static String getNameByReceivers(JSONArray names, Context context) {

        SharedPreferences cookiePreferences = PreferenceManager.getDefaultSharedPreferences(context);
        String myUserId = cookiePreferences.getString("user_id", "'");

        try {
            String all = "";
            int namecounter = 0;
            for (int i = 0; i < names.length(); i++) {

                String s = names.getJSONObject(i).getString("name");
                String userId = names.getJSONObject(i).getString("userId");
                if (namecounter<3 && !myUserId.equals(userId)) {

                    namecounter++;

                    // Extract first name
                    String firstWord = null; // Only first name, not the last name
                    if (s.contains(" ")) {
                        s = s.substring(0, s.indexOf(" "));
                    }

                    // Add name
                    all += s;

                    // Add comma
                    if (namecounter < 4 && namecounter < (names.length() - 1))
                        all = all + ", ";
                    else if (namecounter  == (names.length()-1)) {
                        int moreCount  = names.length()-namecounter-1;
                        if (moreCount > 0)
                        all = all + " and "+String.valueOf(moreCount)+" more";
                    }
                }
            }

            if (namecounter == 0)
                    all = "Soliloquy";

            return all;
        }

        catch(Exception x) {
            System.out.println(x.toString());

            return "";
        }
    }
}

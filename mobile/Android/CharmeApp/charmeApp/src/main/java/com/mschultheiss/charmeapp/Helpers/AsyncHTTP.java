package com.mschultheiss.charmeapp.Helpers;

import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.preference.PreferenceManager;
import android.util.Log;

import com.mschultheiss.charmeapp.ORM.CharmeRequest;
import com.orm.SugarContext;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;

public class AsyncHTTP extends AsyncTask<AsyncHTTPParams, Void, String> {


    // public static  CookieManager cookieManager  = new CookieManager(null, CookiePolicy.ACCEPT_ALL);;
    //static CookieManager cookieManager = new CookieManager();

    protected String doInBackground(AsyncHTTPParams... data2) {

        String result = "";



        // Use the cache if allowed
        if (false && !data2[0].storageId.equals("")) // !Tools.isOnline(data2[0].Context)
        {
            // problem here:
            //List<CharmeRequest> cr2 = = new List<CharmeRequest>();
            try {
                /// TODO: delete old items!!!!!
                SugarContext.init(data2[0].Context);

                List<CharmeRequest> cr2 = CharmeRequest.find(CharmeRequest.class, "thekey = ?", data2[0].storageId);

                if (cr2.size() > 0)
                    return cr2.get(0).data;

                SugarContext.terminate();

                Log.d("CHARME", "GOT DATA " + cr2.get(0).data);

            } catch (Exception ee) {
                ee.printStackTrace();
            }
        }

        URL url;
        try {
            if (data2[0].Url != null && !data2[0].Url.equals(""))
                url = new URL(data2[0].Url);
            else if (data2[0].Server.equals(""))
                url = new URL("http://localhost:9000/charme/req.php");
            else
                url = new URL("http://"+data2[0].Server+"/charme/req.php");

            System.out.println("URL IS "+url.toString());

            HttpURLConnection urlConnection = (HttpURLConnection) url
                    .openConnection();

            urlConnection.setRequestMethod("POST");
            urlConnection.setDoInput(true);
            urlConnection.setDoOutput(true);

            //CookieHandler.setDefault(cookieManager);
            SharedPreferences shp = PreferenceManager.getDefaultSharedPreferences(data2[0].Context);
            String sessionIdPHP = shp.getString("PHPSESSID", "");
            if (!sessionIdPHP.equals(""))
            urlConnection.setRequestProperty("COOKIE", "PHPSESSID="+sessionIdPHP);


            String param = "d=" + URLEncoder.encode(data2[0].PostData, "UTF-8");

            urlConnection.setFixedLengthStreamingMode(param.getBytes().length);
            urlConnection.setRequestProperty("Content-Type",
                    "application/x-www-form-urlencoded");
            PrintWriter out = new PrintWriter(urlConnection.getOutputStream());
            System.out.println(param);

            out.print(param);
            out.close();

            BufferedReader rd = new BufferedReader(new InputStreamReader(
                    urlConnection.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line = null;

            while ((line = rd.readLine()) != null) {
                sb.append(line + '\n');
            }


            result = sb.toString();

            if (!data2[0].storageId.equals("") && !result.equals("")) {
                // todo delete old items before inserting new ones!
                SugarContext.init(data2[0].Context);
              CharmeRequest.deleteAll(CharmeRequest.class, "thekey = ?", data2[0].storageId);

                // Save result to db if cacheable
                System.out.println("Cache data "+data2[0].storageId+" save: "+result);
                CharmeRequest cr = new CharmeRequest(data2[0].storageId, result);
                cr.save();
                SugarContext.terminate();
            }

        } catch (Exception e) {
            Log.d("CHARME", "exception in http request" + e.toString());
            e.printStackTrace();
        }
        return result;
    }

    protected void onProgressUpdate(Integer... progress) {
        // ...

    }

}
package com.example.charmeapp;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

import android.os.AsyncTask;
import android.util.Log;



public class AsyncHTTP extends AsyncTask<AsyncHTTPParams, Void, String> {
	


	
	 protected String doInBackground(AsyncHTTPParams... data2) {

		String result = "";

		URL url;
		try {
			url = new URL("http://charme.local/charme/req.php");
			// user_login, u, p

			// POST DATA: data.data

			HttpURLConnection urlConnection = (HttpURLConnection) url
					.openConnection();

			urlConnection.setRequestMethod("POST");
			urlConnection.setDoInput(true);
			urlConnection.setDoOutput(true);
			// Set cookie manager for maintaining sessions.
			CookieManager cookieManager = new CookieManager();
			CookieHandler.setDefault(cookieManager);

			// WARNING:
			// is data2[0].PostData ok?
			//
			String param = "d=" + URLEncoder.encode(data2[0].PostData, "UTF-8");

			System.out.println("PARAM" + param);

			// +"&param2="+URLEncoder.encode("value2","UTF-8")
			;
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

			System.out.println("CTCB: " + sb.toString());
			result = sb.toString();

		} catch (Exception e) {
			Log.d("CHARME", "exception in http request");
		}
		return result;

	}

	protected void onProgressUpdate(Integer... progress) {
		// ...

	}

}
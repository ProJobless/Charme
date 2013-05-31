package com.mschultheiss.charme.HTTP;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.HttpURLConnection;
import java.net.URL;

import android.os.AsyncTask;

public class ConnectionTask extends AsyncTask<ConnectionTaskParams, Void, String> {  

	 	private OnConnectionTaskCompleteListener listener;
		public void ConnectionTask(OnConnectionTaskCompleteListener occ)
		{
			this.listener=occ;
		}
		interface OnConnectionTaskCompleteListener {
		    void onLoginComplete(String response);
		}
	
		 @Override
		 protected void onPostExecute(String result) {
			 // Call Callback...
		     this.listener.onLoginComplete(result);
		       
		 }
		 
		 private String result = "";
		
			
		 @Override
		 protected String doInBackground(ConnectionTaskParams... data)
		 {
				URL url;
			    try {
			        url = new URL("http://10.149.35.85/charme/req.php");
			        // user_login, u, p
			        
			        //POST DATA: data.data
			        
			        
			        HttpURLConnection urlConnection = (HttpURLConnection) url
			                .openConnection();
			        
			        urlConnection.setRequestMethod("POST");
			        
			        // Set cookie manager for maintaining sessions.
			        CookieManager cookieManager = new CookieManager();  
			        CookieHandler.setDefault(cookieManager);
			        
			    
			         BufferedReader rd = new BufferedReader
			        		 (new InputStreamReader(urlConnection.getInputStream()));
			         
			         StringBuilder  sb = new StringBuilder();
			        
			         String line = null;
			         
			          while ((line = rd.readLine()) != null)
			          {
			              sb.append(line + '\n');
			          }
			        
			          System.out.println("CTCB: "+sb.toString());
			          result = sb.toString();
			  

			          return result;
			          
			         // return sb.toString();
			          
			   
			        
			        
			    } catch (Exception e) {
			       
			      return null;
			      
			    }
		 }


}
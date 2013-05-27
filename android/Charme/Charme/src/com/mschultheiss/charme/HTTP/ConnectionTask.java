package com.mschultheiss.charme.HTTP;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.CookieHandler;
import java.net.CookieManager;
import java.net.HttpURLConnection;
import java.net.URL;

class ConnectionTask{
	 public ConnectionTask()
	 {
		 
	 }
	 public String getResponse(String data)
	 {
			URL url;
		    try {
		        url = new URL("http://10.149.35.85/charme/req.php");
		        // user_login, u, p
		        
		        
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
		        
		          System.out.println(sb.toString());
		          return sb.toString();
		          
		   
		        
		        
		    } catch (Exception e) {
		       
		        e.printStackTrace();
		        return null;
		    }
	 }


}
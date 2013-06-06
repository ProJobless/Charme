package com.mschultheiss.charme;



import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.mschultheiss.charme.HTTP.ConnectionTask;
import com.mschultheiss.charme.HTTP.ConnectionTaskParams;
import com.mschultheiss.charme.HTTP.OnConnectionTaskCompleted;


public class MessagesActivity extends Activity  {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		/*
		 
		 TODO List:
		 
		 - 1. Login: Decode RSA, 
		 - 2. Message Viewer
		 - 3. Sync Contacts
		 - 4. Parse...
		  
		  
		 
		 */
		
	
		//System.out.println("DECRYPTED AES: "+CharmeCrypto.DecryptAES("cbN9TYEFmKuhjuc", "key"));
		
		setContentView(R.layout.activity_messages);
		
		final MessagesActivity that = this;
		
		  final Button button = (Button) findViewById(R.id.buttonLogin);
		  button.setEnabled(true);
		     button.setOnClickListener(new View.OnClickListener() {
		         public void onClick(View v) {
		        	 
		        	// button.setEnabled(false);
		        	 doLogin();
		        	 button.setEnabled(false);
		        	 // Start new activity for selecting messages
		        	 
		        	 
		        	 
		        	 //Intent intent = new Intent(that.getBaseContext(), MessageSelect.class);
		        	 //startActivity(intent);
		        	 
		        	
		     }
		 });
	}
	
	
	public static String passphrase = "neeiZk2PTlkrv76xxqY7";
	public boolean doLogin()
	{
		
		  try {
			  // JSON Tutorial at http://www.mkyong.com/java/json-simple-example-read-and-write-json/
			
			  JSONObject object = new JSONObject();
			  
			  JSONArray list = new JSONArray();
			  
			
			
			  JSONObject r1 = new JSONObject();
			  r1.put("u", "testuser@10.149.35.85");
			  r1.put("p", "testuser");
			  r1.put("id", "user_login");
			  
			  list.put(r1);
			  
			  object.put("requests", list);
		    
		    
		    new ConnectionTask(new OnConnectionTaskCompleted() {
				
				@Override
				public void OnConnectionTaskCompleted(String result) {
					
					if (result == "")
						Toast.makeText(getApplicationContext(), "Something went wrong. Check your internet connection.", Toast.LENGTH_SHORT).show();
					else
					{
						// Parse returned JSON here.
					System.out.println("GOT RESULT:"+result);
					
					try {
						JSONObject jo = new JSONObject(result);
						if (jo.getString("status") == "PASS")
						{
							// Now the Session exists!, lets go!
							String rsaStr = jo.getJSONObject("user_login").getString("rsa");
							System.out.println("rsa22"+rsaStr);
							
							// Get public and private key encrypted with passphrase
							JSONObject rsaEnc = new JSONObject(rsaStr);
							
							// AES Decode it
							rsaEnc.getString("ct");
							
						}
						
						
						
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					}
					
					  final Button button = (Button) findViewById(R.id.buttonLogin);
						 button.setEnabled(true);
					
				}
			}).execute(
			    		new ConnectionTaskParams(
			    		object.toString()
			    		)
		    		);

		   // com.mschultheiss.charme.HTTP.ConnectionTask.getJSON(object);
		    return true;
		  }
		  catch(Exception ef)
		  {
			  System.out.println("CHAR2"+ef.toString());
			  
		  }
		  return false;
	
	}
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.messages, menu);
		return true;
	}

	

}

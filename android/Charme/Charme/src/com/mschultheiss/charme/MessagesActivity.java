package com.mschultheiss.charme;



import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.mschultheiss.charme.HTTP.ConnectionTask;
import com.mschultheiss.charme.HTTP.ConnectionTaskParams;
import com.mschultheiss.charme.HTTP.OnConnectionTaskCompleted;

public class MessagesActivity extends Activity implements OnConnectionTaskCompleted {

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
		
	
		
		
		setContentView(R.layout.activity_messages);
		
		final MessagesActivity that = this;
		
		  final Button button = (Button) findViewById(R.id.buttonLogin);
		     button.setOnClickListener(new View.OnClickListener() {
		         public void onClick(View v) {
		        	 
		        	// button.setEnabled(false);
		        	 doLogin();
		        	 
		        	 
		        	 // Start new activity for selecting messages
		        	 
		        	 
		        	 
		        	 //Intent intent = new Intent(that.getBaseContext(), MessageSelect.class);
		        	 //startActivity(intent);
		        	 
		        	
		     }
		 });
	}
	
	@Override
	public void OnConnectionTaskCompleted(String result) {
		 Toast.makeText(getApplicationContext(), "Task completed"+result, Toast.LENGTH_SHORT).show();


		
	}
	public boolean doLogin()
	{
		
		  try {
			JSONObject object = new JSONObject();
			object.put("u", "testuser@10.159.35.85");
		    object.put("p", "password");
		    object.put("id", "user_login");
		    
		    new ConnectionTask().execute(
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

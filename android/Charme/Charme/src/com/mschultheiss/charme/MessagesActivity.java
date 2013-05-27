package com.mschultheiss.charme;



import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.view.Menu;
import android.view.View;
import android.widget.Button;

public class MessagesActivity extends Activity {

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
		        	 
		        	 // Start new activity for selecting messages
		        	 Intent intent = new Intent(that.getBaseContext(), MessageSelect.class);
		        	 startActivity(intent);


		     }
		 });
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.messages, menu);
		return true;
	}

}

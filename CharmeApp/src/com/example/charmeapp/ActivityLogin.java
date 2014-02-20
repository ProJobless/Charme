package com.example.charmeapp;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;


public class ActivityLogin extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_activity_login);
        
    	Button buttonLogin = (Button) findViewById(R.id.button1);
    	buttonLogin.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				
				
				tryLogin("","","");
			}
		});
    	
    }
    public void tryLogin(String username, String password, String passphrase)
    {
    	
		try {

			JSONObject object = new JSONObject();

			JSONArray list = new JSONArray();

			JSONObject r1 = new JSONObject();
			r1.put("u", "mobile@192.168.43.31");
			r1.put("p", "test"); // TODO: Challenge respond
			r1.put("id", "user_login");

			list.put(r1);

			object.put("requests", list);

			new AsyncHTTP(){

				@Override
				protected void onPostExecute(String result) {
					
				
					if (result == "")
						Toast.makeText(
								getApplicationContext(),
								"Something went wrong. Check your internet connection or server status.",
								Toast.LENGTH_SHORT).show();
					else {
						// Parse returned JSON here.
						System.out.println("GOT RESULT:" + result);

						try {
							JSONObject jo = new JSONObject(result);
							
							System.out.println("STATUS IS"+jo.getJSONObject("user_login").getString("status"));
							if (jo.getJSONObject("user_login").getString("status").equals("PASS")) {
								// Now the Session exists!, lets go!
								
								
								System.out.println("CHARME33: RSA STR NOW");

								
								
								String rsaStr = jo.getJSONObject("user_login").getJSONObject("ret").getString("keyring");
								
								
								GibberishAESCrypto gib = new GibberishAESCrypto();
								
								System.out.println("CHARME33: RSA STR IS " + rsaStr);

								String passphrase = "FutyUJD0qGOtW3QSQIHK"; //FutyUJD0qGOtW3QS
								// Only use 16 bytes of passphrase
								try{
								System.out.println("CHARME33:" + gib.decrypt(rsaStr,  passphrase.toCharArray()));
								}
								catch(Exception ee){}
								
								//jo.getJSONObject("user_login").getObject("status")
								
								
								// Start new activity
								
								
								// Decode RSA
								Intent intent = new Intent(getBaseContext(), Talks.class);
						    	startActivity(intent);
							}
							else if (jo.getJSONObject("user_login").getString("status").equals("FAIL")) {
								
								System.out.println("CHARME1: LOGIN FAILED BECAUSE OF CREDENTIALS");
								Toast.makeText(
										getApplicationContext(),
										"Wrong username, password or passphrase.",
										Toast.LENGTH_SHORT).show();
								
							}
								

						} catch (JSONException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}

					final Button button = (Button) findViewById(R.id.button1);
					button.setEnabled(true);

				}
			}.execute(new AsyncHTTPParams(object.toString()));

			// com.mschultheiss.charme.HTTP.ConnectionTask.getJSON(object);
	
		} catch (Exception ef) {
			System.out.println("CHAR2" + ef.toString());

		}

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.activity_login, menu);
        return true;
    }
    
}

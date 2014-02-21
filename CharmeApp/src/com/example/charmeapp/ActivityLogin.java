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
    public static RSAObj global_rsakey;
    public static JSONArray global_keyring;
    
    public static JSONObject findKey(int revision)
    {	
    	JSONObject oo2 = new JSONObject();
    	try{
    	// Revision 0 -> newest
    	
    	if (revision == 0)
    	{

			System.out.println("CH1: revision 0");
    		int newestrev= 0;
    		
			for (int i = 0; i < global_keyring.length(); i++) {
			JSONObject oo = global_keyring.getJSONObject(i);
			if (oo.getInt("revision") > newestrev)
				newestrev = oo.getInt("revision");
			
				System.out.println("NEWEST REV IS "+newestrev);
				oo2 = oo;
				
			}
			return oo2;
			
			
			
    	}
    	else
    	{
    
    
			for (int i = 0; i < global_keyring.length(); i++) {
			JSONObject oo = global_keyring.getJSONObject(i);
			if (revision == oo.getInt("revision"))
				return oo;
				
			}
    	}}
    	catch(Exception ee){ }
    	return oo2;
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
								
								
							
								
								System.out.println("CHARME33: RSA STR IS " + rsaStr);

								String passphrase = "FutyUJD0qGOtW3QSQIHK"; // This is  the passphrase
								// Only use 16 bytes of passphrase
								try{
									GibberishAESCrypto gib = new GibberishAESCrypto();
								String aesdec = gib.decrypt(rsaStr,  passphrase.toCharArray());
								
								global_keyring = new JSONArray(aesdec); 
								// object contains fastkey1, fastkey2, revision, rsa.n, rsa.e, rsa.d, rsa.p, rsa.q
								global_rsakey = new RSAObj();
								
								
								global_rsakey.n = findKey(0).getJSONObject("rsa").getJSONObject("rsa").getString("n");
								global_rsakey.e = findKey(0).getJSONObject("rsa").getJSONObject("rsa").getString("e");
								global_rsakey.d = findKey(0).getJSONObject("rsa").getJSONObject("rsa").getString("d");
								
								
								}
								catch(Exception ee){
									System.out.println("error10:"+ee.toString());
									Toast.makeText(
											getApplicationContext(),
											"Wrong passphrase",
											Toast.LENGTH_SHORT).show();
								}
								
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
										"Wrong user id or password. Make sure you enter full user id (e.g. you@yourserver.com).",
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

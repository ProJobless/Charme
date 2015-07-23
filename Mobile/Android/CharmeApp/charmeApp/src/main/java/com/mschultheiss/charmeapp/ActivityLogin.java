package com.mschultheiss.charmeapp;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.Menu;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class ActivityLogin extends Activity {

	public void dbTest()
	{
		System.out.println("dbTEST");
		sqLiteHelper db = new sqLiteHelper(this);

	}

    SharedPreferences sharedPref;
    @Override
    protected void onCreate(Bundle savedInstanceState) {

		GibberishAESCrypto a = new GibberishAESCrypto();
		try {

			a.encrypt("meinedaten", "test".toCharArray());
			System.out.println("cdebug2");

			System.out.println("cdebug" + a.decrypt(a.encrypt("meinedaten", "test".toCharArray()), "test".toCharArray()));
		}
		catch(Exception ea) {
			System.out.println("cdebug"+ea.toString());
			ea.printStackTrace();
		}

    	// If user is already logged in open Messages Overview
    	sharedPref =  PreferenceManager.getDefaultSharedPreferences(this);
        Intent intent = getIntent();

    	if (!sharedPref.getString("user_rsaN", "").equals("") && intent.getBooleanExtra("autoLogin", true)) // login already exist and allow autologin
    	{
    		super.onCreate(savedInstanceState);
    		tryLogin(sharedPref.getString("user_id", ""),sharedPref.getString("user_passwordhash", ""),"KEYRINGALREADYEXISTS", true);
    	}
    	else
    	{
	    	// Else open login window (=this activity)
	    	super.onCreate(savedInstanceState);
	        setContentView(R.layout.activity_activity_login);

            Window window = this.getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);

            Button buttonLogin = (Button) findViewById(R.id.button1);
	    	buttonLogin.setOnClickListener(new View.OnClickListener() {
				@Override
				public void onClick(View v) {

			tryLogin(
					((EditText)findViewById(R.id.editTextUserid)).getText().toString(),
					((EditText)findViewById(R.id.EditTextPassword)).getText().toString(),
					((EditText)findViewById(R.id.editTextPassphrase)).getText().toString(), false
					);
				}
			});
    	}
    }

    public void StartLogin()
    {
    	global_rsakey = new RSAObj();
    	global_rsakey.n = sharedPref.getString("user_rsaN", "");
    	global_rsakey.e =  sharedPref.getString("user_rsaE",  "");
    	global_rsakey.d = sharedPref.getString("user_rsaD",  "");

    	if (!global_rsakey.n.equals( ""))
    	{
    	try
    	{

    	}
    	catch(Exception ea){
    		
    	}
  
		Intent intent = new Intent(getBaseContext(), Talks.class);
    	startActivity(intent);
      	finish();
    	}
    	else
    	{
    		Toast.makeText(
					getApplicationContext(),
					"Unable to login. Please check your connection.",
					Toast.LENGTH_SHORT).show();

    	}
    	
    	
    }
    private RSAObj global_rsakey;

    
    public static JSONObject findKey(int revision, Context ctx, String ring)
    {
        System.out.println("ring is "+ring);

        JSONArray global_keyring = null;
      try {
           global_keyring = new JSONArray(ring);
      }catch(Exception ea)
      {
          System.out.println("CHARME FATAL ERROR: Global keyring not found.");
          ea.printStackTrace();
      }
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

    public void tryLogin(final String userid, final String password, final String passphrase, final boolean isPasswordHash)
    {
    	final ActivityLogin that = this;
  
    	
    	if (!Tools.isOnline(this))
    	{	
    		StartLogin(); // try login if there is not internet connection
    		return;
    	}
    	
		try 
		{
			// Get salt value
			JSONObject objectSalt = new JSONObject();
			JSONArray listSalt = new JSONArray();
			JSONObject jsonSaltRequest = new JSONObject();
			jsonSaltRequest.put("userid", userid);
			jsonSaltRequest.put("id", "reg_salt_get");
			listSalt.put(jsonSaltRequest);
			objectSalt.put("requests", listSalt);

			final String server = userid.split("@")[1];

			new AsyncHTTP(){

				 String hashpass = "";

				@Override
				protected void onPostExecute(String result2) {
					
					try{


					System.out.println("result2  "+result2);
					JSONObject jo2 = new JSONObject(result2);
					String saltvalue = jo2.getJSONObject("reg_salt_get").getString("salt");
					System.out.println("saltvalue 1: "+saltvalue+" saltvalue");
					if (!isPasswordHash)
					 hashpass = Crypto.makeSha256(password+saltvalue, true);
					else
						hashpass = password;

					JSONObject object = new JSONObject();
					JSONArray list = new JSONArray();
					JSONObject r1 = new JSONObject();
					r1.put("u", userid);
					r1.put("p", hashpass); // TODO: Challenge respond
					r1.put("id", "user_login");
		
					list.put(r1);
		
					object.put("requests", list);
					
			new AsyncHTTP(){
				
				@Override
				protected void onPostExecute(String result) {
					
					System.out.println("CHARME 1: STEP 2");
				
					if (result.isEmpty())
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

								// Now the Session exists!, save the id and proceed login!
                                SharedPreferences cookiePreferences = that.getSharedPreferences("CHARME_COOKIE_PREFERENCES", Context.MODE_PRIVATE);
                                SharedPreferences.Editor e = cookiePreferences.edit();
                                e.putString("PHPSESSID", jo.getJSONObject("user_login").getString("sessionId"));



								if (jo.getJSONObject("user_login").has("gcmprojectid"))
                                e.putString("GCM_PROJECT_ID", jo.getJSONObject("user_login").getString("gcmprojectid"));
                                e.commit(); // save changes


                                System.out.println("GCM4 ID IS "+jo.getJSONObject("user_login").getString("gcmprojectid"));
								
								
								String rsaStr = jo.getJSONObject("user_login").getJSONObject("ret").getString("keyring");
								
								if (!passphrase.equals("KEYRINGALREADYEXISTS"))  // Keyring already exists
								{
									// Only use 16 bytes of passphrase
									try{

										GibberishAESCrypto gib = new GibberishAESCrypto();
										String userKeyRing = gib.decrypt(rsaStr,  passphrase.toCharArray()); // userKeyRing contains all public and private keys of the current user

										// Setup keyring first
										System.out.println("user_keyring is "+sharedPref.getString("user_keyring", ""));

										SharedPreferences.Editor editor2 = sharedPref.edit();
										editor2.putString("server", server);

										editor2.putString("user_keyring",   userKeyRing);
										editor2.putString("user_rsaN",  findKey(0, that,  userKeyRing).getJSONObject("rsa").getJSONObject("rsa").getString("n"));
										editor2.putString("user_rsaE",  findKey(0, that,  userKeyRing).getJSONObject("rsa").getJSONObject("rsa").getString("e"));
										editor2.putString("user_rsaD",  findKey(0, that,  userKeyRing).getJSONObject("rsa").getJSONObject("rsa").getString("d"));
										editor2.putString("user_id",  userid.replace("localhost:9000", "charme.local")); //localhost 9000 can be used for debug
										editor2.putString("user_passwordhash",  hashpass);
										editor2.commit();

									}
							    	catch(Exception ee){
										System.out.println("error10:"+ee.toString());
										Toast.makeText(
												getApplicationContext(),
												"Wrong passphrase",
												Toast.LENGTH_SHORT).show();
									}
								}

						    	StartLogin();
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
					
					if (button != null)
					button.setEnabled(true);

				}
			}.execute(new AsyncHTTPParams(object.toString(), that, "", server));
			
			}
			catch(Exception ee){
				System.out.println("CHARME ERROR 1: Not connected to server?");
				ee.printStackTrace();
				StartLogin();
			}
			}
			
			}.execute(new AsyncHTTPParams(objectSalt.toString(), this, "", server));
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

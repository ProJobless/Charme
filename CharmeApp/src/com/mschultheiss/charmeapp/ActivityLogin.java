package com.mschultheiss.charmeapp;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.mschultheiss.charmeapp.ORM.CharmeRequest;
import com.orm.SugarContext;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;


public class ActivityLogin extends Activity {

	public void dbTest()
	{
		System.out.println("dbTEST");
		sqLiteHelper db = new sqLiteHelper(this);
		db.addMessage("testmessage", "conversationId", 1, "irgendwer");
		
		
		
	}

	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
       
    	// If user is already logged in open Messages Overview
    	

    	SharedPreferences sharedPref = this.getPreferences(Context.MODE_PRIVATE);

    	
    	
    	
    	if (!sharedPref.getString("user_rsaN", "").equals("")) // login already exist
    	{
    		
    	
    		
    		super.onCreate(savedInstanceState);
    		
    		
    		
    		
    		dbTest();
    	
    		
    		
    		
    		
    		
    		
    		
    		
    		
    		
    		
    		
    		
    		// oKuPCeiB9STehwBguYyF, Passphrase can be empty here as we already own the keyring!
    		tryLogin(sharedPref.getString("user_id", ""),sharedPref.getString("user_passwordhash", ""),"KEYRINGALREADYEXISTS", true);
    		//StartLogin();
    		
    		
    	}
    	else
    	{

	    	// Else open login window (=this activity)
	    	super.onCreate(savedInstanceState);
	        setContentView(R.layout.activity_activity_login);
	        
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
    public static String global_userid = "";
    public void StartLogin()
    {
    	// Set global Variables from settings
 
    	
    	
    	SharedPreferences sharedPref = this.getPreferences(Context.MODE_PRIVATE);

    	

    	global_rsakey = new RSAObj();
    	global_rsakey.n = sharedPref.getString("user_rsaN", "");
    	global_rsakey.e =  sharedPref.getString("user_rsaE",  "");
    	global_rsakey.d = sharedPref.getString("user_rsaD",  "");
    	
    	global_userid = sharedPref.getString("user_id",  "");
    	
    	
    	String ring =  sharedPref.getString("user_keyring",  "");
    	if (!global_rsakey.n.equals( ""))
    	{
    	try
    	{
		global_keyring = new JSONArray(ring); 
		// object contains fastkey1, fastkey2, revision, rsa.n, rsa.e, rsa.d, rsa.p, rsa.q
	

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
					
					
					System.out.println("hashpass 1: "+hashpass);
						
		
					
			
					JSONObject object = new JSONObject();
		
					JSONArray list = new JSONArray();
		
					JSONObject r1 = new JSONObject();
					r1.put("u", userid);
					r1.put("p", hashpass); // TODO: Challenge respond
					r1.put("id", "user_login");
		
					list.put(r1);
		
					object.put("requests", list);
					//System.out.println("CHARME 1: STEP HASHPASS IS"+mypassword+saltvalue);
					
					
			new AsyncHTTP(){
				
				@Override
				protected void onPostExecute(String result) {
					
					System.out.println("CHARME 1: STEP 2");
				
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
								
								if (jo.getJSONObject("user_login").getJSONObject("ret").has("gcmprojectid"))
								Talks.SENDER_ID = jo.getJSONObject("user_login").getJSONObject("ret").getString("gcmprojectid");
								
								
								
								String rsaStr = jo.getJSONObject("user_login").getJSONObject("ret").getString("keyring");
								
								if (!passphrase.equals("KEYRINGALREADYEXISTS"))  // Keyring already exists
								{
									// Only use 16 bytes of passphrase
									try{
										GibberishAESCrypto gib = new GibberishAESCrypto();
									String aesdec = gib.decrypt(rsaStr,  passphrase.toCharArray());
									
									
							    	SharedPreferences sharedPref = that.getPreferences(Context.MODE_PRIVATE);
	
							    	SharedPreferences.Editor editor = sharedPref.edit();
							    	
							    	// Setup keyring first
							    	ActivityLogin.global_keyring = new JSONArray(aesdec); 
							    	editor.putString("user_rsaN",  findKey(0).getJSONObject("rsa").getJSONObject("rsa").getString("n"));
							    	editor.putString("user_rsaE",  findKey(0).getJSONObject("rsa").getJSONObject("rsa").getString("e"));
							    	editor.putString("user_rsaD",  findKey(0).getJSONObject("rsa").getJSONObject("rsa").getString("d"));
							    	editor.putString("user_keyring",  aesdec);
							    	editor.putString("user_id",  userid);
							    	editor.putString("user_passwordhash",  hashpass);
							    	
							    	ActivityLogin.global_userid = userid;
							    	editor.commit();
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
			}.execute(new AsyncHTTPParams(object.toString(), that, ""));
			
			}
			catch(Exception ee){
				
				System.out.println("CHARME ERROR 1: Not connected to server?");
				ee.printStackTrace();
				StartLogin();
				
			}
			}
			
			}.execute(new AsyncHTTPParams(objectSalt.toString(), this, ""));
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

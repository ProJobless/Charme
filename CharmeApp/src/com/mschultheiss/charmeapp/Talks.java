package com.mschultheiss.charmeapp;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.json.JSONArray;
import org.json.JSONObject;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.mschultheiss.charmeapp.TalksMessages.MessageItem;

public class Talks extends Activity {

	private BroadcastReceiver receiver;
	private final static int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;

	private boolean checkPlayServices() {
		int resultCode = GooglePlayServicesUtil
				.isGooglePlayServicesAvailable(this);
		if (resultCode != ConnectionResult.SUCCESS) {
			if (GooglePlayServicesUtil.isUserRecoverableError(resultCode)) {
				GooglePlayServicesUtil.getErrorDialog(resultCode, this,
						PLAY_SERVICES_RESOLUTION_REQUEST).show();
			} else {
				Log.i("CHARME",
						"This device is not supported by Play Services.");
				finish();
			}
			return false;
		}
		return true;
	}

	@Override
	protected void onResume() {
		super.onResume();
		checkPlayServices();
	}

	public static final String EXTRA_MESSAGE = "message";
	public static final String PROPERTY_REG_ID = "registration_id";
	private static final String PROPERTY_APP_VERSION = "1";

	/**
	 * Substitute you own sender ID here. This is the project number you got
	 * from the API Console, as described in "Getting Started."
	 */
	public static String SENDER_ID = "";

	/**
	 * Tag used on log messages.
	 */
	static final String TAG = "GCMDemo";

	TextView mDisplay;
	GoogleCloudMessaging gcm;
	AtomicInteger msgId = new AtomicInteger();
	SharedPreferences prefs;
	Context context;

	String regid;

	/**
	 * @return Application's version code from the {@code PackageManager}.
	 */
	private static int getAppVersion(Context context) {
		try {
			PackageInfo packageInfo = context.getPackageManager()
					.getPackageInfo(context.getPackageName(), 0);
			return packageInfo.versionCode;
		} catch (NameNotFoundException e) {
			// should never happen
			throw new RuntimeException("Could not get package name: " + e);
		}
	}

	/**
	 * Gets the current registration ID for application on GCM service.
	 * <p>
	 * If result is empty, the app needs to register.
	 * 
	 * @return registration ID, or empty string if there is no existing
	 *         registration ID.
	 */

	private String getRegistrationId(Context context) {
		final SharedPreferences prefs = getGCMPreferences(context);
		String registrationId = prefs.getString(PROPERTY_REG_ID, "");
		if (registrationId.isEmpty()) {
			Log.i(TAG, "Registration not found.");
			return "";
		}
		// Check if app was updated; if so, it must clear the registration ID
		// since the existing regID is not guaranteed to work with the new
		// app version.
		int registeredVersion = prefs.getInt(PROPERTY_APP_VERSION,
				Integer.MIN_VALUE);
		int currentVersion = getAppVersion(context);
		if (registeredVersion != currentVersion) {
			Log.i(TAG, "App version changed.");
			return "";
		}
		return registrationId;
	}

	@Override
	public void onDestroy() {

		super.onDestroy();

		if (receiver != null)
			unregisterReceiver(receiver);

	}

	/**
	 * @return Application's {@code SharedPreferences}.
	 */
	private SharedPreferences getGCMPreferences(Context context) {
		// This sample app persists the registration ID in shared preferences,
		// but
		// how you store the regID in your app is up to you.
		return getSharedPreferences(Talks.class.getSimpleName(),
				Context.MODE_PRIVATE);
	}

	/**
	 * Sends the registration ID to a CHARME Server over HTTP, so it can use
	 * GCM/HTTP or CCS to send messages to your app.
	 */
	private void sendRegistrationIdToBackend(final String regId) {
		// apl_request: gcm_registerId
		System.out.println("CHARME44 REGISTER IN BG: Send to backend");

		try {

			JSONObject object = new JSONObject();
			JSONArray list = new JSONArray();

			JSONObject r1 = new JSONObject();
			r1.put("id", "gcm_register");
			r1.put("regId", regId);

			list.put(r1);

			object.put("requests", list);

			new AsyncHTTP() {

				protected void onPostExecute(String result) {

					System.out.println("RESULT IS:" + result);
					try {

						System.out
								.println("CHARME44 REGISTER IN BG: Send to backend completed");

						System.out
								.println("DEVICE REGISTRED SUCCESFUL FOR GCM");

					} catch (Exception ex) {
						System.out.println("CHARME ERROR2" + ex.toString());
					}

				}

			}.execute(new AsyncHTTPParams(object.toString()));
		} catch (Exception ex) {
			System.out.println("CHARME1234 ERROR" + ex.toString());
		}

	}

	private void registerInBackground() {

		System.out.println("CHARME44 REGISTER IN BG");
		new AsyncTask() {

			protected Object doInBackground(Object... params) {

				System.out.println("CHARME44 START ASYNC");
				String msg = "";
				try {
					if (gcm == null) {
						gcm = GoogleCloudMessaging.getInstance(context);
					}
					regid = gcm.register(Talks.SENDER_ID);
					msg = "Device registered, registration ID=" + regid;

					// Send notification ID to Charme Backend Server
					sendRegistrationIdToBackend(regid);

					storeRegistrationId(context, regid);
				} catch (IOException ex) {
					msg = "Error :" + ex.getMessage();
					System.out.println("CHARME44 reg error: " + msg);
					// If there is an error, don't just keep trying to register.
					// Require the user to click a button again, or perform
					// exponential back-off.
				}
				return msg;
			}

			protected void onPostExecute(String msg) {
				System.out.println("CHARME44 reg error: " + msg);
			}

		}.execute(null, null, null);

	}

	/**
	 * Stores the registration ID and app versionCode in the application's
	 * {@code SharedPreferences}.
	 * 
	 * @param context
	 *            application's context.
	 * @param regId
	 *            registration ID
	 */
	private void storeRegistrationId(Context context, String regId) {

		final SharedPreferences prefs = getGCMPreferences(context);
		int appVersion = getAppVersion(context);
		Log.i(TAG, "Saving regId on app version " + appVersion);
		SharedPreferences.Editor editor = prefs.edit();
		editor.putString(PROPERTY_REG_ID, regId);
		editor.putInt(PROPERTY_APP_VERSION, appVersion);
		editor.commit();
	}

	boolean forceNewRegId = false; // For debugging only.

	void registerBCReceiver() {

		if (receiver != null) return;
		
		receiver = new BroadcastReceiver() {
			@Override
			public void onReceive(Context context, Intent intent) {

				String action = intent.getAction();
				if (action
						.equals("com.mschultheiss.charmeapp.actions.newmessage")) {

					// ...call update.
					String conId = intent.getExtras().getString(
							"conversationId");
					System.out.println("CONVERSATION ID IS " + conId);

					boolean found = false;
					for (int i = 0; i < list2.size(); i++) {
						if (conId.equals(((TalkItem) list2.get(i)).ConversationId))
						{((TalkItem) list2.get(i)).inc();
						
						found = true;
						}
						
					}
					if (found)
						System.out.println("found");
					else
						System.out.println("not found");
					adapter.notifyDataSetChanged();
					
					if (found)
						adapter.update(list2);

					if (!found) // New Conversation --> Update all messages
					{

						updateMessages();
					}
				}

			}
		};

		IntentFilter filter = new IntentFilter();

		// Register receivers here!!!!
		filter.addAction("com.mschultheiss.charmeapp.actions.newmessage");

		registerReceiver(receiver, filter);
	}

	public ArrayList<TalkItem> list2;
	Talks.StableArrayAdapter adapter;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_talks);
		
		list2 =  new ArrayList<TalkItem>();
		

		context = getApplicationContext();

		if (checkPlayServices()) {
			gcm = GoogleCloudMessaging.getInstance(this);
			regid = getRegistrationId(context);

			if (regid.isEmpty() || forceNewRegId) {
				registerInBackground();
			} else
				System.out.println("regid is " + regid);
		}
		
		updateMessages();

	}

	void updateMessages() {
		
		list2 =  new ArrayList<TalkItem>();
		final ListView listview = (ListView) findViewById(R.id.listView1);

		final Talks that = this;

		try {

			JSONObject object = new JSONObject();

			JSONArray list = new JSONArray();

			JSONObject r1 = new JSONObject();
			r1.put("countReturn", true);
			r1.put("start", 0); // TODO: Challenge respond
			r1.put("id", "messages_get");

			list.put(r1);

			object.put("requests", list);

			new AsyncHTTP() {
				@Override
				protected void onPostExecute(String result) {

					// Problem: not logged in!
					System.out.println("CH1: RESULT IS " + result.toString());
					try {
						JSONObject jo = new JSONObject(result);
						GibberishAESCrypto gib = new GibberishAESCrypto();
						JSONArray arr = jo.getJSONObject("messages_get")
								.getJSONArray("messages");
						System.out.println("CH1: arr" + arr.toString());
						for (int i = 0; i < arr.length(); i++) {
							JSONObject oo = arr.getJSONObject(i);

							RSAObj rsa = new RSAObj();
							JSONObject oo5 = ActivityLogin
									.findKey(oo.getInt("revision"))
									.getJSONObject("rsa").getJSONObject("rsa");

							rsa.n = oo5.getString("n");
							rsa.d = oo5.getString("d");
							rsa.e = oo5.getString("e");

							String aes = rsa
									.decryptText(oo.getString("aesEnc"));

							System.out.println("CH1:cid "+oo.getJSONObject("conversationId"));
							String prev = gib.decrypt(
									oo.getString("messagePreview"),
									aes.toCharArray());

							int count1 = 0;
							if (oo.has("counter"))
								count1 = oo.getInt("counter");

							System.out.println("CH1:ab " + prev);
							list2.add(new TalkItem(oo.getJSONObject("_id")
									.getString("$id"), prev, oo
									.getString("pplCount") + " People", aes,
									count1, oo.getJSONObject("conversationId")
											.getString("$id")));
						}
						System.out.println("SIZE OF L2: "+list2.size());
						
						
						adapter = new Talks.StableArrayAdapter(that, R.layout.activity_talks_listitem,
								list2);
						
						
						ListView listview = (ListView) findViewById(R.id.listView1);

						listview.setAdapter(adapter);
						
						
						registerBCReceiver();
						

					} catch (Exception ee) {
						System.out.println("CHARME ERROR12341" + ee.toString());
					}
				}
			}.execute(new AsyncHTTPParams(object.toString()));
		} catch (Exception ex) {
			System.out.println("CHARME ERROR3211 " + ex.toString());
		}

		listview.setOnItemClickListener(new OnItemClickListener() {
			@Override
			public void onItemClick(AdapterView<?> parent, View view,
					int position, long id) {
				final TalkItem t = ((Talks.StableArrayAdapter) listview
						.getAdapter()).mIdMap.get(position);

				Intent intent = new Intent(getBaseContext(),
						TalksMessages.class);
				t.Count = 0; // Reset new messages counter
				intent.putExtra("superId", t.ID);
				// intent.putExtra("aes", t.AES);
				startActivity(intent);
			}
		});

	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.talks, menu);
		return true;
	}

	public class StableArrayAdapter extends ArrayAdapter<TalkItem> {

		public HashMap<Integer, TalkItem> mIdMap = new HashMap<Integer, TalkItem>();
		Context mContext;

		public StableArrayAdapter(Context context, int textViewResourceId,
				List<TalkItem> objects) {

			super(context, textViewResourceId, objects);

			this.mContext = context;

			for (int i = 0; i < objects.size(); ++i) {
				mIdMap.put(i, objects.get(i));
			}
		}

		public void update(List<TalkItem> objects) {
			
			// TODO!!!
			
			
			mIdMap.clear();
			for (int i = 0; i < objects.size(); ++i) {
				
					mIdMap.put(i, objects.get(i));
			}
			
			System.out.println("LIST SIZE IS "+objects.size());

		}

		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			// --init if not re-cycled--
			if (convertView == null) {
				convertView = LayoutInflater.from(getContext()).inflate(
						R.layout.activity_talks_listitem, parent, false);
				convertView.setTag(new ViewHolder((TextView) convertView
						.findViewById(R.id.label), (ImageView) convertView
						.findViewById(R.id.icon), (TextView) convertView
						.findViewById(R.id.submessage), (TextView) convertView
						.findViewById(R.id.textView1)));
			}
			final TalkItem t = mIdMap.get(position);

			ViewHolder holder = (ViewHolder) convertView.getTag();
			holder.atext.setText(t.Title);
			holder.atext2.setText(t.People);

			if (t.Count == 0)
				holder.counter.setVisibility(View.GONE);
			else
				holder.counter.setVisibility(View.VISIBLE);

			holder.counter.setText(String.valueOf(t.Count));

			return convertView;

		}

		@Override
		public boolean hasStableIds() {
			return true;
		}
	}

	private static class ViewHolder {
		public final TextView atext;
		public final TextView atext2;
		public final ImageView aimg;
		public final TextView counter;

		private ViewHolder(TextView text, ImageView img, TextView text2,
				TextView c) {
			this.aimg = img;
			this.atext = text;
			this.atext2 = text2;
			this.counter = c;
		}
	}

}

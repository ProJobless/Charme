package com.mschultheiss.charmeapp;

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
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.gcm.GoogleCloudMessaging;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class Talks extends Activity {

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle item selection
        switch (item.getItemId()) {
            case R.id.action_online:

                Intent intent = new Intent(getBaseContext(), WebWrapper.class);
                startActivity(intent);

            case R.id.action_settings:

                Intent intent2 = new Intent(getBaseContext(), SettingsActivity.class);
                startActivity(intent2);
            break;
        }

        return true;
    }

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
     * <p/>
     * If result is empty, the app needs to register.
     *
     * @return registration ID, or empty string if there is no existing
     * registration ID.
     */
    private String getRegistrationId(Context context) {

        String registrationId = sharedPrefs.getString(PROPERTY_REG_ID, "");
        if (registrationId.isEmpty()) {
            Log.i(TAG, "Registration not found.");
            return "";
        }
        // Check if app was updated; if so, it must clear the registration ID
        // since the existing regID is not guaranteed to work with the new
        // app version.
        int registeredVersion = sharedPrefs.getInt(PROPERTY_APP_VERSION,
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
     * Sends the registration ID to a CHARME Server over HTTP, so it can use
     * GCM/HTTP or CCS to send messages to your app.
     */
    private void sendRegistrationIdToBackend(final String regId) {
        // apl_request: gcm_registerId
        System.out.println("GCM4: CHARME44 REGISTER IN BG: Send to backend");


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

                    System.out.println("GCM4 RESULT IS:" + result);
                    try {

                        System.out
                                .println("GCM4 CHARME44 REGISTER IN BG: Send to backend completed");

                        System.out
                                .println("GCM4 DEVICE REGISTRED SUCCESFUL FOR GCM");

                    } catch (Exception ex) {
                        System.out.println("GCM4 CHARME ERROR2" + ex.toString());
                    }

                }

            }.execute(new AsyncHTTPParams(object.toString(), this, "", server));
        } catch (Exception ex) {
            System.out.println("GCM4 CHARME1234 ERROR" + ex.toString());
        }

    }

    private void registerInBackground() {

        System.out.println("CHARME44 REGISTER IN BG");
        new AsyncTask() {

            protected Object doInBackground(Object... params) {

                System.out.println("GCM4: CHARME44 START ASYNC");
                String msg = "";
                try {
                    if (gcm == null) {
                        gcm = GoogleCloudMessaging.getInstance(context);
                    }
                    SharedPreferences sharedPrefs2 = getSharedPreferences("CHARME_COOKIE_PREFERENCES", Context.MODE_PRIVATE);
                    String GCM_PROJECT_ID= sharedPrefs2.getString("GCM_PROJECT_ID", "");
                    System.out.println("GCM4 GCM ID IS "+GCM_PROJECT_ID);
                    if (GCM_PROJECT_ID.equals(""))
                        System.out.println("CHARME CRITICAL ERROR: GCM ID NOT SET");

                    regid = gcm.register(GCM_PROJECT_ID);
                    msg = "Device registered, registration ID=" + regid;

                    // Send notification ID to Charme Backend Server
                    sendRegistrationIdToBackend(regid);

                    storeRegistrationId(context, regid);
                } catch (IOException ex) {
                    msg = "Error :" + ex.getMessage();
                    System.out.println("GCM4: CHARME44 reg error: " + msg);
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

    private void storeRegistrationId(Context context, String regId) {


        int appVersion = getAppVersion(context);
        Log.i(TAG, "Saving regId on app version " + appVersion);
        SharedPreferences.Editor editor = sharedPrefs.edit();
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
                        if (conId.equals(((TalkItem) list2.get(i)).ConversationId)) {
                            ((TalkItem) list2.get(i)).inc();

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

    String server = "";
    @Override
    protected void onCreate(Bundle savedInstanceState) {





        super.onCreate(savedInstanceState);


        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(this);
        server = sharedPref.getString("server", "");


        setContentView(R.layout.activity_talks);

        Window window = this.getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        //window.setStatusBarColor(this.getResources().getColor(R.color.primary));




        sharedPrefs =  PreferenceManager.getDefaultSharedPreferences(this);
        list2 = new ArrayList<TalkItem>();
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
    SharedPreferences sharedPrefs;
    void updateMessages() {

        list2 = new ArrayList<TalkItem>();
        final ListView listview = (ListView) findViewById(R.id.listView1);
        final String cacheId = "messages_get";
        final Talks that = this;





        try {

            JSONObject object = new JSONObject();

            JSONArray list = new JSONArray();

            JSONObject r1 = new JSONObject();
            r1.put("countReturn", true);
            r1.put("start", 0);
            r1.put("id", "messages_get");

            list.put(r1);

            object.put("requests", list);

            new AsyncHTTP() {
                @Override
                protected void onPostExecute(String result) {


                    boolean sessionExpired = false;
                    // Problem: not logged in!
                    System.out.println("CHARME: RESULT of messages_get IS " + result.toString());
                    try {
                        JSONObject jo = new JSONObject(result);
                        if (jo.getInt("ERROR") == 1) {

                            // New Login needed!
                            finish();
                            Intent intent = new Intent(getBaseContext(),
                                    ActivityLogin.class);
                            intent.putExtra("autoLogin", false);

                            sessionExpired = true;
                            startActivity(intent);
                        }
                    } catch (Exception ee) {
                    }

                    if (!sessionExpired) {
                        if (result.toString().equals(""))
                            Toast.makeText(
                                    getApplicationContext(),
                                    "No Internet connection...",
                                    Toast.LENGTH_SHORT).show();


                        try {
                            JSONObject jo = new JSONObject(result);
                            GibberishAESCrypto gib = new GibberishAESCrypto();
                            JSONArray arr = jo.getJSONObject("messages_get")
                                    .getJSONArray("messages");

                            JSONArray messageKeys = jo.getJSONObject("messages_get")
                                    .getJSONArray("messageKeys");


                            System.out.println("CH1: arr" + arr.toString());
                            for (int i = 0; i < arr.length(); i++) {

                                try {
                                    JSONObject oo = arr.getJSONObject(i);


                                    String newestMessageKey = "";
                                    JSONObject bestKeyObj = null;
                                    int highestRevision = 0;

                                    for (int j = 0; j < messageKeys.length(); j++) {

                                        JSONObject keyObj = messageKeys.getJSONObject(j);

                                        if (keyObj.getJSONObject("conversationId").getString("$id").equals(oo.getJSONObject("messageData").getString("conversationId"))) {
                                            if (keyObj.getInt("revision") >= highestRevision) {
                                                bestKeyObj = keyObj;


                                            }
                                        }
                                    }

                                    if (bestKeyObj != null) {


                                        int rsaRevision = bestKeyObj.getInt("revision");
                                        String rsaEncEdgeKey = bestKeyObj.getJSONObject("key").getString("rsaEncEdgekey");

                                        // Set up RSA decryption
                                        RSAObj rsa = new RSAObj();


                                        JSONObject oo5 = ActivityLogin
                                                .findKey(rsaRevision, that, sharedPrefs.getString("user_keyring",  ""))
                                                .getJSONObject("rsa").getJSONObject("rsa");

                                        rsa.n = oo5.getString("n");
                                        rsa.d = oo5.getString("d");
                                        rsa.e = oo5.getString("e");

                                        System.out.println("CHARME INFO: rsaEncEdgeKey is " + rsaEncEdgeKey);
                                        // Decrypt the message key with RSA
                                        String edgekey = rsa
                                                .decryptText(rsaEncEdgeKey);

                                        System.out.println("edgekey is " + edgekey);
                                        if (edgekey.equals(""))
                                            System.out.println("CHARME WARNING: edgekey is empty!");

                                        newestMessageKey = gib.decrypt(
                                                bestKeyObj.getJSONObject("key").getString("messageKey"), edgekey.toCharArray());

                                        System.out.println("newestMessageKey is " + newestMessageKey);


                                        // With having the message key, we can decrypt the preview text now
                                        //System.out.println("CH1:cid "+oo.getJSONObject("conversationId"));
                                        String prev = "";
                                        try {
                                            prev = gib.decrypt(
                                                    oo.getString("preview"),
                                                    newestMessageKey.toCharArray());
                                        } catch (Exception ex) {
                                        }
                                        int count1 = 0;
                                        if (oo.has("counter"))
                                            count1 = oo.getInt("counter");


                                        list2.add(new TalkItem(oo.getJSONObject("messageData").getString("conversationId"), prev, String.valueOf(oo.getJSONObject("messageData").getJSONArray("receivers").length()) + " People", newestMessageKey,
                                                count1, oo.getJSONObject("messageData").getString("conversationId")));


                                    } else {
                                        // key not found exec[ption
                                    }
                                } catch (Exception ea) {
                                    ea.printStackTrace();
                                }
                            }
                            System.out.println("SIZE OF L2: " + list2.size());


                            adapter = new StableArrayAdapter(that, R.layout.activity_talks_listitem,
                                    list2);


                            ListView listview = (ListView) findViewById(R.id.listView1);

                            listview.setAdapter(adapter);


                            registerBCReceiver();


                        } catch (Exception ee) {
                            System.out.println("CHARME ERROR12341" + ee.toString());
                            ee.printStackTrace();
                        }
                    }
                }
            }.execute(new AsyncHTTPParams(object.toString(), this, cacheId, server));
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
                intent.putExtra("conversationId", t.ID);
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

            System.out.println("LIST SIZE IS " + objects.size());

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

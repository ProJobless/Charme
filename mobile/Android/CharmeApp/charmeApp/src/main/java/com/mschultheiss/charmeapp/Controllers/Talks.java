package com.mschultheiss.charmeapp.Controllers;

import android.app.Activity;

import android.content.BroadcastReceiver;
import android.content.Context;

import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.media.Image;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.ActionBarActivity;
import android.support.v7.app.AlertDialog;
import android.util.Log;
import android.view.ContextThemeWrapper;
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
import com.mschultheiss.charmeapp.Crypto.AsyncCrypto;
import com.mschultheiss.charmeapp.Crypto.AsyncCryptoArgs;
import com.mschultheiss.charmeapp.Helpers.AsyncHTTP;
import com.mschultheiss.charmeapp.Helpers.AsyncHTTPParams;
import com.mschultheiss.charmeapp.ORM.CharmeRequest;
import com.mschultheiss.charmeapp.Service.GCMRegistrationService;
import com.mschultheiss.charmeapp.Crypto.GibberishAESCrypto;
import com.mschultheiss.charmeapp.R;
import com.mschultheiss.charmeapp.Crypto.RSAObj;
import com.mschultheiss.charmeapp.Models.TalkItem;
import com.orm.SugarContext;


import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class Talks extends ActionBarActivity {

    public void startNewConversation(View v) {

        Intent intent2 = new Intent(getBaseContext(), NewConversation.class);
        startActivity(intent2);

    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle item selection
        switch (item.getItemId()) {

            case R.id.action_settings:

                Intent intent2 = new Intent(getBaseContext(), SettingsActivity.class);
                startActivity(intent2);
                break;

            case R.id.action_logout:

                logoutDialog();
                break;

            case R.id.action_about:

                aboutDialog();
                break;
        }

        return true;
    }

    public void aboutDialog() {
        Intent intent = new Intent(getBaseContext(), AboutPage.class);
        startActivity(intent);
    }

    public void logoutDialog() {
        DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                switch (which){
                    case DialogInterface.BUTTON_POSITIVE:
                        logout();
                        break;

                    case DialogInterface.BUTTON_NEGATIVE:
                        //No button clicked
                        break;
                }
            }
        };

        AlertDialog.Builder builder = new AlertDialog.Builder(new ContextThemeWrapper(this, R.style.myDialog));
        builder.setMessage("Do you really want to logout?").setPositiveButton("Yes, i want!", dialogClickListener)
                .setNegativeButton("No", dialogClickListener).show();
    }

    public static void clearRSACache(Context c) {

        SharedPreferences preferences = c.getSharedPreferences("cryptoRSACache", c.MODE_PRIVATE);
        preferences.edit().clear().commit();
    }
    public void logout() {

        SharedPreferences cookiePreferences =PreferenceManager.getDefaultSharedPreferences(this);
        SharedPreferences.Editor e = cookiePreferences.edit();
        e.putString("PHPSESSID", "");
        e.putString("user_rsaN", "");
        e.putString("user_rsaE", "");
        e.putString("user_rsaD", "");
        e.putString("user_id", "");
        e.putString("user_passwordhash", "");
        e.putString("server", "");
        e.putString("user_keyring", "");
        e.commit();

        // Clear RSA Cache
         clearRSACache(Talks.this);


        Intent intent = new Intent(getBaseContext(), ActivityLogin.class);
        startActivity(intent);
        finish();

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

    @Override
    public void onDestroy() {
        if (receiver != null) {
            LocalBroadcastManager.getInstance(this).unregisterReceiver(receiver);
        }
        super.onDestroy();
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

        LocalBroadcastManager.getInstance(context).registerReceiver(receiver, filter);
    }

    public ArrayList<TalkItem> list2;
    Talks.StableArrayAdapter adapter;

    public void initButtons() {

        FloatingActionButton myFab = (FloatingActionButton) findViewById(R.id.fab);
        myFab.setOnClickListener(new View.OnClickListener()
        { public void onClick(View v)
            { startNewConversation(null);
            } });

    }
    String server = "";

    private void initListView() {
        list2 = new ArrayList<TalkItem>();
        adapter = new StableArrayAdapter(Talks.this, R.layout.activity_talks_listitem,
                list2);

        ListView listview = (ListView) findViewById(R.id.listView1);
        listview.setAdapter(adapter);
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);


        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(this);

        if (sharedPref.getString("user_rsaN", "").equals("")) // login already exist and allow autologin
        {
         logout();
        }
        else {

            setContentView(R.layout.activity_talks);
            initListView();

            server = sharedPref.getString("server", "");
            initButtons();

            Window window = this.getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);

            sharedPrefs = PreferenceManager.getDefaultSharedPreferences(this);
            context = getApplicationContext();

            if (checkPlayServices()) {
                // Start IntentService to register this application with GCM.
                Intent intent = new Intent(this, GCMRegistrationService.class);
                startService(intent);
            }

            // Load offline messages
            loadCache();

            // Load online messages
            updateMessages();
        }
    }
    void loadCache() {

            // Load some messages from Cache
            try {
                /// TODO: delete old items!!!!!
                SugarContext.init(this);
                List<CharmeRequest> cr2 = CharmeRequest.find(CharmeRequest.class, "thekey = ?", Talks.cacheId);
                String data = cr2.get(0).data;
                System.out.println("cache data "+Talks.cacheId+" is"+data);
                if (cr2.size() > 0) {
                    processResult(data, true);
                }

                SugarContext.terminate();

            } catch (Exception ee) {
                System.out.println("LOAD CACHE ERROR: ");
                ee.printStackTrace();
            }

    }
    SharedPreferences sharedPrefs;
    void processResult(String result, boolean cacheLoad) {

        if (result.equals(""))
            return;

        boolean sessionExpired = false;
        // Problem: not logged in!
        System.out.println("CHARME: RESULT of messages_get IS " + result.toString());
        try {
            JSONObject jo = new JSONObject(result);
            if (jo.getInt("ERROR") == 1) {

                // New Login needed!
                if (!cacheLoad) { // Do not finish when loading from cache, as we are logged out automatically otherwise
                finish();
                Intent intent = new Intent(getBaseContext(),
                        ActivityLogin.class);
                intent.putExtra("autoLogin", false);

                sessionExpired = true;
                startActivity(intent);
                }
            }
        } catch (Exception ee) {
            System.out.println("EX 1");
        }

        if (!sessionExpired) {
            if (result.toString().equals("")) {

                Toast.makeText(
                        getApplicationContext(),
                        "No Internet connection...",
                        Toast.LENGTH_SHORT).show();

            }
            try {
                final JSONObject jo = new JSONObject(result);
                final GibberishAESCrypto gib = new GibberishAESCrypto();
                final JSONArray arr = jo.getJSONObject("messages_get")
                        .getJSONArray("messages");

                final JSONArray messageKeys = jo.getJSONObject("messages_get")
                        .getJSONArray("messageKeys");


                System.out.println("CH1: arr" + arr.toString());
                for (int i = 0; i < arr.length(); i++) {

                    try {
                        final JSONObject oo = arr.getJSONObject(i);

                        JSONObject bestKeyObjTemp = null;
                        int highestRevision = 0;

                        for (int j = 0; j < messageKeys.length(); j++) {

                            JSONObject keyObj = messageKeys.getJSONObject(j);

                            if (keyObj.getJSONObject("conversationId").getString("$id").equals(oo.getJSONObject("messageData").getString("conversationId"))) {
                                if (keyObj.getInt("revision") >= highestRevision) {
                                    bestKeyObjTemp = keyObj;


                                }
                            }
                        }
                        final JSONObject bestKeyObj = bestKeyObjTemp;

                        if (bestKeyObj != null) {


                            int rsaRevision = bestKeyObj.getInt("revision");
                            String rsaEncEdgeKey = bestKeyObj.getJSONObject("key").getString("rsaEncEdgekey");

                            // Set up RSA decryption
                            RSAObj rsa = new RSAObj();


                            JSONObject oo5 = ActivityLogin
                                    .findKey(rsaRevision, Talks.this)
                                    .getJSONObject("rsa").getJSONObject("rsa");

                            rsa.n = oo5.getString("n");
                            rsa.d = oo5.getString("d");
                            rsa.e = oo5.getString("e");

                            System.out.println("CHARME INFO: rsaEncEdgeKey is " + rsaEncEdgeKey);
                            // Decrypt the message key with RSA


                            new AsyncCrypto() {
                                @Override
                                protected void onPostExecute(String result2) {

                                    try {
                                        String edgekey = result2;
                                        String newestMessageKey = "";
                                        System.out.println("edgekey is " + edgekey);
                                        if (edgekey.equals(""))
                                            System.out.println("CHARME WARNING: edgekey is empty!");

                                        newestMessageKey = gib.decrypt(
                                                bestKeyObj.getJSONObject("key").getString("messageKey"), edgekey.toCharArray());

                                        System.out.println("newestMessageKey is " + newestMessageKey);


                                        // With having the message key, we can decrypt the preview text now
                                        //System.out.println("CH1:cid "+oo.getJSONObject("conversationId"));
                                        String previewText = "...";
                                        try {
                                            previewText = gib.decrypt(
                                                    oo.getString("preview"),
                                                    newestMessageKey.toCharArray()).trim().replace("\n", "").replace("\r", "");
                                        } catch (Exception ex) {
                                        }
                                        int count1 = 0;
                                        if (oo.has("counter"))
                                            count1 = oo.getInt("counter");


                                        TalkItem x = new TalkItem(oo.getJSONObject("messageData").getString("conversationId"), previewText,

                                                oo.getJSONObject("messageData").getJSONObject("obj").getJSONArray("usernames"),
                                                newestMessageKey,
                                                count1, oo.getJSONObject("messageData").getString("conversationId"));

                                        boolean found = false; // Check if already in list
                                        for (TalkItem t : list2) {
                                            if (t.ConversationId.equals(oo.getJSONObject("messageData").getString("conversationId"))) {
                                                found = true;
                                                t = x;
                                            }
                                        }
                                        if (!found) {

                                            list2.add(0, x);
                                            adapter.notifyDataSetChanged();
                                        }

                                    }
                                    catch(Exception x) {

                                        x.printStackTrace();
                                    }
                                }

                            }.execute(new AsyncCryptoArgs(rsa, rsaEncEdgeKey,
                                    AsyncCryptoArgs.ACTION_DECRYPT, rsaRevision, Talks.this));

                        } else {
                            // key not found exec[ption
                        }
                    } catch (Exception ea) {
                        ea.printStackTrace();
                    }
                }


                registerBCReceiver();

            } catch (Exception ee) {
                System.out.println("CHARME ERROR12341" + ee.toString());
                ee.printStackTrace();
            }
        }
    }
    final static String cacheId = "messages_get";
    void updateMessages() {

        final ListView listview = (ListView) findViewById(R.id.listView1);

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


                   processResult(result, false);
                }
            }.execute(new AsyncHTTPParams(object.toString(), this, Talks.cacheId, server));
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
                adapter.mIdMap.set(position, t);

                adapter.notifyDataSetChanged();


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

        public List<TalkItem> mIdMap;
        Activity mContext;

        public StableArrayAdapter(Activity context, int textViewResourceId,
                                  List<TalkItem> objects) {

            super(context, textViewResourceId, objects);

            this.mContext = context;
            mIdMap = objects;

        }


        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            // --init if not re-cycled--
            if (convertView == null) {
                LayoutInflater inflator = mContext.getLayoutInflater();
                convertView = inflator.inflate(R.layout.activity_talks_listitem, null);
            }

            final TalkItem t = mIdMap.get(position);

            ((TextView)convertView.findViewById(R.id.label)).setText(t.getPeopleAsName(Talks.this));
            ((TextView)convertView.findViewById(R.id.submessage)).setText(t.Title);
            ((ImageView)convertView.findViewById(R.id.icon)).setImageDrawable(getResources().getDrawable(t.getImageResource(getContext())));

            TextView tcounter = (TextView) convertView.findViewById(R.id.messagecounter);
            tcounter.setText(String.valueOf(t.Count));

            if (t.Count == 0)
                tcounter.setVisibility(View.GONE);
            else
                tcounter.setVisibility(View.VISIBLE);


            return convertView;

        }

        @Override
        public boolean hasStableIds() {
            return true;
        }
    }


}

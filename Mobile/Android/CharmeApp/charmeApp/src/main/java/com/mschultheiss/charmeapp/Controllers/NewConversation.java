package com.mschultheiss.charmeapp.Controllers;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.ActionBarActivity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.mschultheiss.charmeapp.Crypto.AsyncCrypto;
import com.mschultheiss.charmeapp.Crypto.AsyncCryptoArgs;
import com.mschultheiss.charmeapp.Crypto.Crypto;
import com.mschultheiss.charmeapp.Crypto.GibberishAESCrypto;
import com.mschultheiss.charmeapp.Crypto.RSAObj;
import com.mschultheiss.charmeapp.Crypto.RandomString;
import com.mschultheiss.charmeapp.Helpers.AsyncHTTP;
import com.mschultheiss.charmeapp.Helpers.AsyncHTTPParams;
import com.mschultheiss.charmeapp.Models.PersonItem;
import com.mschultheiss.charmeapp.Models.TalkItem;
import com.mschultheiss.charmeapp.R;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class NewConversation extends ActionBarActivity {

    private ListView mListView;
    PersonArrayAdapter mAdapter;
    List<PersonItem> mPersonList = new ArrayList();

    public void openTalkActivity(String conversationId) {
        finish();
        Intent intent = new Intent(getBaseContext(), TalksMessages.class);
        intent.putExtra("conversationId", conversationId);
        startActivity(intent);
    }

    public void initButtons() { // Setup onclick of that blue round button

        FloatingActionButton myFab = (FloatingActionButton) findViewById(R.id.fab);
        myFab.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                makeNewConversationRequest(getPersonsSelected());
            }
        });

    }

    public void makeNewConversationRequest( List<PersonItem> people) {

        setContentView(R.layout.loading_indicator); // Nice loading animation

        if (people.size() < 1) // No people selected ---> no conversation!
            return;

        /*
            Initate a new Conversation:

            1. Add userId, name of receiver and add to list as object. [{userId: "...", name: "..."}, ...]

            2. Look for invalid public keys

            3. Encrypt peopleMessageKeys with messageKey:

                messageKey = randomKey()...

            	var edgekey = crypto_decryptFK1(item.key.obj.edgekeyWithFK).message;
		        var messageKeyEnc = aes_encrypt(edgekey, messageKey);
                [{
                messageKey: messageKeyEnc,
                userId: item.key.obj.publicKeyUserId,
                rsaEncEdgekey: item.key.obj.edgekeyWithPublicKey,
                revisionB: item.key.obj.publicKeyRevision
		        })]

            4. 		"id": "message_distribute",
                    "messageKeys": peopleMessageKeys, // Receivers must only accept the public newest key here. So we do not need integrity protection for the key revision
                    "messageData": crypto_hmac_make( // Make HMAC to protect message integrity
                                  {
                                    "usernames": usernames,
                                    "action": "initConversation"
                                    }, messageKey, 0)


         */

        // Step 1

        JSONArray peopleJSON = new JSONArray();
        JSONArray jsonReceivers = new JSONArray();
        JSONArray jsonMessageKeys = new JSONArray();

        String messageKey = RandomString.alphaNumeric(32);

        //
        // TODO: Step2
        //
        int errorCounter = 0;
        for (PersonItem p : people) {
            peopleJSON.put(p.makeJSON());
            jsonReceivers.put(p.UserId);

            JSONObject json =  p.makeCryptoObject(messageKey, NewConversation.this);

            if (json != null)
            jsonMessageKeys.put(json
                   ); // Step 3
            else
                errorCounter++;
        }

        if (errorCounter != 0)
            System.out.println("Some Errors occured!");

        // Step 4: Build final request to server

        JSONObject object = new JSONObject();

        try {
            JSONArray list = new JSONArray();
            JSONObject r1 = new JSONObject();
            r1.put("id", "message_distribute");
            JSONObject jsonMessageData = new JSONObject();
            jsonMessageData.put("action", "initConversation");
            jsonMessageData.put("usernames", peopleJSON);


            r1.put("messageData", Crypto.makeJsonHmac(jsonMessageData, messageKey, 0));
            r1.put("messageKeys", jsonMessageKeys);

            list.put(r1);
            object.put("requests", list);
        }
        catch(Exception x) {
           x.printStackTrace();
        }

        System.out.println("JSON SENT IS:"+object.toString());

        new AsyncHTTP() {
            @Override
            protected void onPostExecute(String result) {
                try {

                    final JSONObject jo = new JSONObject(result);
                    String messageId = jo.getJSONObject("message_distribute").getString("messageId");
                    openTalkActivity(messageId);
                }
                catch(Exception x) {

                    setContentView(R.layout.activity_new_conversation);

                }
            }
        }.execute(new AsyncHTTPParams(object.toString(), this, "", NewConversation.this));

    }

    public void loadAllKeysToList() {

        JSONObject object = new JSONObject();

        try {
            JSONArray list = new JSONArray();
            JSONObject r1 = new JSONObject();
            r1.put("id", "key_getAll");
            list.put(r1);
            object.put("requests", list);
        }
        catch(Exception x) {}


        new AsyncHTTP() {
            @Override
            protected void onPostExecute(String result) {
                try {

                    setContentView(R.layout.activity_new_conversation);
                    initButtons();

                    mAdapter = new PersonArrayAdapter(NewConversation.this, R.layout.activity_conversation_listitem, mPersonList);
                    mListView = (ListView)findViewById(R.id.listView);
                    mListView.setAdapter(mAdapter);

                    mListView.setClickable(true);
                    mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {

                        @Override
                        public void onItemClick(AdapterView<?> arg0, View arg1, int position, long arg3) {
                            PersonItem p = (PersonItem)mListView.getItemAtPosition(position);
                            p.isSelected = !p.isSelected;
                            mAdapter.notifyDataSetChanged();
                        }
                    });

                    final JSONObject jo = new JSONObject(result);
                    final JSONArray items = jo.getJSONObject("key_getAll").getJSONArray("items");

                    for (int i = 0; i < items.length(); i++) {
                        final JSONObject oo = items.getJSONObject(i);

                        // TODO: Check MAC! Critical Security Feature!!!!
                        PersonItem pi = new PersonItem(oo);
                        mPersonList.add(pi);
                    }

                    loadList(mPersonList);
                }
                catch(Exception x) {


                }
            }
        }.execute(new AsyncHTTPParams(object.toString(), this, "", NewConversation.this));
    }
    public void loadList(List<PersonItem> personList) {


    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.loading_indicator);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        loadAllKeysToList();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_new_conversation, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }
        if (id == android.R.id.home) {
            finish();
        }

        return super.onOptionsItemSelected(item);
    }

    public List<PersonItem> getPersonsSelected() {

        List<PersonItem> newList = new ArrayList<PersonItem>();
        for (PersonItem p: mPersonList) {
            if (p.isSelected)
                newList.add(p);
        }
        return newList;
    }


    public class PersonArrayAdapter extends ArrayAdapter<PersonItem> {

        Activity context;
        int layoutResourceId;
        List<PersonItem> data;

        public PersonArrayAdapter(Activity context, int layoutResourceId, List<PersonItem> list) {
            super(context, layoutResourceId, list);
            this.layoutResourceId = layoutResourceId;
            this.context = context;
            this.data = list;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {

            if (convertView == null) {
                LayoutInflater inflator = context.getLayoutInflater();
                convertView = inflator.inflate(R.layout.activity_conversation_listitem, null);
            }
            PersonItem item = data.get(position);
            ((TextView) convertView.findViewById(R.id.textViewUsername)).setText(item.Name);
            ((TextView) convertView.findViewById(R.id.textViewUserId)).setText(item.UserId);

            CheckBox cb = ((CheckBox) convertView.findViewById(R.id.checkBox));
            if (item.isSelected)
                cb.setChecked(true);
            else
                cb.setChecked(false);
;

            return convertView;
        }
    }
}

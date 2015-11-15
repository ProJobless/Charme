package com.mschultheiss.charmeapp.Controllers;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.provider.MediaStore;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.ActionBarActivity;
import android.util.Base64;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.mschultheiss.charmeapp.Crypto.AsyncCrypto;
import com.mschultheiss.charmeapp.Crypto.AsyncCryptoArgs;
import com.mschultheiss.charmeapp.Helpers.AsyncHTTP;
import com.mschultheiss.charmeapp.Helpers.AsyncHTTPParams;
import com.mschultheiss.charmeapp.Crypto.Crypto;
import com.mschultheiss.charmeapp.Crypto.GibberishAESCrypto;
import com.mschultheiss.charmeapp.Models.MessageItem;
import com.mschultheiss.charmeapp.R;
import com.mschultheiss.charmeapp.Crypto.RSAObj;
import com.mschultheiss.charmeapp.Helpers.StringFormatter;
import com.mschultheiss.charmeapp.StringHelper.StringFormater;
import com.mschultheiss.charmeapp.Helpers.sqLiteHelper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

import models.Message;

public class TalksMessages extends ActionBarActivity {


    /*
        What is important here?
        -> getMessageKeys: Returns a set of rsa encrypted keys needed to decrypt the message
        -> getTheNewestMessageKey: Returns the newest message key and saves it to settings, so that background services can access it and display a preview text.
           In secure mode this should be disabled however...


     */
	ListView m_listview;
	GibberishAESCrypto gib = new GibberishAESCrypto();
	int count = -1;
	int nextstart = -1;
	int nextlimit = -1;
	String superId; // Shoudl be unused
	String conversationId = ""; // A unique id for each conversation between different people
	// String msgaes = "";
	String newestMessageId = "";

	BroadcastReceiver receiver;
	JSONArray messageKeys = new JSONArray();

	int newestMessageKeyRevision = 0;
    public String getCurrentUserId()
    {

        String s =  sharedPref.getString("user_id","");
        if (s.isEmpty())
            System.out.println("CHARME FATAL ERROR: NO USER ID IN preferences found");
        return s;

    }
    public String getCurrentServer()
    {
        return getCurrentUserId().split("@")[1].replace("charme.local", "localhost:9000");
    }


	private JSONObject getMessageKeyByRevision(int revision) {

		JSONObject newestKey = null; // Only used for revision = -1
		int bestRevision = 0; // Only used for revision = -1

		for (int j = 0; j < messageKeys.length(); j++) {
			try {

				JSONObject keyObj = messageKeys.getJSONObject(j);

				if (keyObj.getInt("revision") >= newestMessageKeyRevision)
					newestMessageKeyRevision = keyObj.getInt("revision");

				if (revision != -1 && keyObj.getInt("revision") == revision) {
					return keyObj;
				} else if (revision == -1) {
					if (keyObj.getInt("revision") >= bestRevision) {
						newestKey = keyObj;
						bestRevision = keyObj.getInt("revision");
					}

				}
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
		if (revision == -1)
			return newestKey; // Only if revision = -1

		return null;
	}
	

	
	void getMessageKeys(final boolean firstload) {
		JSONObject object = new JSONObject();
        final TalksMessages that  =this;
		try {

			JSONArray list = new JSONArray();
			JSONObject r1 = new JSONObject();
			r1.put("conversationId", this.conversationId);
			r1.put("id", "messages_get_keys");
			list.put(r1);
			object.put("requests", list);

		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		new AsyncHTTP() {
			@Override
			protected void onPostExecute(String result) {

                if (result.equals("")) // Could not connect to server, load cached messages!
                    loadMessages(firstload);
                else {
                    try {
                        JSONObject jo = new JSONObject(result);
                        messageKeys = jo.getJSONObject("messages_get_keys")
                                .getJSONArray("messageKeys");


                        SharedPreferences.Editor editor = sharedPref.edit();
                        System.out.println("SAVED CONV ID "+conversationId+" to "+getTheNewestMessageKey() );
                        editor.putString("conv_"+conversationId, getTheNewestMessageKey());
                        editor.commit();



                        // keys there? Then load messages!!
                        loadMessages(firstload);

                    } catch (Exception ee) {
                        loadMessages(firstload);
                    }
                }
			}
		}.execute(new AsyncHTTPParams(object.toString(), this, "", server));

		/*
		 * 
		 * apl_request({ "requests": [{ "id": "messages_get_keys",
		 * "conversationId": serverData[0].message.object.conversationId,
		 * 
		 * }] }, function(d2) { that.options.messageKeys =
		 * d2.messages_get_keys.messageKeys; renderMessages(serverData); });
		 */

	}

	String getAesMessageKey(JSONObject messageKey) {



        String rsaEncEdgeKey;
		try {
			rsaEncEdgeKey = messageKey.getJSONObject("key").getString(
					"rsaEncEdgekey");

			int rsaRevision = messageKey.getInt("revision");

			// Set up RSA decryption
			RSAObj rsa = new RSAObj();
            String s = 	 ActivityLogin.findKey(rsaRevision, this).toString();
            JSONObject oo5 = ActivityLogin.findKey(rsaRevision, this)
                    .getJSONObject("rsa").getJSONObject("rsa");

			rsa.n = oo5.getString("n");
			rsa.d = oo5.getString("d");
			rsa.e = oo5.getString("e");

			// Decrypt the message key with RSA
			String edgekey = rsa.decryptText(rsaEncEdgeKey);
            System.out.println("cryp edgekey  is "+edgekey);

			String newestMessageKey = gib.decrypt(
					messageKey.getJSONObject("key").getString("messageKey"),
					edgekey.toCharArray());

            System.out.println("cryp newest is "+edgekey);
			return newestMessageKey;

		} catch (Exception e) {
			System.out.println("CHARME ERROR 32");
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "";
		}

	}
    double getCurrentTimeSecondsAsDouble()
    {
        double seconds = System.currentTimeMillis() / 1000;
        return seconds;


    }



    JSONObject getCurrentTimeSeconds()
    {   try {
        double seconds = System.currentTimeMillis() / 1000;
        JSONObject date2 = new JSONObject();
        date2.put("sec", String.valueOf(seconds));

        return date2;
        }
    catch(Exception ea)
    {return new JSONObject();}


    }

    String oldestMessageId = "NO_MESSAGES_LOCALLY";
    double oldestTime = 1.425407873E12;


	void loadMessages(final boolean firstload) {
        // Message keys should have been loaded. First we try to get
        // all messages saved locally. There are messages before and after on the server:
        /*
                Messages Earlier on server OR LOCALLY
                            A
                            |
                ------------------------------> oldestMessageID, oldestTime
                | Locally  Stored Messages   |
                ------------------------------> newestMessageId
                            |
                            v
                Messages Later on server. Loaded via Refresh

         */
        List<Message> messagesLocal =  db.getAllMessages(this.conversationId, oldestTime); // The float value should be increased as high as possible
        m_listview.setDivider(null);

        for (int i = 0; i< messagesLocal.size(); i++)
        {
            MessageItem msgitem;
            models.Message msg2 = messagesLocal.get(i);

            if (msg2.hasFile == 1)
            {
                String fileBlob = db.getFileBlob(msg2.messageId);
                msgitem = new MessageItem( msg2.content, msg2.author, msg2.userId, 2, msg2.messageId, msg2.timestamp);
                msgitem.fileId = msg2.fileId;
                msgitem.image = bmpFromBase64(fileBlob);
            }
            else {
                 msgitem = new MessageItem(msg2.content, msg2.author, msg2.userId, 0, msg2.messageId, msg2.timestamp);
            }

            this.updateOldestMessageId(msg2.timestamp, msg2.messageId);

            if (newestMessageId.equals(""))
                newestMessageId = msg2.messageId;

            adapter.addItem(msgitem, 0);
        }

        // Refresh List View
        TalksMessages.this.runOnUiThread(new Runnable() {

            @Override
            public void run() {
                adapter.refresh();
            }
        });

        if (firstload)  // scroll down
            m_listview.setSelection(adapter.getSize() - 1);

        System.out.println("SIZE IS "+(messagesLocal.size()));
         if (messagesLocal.size()< 9) {

             loadMessagesFromServer(firstload);
         }
        else
        {   // Add load more button
            adapter.addItem(new MessageItem("", "", "", 1, "", 0),
                        0);

            TalksMessages.this.runOnUiThread(new Runnable() {

                @Override
                public void run() {
                    adapter.refresh();
                }
            });


        }

        if (firstload)
        {
            checkNewMessages();
        }


	}
    void loadMessagesFromServer(final boolean firstLoad)
    {
        System.out.println("loadMessagesFromServer was called");
        final TalksMessages that = this;
        m_listview.setDivider(null);

        try {

            JSONObject object = new JSONObject();
            JSONArray list = new JSONArray();
            JSONObject r1 = new JSONObject();
            r1.put("beforeMessageId", oldestMessageId);

            if (conversationId != null)
                r1.put("conversationId", conversationId);
            else {
                r1.put("conversationId", that.conversationId);
            }
            r1.put("id", "messages_get_sub");
            list.put(r1);

            object.put("requests", list);
            new AsyncHTTP() {
                @Override
                protected void onPostExecute(String result) {
                    System.out.println("MESSAGES GET JSON REQUEST IST  " + result);
                    // TODO: CHECK FOR ERROR 1 (no session exists)
                    try {

                        JSONObject jo = new JSONObject(result);

                        JSONArray arr = jo.getJSONObject("messages_get_sub")
                                .getJSONArray("messages");

                        if (jo.getJSONObject("messages_get_sub")
                                .getInt("count") != -1) {
                            count = jo.getJSONObject("messages_get_sub")
                                    .getInt("count");

                        }

                        int insertpos = 1;

                        if (count >= 10) // Show more button if more then 10 items were loaded
                            adapter.addItem(new MessageItem("", "", "", 1, "", 0),
                                    0);
                        else
                            insertpos = 0; // Insert new item after more button

                        for (int i = (arr.length() - 1); i >= 0; i--) {

                            JSONObject messageKey = getMessageKeyByRevision(arr
                                    .getJSONObject(i).getJSONObject("message")
                                    .getJSONObject("object")
                                    .getInt("msgKeyRevision"));

                            String newestMessageKey = getAesMessageKey(messageKey);

                            MessageItem item = insertMessage(insertpos, arr.getJSONObject(i),
                                    newestMessageKey);
                            item.saveToDatabase(that.db, that.conversationId);

                            if (item.hasFile == 1)
                            {
                                System.out.println("ITEM HAS A FILE");
                            }


                            if (i == (arr.length() - 1) && firstLoad && newestMessageId.equals(""))
                                newestMessageId = arr.getJSONObject(i)
                                        .getJSONObject("_id").getString("$id");
                            // Add message item
                          //  adapter.addItem(item, 0);
                        }

                        TalksMessages.this.runOnUiThread(new Runnable() {

                            @Override
                            public void run() {
                                adapter.refresh();
                            }
                        });

                        if (firstLoad)
                            m_listview.setSelection(adapter.getSize() - 1); // scroll
                        // to
                        // bottom

                        if (firstLoad) { // PULL server for new messages?
                            // Init Timer

							/*
							 * final int interval = 3000; // 1 Second final
							 * Handler handler = new Handler(); final Runnable
							 * runnable = new Runnable() { public void run() {
							 * checkNewMessages(); // lastid must be // defined!
							 * handler.postAtTime(this,
							 * System.currentTimeMillis() + interval);
							 * handler.postDelayed(this, interval); } };
							 *
							 * handler.postAtTime(runnable,
							 * System.currentTimeMillis() + interval);
							 * handler.postDelayed(runnable, interval);
							 */

                        }

                    } catch (Exception ee) {
                        System.out.println("CHARME ERROR onPostExcute of message_get_sub ");
                        ee.printStackTrace();


                        // Add load more button
                        adapter.addItem(new MessageItem("", "", "", 1, "", 0),
                                0);
                        TalksMessages.this.runOnUiThread(new Runnable() {

                            @Override
                            public void run() {
                                adapter.refresh();
                            }
                        });



                    }
                }
            }.execute(new AsyncHTTPParams(object.toString(), this, "", server));
        } catch (Exception ex) {
            System.out.println("CHARME ERROR before HTTP request of messages_get_sub " + ex.toString());
        }
    }
	StableArrayAdapter adapter;
    public void updateOldestMessageId(double timestamp, String msgId)
    {

        if (timestamp<oldestTime)
        {
            oldestTime = timestamp;
            oldestMessageId = msgId;
        }
    }
	public String getPath(Uri uri) {
		String[] projection = { MediaStore.Images.Media.DATA };
		Cursor cursor = managedQuery(uri, projection, null, null, null);
		if (cursor != null) {
			// HERE YOU WILL GET A NULLPOINTER IF CURSOR IS NULL
			// THIS CAN BE, IF YOU USED OI FILE MANAGER FOR PICKING THE MEDIA
			int column_index = cursor
					.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
			cursor.moveToFirst();
			return cursor.getString(column_index);
		} else
			return null;
	}

	protected void onActivityResult(int requestCode, int resultCode, Intent data) {

		Uri realImgUri = null;
		String filePath = null;

		if (requestCode == CAMERA_REQUEST && resultCode == RESULT_OK) {
			if (resultCode == RESULT_OK) {
				// use imageUri here to access the image
				realImgUri = imageUri;
			} else if (resultCode == RESULT_CANCELED) {
				Toast.makeText(this, "Canceled", Toast.LENGTH_SHORT).show();
			} else {
				Toast.makeText(this, "Picture was not taken",
						Toast.LENGTH_SHORT).show();
			}

			try {
				// OI FILE Manager
				String filemanagerstring = realImgUri.getPath();

				// MEDIA GALLERY
				String selectedImagePath = getPath(realImgUri);

				if (selectedImagePath != null) {
					filePath = selectedImagePath;
				} else if (filemanagerstring != null) {
					filePath = filemanagerstring;
				} else {
					Toast.makeText(getApplicationContext(), "Unknown path",
							Toast.LENGTH_LONG).show();

				}

				if (filePath != null) {
					decodeFile(filePath);
				} else {
					bitmap = null;
				}
			} catch (Exception e) {
				Toast.makeText(getApplicationContext(), "Internal error",
						Toast.LENGTH_LONG).show();
				e.printStackTrace();

			}
		}
	}
    SharedPreferences sharedPref;

    private static final int CAMERA_REQUEST = 1888;
    sqLiteHelper db; // Database Helper
    String server = "";

	@Override
	protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

		setContentView(R.layout.activity_talks_messages);

        Window window = this.getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        sharedPref =  PreferenceManager.getDefaultSharedPreferences(this);
        server = sharedPref.getString("server", "");

		Intent intent = getIntent();

		this.conversationId = intent.getStringExtra("conversationId");
        db = new sqLiteHelper(this);
		adapter = new StableArrayAdapter(this,
				R.layout.talks_messages_row_message);

		this.m_listview = (ListView) findViewById(R.id.listView1);
		m_listview.setAdapter(adapter);

		receiver = new BroadcastReceiver() {
			@Override
			public void onReceive(Context context, Intent intent) {

				String action = intent.getAction();
				if (action
						.equals("com.mschultheiss.charmeapp.actions.newmessage")) {

                    System.out.println("GOT BROADCAST");
					// ...call update.
					if (intent.getExtras().getString("conversationId")
							.equals(conversationId)) {
						checkNewMessages();
					}
				}

			}
		};
		IntentFilter filter = new IntentFilter();

		// Register receivers here!!!!
		filter.addAction("com.mschultheiss.charmeapp.actions.newmessage");


        LocalBroadcastManager.getInstance(TalksMessages.this).registerReceiver(receiver, filter);


		this.getMessageKeys(true);

        ImageButton buttonLogin = (ImageButton) findViewById(R.id.button1);
		buttonLogin.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {

				sendAnswer();
			}
		});
		
	}

	@Override
	public void onDestroy() {
		super.onDestroy();

        if (receiver != null)
            LocalBroadcastManager.getInstance(this).unregisterReceiver(receiver);

    }

	// taken from
	// http://androidmyway.wordpress.com/2012/02/05/selecting-image-from-gallery-or-taking-image-from-camera-with-options-menu-uploading-to-server/
	private Bitmap bitmap;
	Uri imageUri;

	public String mkBase64(Bitmap immagex) {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		immagex.compress(Bitmap.CompressFormat.JPEG, 90, baos);
		byte[] b = baos.toByteArray();
		String imageEncoded = Base64.encodeToString(b, Base64.DEFAULT);
		return "data:image/jpeg;base64," + imageEncoded;
	}

	public void decodeFile(String filePath) {
		// Decode image size
		BitmapFactory.Options o = new BitmapFactory.Options();
		o.inJustDecodeBounds = true;
		BitmapFactory.decodeFile(filePath, o);

		// The new size we want to scale to
		final int REQUIRED_SIZE = 1024;

		// Find the correct scale value. It should be the power of 2.
		int width_tmp = o.outWidth, height_tmp = o.outHeight;
		int scale = 1;
		while (true) {
			if (width_tmp < REQUIRED_SIZE && height_tmp < REQUIRED_SIZE)
				break;
			width_tmp /= 2;
			height_tmp /= 2;
			scale *= 2;
		}

		// Decode with inSampleSize
		BitmapFactory.Options o2 = new BitmapFactory.Options();
		o2.inSampleSize = scale;
		bitmap = BitmapFactory.decodeFile(filePath, o2);

		System.out.println("CHARME55bmp is" + bitmap);
		// start server request here...

		// Make Thumbnail

		final int THUMBNAIL_SIZE = 100;

		Bitmap imageBitmap = Bitmap.createBitmap(bitmap);

		final Bitmap bitmapThumb = Bitmap.createScaledBitmap(imageBitmap,
				THUMBNAIL_SIZE, THUMBNAIL_SIZE, false);

		final TalksMessages that = this;

		try {

			String newestMessageKey = getTheNewestMessageKey();

			// Generate Object to sign
			final JSONObject messageRaw = new JSONObject();

			String fileBlob = gib.encrypt(mkBase64(bitmap),
					getTheNewestMessageKey().toCharArray());
			messageRaw.put("conversationId", this.conversationId);
			messageRaw.put("encFileHash", Crypto.makeSha256(fileBlob, true));
			messageRaw.put("time", getCurrentTimeSeconds());
			messageRaw.put("msgKeyRevision", newestMessageKeyRevision);
			messageRaw.put("sender", getCurrentUserId());

			
			final RSAObj rsa = getRSAEncryptObject();


			new AsyncCrypto() {
				@Override
				protected void onPostExecute(String result2) {

					try {
					

						JSONObject object = new JSONObject();
						JSONArray list = new JSONArray();
						
						JSONObject r1 = new JSONObject();
						r1.put("encFileThumb", gib.encrypt(mkBase64(bitmapThumb),
								getTheNewestMessageKey().toCharArray()));
						r1.put("encFile", gib.encrypt(mkBase64(bitmap),
								getTheNewestMessageKey().toCharArray()));
						r1.put("message", new JSONObject(result2));
						r1.put("id", "message_distribute_answer");
							
						list.put(r1);

						object.put("requests", list);
								 
						

						// Async HTTP
						new AsyncHTTP() {
							@Override
							protected void onPostExecute(String result) {

								try {
									JSONObject jo = new JSONObject(result);
									String myname = jo.getJSONObject(
											"message_distribute_answer")
											.getString("sendername");


                                    MessageItem item = new MessageItem(
                                            "",
                                            myname,
                                            getCurrentUserId(),
                                    0, "", getCurrentTimeSecondsAsDouble());

                                    item.saveToDatabase(db, that.conversationId);

									adapter.addItem(item, adapter.getSize());


									// must run in ui thread to maintain scroll
									// position
									TalksMessages.this
											.runOnUiThread(new Runnable() {

												@Override
												public void run() {
													// refresh list
													adapter.refresh();



                                                    ImageButton btn = (ImageButton) findViewById(R.id.button1);
													btn.setEnabled(true);

													// scroll down
													m_listview
															.setSelection(adapter
																	.getSize() - 1); // scroll
																						// to
																						// bottom
												}
											});

								} catch (Exception ex) {
									System.out.println("CHARME ERROR2"
											+ ex.toString() + " RESULT WAS:"+result);

								}

							}
						}.execute(new AsyncHTTPParams(object.toString(), that, "", server));

					} catch (Exception ee) {
					}

				}

			}.execute(new AsyncCryptoArgs(rsa, messageRaw,
					AsyncCryptoArgs.ACTION_SIGN, TalksMessages.this));

			//
			// test end
			//

			
		} catch (Exception ex) {
			System.out.println("CHARME ERROR" + ex.toString());
			ex.printStackTrace();
			
		}



	}
    public Bitmap bmpFromBase64(String base64)
    {

        byte[] bytes = Base64.decode(base64, Base64.DEFAULT);

        Bitmap decodedByte = BitmapFactory.decodeByteArray(
                bytes, 0, bytes.length);


        return BitmapFactory.decodeByteArray(
                bytes, 0, bytes.length);

    }

    public void refreshListView()
    {
        TalksMessages.this.runOnUiThread(new Runnable() {

            @Override
            public void run() {

                adapter.refresh();

            }
        });
    }

	MessageItem insertMessage(int insertpos, final JSONObject oo,
		final String messageAesKey) throws Exception {

        double timestamp = oo.getJSONObject("message").getJSONObject("object").getJSONObject("time").getDouble("sec");


        if (oo.has("fileId")) {

            System.out.println("e23 FOUDN A FILEID");
			final MessageItem msgitem;

            final String messageId = oo.getJSONObject("_id")
                    .getString("$id");

			msgitem = new MessageItem("", oo.getString("sendername"), oo
					.getJSONObject("message").getJSONObject("object")
					.getString("sender"), 2, messageId, Double.valueOf( oo.getJSONObject("message").getJSONObject("object").getJSONObject("time").getDouble("sec")));
            msgitem.hasFile = 1;

            msgitem.fileId = oo.getString("fileId");

            this.updateOldestMessageId(timestamp, messageId);

            // if its an image, load the image!

			JSONObject object = new JSONObject();
			AsyncHTTPParams param = new AsyncHTTPParams(object.toString(), this, "", server);
			param.Url = "http://"+server+"/charme/fs.php?enc=1&id="
					+ oo.getString("fileId"); // The url of the image


            String fileBlob = db.getFileBlob(messageId);

            // Lookup Item in Local DB
            if (fileBlob.equals("")) {

                System.out.println("e23 DIDNT FIND FILE BLOB");
                new AsyncHTTP() {
                    @Override
                    protected void onPostExecute(String result) {
                        try {
                            String imageData = gib.decrypt(result,
                                    messageAesKey.toCharArray()).replaceFirst(
                                    "^data:image/[^;]*;base64,?", "");

                            db.addFile(conversationId,messageId, imageData, oo
                                    .getJSONObject("message").getJSONObject("object")
                                    .getString("sender") );


                            msgitem.image = bmpFromBase64(imageData);
                            refreshListView();

                        } catch (Exception ex) {

                            System.out.println("CHARME IMAGE" + ex.toString());
                            ex.printStackTrace();
                        }

                    }
                }.execute(param);
            }
            else
            {
                System.out.println("e23 FOUND FILE BLOB");
                msgitem.image = bmpFromBase64(fileBlob);



            }
			adapter.addItem(msgitem, insertpos);
            return msgitem;

		} else {

			/*
			 * ( [_id] => 54abfe00d8cc9ab24c004f2c [message] => Array ( [object]
			 * => Array ( [conversationId] => 54abfdfad8cc9aa24c004f2c [content]
			 * => U2FsdGVkX1/LaJRax6HOn050EMQnC5eBvIzhVxNYCDo=
			 * 
			 * [preview] => U2FsdGVkX19Ejzx3/79MBRUdiq3Bdul0QuH3FdpZ4b8=
			 * 
			 * [msgKeyRevision] => 0 [sender] => test34@charme.local [time] =>
			 * Array ( [sec] => 1420557824.151 )
			 * 
			 * )
			 * 
			 * )
			 * 
			 * [owner] => test34@charme.local [sendername] => aasdf saldkmasdl
			 * [fileId] => 0
			 */

			final MessageItem msgitem;
			{
				String msg = gib.decrypt(oo.getJSONObject("message")
						.getJSONObject("object").getString("content"),
						messageAesKey.toCharArray());


				msgitem = new MessageItem(StringFormater.formatText(msg), oo.getString("sendername"), oo
						.getJSONObject("message").getJSONObject("object")
						.getString("sender"), 0, oo.getJSONObject("_id")
						.getString("$id") , Double.valueOf( oo.getJSONObject("message").getJSONObject("object").getJSONObject("time").getDouble("sec")) );

                this.updateOldestMessageId(timestamp, oo.getJSONObject("_id")
                        .getString("$id"));



                adapter.addItem(msgitem, insertpos);

			}
            return msgitem;
		}

		// Insert after more button

	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.talks_messages, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle item selection
		switch (item.getItemId()) {
		case R.id.action_takepic:

			String fileName = "new-photo-name.jpg";
			// create parameters for Intent with filename
			ContentValues values = new ContentValues();
			values.put(MediaStore.Images.Media.TITLE, fileName);
			values.put(MediaStore.Images.Media.DESCRIPTION,
					"Image capture by camera");
			// imageUri is the current activity attribute, define and save it
			// for later usage (also in onSaveInstanceState)
			imageUri = getContentResolver().insert(
					MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
			// create new Intent
			Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
			intent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
			intent.putExtra(MediaStore.EXTRA_VIDEO_QUALITY, 1);
			startActivityForResult(intent, CAMERA_REQUEST);

			return true;


		case R.id.action_refresh:
			checkNewMessages();
            return true;


       case android.R.id.home:
                finish();
           return true;

        case R.id.action_settings:

                Intent intent2 = new Intent(getBaseContext(), SettingsActivity.class);
                startActivity(intent2);

            return true;

		default:
			return super.onOptionsItemSelected(item);
		}
	}





	public String getTheNewestMessageKey() {
		JSONObject messageKey = getMessageKeyByRevision(-1);
		String newestMessageKey = getAesMessageKey(messageKey);



		return newestMessageKey;
	}

	public class StableArrayAdapter extends ArrayAdapter<MessageItem> {

		private ArrayList<MessageItem> mIdMap = new ArrayList<MessageItem>();
		Context mContext;

		public StableArrayAdapter(Context context, int textViewResourceId) {

			super(context, textViewResourceId);

			this.mContext = context;

		}

		public int getSize() {
			return mIdMap.size();
		}

		@Override
		public int getCount() {
			return mIdMap.size();
		}

		@Override
		public long getItemId(int position) {

			return position;
		}

		@Override
		public MessageItem getItem(int position) {
			return mIdMap.get(position);
		}

		private ArrayList<MessageItem> tempList = new ArrayList<MessageItem>();

		public void refresh() {
			mIdMap.clear();
			mIdMap.addAll(tempList);

			notifyDataSetChanged();

		}

		public void removeAnswerItems() {
			for (int i = 0; i < tempList.size(); i++) {
				MessageItem mm = (MessageItem) tempList.get(i);
				if (mm.type == 0 && mm.ID == "")
					this.remove(i);
			}
		}

		public void remove(int pos) {
			tempList.remove(pos);
		}

		public void addItem(MessageItem m, int pos) {
			tempList.add(pos, m);
		}

		@Override
		public int getViewTypeCount() {
			return 3; // 0 Message / 1 Show more / 2 Image / 3 Information / ->
						// currently 2, later 4
		}

		@Override
		public int getItemViewType(int position) {

			MessageItem t = mIdMap.get(position);

			if (t == null) {
				return android.widget.Adapter.IGNORE_ITEM_VIEW_TYPE;
			} else
			return t.type;

		}

		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			// --init if not re-cycled--

			final MessageItem t = mIdMap.get(position);
			int type = getItemViewType(position);


			if (type == 0) {
				if (convertView == null
					) {
					convertView = LayoutInflater.from(getContext()).inflate(
							R.layout.talks_messages_row_message, parent, false);
				}




				if (t != null && t.message != null) {


                    TextView txtUsername =  (TextView)convertView.findViewById(R.id.textViewUsername);
                    TextView txtMessage =  (TextView)convertView.findViewById(R.id.textViewMessage);
                    View mainLayout = (View) convertView.findViewById(R.id.mainbox);
                    ProgressBar progress = (ProgressBar) convertView.findViewById(R.id.progressSending);

                    if (t.isSending)
                        progress.setVisibility(View.VISIBLE);
                    else
                        progress.setVisibility(View.GONE);

                    txtUsername.setText(t.user);
                    txtMessage.setText(t.message);

					float scale = getResources().getDisplayMetrics().density;
					int dp50 = (int) (50 * scale + 0.5f);
					int dp8 = (int) (8 * scale + 0.5f);

					if (!t.userId.equals(getCurrentUserId())) {
                        mainLayout.setPadding(dp8, dp8, dp50, 0);
					} else
                        mainLayout.setPadding(dp50, dp8, dp8, 0);

				}

			}
			if (type == 2) { // Image Box
				if (convertView == null
						|| !(convertView.getTag() instanceof ViewHolder3)) {
					convertView = LayoutInflater.from(getContext()).inflate(
							R.layout.talks_messages_row_images, parent, false);
					convertView.setTag(new ViewHolder3((TextView) convertView
							.findViewById(R.id.textView1),

					(ImageView) convertView.findViewById(R.id.imageView1),
							(LinearLayout) convertView
									.findViewById(R.id.mainbox)));
				}

				ViewHolder3 holder3 = (ViewHolder3) convertView.getTag();

				if (t != null && holder3 != null) {

					float scale = getResources().getDisplayMetrics().density;
					int dp50 = (int) (50 * scale + 0.5f);
					;
					int dp8 = (int) (8 * scale + 0.5f);

					if (!t.userId.equals(getCurrentUserId())) {
						holder3.mainbox.setPadding(dp8, dp8, dp50, 0);
					} else
						holder3.mainbox.setPadding(dp50, dp8, dp8, 0);

					holder3.atext.setText(t.user);


					if (t.image != null)
						holder3.img.setImageBitmap(t.image);

					holder3.img.setOnClickListener(new View.OnClickListener() {
						@Override
						public void onClick(View v) {

							Intent intent = new Intent(getBaseContext(),
									ImageViewer.class);
							intent.putExtra("fileId", t.fileId);
							intent.putExtra("aes", getTheNewestMessageKey());
                            intent.putExtra("server", getCurrentServer());
							startActivity(intent);

						}
					});
					System.out.println("CHARME: setted onclick img thumb");

				}

			}

			if (type == 1) {
				if (convertView == null
						|| !(convertView.getTag() instanceof ViewHolder2)) {
					convertView = LayoutInflater.from(getContext()).inflate(
							R.layout.talks_messages_row_more, parent, false);
					convertView.setTag(new ViewHolder2((Button) convertView
							.findViewById(R.id.button1)));
				}

				ViewHolder2 holder2 = (ViewHolder2) convertView.getTag();
				holder2.shwmore.setOnClickListener(new View.OnClickListener() {
					@Override
					public void onClick(View v) {

						adapter.remove(0);
						loadMessages(false);
					}
				});

			}

			return convertView;
		}

	}

	RSAObj getRSAEncryptObject() {

        SharedPreferences.Editor editor = sharedPref.edit();

        try{
		JSONObject oo4 = ActivityLogin.findKey(0, this);
		
		JSONObject oo5 = oo4.getJSONObject("rsa").getJSONObject("rsa");

		final RSAObj rsa = new RSAObj();
		rsa.n = oo5.getString("n");
		rsa.d = oo5.getString("d");
		rsa.e = oo5.getString("e");
		return rsa;
		}
		catch(Exception ee){ee.printStackTrace(); return null;}

	}

	void sendAnswer() {

		final TalksMessages that = this;
		final EditText mEdit = (EditText) findViewById(R.id.editText1);

		final String realmessage = mEdit.getText().toString();

        if (realmessage.equals("") || this.conversationId.equals(""))
            return;


        String shortmessage = StringFormatter.shorten(mEdit.getText()
                .toString(), 127);



		try {
			String newestMessageKey = getTheNewestMessageKey();

			// Generate Object to sign
			JSONObject messageRaw = new JSONObject();
			messageRaw.put("conversationId", this.conversationId);
			messageRaw.put("content",
					gib.encrypt(realmessage, newestMessageKey.toCharArray()));
			messageRaw.put("time", getCurrentTimeSeconds());
			messageRaw.put("preview",
					gib.encrypt(shortmessage, newestMessageKey.toCharArray()));
			messageRaw.put("msgKeyRevision", newestMessageKeyRevision);
			messageRaw.put("sender", getCurrentUserId());

	

			final RSAObj rsa = getRSAEncryptObject();


            final MessageItem msgItem = 	new MessageItem(
                    realmessage,
                    "My Name",
                    getCurrentUserId(),
            0, "", getCurrentTimeSecondsAsDouble());


            adapter.addItem(
                    msgItem, adapter.getSize());
            msgItem.isSending = true;

            adapter.refresh();



            adapter.notifyDataSetChanged();
            mEdit.setText("");
            m_listview
                    .setSelection(adapter
                            .getSize() - 1);


			new AsyncCrypto() {
				@Override
				protected void onPostExecute(String result2) {

					try {
						// Sign and build object which will be send to server
						JSONObject signedJSON = new JSONObject(result2);
						JSONArray list = new JSONArray();
						JSONObject r1 = new JSONObject();
						r1.put("id", "message_distribute_answer");
						r1.put("message", signedJSON);
						list.put(r1);
						final JSONObject object = new JSONObject();
						object.put("requests", list);

						// Async HTTP
						new AsyncHTTP() {
							@Override
							protected void onPostExecute(String result) {
                                if (result.equals("")) {

                                    System.out.println("CRITICAL ERROR: NO CONNECTION?");
                                    return;

                                }
								try {
									JSONObject jo = new JSONObject(result);
									String myname = jo.getJSONObject(
											"message_distribute_answer")
											.getString("sendername");

                                    msgItem.user = myname;
                                    msgItem.isSending = false;
                                    adapter.notifyDataSetChanged();


									// must run in ui thread to maintain scroll
                                            // position
                                            TalksMessages.this
                                                    .runOnUiThread(new Runnable() {

                                                        @Override
                                                        public void run() {
                                                            // refresh list
                                                            adapter.refresh();




                                                            // scroll down
                                                            m_listview
                                                                    .setSelection(adapter
                                                                            .getSize() - 1); // scroll
                                                            // to
                                                            // bottom
                                                        }
                                                    });

								} catch (Exception ex) {
									System.out.println("CHARME ERROR2"
											+ ex.toString());
								}

							}
						}.execute(new AsyncHTTPParams(object.toString(), that, "", server));

					} catch (Exception ee) {
					}

                }

            }.execute(new AsyncCryptoArgs(rsa, messageRaw,
                    AsyncCryptoArgs.ACTION_SIGN, TalksMessages.this));

			// Async HTTP End

		} catch (Exception ex) {
			System.out.println("CHARME ERROR" + ex.toString());
			ex.printStackTrace();
		}

	}

	public void checkNewMessages() {
		// Not workign at the moment
        System.out.println("Checking new messages....");
		// TODO: Do key update if necessary
		checkNewMessagesOld();

	}

	public void checkNewMessagesOld() {

		// TODO: Do key update if necessary

		System.out.println("STEP 1");
		final TalksMessages that = this;
		try {

			JSONObject object = new JSONObject();
			JSONArray list = new JSONArray();

			JSONObject r1 = new JSONObject();
			r1.put("id", "message_get_sub_updates");
			r1.put("conversationId", this.conversationId);
			System.out.println("lastid IST " + newestMessageId);
			r1.put("lastId", newestMessageId);

			list.put(r1);

			object.put("requests", list);

			new AsyncHTTP() {
				@Override
				protected void onPostExecute(String result) {
					System.out.println("STEP 2");

					try {
						JSONObject jo = new JSONObject(result);

						final JSONArray arr = jo.getJSONObject(
								"message_get_sub_updates").getJSONArray(
								"messages");

						for (int i = (arr.length() - 1); i >= 0; i--) {

							JSONObject messageKey = getMessageKeyByRevision(arr
									.getJSONObject(i).getJSONObject("message")
									.getJSONObject("object")
									.getInt("msgKeyRevision"));

							String newestMessageKey = getAesMessageKey(messageKey);

							MessageItem item = insertMessage(adapter.getSize(),
									arr.getJSONObject(i), newestMessageKey);


                            item.saveToDatabase(db, that.conversationId);


							if (i == (arr.length() - 1))
								newestMessageId = arr.getJSONObject(i)
										.getJSONObject("_id").getString("$id");


						}

						// must run in ui thread to maintain scroll position
						TalksMessages.this.runOnUiThread(new Runnable() {

							@Override
							public void run() {
								// refresh list

								if (arr.length() > 0) {
									adapter.removeAnswerItems();
									adapter.refresh();
									// scroll down
									m_listview.setSelection(adapter.getSize() - 1); // scroll
																					// to
																					// bottom
								}

							}
						});

					} catch (Exception ee) {
						ee.printStackTrace();
					}

				}
			}.execute(new AsyncHTTPParams(object.toString(), that, "", server));
		} catch (Exception ex) {
			System.out.println("CHARME ERROR" + ex.toString());
		}
	}

	private static class ViewHolder2 {
		public Button shwmore;

		public ViewHolder2(Button s) {

			this.shwmore = s;

		}
	}


	private static class ViewHolder3 {
		public TextView atext;
		public ImageView img;
		public LinearLayout mainbox;

		private ViewHolder3(TextView text, ImageView img2, LinearLayout mb) {

			this.atext = text;
			this.img = img2;
			this.mainbox = mb;
		}
	}

}

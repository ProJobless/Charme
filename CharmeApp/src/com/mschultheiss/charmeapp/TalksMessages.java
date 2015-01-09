package com.mschultheiss.charmeapp;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

public class TalksMessages extends Activity {

	ListView m_listview;
	GibberishAESCrypto gib = new GibberishAESCrypto();
	int count = -1;
	int nextstart = -1;
	int nextlimit = -1;
	String superId;
	String conversationId = "";
	// String msgaes = "";
	String lastid = "";

	BroadcastReceiver receiver;
	JSONArray messageKeys = new JSONArray();

	private JSONObject getMessageKeyByRevision(int revision) {

		JSONObject newestKey = null; // Only used for revision = -1
		int bestRevision = 0; // Only used for revision = -1

		for (int j = 0; j < messageKeys.length(); j++) {
			try {
				JSONObject keyObj = messageKeys.getJSONObject(j);
				if (revision != -1 && keyObj.getInt("revision") == revision) {
					return keyObj;
				} else if (revision == -1) {
					if (keyObj.getInt("revision") > bestRevision) {
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

	void getMessageKeys() {
		JSONObject object = new JSONObject();

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
				try {
					JSONObject jo = new JSONObject(result);
					messageKeys = jo.getJSONObject("messages_get_keys")
							.getJSONArray("messageKeys");

					// keys there? Then load messages!!
					loadMessages(true);

				} catch (Exception ee) {

				}
			}
		}.execute(new AsyncHTTPParams(object.toString()));

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
			JSONObject oo5 = ActivityLogin.findKey(rsaRevision)
					.getJSONObject("rsa").getJSONObject("rsa");

			rsa.n = oo5.getString("n");
			rsa.d = oo5.getString("d");
			rsa.e = oo5.getString("e");

			// Decrypt the message key with RSA
			String edgekey = rsa.decryptText(rsaEncEdgeKey);

			String newestMessageKey = gib.decrypt(
					messageKey.getJSONObject("key").getString("messageKey"),
					edgekey.toCharArray());

			return newestMessageKey;

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "";
		}

	}

	void loadMessages(final boolean firstload) {

		final TalksMessages that = this;
		m_listview.setDivider(null);

		Button buttonLogin = (Button) findViewById(R.id.button1);
		buttonLogin.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {

				sendAnswer();
			}
		});

		try {

			JSONObject object = new JSONObject();

			JSONArray list = new JSONArray();

			if (nextstart == 0)
				nextlimit = count % 10;

			JSONObject r1 = new JSONObject();
			r1.put("limit", String.valueOf(nextlimit));
			r1.put("start", String.valueOf(nextstart));

			if (conversationId != null)
				r1.put("conversationId", conversationId);

			else {
				System.out.println("CONV ID SETTED TO " + that.conversationId);

				r1.put("conversationId", that.conversationId);
			}

			r1.put("id", "messages_get_sub");

			list.put(r1);

			/*
			 * {"id":"messages_get_sub","limit":"-1","start":"-1","superId":
			 * "532075d4a8d09b4002994f4a"}
			 * {"id":"messages_get_sub","conversationId"
			 * :"532075d4d8cc9a646cbccf22","limit":"-1","start":"-1"}
			 */

			object.put("requests", list);
			System.out.println("JSON REQUEST DATA IST  " + object.toString());
			new AsyncHTTP() {
				@Override
				protected void onPostExecute(String result) {
					System.out.println("JSON REQUEST IST  " + result);

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
						/*
						 * if (firstload) {
						 * 
						 * if (that.conversationId.equals("")) {
						 * //that.conversationId = jo //
						 * .getJSONObject("messages_get_sub") //
						 * .getJSONObject("conversationId") //
						 * .getString("$id"); }
						 * 
						 * System.out .println("SET CON ID TO" +
						 * that.conversationId); }
						 */
						int insertpos = 1;
						// Problem: not logged in!

						// Show more button if useful
						if (nextstart != 0 && count > 10)
							adapter.addItem(new MessageItem("", "", "", 1, ""),
									0);
						else
							insertpos = 0; // Insert new item after more button

						if (nextstart == -1)
							nextstart = count - 20;
						else
							nextstart = nextstart - 10;

						if (nextstart < 0)
							nextstart = 0;

						for (int i = (arr.length() - 1); i >= 0; i--) {

							JSONObject messageKey = getMessageKeyByRevision(arr
									.getJSONObject(i).getJSONObject("message")
									.getJSONObject("object")
									.getInt("msgKeyRevision"));

							String newestMessageKey = getAesMessageKey(messageKey);

							insertMessage(insertpos, arr.getJSONObject(i),
									newestMessageKey);

							if (i == (arr.length() - 1) && firstload)
								lastid = arr.getJSONObject(i)
										.getJSONObject("_id").getString("$id");

						}

						TalksMessages.this.runOnUiThread(new Runnable() {

							@Override
							public void run() {
								adapter.refresh();
							}
						});

						if (firstload)
							m_listview.setSelection(adapter.getSize() - 1); // scroll
																			// to
																			// bottom

						if (firstload) {
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
						System.out.println("CHARME ERROR" + ee.toString());

					}
				}
			}.execute(new AsyncHTTPParams(object.toString()));
		} catch (Exception ex) {
			System.out.println("CHARME ERROR" + ex.toString());
		}

	}

	StableArrayAdapter adapter;

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

			}
		}
	}

	private static final int CAMERA_REQUEST = 1888;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_talks_messages);

		Intent intent = getIntent();

		this.conversationId = intent.getStringExtra("conversationId");

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
		registerReceiver(receiver, filter);

		this.getMessageKeys();
	}

	@Override
	public void onDestroy() {

		super.onDestroy();
		unregisterReceiver(receiver);

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
		Bitmap bitmapThumb = null;

		try {

			final int THUMBNAIL_SIZE = 100;

			Bitmap imageBitmap = Bitmap.createBitmap(bitmap);

			bitmapThumb = Bitmap.createScaledBitmap(imageBitmap,
					THUMBNAIL_SIZE, THUMBNAIL_SIZE, false);

		} catch (Exception ex) {

		}

		try {

			JSONObject object = new JSONObject();
			JSONArray list = new JSONArray();

			JSONObject r1 = new JSONObject();
			r1.put("encFileThumb", gib.encrypt(mkBase64(bitmapThumb),
					getTheNewestMessageKey().toCharArray()));
			r1.put("encFile", gib.encrypt(mkBase64(bitmap),
					getTheNewestMessageKey().toCharArray()));
			r1.put("conversationId", this.conversationId);
			r1.put("id", "message_distribute_answer");

			list.put(r1);

			object.put("requests", list);

			new AsyncHTTP() {
				@Override
				protected void onPostExecute(String result) {

					try {

						JSONObject jo = new JSONObject(result);

						JSONArray arr = jo.getJSONObject("messages_get_sub")
								.getJSONArray("messages");

						// /MessageItem mi = new MessageItem("You", "", 0, "");

						// mi.fileId = "";

						// Insert message
						// adapter.addItem(mi,
						// adapter.getSize());

					} catch (Exception ee) {
						System.out.println("CHARME ERROR" + ee.toString());

					}
				}
			}.execute(new AsyncHTTPParams(object.toString()));
		} catch (Exception ex) {
			System.out.println("CHARME ERROR" + ex.toString());
		}

		/*
		 * 
		 * var thumbEnc = aes_encrypt(that.aes, thumb); var fileEnc =
		 * aes_encrypt(that.aes, file);
		 * 
		 * 
		 * var conversationId = ($('#msg_conversationId').data("val"));
		 * 
		 * apl_request({ "requests": [{ "id": "message_distribute_answer",
		 * "conversationId": conversationId, "encFile": fileEnc, "encFileThumb":
		 * thumbEnc, }
		 * 
		 * ] }, function(d2) { location.reload(); });
		 */

	}

	MessageItem insertMessage(int insertpos, JSONObject oo,
			final String messageAesKey) throws Exception {

		if (oo.has("fileId") && oo.getInt("fileId") != 0) {
			final MessageItem msgitem;

			msgitem = new MessageItem("", oo.getString("sendername"), oo
					.getJSONObject("message").getJSONObject("object")
					.getString("sender"), 2, oo.getJSONObject("_id").getString(
					"$id"));

			msgitem.fileId = oo.getString("fileId");
			// if its an image, load the image!

			JSONObject object = new JSONObject();
			AsyncHTTPParams param = new AsyncHTTPParams(object.toString());
			param.Url = "http://192.168.43.31/charme/fs.php?enc=1&id="
					+ oo.getString("fileId"); // The url of the image

			new AsyncHTTP() {
				@Override
				protected void onPostExecute(String result) {
					try {
						String imageData = gib.decrypt(result,
								messageAesKey.toCharArray()).replaceFirst(
								"^data:image/[^;]*;base64,?", "");
						byte[] bytes = Base64.decode(imageData, Base64.DEFAULT);

						Bitmap decodedByte = BitmapFactory.decodeByteArray(
								bytes, 0, bytes.length);
						msgitem.image = decodedByte;

						TalksMessages.this.runOnUiThread(new Runnable() {

							@Override
							public void run() {

								adapter.refresh();

							}
						});

					} catch (Exception ex) {
						System.out.println("CHARME IMAGE" + ex.toString());
					}

				}
			}.execute(param);

			adapter.addItem(msgitem, insertpos);

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

				msgitem = new MessageItem(msg, oo.getString("sendername"), oo
						.getJSONObject("message").getJSONObject("object")
						.getString("sender"), 0, oo.getJSONObject("_id")
						.getString("$id"));
				adapter.addItem(msgitem, insertpos);

			}

		}
		return null;
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

		default:
			return super.onOptionsItemSelected(item);
		}
	}

	public class MessageItem {
		public MessageItem(String msg, String username, String uid, int typ,
				String id) {
			this.message = msg;
			this.user = username;
			this.type = typ;
			this.ID = id;
			this.userId = uid;

		}

		public String ID;
		public Bitmap image;
		public String user;
		public String userId;
		public String fileId;
		public String message;
		public int type; // Message / Image / Information / Show more
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

		/*
		 * public void setNewList(ArrayList<MessageItem> list) { this.mIdMap =
		 * list; notifyDataSetChanged();
		 * 
		 * }
		 */

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
				System.out.println("layout: t  IS null ");
				return android.widget.Adapter.IGNORE_ITEM_VIEW_TYPE;
			} else
				System.out.println("layout: MSG ITEM  IS " + t.type);
			return t.type;

		}

		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			// --init if not re-cycled--

			final MessageItem t = mIdMap.get(position);
			int type = getItemViewType(position);

			System.out.println("layout: CHARME TYPE IS " + type);

			if (type == 0) {
				if (convertView == null
						|| !(convertView.getTag() instanceof ViewHolder)) {
					convertView = LayoutInflater.from(getContext()).inflate(
							R.layout.talks_messages_row_message, parent, false);
					convertView.setTag(new ViewHolder((TextView) convertView
							.findViewById(R.id.textView1),

					(TextView) convertView.findViewById(R.id.textView2),
							(LinearLayout) convertView
									.findViewById(R.id.mainbox)

					));
				}

				ViewHolder holder = (ViewHolder) convertView.getTag();
				if (t != null && t.message != null && holder != null) {
					holder.atext.setText(t.user);
					holder.atext2.setText(t.message);

					float scale = getResources().getDisplayMetrics().density;
					int dp50 = (int) (50 * scale + 0.5f);
					int dp8 = (int) (8 * scale + 0.5f);

					if (!t.userId.equals(ActivityLogin.global_userid)) {
						holder.mainbox.setPadding(dp8, dp8, dp50, 0);
					} else
						holder.mainbox.setPadding(dp50, dp8, dp8, 0);

				}

			}
			if (type == 2) {
				if (convertView == null
						|| !(convertView.getTag() instanceof ViewHolder)) {
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

					if (!t.userId.equals(ActivityLogin.global_userid)) {
						holder3.mainbox.setPadding(dp8, dp8, dp50, 0);
					} else
						holder3.mainbox.setPadding(dp50, dp8, dp8, 0);

					holder3.atext.setText(t.user);

					System.out.println("SET 123");
					if (t.image != null)
						holder3.img.setImageBitmap(t.image);

					holder3.img.setOnClickListener(new View.OnClickListener() {
						@Override
						public void onClick(View v) {

							Intent intent = new Intent(getBaseContext(),
									ImageViewer.class);
							intent.putExtra("fileId", t.fileId);
							intent.putExtra("aes", getTheNewestMessageKey());

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

	void sendAnswer() {
	
		final TalksMessages that = this;
		EditText mEdit = (EditText) findViewById(R.id.editText1);
		final String realmessage = mEdit.getText().toString();
		String shortmessage = StringFormatter.shorten(mEdit.getText()
				.toString(), 127);

		if (realmessage.equals("") || this.conversationId.equals(""))
			return;

		try {
			String newestMessageKey =getTheNewestMessageKey();

			/*
			 * messageRaw = { "conversationId": that.options.conversationId,
			 * "content": messageEncrypted, "preview": messageEncryptedPreview,
			 * "msgKeyRevision": msgKeyRevision, "sender": charmeUser.userId,
			 * "time": { sec: new Date().getTime() / 1000 }, };
			 * 
			 * NProgress.start(); apl_request({ "requests": [{ "id":
			 * "message_distribute_answer", "message":
			 * CharmeModels.Signature.makeSignedJSON(messageRaw) }
			 * 
			 * ] },
			 */

			JSONObject object = new JSONObject();
			JSONArray list = new JSONArray();

			GibberishAESCrypto gib = new GibberishAESCrypto();

			String cryptoMessage = gib.encrypt(realmessage,
					newestMessageKey.toCharArray());
			String cryptoPreview = gib.encrypt(shortmessage,
					newestMessageKey.toCharArray());

			JSONObject r1 = new JSONObject();
			r1.put("id", "message_distribute_answer");
			r1.put("conversationId", this.conversationId);

			r1.put("encMessage", cryptoMessage);
			r1.put("messagePreview", cryptoPreview);

			list.put(r1);

			object.put("requests", list);

			new AsyncHTTP() {
				@Override
				protected void onPostExecute(String result) {

					System.out.println("RESULT IS:" + result);
					try {
						JSONObject jo = new JSONObject(result);
						String myname = jo.getJSONObject(
								"message_distribute_answer").getString(
								"sendername");

						adapter.addItem(new MessageItem(realmessage, myname,
								ActivityLogin.global_userid, 0, ""), adapter
								.getSize());

						// must run in ui thread to maintain scroll position
						TalksMessages.this.runOnUiThread(new Runnable() {

							@Override
							public void run() {
								// refresh list
								adapter.refresh();
								// scroll down
								m_listview.setSelection(adapter.getSize() - 1); // scroll
																				// to
																				// bottom
							}
						});

					} catch (Exception ex) {
						System.out.println("CHARME ERROR2" + ex.toString());
					}

				}
			}.execute(new AsyncHTTPParams(object.toString()));
		} catch (Exception ex) {
			System.out.println("CHARME ERROR" + ex.toString());
		}

	}

	public void checkNewMessages() {
		// Not workign at the moment
	}

	public void checkNewMessagesOld() {

		// // Not working at the moment :(
		// return;

		final TalksMessages that = this;
		try {

			JSONObject object = new JSONObject();
			JSONArray list = new JSONArray();

			JSONObject r1 = new JSONObject();
			r1.put("id", "message_get_sub_updates");
			r1.put("conversationId", this.conversationId);
			System.out.println("lastid IST " + lastid);
			r1.put("lastid", lastid);

			list.put(r1);

			object.put("requests", list);

			new AsyncHTTP() {
				@Override
				protected void onPostExecute(String result) {

					try {
						JSONObject jo = new JSONObject(result);

						final JSONArray arr = jo.getJSONObject(
								"message_get_sub_updates").getJSONArray(
								"messages");

						for (int i = (arr.length() - 1); i >= 0; i--) {
							// adapter.putMessage(-1, ));
							try {
								insertMessage(adapter.getSize(),
										arr.getJSONObject(i),
										"TODO: MESSAGEAESKEY");

							} catch (Exception ee) {
							}

							if (i == (arr.length() - 1))
								lastid = arr.getJSONObject(i)
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

					}

				}
			}.execute(new AsyncHTTPParams(object.toString()));
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

	private static class ViewHolder {
		public TextView atext;
		public TextView atext2;
		public LinearLayout mainbox;

		private ViewHolder(TextView text, TextView text2, LinearLayout mb) {

			this.atext = text;
			this.atext2 = text2;
			this.mainbox = mb;

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

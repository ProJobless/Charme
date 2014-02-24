package com.example.charmeapp;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

public class Talks extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_talks);
		
		  final ListView listview = (ListView) findViewById(R.id.listView1);
		  final Talks that = this;
		
			final ArrayList<TalkItem> list2 = new ArrayList<TalkItem>();
			
			try {

				JSONObject object = new JSONObject();

				JSONArray list = new JSONArray();

				JSONObject r1 = new JSONObject();
				r1.put("countReturn", true);
				r1.put("start", 0); // TODO: Challenge respond
				r1.put("id", "messages_get");
				
				list.put(r1);

				object.put("requests", list);
			
				  
				new AsyncHTTP(){
					@Override
					protected void onPostExecute(String result) {
						
						// Problem: not logged in!
						System.out.println("CH1: RESULT IS "+result.toString());
						try{
						JSONObject jo = new JSONObject(result);
						GibberishAESCrypto gib = new GibberishAESCrypto();
						JSONArray arr = jo.getJSONObject("messages_get").getJSONArray("messages");
						System.out.println("CH1: arr"+arr.toString());
						for (int i = 0; i < arr.length(); i++) {
							  JSONObject oo = arr.getJSONObject(i);
							  
							  RSAObj rsa = new RSAObj();
							  JSONObject oo5 = ActivityLogin.findKey(oo.getInt("revision")).getJSONObject("rsa").getJSONObject("rsa");
							  
							 rsa.n = oo5.getString("n");
							 rsa.d = oo5.getString("d");
							 rsa.e = oo5.getString("e");
							  
							  
							  
							 String aes =  rsa.decryptText(oo.getString("aesEnc"));
						 		
							 System.out.println("CH1:aes "+aes);
							  String prev = gib.decrypt(oo.getString("messagePreview"), aes.toCharArray());
							  
							  		System.out.println("CH1:ab "+prev);
								 list2.add(new TalkItem(oo.getJSONObject("_id").getString("$id"), prev, oo.getString("pplCount")+" People", aes));
							}
						
						Talks.StableArrayAdapter adapter = new Talks.StableArrayAdapter(that,
								      R.layout.activity_talks_listitem, list2);
								    listview.setAdapter(adapter);
				
				
				
						}
					catch(Exception ee){System.out.println("CHARME ERROR"+ee.toString());}
					}
				}.execute(new AsyncHTTPParams(object.toString()));
			}
			catch(Exception ex){
			System.out.println("CHARME ERROR"+ex.toString());
			}
		 
		  
			listview.setOnItemClickListener(new OnItemClickListener() {
	            @Override
	            public void onItemClick(AdapterView<?> parent, View view, int position,
	                    long id) {
	         	   	final TalkItem t = ((Talks.StableArrayAdapter)listview.getAdapter()).mIdMap.get(position);
	         
	            	Intent intent = new Intent(getBaseContext(), TalksMessages.class);
		        	intent.putExtra("superId", t.ID);
		        	intent.putExtra("aes", t.AES);
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
		
		
		
		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			   //--init if not re-cycled--
		    if (convertView == null) {
		        convertView = LayoutInflater.from(getContext()).inflate(R.layout.activity_talks_listitem, parent, false);
		        convertView.setTag(new ViewHolder(
		               (TextView) convertView.findViewById(R.id.label),
		               (ImageView) convertView.findViewById(R.id.icon),
		               (TextView) convertView.findViewById(R.id.submessage)
		               
		        ));
		    }
		   final TalkItem t = mIdMap.get(position);
	

		    ViewHolder holder = (ViewHolder) convertView.getTag();
		    holder.atext.setText(t.Title);
		    holder.atext2.setText(t.People);
		    return convertView;

		}
		@Override
		public boolean hasStableIds() {
			return true;
		}
	}
	private static class ViewHolder{
	    public final TextView atext;
	    public final TextView atext2;
	    public final ImageView aimg;

	    private ViewHolder(TextView text, ImageView img, TextView text2) {
	        this.aimg = img;
	        this.atext = text;
	        this.atext2 = text2;
	        
	    }
	}

}

